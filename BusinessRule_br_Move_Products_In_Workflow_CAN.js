/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Move_Products_In_Workflow_CAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Move Products in workflow CAN",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
var CCList = node.getChildren();
var BusinessRuleHome = stepManager.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
for(var i = 0; i < CCList.size(); i++) {
	var cc = CCList.get(i);
	if(cc.isInState("wf_CCEnrichmentCanada","NewCCEnrichState1")) {
		//cc.getTaskByID("wf_CCEnrichmentCanada","NewCCEnrichState1").triggerByID("CCReadyForEnrichment", "Moving to In Progress automatically from Style Enrichment");
		BusinessRuleHome.getBusinessActionByID("wf_CCEnrichmentCanada_NewCCEnrichState1").execute(node);
		/*try {
                    cc.getTaskByID("wf_CCEnrichmentCanada","NewCCEnrichState1").triggerByID("CCReadyForEnrichment", "Moving to In Progress automatically from Style Enrichment");
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                        cc.getTaskByID("wf_CCEnrichmentCanada","NewCCEnrichState1").triggerLaterByID("CCReadyForEnrichment", "Moving to In Progress automatically from Style Enrichment");
                    }
                }*/
	}

	// do the same for SKUs.
	var skuList = cc.getChildren();
	for(var j = 0; j < skuList.size(); j++) {
		var sku = skuList.get(j);
		if(sku.isInState("wf_NewSKUEnrichmentCanada","NewSKUEnrich1")) {
			//sku.getTaskByID("wf_NewSKUEnrichmentCanada","NewSKUEnrich1").triggerByID("Submit", "Moving to In Progress automatically from Style Enrichment");
			BusinessRuleHome.getBusinessActionByID("wf_NewSKUEnrichmentCanada_NewSKUEnrich1").execute(node);
			/*try {
                    sku.getTaskByID("wf_NewSKUEnrichmentCanada","NewSKUEnrich1").triggerByID("Submit", "Moving to In Progress automatically from Style Enrichment");
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                        sku.getTaskByID("wf_NewSKUEnrichmentCanada","NewSKUEnrich1").triggerLaterByID("Submit", "Moving to In Progress automatically from Style Enrichment");
                    }
                }*/
		}
	}
		
}

// run autoclassification mapping rule
/*  PPIM-7616 Deprecate VMDD
autoClassify.autoClassifyProduct(node, step);
*/
}