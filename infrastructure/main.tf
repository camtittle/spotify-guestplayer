# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 2.26"
    }
  }

  backend "azurerm" {
    resource_group_name  = "guestplayerTerraformStateRG"
    storage_account_name = "guestplayertfstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }

  required_version = ">= 0.14.9"
}

variable "admin_username" {
    type = string
    description = "Administrator user name for virtual machine"
}

variable "admin_password" {
    type = string
    description = "Password must meet Azure complexity requirements"
}

variable "deploy_from_ip" {
    type = string
    description = "IP from which to allow inbound RDP and WebDeploy traffic to the VM"
}

variable "deploy_from_ipv6" {
    type = string
    description = "IPv6 from which to allow inbound RDP and WebDeploy traffic to the VM"
}

locals {
  cdb_account_name = "cameront-guestplayer"
  database_name = "guestplayer"
  container_name = "party"
  vm_image_id = "/subscriptions/b3ad533a-7660-4693-aecf-08c4492e2565/resourceGroups/iisSetup_group/providers/Microsoft.Compute/images/iis3"
}

provider "azurerm" {
  features {}
}

data "azurerm_subscription" "primary" {}
data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = "guestplayerResourceGroup"
  location = "UK South"
}

// Database

resource "azurerm_cosmosdb_account" "cdbAccount" {
  name                = local.cdb_account_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  enable_free_tier    = true

  consistency_policy {
    consistency_level = "Strong"
  }

  identity {
    type = "SystemAssigned"
  }

  geo_location {
    location          = azurerm_resource_group.rg.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "cdbDatabase" {
  name                = local.database_name
  resource_group_name = azurerm_cosmosdb_account.cdbAccount.resource_group_name
  account_name        = azurerm_cosmosdb_account.cdbAccount.name
  throughput          = 400
}

resource "azurerm_cosmosdb_sql_container" "cdbContainerParty" {
  name                  = local.container_name
  resource_group_name   = azurerm_cosmosdb_account.cdbAccount.resource_group_name
  account_name          = azurerm_cosmosdb_account.cdbAccount.name
  database_name         = azurerm_cosmosdb_sql_database.cdbDatabase.name
  partition_key_path    = "/partyId"
  partition_key_version = 1
  throughput            = 400
}

# Key vault

resource "azurerm_key_vault" "kv" {
  name                        = "guestplayerKeyVault"
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "Delete", "List", "Set", "Purge", "Recover", "Restore"
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_app_service.gp.identity.0.principal_id

    secret_permissions = [
      "Get", "List"
    ]
  }
}

# Storage account
resource "azurerm_storage_account" "sa" {
  name                     = "guestplayer"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_kind             = "StorageV2"
  account_replication_type = "LRS"

  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_role_assignment" "storageAccountOwner" {
  scope                = data.azurerm_subscription.primary.id
  principal_id         = data.azurerm_client_config.current.object_id
  role_definition_name = "Storage Blob Data Owner"
}

# resource "azurerm_cdn_profile" "profile" {
#   name                = "cdn-profile"
#   location            = "westeurope"
#   resource_group_name = azurerm_resource_group.rg.name
#   sku                 = "Standard_Microsoft"
# }

# resource "azurerm_cdn_endpoint" "guestplayer" {
#   name                = "guestplayer"
#   profile_name        = azurerm_cdn_profile.profile.name
#   location            = "westeurope"
#   resource_group_name = azurerm_resource_group.rg.name
#   origin_host_header = azurerm_storage_account.sa.primary_web_host

#   origin {
#     name      = "storage"
#     host_name = azurerm_storage_account.sa.primary_web_host
#   }

#   delivery_rule {
#     name = "spaRewrite"
#     order = 1

#     url_file_extension_condition {
#       operator = "LessThan"
#       match_values = ["1"]
#     }

#     url_rewrite_action {
#       source_pattern = "/"
#       destination = "/index.html"
#       preserve_unmatched_path = false
#     }
#   }
# }