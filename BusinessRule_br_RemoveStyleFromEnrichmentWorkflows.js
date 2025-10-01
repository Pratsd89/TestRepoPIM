/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_RemoveStyleFromEnrichmentWorkflows",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Remove Style From Enrichment Workflows",
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
var styleEnrichmentWorkflows = ["wf_NewStyleEnrichment", "wf_NewStyleEnrichmentCanada", "wf_NewStyleEnrichmentJapan", "wf_NewStyleEnrichmentSA"];
var wfName;

for (wfName in styleEnrichmentWorkflows) {
	
	var wf = node.getWorkflowInstanceByID(styleEnrichmentWorkflows[wfName]);
	if (wf != null) { 
			
			wf.delete("Style end-date passed, removing from workflow");
		}
}
}