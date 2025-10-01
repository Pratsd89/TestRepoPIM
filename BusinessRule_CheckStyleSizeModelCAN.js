/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckStyleSizeModelCAN",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Style Size Model CAN",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//BR to check if size model will be triggered from EN_CA context
var result = true;
var currContext = step.getCurrentContext().getID();
if(currContext == "EN_CA" || currContext == "FR_CA"){
	result = true;
	}
	else{
		result = false;
		}
if(result == true){
step.executeInContext('EN_CA',function(caContextManager) {
					var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
					var legCorpNum = caCurrentProduct.getValue("a_Legacy_Corp_Number").getSimpleValue();
					if(legCorpNum == null){
						result = false;
						}
					var sizeModel = caCurrentProduct.getValue("a_Source_Size_Model").getSimpleValue();
					if (sizeModel == null){
						result = false;
						}
			});
}
if(result == true){
var lastModifiedUser = node.getRevision().getUserID();
if (lastModifiedUser.toUpperCase() != "STIBOACLUSER"){
	result = false;
	}
}
return result;
}