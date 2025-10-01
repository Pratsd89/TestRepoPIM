/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TEST_TRIGGER_AUTO",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TEST_TRIGGER_AUTO",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
if(node.getObjectType().getID()=='Style'){
    		if ((node.isInState("TEST_TRIGGER","NewStyleEnrich_Copy1"))){
                //try {
             		//	log.info("ANSI-Physically Entered Copy State");
             		//	log.info("Is in Draft State = "+node.isInState("TEST_TRIGGER","NewStyleEnrichState1"));
                   //var wfErrorMessage = node.getWorkflowInstanceByID("TEST_TRIGGER").getTaskByID("NewStyleEnrich_Copy1").triggerByID("Copy_Complete","Auto Trigger").getScriptMessage();
                //}
               // catch (e) {
                	//log.info("EXCEPTION IS "+e);
                    //if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    	log.info("TRIGGER from Catch"+node.isInState("TEST_TRIGGER","NewStyleEnrich_Copy1"));
                       var wfErrorMessage =  node.getWorkflowInstanceByID("TEST_TRIGGER").getTaskByID("NewStyleEnrich_Copy1").triggerLaterByID("Copy_Complete","Auto Trigger");
                    //log.info("Test "+ test);
                    //}
                //}
            log.info("ANSI-Physically Entered Copy State "+wfErrorMessage);
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }

         if ((node.isInState("TEST_TRIGGER","NewStyleEnrich_Final"))){
         	log.info("ANSI-Physically Entered Final State");
            try {
                wfErrorMessage = node.getWorkflowInstanceByID("TEST_TRIGGER").getTaskByID("NewStyleEnrich_Final").triggerByID("FinalValidation","Auto Trigger").getScriptMessage();
            }
            catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.impl.state.scxmlimpl.StateFlowImpl$StateFlowRuntimeException) {
                    node.getWorkflowInstanceByID("TEST_TRIGGER").getTaskByID("NewStyleEnrich_Final").triggerLaterByID("FinalValidation","Auto Trigger");
                }
            }
            log.info("ANSI-Physically Entered Final State"+wfErrorMessage);
            if(wfErrorMessage != null){
                node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
            }
         }
    }

     
}