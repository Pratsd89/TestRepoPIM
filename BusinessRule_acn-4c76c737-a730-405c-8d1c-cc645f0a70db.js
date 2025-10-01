/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "acn-4c76c737-a730-405c-8d1c-cc645f0a70db",
  "type" : "BusinessAction",
  "setupGroups" : [ "Workflows" ],
  "name" : "Draft - CCReadyForEnrichment - Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_autoClassification",
    "libraryAlias" : "autoClassify"
  } ]
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,autoClassify) {
//Trigger Style and Sku from Draft to In Progress after completeness check passes for all objects:

var style = node.getParent();
if (style.isInState("wf_NewStyleEnrichmentSA", "NewStyleEnrichState1")) {
	var wf = style.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA");
    try {
        wf.getTaskByID("wf_NewStyleEnrichmentSA", "NewStyleEnrichState1").triggerByID("ReadyForEnrichment", "Moving to In Progress automatically from CC Enrichment");
    } catch (e) {
        if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
            wf.getTaskByID("wf_NewStyleEnrichmentSA", "NewStyleEnrichState1").triggerLaterByID("ReadyForEnrichment", "Moving to In Progress automatically from CC Enrichment");
        }
    }
}

    var skuList = node.getChildren();
    for (var j = 0; j < skuList.size(); j++) {
        var sku = skuList.get(j);
        if (sku.isInState("wf_NewSKUEnrichmentSA", "NewSKUEnrich1")) {
        	  var myTask = sku.getWorkflowInstanceByID("wf_NewSKUEnrichmentSA").getTaskByID("NewSKUEnrich1");
            //sku.getTaskByID("wf_NewSKUEnrichment","NewSKUEnrich1").triggerByID("Submit", "Moving to In Progress automatically from CC Enrichment");
            try {
                myTask.triggerByID("Submit", "Moving to In Progress automatically from CC Enrichment");
            } catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    myTask.triggerLaterByID("Submit", "Moving to In Progress automatically from CC Enrichment");
                }
            }
        }
    }

    // run autoclassification mapping rule
    /*  PPIM-7616 Deprecate VMDD
    autoClassify.autoClassifyProduct(node, step);
    */
}