/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "AssortmentType_RemoveProductAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "AssortmentType_RemoveProductAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,portal) {
var result = true;
var assortmentType = node.getValue("a_WebCategory_Assortment_Type").getSimpleValue();
if(assortmentType == "Autopop")
{
	result = false;
	portal.showAlert("ERROR",  "Web Category Assortment Type is Autopop, the product cannot be removed manually");
}
if(result == true && assortmentType == "Manual")
{
	var selectedNodeList = new java.util.ArrayList();
	var selectedNodes = portal.getSelection().iterator();
	while (selectedNodes.hasNext())
	{
		var selectNode = selectedNodes.next();
		selectedNodeList.add(selectNode.getID());			
	}
	var productsList = node.getClassificationProductLinks().toArray();
	for(var k=0; k < productsList.length ; k++)
	{
		var productID = productsList[k].getProduct().getID();
		if(selectedNodeList.indexOf(productID) != -1)
		{
			productsList[k].delete();
		}
	}
}
}