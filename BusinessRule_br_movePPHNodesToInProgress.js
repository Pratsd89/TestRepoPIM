/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_movePPHNodesToInProgress",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Move PPH Nodes To In Progress",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
function movePPHNode(pph) {
	if(pph.isInState("wf_NewPPHEnrichment","NewPPHEnrichState1")) {
		pph.getTaskByID("wf_NewPPHEnrichment","NewPPHEnrichState1").triggerByID("ReadyforEnrichment", "Style has been added so moving to In Progress");
	}

	//do the same for parent object
	if(pph.getObjectType().getID() != "Division") {
		movePPHNode(pph.getParent());
	}
}

movePPHNode(node.getParent());


}