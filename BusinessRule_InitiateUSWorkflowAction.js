/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiateUSWorkflowAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) InitiateUSWorkflowAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av1Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av2Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av3Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av4Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av5Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av6Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av7Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av8Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "av9Ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ppiRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "videoRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Video",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef) {
var currContext = step.getCurrentContext().getID();
if (currContext == "EN_US") {
	var objType = node.getObjectType().getID();
	if (objType == "Style") {
		if (node.getValue("a_Style_Life_Cycle_Status").getValue() == null) {
			if (node.getValue("a_Style_Market_Designation").getSimpleValue() != null) {
				if (!(node.getValue("a_Style_Market_Designation").getSimpleValue().contains("US"))) {
					node.getValue("a_Style_Market_Designation").addValue("US");
				}
			}
			else {
				node.getValue("a_Style_Market_Designation").addValue("US");
			}

			if ((!(node.isInWorkflow("wf_NewStyleEnrichment"))) && node.getValue("a_Style_Life_Cycle_Status").getSimpleValue() != "Approved") {
				node.startWorkflowByID("wf_NewStyleEnrichment", "Style US Workflow Initiation");
			}
		}
	}
	else if (objType == "CustomerChoice") {
		if (node.getValue("a_ACL_Market_Designation").getSimpleValue() == "US" && node.getValue("a_ACL_Market_Designation").isInherited() == false && node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == null) {
			if (!(node.isInWorkflow("wf_CCEnrichment"))) {
				//Check Style Market Designation and initaite in WF if required
				if (node.getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue() == null && node.getParent().getValue("a_Style_Market_Designation").getSimpleValue().contains("US")) {
					if (!(node.getParent().isInWorkflow("wf_NewStyleEnrichment"))) {
						node.getParent().startWorkflowByID("wf_NewStyleEnrichment", "Style US Workflow Initiation from CC Market Update");
					}
				}
				else if (node.getParent().isInWorkflow("wf_NewStyleEnrichment")) {
					if (node.getParent().isInState("wf_NewStyleEnrichment", "NewStyleEnrichState1")) {
						node.getParent().getWorkflowInstanceByID("wf_NewStyleEnrichment").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment", "Style US Workflow Trigger from CC Market Update");
					}
				}
				node.startWorkflowByID("wf_CCEnrichment", "CC US Workflow Initiation");
			}
		}
	}
	else if (objType == "SKU") {
		if (node.getValue("a_ACL_Market_Designation").getSimpleValue() == "US" && node.getValue("a_ACL_Market_Designation").isInherited() == false && node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == null) {
			if (!(node.isInWorkflow("wf_NewSKUEnrichment"))) {
				node.startWorkflowByID("wf_NewSKUEnrichment", "SKU US Workflow Initiation");
			}
		}
	}
}
}