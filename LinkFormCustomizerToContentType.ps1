  # Connecting to Tenant App Catalog (but could be also a Site Collection App Catalog)
  Connect-PnPOnline -Url https://contoso.sharepoint.com/sites/appcatalog -Interactive

  # Deploy the SPFx package to the Tenant App Catalog
  Add-PnPApp -Path "[PATH_TO_YOUR_SPFX_PACKAGE]" -Scope Tenant -Publish -Overwrite

  Disconnect-PnPOnline

  # Connecting to the target site where the component will be added
  Connect-PnPOnline -Url https://contoso.sharepoint.com/sites/hr -Interactive

  # Adding the solution to the site
  Get-PnPApp -Identity 0f850be3-9749-4726-9a75-06a89e6f231d | Install-PnPApp

  # Form customizer component id
  $customFormComponentId = "8b38fd0b-2722-4001-acc0-5fddb5bc4c50"

  # Getting the list default Content Type (but could also be a Hub or a Document Set one)
  $listCT = Get-PnPContentType -Identity "Item" -List "/lists/EmployeeOnboarding"

  # Linking the component to the different form contexts
  $listCT.EditFormClientSideComponentId = $customFormComponentId
  $listCT.NewFormClientSideComponentId = $customFormComponentId
  $listCT.DisplayFormClientSideComponentId = $customFormComponentId
  $listCT.Update(0)

  Invoke-PnPQuery