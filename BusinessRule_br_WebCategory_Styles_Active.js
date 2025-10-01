/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WebCategory_Styles_Active",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_WebCategory_Styles_Active",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,log) {
function referencecheck (node,contextID) {
	stepManager.executeInContext(contextID, function (otherManager) {
		var othernode= otherManager.getClassificationHome().getClassificationByID(node.getID());
		var webCategoryProductType = othernode.getValue('a_WebCategory_Product_Type').getSimpleValue();
		if(webCategoryProductType == 'Style'){
    var classification = otherManager.getClassificationHome().getClassificationByID(node.getID());
    var productsList = classification.getClassificationProductLinks().toArray();
    var classificationProductLinkType = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome).getLinkTypeByID('StyleToWebSubCategoryRef');
    for(var k=0;k<productsList.length;k++){
        var objectType = productsList[k].getProduct().getObjectType().getID();
        if(objectType == 'Style'){
        	var styleEndDate = node.getValue('a_Style_End_Date')getSimpleValue();
        }
          
}