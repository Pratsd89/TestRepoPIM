/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_EN_US_MVGReportBulkUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_EN_US_MVGReportBulkUpdate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "MultiVariantGroup" ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MultiVariant_Group_Reference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "OIEP_MVGReviewProblemGroupStyle_EN_US",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
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
exports.operation0 = function (node,MultiVariant_Group_Reference,OIEP_MVGReviewProblemGroupStyle_EN_US,qh,manager) {
/*var MVGworkflow = manager.getWorkflowHome().getWorkflowByID("wf_MVG_Status");
var EN_US_state = MVGworkflow.getStateByID("EN_US_MVG_ReviewProblemGroup");
var EN_CA_state = MVGworkflow.getStateByID("EN_CA_MVG_ReviewProblemGroup");
var c = com.stio.query.condition.Conditions;
var query = qh.queryWorkflowTasks().where(
	 c.workflow().eq("wf_MVG_Status"));
	.and(c.state.eq("EN_US_MVG_ReviewProblemGroup")));
	var EN_Result = query.execute();*/
	
var refList = node.queryReferences(MultiVariant_Group_Reference).asList(1000).toArray();
 for (var k in refList) {
     var style = refList[k].getTarget();
	OIEP_MVGReviewProblemGroupStyle_EN_US.republish(style);
 }
}