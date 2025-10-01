/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_NewStyleEnrichWF_TriggerMerchComplete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "NewStyleEnrichWF_TriggerMerchComplete (US + CA + JP)",
  "description" : "Moves Styles from 'NewStyleEntrich_WebMerch1' to 'NewStyleEnrich_WebMerch2' for the US, Canada and JP New Style Enrich WFs",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
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
    "alias" : "manager",
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,webui,compCheck) {
/**
 * JP changes added as a part of PPIM-7537
 */
//PPIM 3690
//PPIM 3736
//Declare variables
var appliesConditionContext = true;
var appliesCondition1 = true;
var appliesCondition2 = true;
var returnMsg;
var targetWorkflowUS = "wf_NewStyleEnrichment";
var targetState1US = "NewStyleEntrich_WebMerch1";
var targetWorkflowCA = "wf_NewStyleEnrichmentCanada";
var targetState1CA = "NewStyleEntrich_WebMerch1";
var targetWorkflowJP = "wf_NewStyleEnrichmentJapan";
var targetState1JP = "NewStyleEntrich_WebMerch1";
var currentContext = manager.getCurrentContext().getID();
var context;
if(currentContext == "EN_US"){
	context = "US";
}
if(currentContext == "EN_CA" || currentContext == "FR_CA"){
	context = "CAN";
}
if(currentContext == "EN_JP"||currentContext == "JA_JP"){
	context = "JPN";
}

//if the Context is not EN_US, EN_CA, or FR_CA,EN_JP or JA_JP then this logic will not apply
if(context != "US" && context != "CAN"&&context != "JPN"){ 
	appliesConditionContext = false;
	returnMsg = 'The New Style Enrichment Workflow can only be triggered from the EN_US, EN_CA or FR_CA,EN_JP or JA_JP context. Please select the appropriate context and try again.';
	webui.showAlert("Error","Button Does Not Apply",returnMsg);
}

//Check that the style is in the target workflow (depending on the context) to determine the value for appliesCondition1
if(context == "US"){
	//Check that the style is in the target workflow: New Style Enrichment(wf_NewStyleEnrichment)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if(node.isInWorkflow(targetWorkflowUS)){
		if(!node.isInState(targetWorkflowUS, targetState1US)){
			//Style is in the target workflow, but NOT in the target state
			appliesCondition1 = false;
			returnMsg = "Style is not in the \'Missing Web Merchandising State\' for the New Style Enrichment Workflow";
			//Below line should be uncommented once web categoriztion check in-place
			//webui.showAlert("Error","Button Does Not Apply",returnMsg);
		}
	}
	else{
		//Style is NOT in the target workflow
		appliesCondition1 = false;
		returnMsg = "Style is not in the \'New Style Enrichment Workflow\'";
		webui.showAlert("Error","Button Does Not Apply",returnMsg);
	}
}
if(context == "CAN"){
	//Check that the style is in the target workflow: New Style Enrichment Canada (wf_NewStyleEnrichmentCanada)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if(node.isInWorkflow(targetWorkflowCA)){
		if(!node.isInState(targetWorkflowCA, targetState1CA)){
			//Style is in the target workflow, but NOT in the target state
			appliesCondition1 = false;
			returnMsg = "Style is not in the \'Missing Web Merchandising State\' for the New Style Enrichment Workflow Canada";
			//Below line should be uncommented once web categoriztion check in-place
			//webui.showAlert("Error","Button Does Not Apply",returnMsg);
		}
	}
	else{
		//Style is NOT in the target workflow
		appliesCondition1 = false;
		returnMsg = "Style is not in the \'New Style Enrichment Workflow Canada\'";
		webui.showAlert("Error","Button Does Not Apply",returnMsg);
	}	
}
// Added as part of PPIM_7537 added Changes w.r.t JP Context
if(context == "JPN"){
	//Check that the style is in the target workflow: New Style Enrichment Japan (wf_NewStyleEnrichmentJapan)
	//and that the Style is in the target states: Missing Web Merchandising State(NewStyleEntrich_WebMerch1)
	if(node.isInWorkflow(targetWorkflowJP)){
		if(!node.isInState(targetWorkflowJP, targetState1JP)){
			//Style is in the target workflow, but NOT in the target state
			appliesCondition1 = false;
			returnMsg = "Style is not in the \'Missing Web Merchandising State\' for the New Style Enrichment Workflow Japan";
			//Below line should be uncommented once web categoriztion check in-place
			//webui.showAlert("Error","Button Does Not Apply",returnMsg);
		}
	}
	else{
		//Style is NOT in the target workflow
		appliesCondition1 = false;
		returnMsg = "Style is not in the \'New Style Enrichment Workflow Japan\'";
		webui.showAlert("Error","Button Does Not Apply",returnMsg);
	}	
}

//The following will apply if the context is US/CA/JP and the Style is in the correct Workflow and State
if(appliesCondition1 == true){
	//Check to Ignore web related validations for Non Merch Style
	var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
	if(!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || 
		nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN"))
	{	
		//Call on the function attributeCompletenessCheck
		var attributeCheck = compCheck.attributeCompletenessCheck(node, manager, "ag_Style_Validation");
		//If the attributeCompletenessCheck returns false then appliesCondition2 will be false and an Error Message should be returned
		if(attributeCheck != true){
			appliesCondition2 = false;
			returnMsg = "Following attributes are mandatory and needs to be filled to proceed: \n"+attributeCheck;
			webui.showAlert("Error","Style Missing Mandatory Attributes",returnMsg);
		}
		
		//For web category check, if the style is not in a Web Category but any one of its CC is, then let that Style pass
		
		
		// at this point, none of CCs under the Style has Web Category so check for the same on Style
	   var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
	   var classificationType = classificationTypeHome.getLinkTypeByID("StyleToWebSubCategoryRef");	
        var classificationLinkList = node.getClassificationProductLinks(classificationType).toArray();
        var classificationErrorFlag = false;
       /* if(context == "US"){
            if(classificationLinkList.length == 0){
                var CCList = node.getChildren();
                if (CCList.size() > 0) {
                    for (var i = 0; i < CCList.size(); i++) {
                        var cc= CCList.get(i);
                        var marketDesignation = cc.getValue('a_Market_Designation').getSimpleValue();
                        var lifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
            		    if(marketDesignation.contains('US') && lifeCycleStatus != "DRAFT"){
                            var isCCActive = false;
                            var ccDeactivationDate = cc.getValue('a_CC_End_Date').getSimpleValue();
                            if(ccDeactivationDate == null){
                                isCCActive = true;
                            }
                            else{
                                var ccDeactivationDateFlag = false;
                                var formatter =java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");  
                                var now = java.time.ZonedDateTime.now();
                                var current = now.format(formatter);
                                ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
                                current = simpleDateFormat.parse(current);
                                if(current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate)==0){
                                    ccDeactivationDateFlag = true;
                                }

                                if(ccDeactivationDateFlag == false){
                                    isCCActive = true;
                                }
                            }
                            if(isCCActive == true){

                                var ccClassificationLinkList = cc.getClassificationProductLinks(classificationType).toArray();
                                if(ccClassificationLinkList.length ==0) {
                                    classificationErrorFlag = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                
            }
        }*/

       /* if(context == "CAN"){
            if(classificationLinkList.length == 0){
                var CCList = node.getChildren();
                if (CCList.size() > 0) {
                    for (var i = 0; i < CCList.size(); i++) {
                        var cc= CCList.get(i);
                        var marketDesignation = cc.getValue('a_Market_Designation').getSimpleValue();
                        var lifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
            		    if(marketDesignation.contains('CAN') && lifeCycleStatus != "DRAFT"){
                            var isCCActive = false;
                            var ccDeactivationDate = cc.getValue('a_CC_End_Date').getSimpleValue();
                            if(ccDeactivationDate == null){
                                isCCActive = true;
                            }
                            else{
                                var ccDeactivationDateFlag = false;
                                var formatter =java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");  
                                var now = java.time.ZonedDateTime.now();
                                var current = now.format(formatter);
                                ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
                                current = simpleDateFormat.parse(current);
                                if(current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate)==0){
                                    ccDeactivationDateFlag = true;
                                }

                                if(ccDeactivationDateFlag == false){
                                    isCCActive = true;
                                }
                            }
                            if(isCCActive == true){

                                var ccClassificationLinkList = cc.getClassificationProductLinks(classificationType).toArray();
                                if(ccClassificationLinkList.length ==0) {
                                    classificationErrorFlag = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                
            }
        }*/
//Added as part of PPIM_7537 added Changes w.r.t JP Context
         /* if(context == "JPN"){
            if(classificationLinkList.length == 0){
                var CCList = node.getChildren();
                if (CCList.size() > 0) {
                    for (var i = 0; i < CCList.size(); i++) {
                        var cc= CCList.get(i);
                        var marketDesignation = cc.getValue('a_Market_Designation').getSimpleValue();
                        var lifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
            		    if(marketDesignation.contains('JPN') && lifeCycleStatus != "DRAFT"){
                            var isCCActive = false;
                            var ccDeactivationDate = cc.getValue('a_CC_End_Date').getSimpleValue();
                            if(ccDeactivationDate == null){
                                isCCActive = true;
                            }
                            else{
                                var ccDeactivationDateFlag = false;
                                var formatter =java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");  
                                var now = java.time.ZonedDateTime.now();
                                var current = now.format(formatter);
                                ccDeactivationDate = simpleDateFormat.parse(ccDeactivationDate);
                                current = simpleDateFormat.parse(current);
                                if(current.after(ccDeactivationDate) || current.compareTo(ccDeactivationDate)==0){
                                    ccDeactivationDateFlag = true;
                                }

                                if(ccDeactivationDateFlag == false){
                                    isCCActive = true;
                                }
                            }
                            if(isCCActive == true){

                                var ccClassificationLinkList = cc.getClassificationProductLinks(classificationType).toArray();
                                if(ccClassificationLinkList.length ==0) {
                                    classificationErrorFlag = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                
            }
        } */
        
        if(classificationErrorFlag==true){
            appliesCondition2 = false;
            returnMsg = "Style or CC missing web categorization";
            webui.showAlert("Error","Style or CC missing web categorization",returnMsg);
        }
        else{
            var primaryCategoryTrueFlag = false;
            var pCatStyle = node.getValue("a_Primary_Category").getSimpleValue();
            if(pCatStyle != null){
                primaryCategoryTrueFlag = true;
            }
            if(primaryCategoryTrueFlag == false){
                appliesCondition2 = false;
                returnMsg = "There should be at least one Primary Category associated with Style";
                webui.showAlert("Error","Style Missing Primary Category Association",returnMsg);
            }
        }
		
	}
}
//if the appliesCondition1, appliesCondition2, and appliesConditionContext are true, 
//then trigger the Style from the current state to the next Target State of NewStyleEnrich_WebMerch2
if(appliesCondition1 == true && appliesCondition2 == true && appliesConditionContext == true){
	var workflowIDUS = "wf_NewStyleEnrichment";
	var currentStateIDUS = "NewStyleEntrich_WebMerch1";
	var workflowIDCA = "wf_NewStyleEnrichmentCanada";
	var currentStateIDCA = "NewStyleEntrich_WebMerch1";
	var workflowIDJP = "wf_NewStyleEnrichmentJapan";
	var currentStateIDJP = "NewStyleEntrich_WebMerch1";
	var eventID = "Merch_complete";
	if(context == "US"){
		var task = node.getTaskByID(workflowIDUS, currentStateIDUS);
		task.triggerByID(eventID, "Submitting Style from \'NewStyleEntrich_WebMerch1\' to \'NewStyleEnrich_WebMerch2\'");
		if(node.isInState(workflowIDUS, "NewStyleEnrich_WebMerch2")||(node.isInState(workflowIDUS, "WaitingForFirst_CC"))||(node.isInState(workflowIDUS, "NewStyleEnrich_Final"))){
			//pass
		}
		else{
			log.info('Could not submit version 1');
			returnMsg = 'The Style could not move to the next state.';
			webui.showAlert("Error","Workflow Submission Failed",returnMsg);
		}
	}
	if (context == "CAN"){
		var task = node.getTaskByID(workflowIDCA, currentStateIDCA);
		task.triggerByID(eventID, "Submitting Style from \'NewStyleEntrich_WebMerch1\' to \'NewStyleEnrich_WebMerch2\'");
		if(node.isInState(workflowIDCA, "NewStyleEnrich_WebMerch2")||(node.isInState(workflowIDCA, "WaitingForFirst_CC"))||(node.isInState(workflowIDCA, "NewStyleEnrich_Final"))){
			//pass
		}
		else{
			log.info('Could not submit version 2');
			returnMsg = 'The Style could not move to the next state.';
			webui.showAlert("Error","Workflow Submission Failed",returnMsg);
		}
	}
	//Added as part of PPIM_7537 added Changes w.r.t JP Context
	if (context == "JPN"){
		var task = node.getTaskByID(workflowIDJP, currentStateIDJP);
		task.triggerByID(eventID, "Submitting Style from \'NewStyleEntrich_WebMerch1\' to \'NewStyleEnrich_WebMerch2\'");
		if(node.isInState(workflowIDJP, "NewStyleEnrich_WebMerch2")||(node.isInState(workflowIDJP, "WaitingForFirst_CC"))||(node.isInState(workflowIDJP, "NewStyleEnrich_Final"))){
			//pass
		}
		else{
			log.info('Could not submit version 3');
			returnMsg = 'The Style could not move to the next state.';
			webui.showAlert("Error","Workflow Submission Failed",returnMsg);
		}
	}
}
}