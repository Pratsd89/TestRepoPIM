/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveSizeModel",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ApproveSizeModel",
  "description" : "Business Rule To Approve Size Model",
  "scope" : "Global",
  "validObjectTypes" : [ "SizeModel" ],
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,portal,stepManager,logger) {
logger.info("BR ApproveSizeModel");
if (stepManager.getCurrentWorkspace().getID() == "Main") {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    logger.info(iso.format(time));
    var f = 0;

    if (node.isInWorkflow("SizeModelEnrichmentWorkflow")) {
        if (node.isInState("SizeModelEnrichmentWorkflow", "Draft")) {
            var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
            wf.getTaskByID("Draft").triggerByID("Submit", "Size Model send for In Progress");
            if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
                var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                wf.getTaskByID("InProgress").triggerByID("Approve", "start");
                //publish Style
                f = 1;
                if (f == 1) {
                    workflow_status = node.getValue("a_Size_Model_Status").getSimpleValue();
                    log.info(workflow_status);
                    if (workflow_status == "approved") {
                        node.approve();
                        /* PPIM-3306 - Demo feedback- Do Not publish Style and SKU on Size Model changes.

                        var classStyle = node.getClassificationProductLinks();
                        if (classStyle) {
                            var chIter11 = classStyle.iterator();
                            while (chIter11.hasNext()) {
                                var chprod11 = chIter11.next();
                                var x = chprod11.getProduct();
                                log.info("styles are " + x.getID());
                                //set outbound for STYLE
                                // PPIM-3306 - publish as background job for performance reasons
                                updateEVP.republish(x);
                                //x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                //log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
                                var y = x.getChildren();
                                if (y) {
                                    var yIter = y.iterator();
                                    while (yIter.hasNext()) {
                                        var chprodX = yIter.next();
                                        //log.info("CCs are :"+chprodX.getID());
                                        var z = chprodX.getChildren();
                                        if (z) {
                                            var zIter = z.iterator();
                                            while (zIter.hasNext()) {
                                                var chprodZ = zIter.next();
                                                log.info("SKUs are :" + chprodZ.getID());

                                                //set outbound for SKU
                                                // PPIM-3306 - publish as background job for performance reasons
                                                updateEVP.republish(chprodZ);
                                                // chprodZ.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                                //log.info(chprodZ.getValue("a_main_last_modified_date").getSimpleValue());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        */
                    } else {
                        portal.showAlert("ERROR",  "Cannot Approve SizeModel");
                    }
                }
            }
        } else if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
            var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
            wf.getTaskByID("InProgress").triggerByID("Approve", "start");
            f = 1;
            if (f == 1) {
                //publish Style

                workflow_status = node.getValue("a_Size_Model_Status").getSimpleValue();
                log.info(workflow_status);
                if (workflow_status == "approved") {
                    node.approve();
                    /* PPIM-3306 - Demo feedback- Do Not publish Style and SKU on Size Model changes.
                    var classStyle = node.getClassificationProductLinks();
                    if (classStyle) {
                        var chIter11 = classStyle.iterator();
                        while (chIter11.hasNext()) {
                            var chprod11 = chIter11.next();
                            var x = chprod11.getProduct();
                            log.info("styles are " + x.getID());
                            //set outbound for STYLE
                            // PPIM-3306 - publish as background job for performance reasons
                            updateEVP.republish(x);
                            //x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                            //log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
                            var y = x.getChildren();
                            if (y) {
                                var yIter = y.iterator();
                                while (yIter.hasNext()) {
                                    var chprodX = yIter.next();
                                    log.info("CCs are :" + chprodX.getID());
                                    var z = chprodX.getChildren();
                                    if (z) {
                                        var zIter = z.iterator();
                                        while (zIter.hasNext()) {
                                            var chprodZ = zIter.next();
                                            log.info("SKUs are :" + chprodZ.getID());

                                            //set outbound for SKU
                                            // PPIM-3306 - publish as background job for performance reasons
                                            updateEVP.republish(chprodZ);
                                            // chprodZ.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                            // log.info(chprodZ.getValue("a_main_last_modified_date").getSimpleValue());
                                        }
                                    }
                                }
                            }
                        }
                    }
                    */
                } else {
                    portal.showAlert("ERROR",  "Cannot Approve SizeModel");
                }
            }

        }
    } else {
        node.startWorkflowByID("SizeModelEnrichmentWorkflow", '');
        if (node.isInWorkflow("SizeModelEnrichmentWorkflow")) {
            if (node.isInState("SizeModelEnrichmentWorkflow", "Draft")) {
                var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                wf.getTaskByID("Draft").triggerByID("Submit", "Size Model send for In Progress");
                if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
                    var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                    wf.getTaskByID("InProgress").triggerByID("Approve", "start");
                    f = 1;

                    //publish Style
                    if (f == 1) {
                        workflow_status = node.getValue("a_Size_Model_Status").getSimpleValue();
                        log.info(workflow_status);
                        if (workflow_status == "approved") {
                            node.approve();
                            /* PPIM-3306 - Demo feedback- Do Not publish Style and SKU on Size Model changes.
                            var classStyle = node.getClassificationProductLinks();
                            if (classStyle) {
                                var chIter11 = classStyle.iterator();
                                while (chIter11.hasNext()) {
                                    var chprod11 = chIter11.next();
                                    var x = chprod11.getProduct();
                                    log.info("styles are " + x.getID());
                                    //set outbound for STYLE
                                    // PPIM-3306 - publish as background job for performance reasons
                                    updateEVP.republish(x);
                                    //x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                    //log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
                                    var y = x.getChildren();
                                    if (y) {
                                        var yIter = y.iterator();
                                        while (yIter.hasNext()) {
                                            var chprodX = yIter.next();
                                            log.info("CCs are :" + chprodX.getID());
                                            var z = chprodX.getChildren();
                                            if (z) {
                                                var zIter = z.iterator();
                                                while (zIter.hasNext()) {
                                                    var chprodZ = zIter.next();
                                                    log.info("SKUs are :" + chprodZ.getID());

                                                    //set outbound for SKU
                                                    // PPIM-3306 - publish as background job for performance reasons
                                                    updateEVP.republish(chprodZ);
                                                    // chprodZ.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                                    // log.info(chprodZ.getValue("a_main_last_modified_date").getSimpleValue());
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            */
                        } else {
                            portal.showAlert("ERROR",  "Cannot Approve SizeModel");
                        }
                    }
                }
            } else if (node.isInState("SizeModelEnrichmentWorkflow", "InProgress")) {
                var wf = node.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow");
                wf.getTaskByID("InProgress").triggerByID("Approve", "start");
                f = 1;
                //publish Style
                if (f == 1) {
                    workflow_status = node.getValue("a_Size_Model_Status").getSimpleValue();
                    log.info(workflow_status);
                    if (workflow_status == "approved") {
                        node.approve();
                        /* PPIM-3306 - Demo feedback- Do Not publish Style and SKU on Size Model changes.
                        var classStyle = node.getClassificationProductLinks();
                        if (classStyle) {
                            var chIter11 = classStyle.iterator();
                            while (chIter11.hasNext()) {
                                var chprod11 = chIter11.next();
                                var x = chprod11.getProduct();
                                log.info("styles are " + x.getID());
                                //set outbound for STYLE
                                // PPIM-3306 - publish as background job for performance reasons
                                updateEVP.republish(x);
                                // x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                //log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
                                var y = x.getChildren();
                                if (y) {
                                    var yIter = y.iterator();
                                    while (yIter.hasNext()) {
                                        var chprodX = yIter.next();
                                        log.info("CCs are :" + chprodX.getID());
                                        var z = chprodX.getChildren();
                                        if (z) {
                                            var zIter = z.iterator();
                                            while (zIter.hasNext()) {
                                                var chprodZ = zIter.next();
                                                log.info("SKUs are :" + chprodZ.getID());

                                                //set outbound for SKU
                                                // PPIM-3306 - publish as background job for performance reasons
                                                updateEVP.republish(chprodZ);
                                                //  chprodZ.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                                                //log.info(chprodZ.getValue("a_main_last_modified_date").getSimpleValue());
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        */
                    } else {
                        portal.showAlert("ERROR",  "Cannot Approve SizeModel");
                    }
                }

                //publish Style
            }
        }
    }

    /*if(node.isInWorkflow("SizeModelEnrichmentWorkflow")){
    		var task=node.getTaskByID("SizeModelEnrichmentWorkflow","Draft");
         	var triggerResult = task.triggerByID("Submit",'');
         	//node.getWorkflowInstance(workflow).setSimpleVariable(;
         	var task2=node.isInState("SizeModelEnrichmentWorkflow", "InProgress");
              var triggerResult1 = task2.triggerByID("Approve",'');
    }*/

}

}