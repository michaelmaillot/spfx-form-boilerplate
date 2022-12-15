Connect-PnPOnline -Url https://contoso.sharepoint.com/sites/hr -Interactive

$customFormComponentId = "8b38fd0b-2722-4001-acc0-5fddb5bc4c50"

$listCT = Get-PnPContentType -Identity "Item" -List "/lists/EmployeeOnboarding"
$listCT.EditFormClientSideComponentId = $customFormComponentId
$listCT.NewFormClientSideComponentId = $customFormComponentId
$listCT.DisplayFormClientSideComponentId = $customFormComponentId
$listCT.Update(0)

Invoke-PnPQuery