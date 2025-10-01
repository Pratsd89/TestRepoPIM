/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_tempSetBrandWebProductType",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_tempSetBrandWebProductType",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : true,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
//PPIM 10161 Set Values on brand attribute
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var attrID = "a_" + brandNum + "_WebProductType";
var checkId = manager.getAttributeHome().getAttributeByID(attrID);
if(checkId){
	var webProdType = node.getValue("a_Web_Product_Type").getSimpleValue();

	if (webProdType) {
	    if(webProdType == "toddler girl shoes"){
		    node.getValue(attrID).setSimpleValue("Toddler GIrl Shoes");
		}
		else{
		    node.getValue(attrID).setSimpleValue(webProdType);
		   }
	}
	else {
		throw("WPT Value of " + webProdType + " is not valid in LOV for " + checkId);
	}
}
}