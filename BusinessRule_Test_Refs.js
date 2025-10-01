/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Refs",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "Test_Refs",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType) {
var MVG = node.queryReferencedBy(refType).asList(100).get(0).getSource();
log.info(MVG);
MVG.queryReferences(refType).forEach(function(refInstance){
	log.info("US" + refInstance.getTarget());
	return true;
});
var CANMVG;
step.executeInContext("EN_CA", function(cxtManager){
	CANMVG =  cxtManager.getObjectFromOtherManager(MVG);
});

CANMVG.queryReferences(refType).forEach(function(refInstance){
	log.info("CAN" + refInstance.getTarget());
	if (refInstance.getTarget().getID() == "000736716"){
		log.info("CAN" + refInstance.getTarget().getValue("a_Style_Life_Cycle_Status").getSimpleValue());
	}
	return true;
});

}