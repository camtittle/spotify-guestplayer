# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 2.26"
    }
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

locals {
  cdb_account_name = "cameront-guestplayer"
  database_name = "guestplayer"
  container_name = "party"
  vm_image_id = "/subscriptions/b3ad533a-7660-4693-aecf-08c4492e2565/resourceGroups/guestplayerResourceGroup/providers/Microsoft.Compute/images/iis-webdeploy-2"
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

resource "azurerm_virtual_network" "vnet" {
  name                = "example-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "myTFSubnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "publicip" {
  name                = "guestplayerPublicIp"
  location            = "UK South"
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  domain_name_label = "guestplayer-dev"
}

resource "azurerm_network_security_group" "nsg" {
  name                = "guestPlayerVmSecurityGroup"
  location            = "UK South"
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "RDP"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3389"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTP"
    priority                   = 1000
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTPS"
    priority                   = 999
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "WebDeploy"
    priority                   = 998
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "8172"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface" "nic" {
  name                      = "geustPlayerVmNic"
  location                  = "UK South"
  resource_group_name       = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "guestPlayerNicConfig"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "dynamic"
    public_ip_address_id          = azurerm_public_ip.publicip.id
  }
}

resource "azurerm_windows_virtual_machine" "vm" {
  name                = "guestPlayerVm"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  size                = "Standard_B1s"
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  network_interface_ids = [
    azurerm_network_interface.nic.id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "StandardSSD_LRS"
  }

  source_image_id = local.vm_image_id
  
  identity {
    type = "SystemAssigned"
  }
}

data "azurerm_public_ip" "ip" {
  name                = azurerm_public_ip.publicip.name
  resource_group_name = azurerm_windows_virtual_machine.vm.resource_group_name
  depends_on          = [azurerm_windows_virtual_machine.vm]
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
      "Get", "Delete", "List", "Set",
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = azurerm_windows_virtual_machine.vm.identity.0.principal_id

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