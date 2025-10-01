/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "InitiateSAWorkflowActionSKU_JP",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "InitiateSAWorkflowActionSKU_JP",
  "description" : "This business rule will trigger the SA style,CC based on the JAPAN market",
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "webHierRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,shotRef,av1Ref,av2Ref,av3Ref,av4Ref,av5Ref,av6Ref,av7Ref,av8Ref,av9Ref,ppiRef,swatchRef,videoRef,webHierRef) {
//Style Workflow
function triggerStyleEnrichmentWorkflow(product,count,flag){
     var wfErrorMessage = null;

     if ((product.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrichState1")) && count >= 2){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrichState1").triggerByID("ReadyForEnrichment","Style SA Workflow movement from NewStyleEnrichState1 - SKU").getScriptMessage();
     }
     if (((product.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrich_Copy1")) && count >= 3) || ((product.isInState("wf_NewStyleEnrichmentSA","NewStyleEnrich_Copy1")) && count >= 2 && flag == 1)){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","Style SA Workflow movement from NewStyleEnrich_Copy1  - SKU").getScriptMessage();
     }
     if (((product.isInState("wf_NewStyleEnrichmentSA","NewStyleEntrich_WebMerch1")) && count >= 3) || ((product.isInState("wf_NewStyleEnrichmentSA","NewStyleEntrich_WebMerch1")) && count >= 2 && flag == 2)){
     	
	     if(wfErrorMessage == null){
	          wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("NewStyleEntrich_WebMerch1").triggerByID("Merch_complete","Style SA Workflow movement from NewStyleEnrich_WebMerch1  - SKU").getScriptMessage();
	     }
     }
     if ((product.isInState("wf_NewStyleEnrichmentSA","WaitingForFirst_CC")) && count >= 4){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_NewStyleEnrichmentSA").getTaskByID("WaitingForFirst_CC").triggerByID("Submit","Style SA Workflow movement from WaitingForFirst_CC - SKU").getScriptMessage();
     }

     if(wfErrorMessage != null){
	     product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID()+" : "+wfErrorMessage);
     }
     else{
	     if(product.getValue("a_error_message").getSimpleValue() != null){
		     product.getValue("a_error_message").deleteCurrent();
		}
	}
}

//CC Workflow
function triggerCCEnrichmentWorkflow(product,count){
     var wfErrorMessage = null;
     if ((product.isInState("wf_CCEnrichmentSA","NewCCEnrichState1")) && count >= 2){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment","CC SA Workflow movement from NewCCEnrichState1 - SKU").getScriptMessage();
     }
     if ((product.isInState("wf_CCEnrichmentSA","NewCCEnrich_Photo1")) && count >= 3){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo1").triggerByID("Submit","CC SA Workflow movement from NewCCEnrich_Photo1 - SKU").getScriptMessage();
     }
     if ((product.isInState("wf_CCEnrichmentSA","NewCCEnrich_Photo2")) && count >= 4){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview","CC SA Workflow movement from NewCCEnrich_Photo2 - SKU").getScriptMessage();
     }
     if ((product.isInState("wf_CCEnrichmentSA","NewCCEnrich_Photo3")) && count >= 5){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit","CC SA Workflow movement from NewCCEnrich_Photo3 - SKU").getScriptMessage();
     }
     if ((product.isInState("wf_CCEnrichmentSA","NewCCEnrich_Copy1")) && count >= 5){
	     wfErrorMessage = product.getWorkflowInstanceByID("wf_CCEnrichmentSA").getTaskByID("NewCCEnrich_Copy1").triggerByID("CCNameComplete","CC SA Workflow movement from NewCCEnrich_Copy1 - SKU").getScriptMessage();
     }
     if(wfErrorMessage != null){
	     product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID()+" : "+wfErrorMessage);
	}
	else{
		if(product.getValue("a_error_message").getSimpleValue() != null){
			product.getValue("a_error_message").deleteCurrent();
		}
	}
}


var currContext = step.getCurrentContext().getID();
if(currContext == "EN_SA"){
	var order = 0;
	var flags = 0;
	var style = node.getParent().getParent();
	if (style.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Copy1") || style.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEntrich_WebMerch1")){
		if(!(style.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Copy1"))){
			flags = 1;
		}
		else if(!(style.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEntrich_WebMerch1"))){
			flags = 2;
		}
		order = 2;
		triggerStyleEnrichmentWorkflow(style,order,flags);					
	}
	else if (style.isInState("wf_NewStyleEnrichmentJapan", "WaitingForFirst_CC")){
		order = 3;
		triggerStyleEnrichmentWorkflow(style,order,flags);
	}
	else if (style.isInState("wf_NewStyleEnrichmentJapan", "NewStyleEnrich_Final")){
		order = 4;
		triggerStyleEnrichmentWorkflow(style,order,flags);
	}

	var cc = node.getParent();
	if (cc.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Copy1") || cc.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo1")){
		order = 2;
		triggerCCEnrichmentWorkflow(cc,order);
	}
	else if (cc.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo2")){
		order = 3;
		triggerCCEnrichmentWorkflow(cc,order);
	}
	else if (cc.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Photo3")){
		order = 4;
		triggerCCEnrichmentWorkflow(cc,order);
	}
	else if (cc.isInState("wf_CCEnrichmentJapan", "NewCCEnrich_Final")){
		order = 5;
		triggerCCEnrichmentWorkflow(cc,order);
	}
}
}