/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_FilterClassificationOutboundCondJP",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_FilterClassificationOutboundCondJP",
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
//Check to filter classification outbounds to be exported if there is no a_Category_Description value
var result = false;
step.executeInContext("EN_JP",function(jpContextManager){
	var jpCurrentClass = jpContextManager.getClassificationHome().getClassificationByID(node.getID());
	if(jpCurrentClass.getObjectType() != null){
	var objType = jpCurrentClass.getObjectType().getID();
	if (objType == "CustomerServiceBusinessUnit" || objType == "CustomerServiceCategory" || objType == "CustomerServiceHome" || objType == "NonProductCategory" || objType == "WebBU" || objType == "WebCategory" || objType == "WebDivision" || objType == "WebSubCategory"){
		var catDesc = jpCurrentClass.getValue("a_Category_Description").getSimpleValue();
		if(catDesc != null){
			result = true;
		}
	}
	else if(objType == "CustomerServiceRoot" || objType == "NonProductBusinessUnit"){
		result = true;
	}
		}
});
return result;
}