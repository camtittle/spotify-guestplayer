resource "azurerm_app_service_plan" "gp" {
  name                = "guestplayer-prod-asp-uks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  sku {
    tier = "Free"
    size = "F1"
  }
}

resource "azurerm_app_service" "gp" {
  name                = "guestplayer-prod-as-uks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.gp.id


  site_config {
    websockets_enabled = true
    # always_on = false
  }

  identity {
    type = "SystemAssigned"
  }
}