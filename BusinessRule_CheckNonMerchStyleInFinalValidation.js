/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNonMerchStyleInFinalValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckNonMerchStyleInFinalValidation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
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
exports.operation0 = function (node,step,log) {
//NonMerch Style Final validation screen for approval
var result = false;
var objType = node.getObjectType().getID();
 if(objType == "Style"){
	var obj = node.getParent().getID();
	if (obj == "ON_StoredValueCards" || obj == "ON_Gifts_Subclass" || obj == "ON_Services_Subclass"){
	 if ((node.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Final") == true) || (node.isInState("wf_NewStyleEnrichmentCanada", "NewStyleEnrich_Final") == true) || (node.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Final") == true) || (node.isInState("wf_NewStyleEnrichmentSA", "NewStyleEnrich_Final") == true)){
		result = true;
	    }
	}
 }	
return result;

	
}