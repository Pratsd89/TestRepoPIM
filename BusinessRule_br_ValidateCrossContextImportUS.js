/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ValidateCrossContextImportUS",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Validate Cross-Context Import US",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,compCheck) {
var logArray = new Array();
var type = node.getObjectType().getName();


var context = node.getValue("a_Context").getSimpleValue();
if (context) {
    if (context.equals("US")) {
        return true;
    } else if (context != "US") {
	logArray.push("\n<b>File is not allowed to be imported in the current widget.Please import the file in " + context + " " +"File Loading Import Widget</b>");
        if (logArray.length > 0) {
        	if(type == "CC"){
		return "<b>Marketing Flag update rejected for CC " + node.getValue("a_CC_Number").getSimpleValue() + " due to the following reasons: </b>" + logArray; 
	}
	else if(type == "Style"){
		return "<b>Marketing Flag update rejected for Style " + node.getValue("a_Style_Number").getSimpleValue() + " due to the following reasons: </b>" + logArray; 
	}
	}
    }
} else if (context == "" || context == null) {
    return "<b>Please ensure to have valid values in Context field</b>";
} else {
    return true;
}

}