/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DeltaLoadXMLInboundCCActionWF",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DeltaLoadXMLInboundCCActionWF",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotRequestRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotReqRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step,shotRequestRef,shotReqRef) {
//PPIM-2406 - XML Inbound for Style, CC, SKU transition States
function triggerCCEnrichmentWorkflow(product, count, wf) {
    var wfErrorMessage = null;
    if ((!(product.isInWorkflow(wf))) && count >= 1) {
        if (!(product.getValue("a_Source_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && product.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && (!(product.isInWorkflow(wf))) && product.getApprovalStatus() != "Not in Approved workspace")) {
            product.startWorkflowByID(wf, "Delta Load based initiation");
        }
    }
    if ((product.isInState(wf, "NewCCEnrichState1")) && count >= 2) {
        wfErrorMessage = product.getWorkflowInstanceByID(wf).getTaskByID("NewCCEnrichState1").triggerByID("CCReadyForEnrichment", "Delta Load based trigger").getScriptMessage();
    }
    if ((product.isInState(wf, "NewCCEnrich_Photo1")) && count >= 3) {
        wfErrorMessage = product.getWorkflowInstanceByID(wf).getTaskByID("NewCCEnrich_Photo1").triggerByID("Submit", "Delta Load based trigger").getScriptMessage();
    }
    if ((product.isInState(wf, "NewCCEnrich_Photo2")) && count >= 4) {
        wfErrorMessage = product.getWorkflowInstanceByID(wf).getTaskByID("NewCCEnrich_Photo2").triggerByID("SubmitForReview", "Delta Load based trigger").getScriptMessage();
    }
    if ((product.isInState(wf, "NewCCEnrich_Photo3")) && count >= 5) {
        wfErrorMessage = product.getWorkflowInstanceByID(wf).getTaskByID("NewCCEnrich_Photo3").triggerByID("Submit", "Delta Load based trigger").getScriptMessage();
    }
    if ((product.isInState(wf, "NewCCEnrich_Final")) && count == 6) {
        wfErrorMessage = product.getWorkflowInstanceByID(wf).getTaskByID("NewCCEnrich_Final").triggerByID("Submit", "Delta Load based trigger").getScriptMessage();
    }
    if (wfErrorMessage != null) {
        product.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : " + wfErrorMessage);
    } else {
        if (product.getValue("a_error_message").getSimpleValue() != null) {
            product.getValue("a_error_message").deleteCurrent();
        }
    }
}

/*
//////////////////////////////////////////Block to populate pre-Default attributes/////////////////////////////////////////////////////
function updateMarketDesigShotReq(product, contextID) {
    step.executeInContext(contextID, function (contextManager) {
        var currentProduct = contextManager.getProductHome().getProductByID(product.getID());
        var marketDesignation = currentProduct.getValue("a_Market_Designation").getSimpleValue();
        var ccNum = currentProduct.getValue("a_CC_Number").getSimpleValue();
        if (marketDesignation != null) {
            var desigValue = null;
            if (marketDesignation.contains("US") && marketDesignation.contains("CAN")) {
                desigValue = "BOTH";
            }
            if (marketDesignation == "US") {
                desigValue = "US";
            }
            if (marketDesignation == "CAN") {
                desigValue = "CAN";
            }
            var shotReq = null;
            var refsc = new java.util.ArrayList();
            refsc.addAll(currentProduct.getReferences(shotReqRef));
            for (var k = 0; k < refsc.size(); k++) {
                shotReq = refsc.get(k).getTarget();
                shotReq.getValue("a_Market_Designation_Shot_Request").setSimpleValue(desigValue);
                if (ccNum != null) {
                    shotReq.getValue("a_Shot_CC_Number").setSimpleValue(ccNum);
                }
            }
        }
    });

}
/////////////////////////Set Market Designation from ACL////////////////////////////
var usACLMarketDesig = null;
var caACLMarketDesig = null;
step.executeInContext("EN_US", function (usstep) {
    var usProduct = usstep.getProductHome().getProductByID(node.getID());
    if (usProduct.getValue("a_ACL_Market_Designation").getSimpleValue() != null) {
        if (usProduct.getValue("a_ACL_Market_Designation").isInherited() == false) {
            //log.info(usProduct.getValue("a_ACL_Market_Designation").isInherited());
            usACLMarketDesig = usProduct.getValue('a_ACL_Market_Designation').getSimpleValue();
        }
    }

});

step.executeInContext("EN_CA", function (castep) {
    var caProduct = castep.getProductHome().getProductByID(node.getID());
    if (caProduct.getValue("a_ACL_Market_Designation").getSimpleValue() != null) {
        if (caProduct.getValue("a_ACL_Market_Designation").isInherited() == false) {
            caACLMarketDesig = caProduct.getValue('a_ACL_Market_Designation').getSimpleValue();
        }
    }

});

if (caACLMarketDesig != null || usACLMarketDesig != null) {
    if (caACLMarketDesig == null) {
        node.getValue("a_Market_Designation").setSimpleValue(usACLMarketDesig);
			if(node.getParent().getValue("a_Style_Market_Designation").getSimpleValue() == null){
				node.getParent().getValue("a_Style_Market_Designation").setSimpleValue(usACLMarketDesig);
			}
			else{
				var marDes=node.getParent().getValue("a_Style_Market_Designation").getSimpleValue();
				if(marDes.contains("CAN") && (!(marDes.contains("US")))){
					node.getParent().getValue("a_Style_Market_Designation").addLOVValueByID("1");
				}
							
			}
    } else if (usACLMarketDesig == null) {
        node.getValue("a_Market_Designation").setSimpleValue(caACLMarketDesig);
			if(node.getParent().getValue("a_Style_Market_Designation").getSimpleValue() == null){
				node.getParent().getValue("a_Style_Market_Designation").setSimpleValue(caACLMarketDesig);
			}
			else{
				var marDes=node.getParent().getValue("a_Style_Market_Designation").getSimpleValue();
				if(marDes.contains("US") && (!(marDes.contains("CAN")))){
					node.getParent().getValue("a_Style_Market_Designation").addLOVValueByID("4");
				}							
			}
    } else {
        var marketdesig = caACLMarketDesig + '<multisep/>' + usACLMarketDesig;
        node.getValue("a_Market_Designation").setSimpleValue(marketdesig);
        node.getParent().getValue("a_Style_Market_Designation").setSimpleValue(marketdesig);
    }
}

/////////////////////////

var CC_ID = node.getID();
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var now = java.time.ZonedDateTime.now().minusDays(30);
var final_date = now.format(formatter);
//log.info(final_date);
var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();

//////// US Context //////////
if (marketDesignation != null) {
    if (marketDesignation.contains("US")) {
        step.executeInContext('EN_US', function (enContextManager) {
            var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
            /////New Color:
            var CC_Start_Date = enCurrentProduct.getValue("a_CC_Start_Date").getSimpleValue();
            //log.info(CC_Start_Date);
            if (CC_Start_Date != null) {

                if (CC_Start_Date > final_date || CC_Start_Date == final_date) {
                    enCurrentProduct.getValue("a_New_Color").setSimpleValue("Yes");
                    //log.info(enCurrentProduct.getValue("a_New_Color").getSimpleValue());

                } else {
                    enCurrentProduct.getValue("a_New_Color").setSimpleValue("No");
                    //log.info(enCurrentProduct.getValue("a_New_Color").getSimpleValue());
                }
            }
            //=============DONOTAllow catalog sync user to trigger functions // PPIM-3799===========
var lastModifiedUser = node.getRevision().getUserID();

            ///CC Planned in DC Date
            var CC_Source_Date = enCurrentProduct.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
            var CC_Planned_Date = enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue();
            //log.info("plan" +CC_Planned_Date);
            //log.info("source" +CC_Source_Date);
if (lastModifiedUser.toUpperCase() != "STIBOCATALOGSYNCUSER"){
            if (CC_Planned_Date == null && CC_Source_Date != null) {
                enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
                //log.info(enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue())
            } else if (CC_Source_Date != null && CC_Planned_Date != null) {

                if (CC_Source_Date < CC_Planned_Date) {
                    enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
                    //log.info("a_CC_Source_in_DC_Date " +enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue());
                }
            }
}

            ///Style IN DC Date
            var parent_style = enCurrentProduct.getParent().getID();
            //log.info(parent_style);
            var enCurrentParentProduct = enContextManager.getProductHome().getProductByID(parent_style);
            var style_DC_Date = enCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue();
            //log.info("date" +  style_DC_Date);
            if (style_DC_Date == null && CC_Source_Date != null) {
                enCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
            } else if (CC_Source_Date != null && style_DC_Date != null) {
                if (CC_Source_Date < style_DC_Date) {
                    enCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
                    //log.info("Style overlap" +enCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue());
                }
            }
            /////a_Override_CC_Name
            var Override_CC_Name = enCurrentProduct.getValue("a_Override_CC_Name").getSimpleValue();
            if (Override_CC_Name == null) {
                enCurrentProduct.getValue("a_Override_CC_Name").setSimpleValue("No");
                //log.info("a_Override_CC_Name  " + enCurrentProduct.getValue("a_Override_CC_Name").getSimpleValue());
            }
        })
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////CA Context///
if (marketDesignation != null) {
    if (marketDesignation.contains("CAN")) {
        step.executeInContext('EN_CA', function (caContextManager) {
            var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
            /////New Color:
            var CC_Start_Date = caCurrentProduct.getValue("a_CC_Start_Date").getSimpleValue();
            //log.info(CC_Start_Date);

            //log.info(CC_Start_Month);
            if (CC_Start_Date != null) {

                if (CC_Start_Date > final_date || CC_Start_Date == final_date) {
                    caCurrentProduct.getValue("a_New_Color").setSimpleValue("Yes");
                    //log.info(caCurrentProduct.getValue("a_New_Color").getSimpleValue());

                } else {
                    caCurrentProduct.getValue("a_New_Color").setSimpleValue("No");
                    //log.info(caCurrentProduct.getValue("a_New_Color").getSimpleValue());
                }
            }
            //=============DONOTAllow catalog sync user to trigger functions // PPIM-3799===========
            var lastModifiedUser = node.getRevision().getUserID();
            
                        ///CC Planned in DC Date
                        var CC_Source_Date = caCurrentProduct.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
                        var CC_Planned_Date = caCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue();
            if (lastModifiedUser.toUpperCase() != "STIBOCATALOGSYNCUSER"){
                        if (CC_Planned_Date == null && CC_Source_Date != null) {
                            caCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
                        } else if (CC_Source_Date != null && CC_Planned_Date != null) {
                            if (CC_Source_Date < CC_Planned_Date) {
                                caCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
                                //log.info("a_CC_Source_in_DC_Date " +enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue());
                            }
                        }
            }
            ///Style IN DC Date
            var parent_style = caCurrentProduct.getParent().getID();
            //log.info(parent_style);
            var caCurrentParentProduct = caContextManager.getProductHome().getProductByID(parent_style);
            var style_DC_Date = caCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue();
            //log.info("date" +  style_DC_Date);
            if (style_DC_Date == null && CC_Source_Date != null) {
                caCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
            } else if (CC_Source_Date != null && style_DC_Date != null) {
                if (CC_Source_Date < style_DC_Date) {
                    caCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
                    //log.info("Style overlap" +caCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue());
                }
            }
            /////a_Override_CC_Name
            var Override_CC_Name = caCurrentProduct.getValue("a_Override_CC_Name").getSimpleValue();
            if (Override_CC_Name == null) {
                caCurrentProduct.getValue("a_Override_CC_Name").setSimpleValue("No");
                //log.info("a_Override_CC_Name  " + node.getValue("a_Override_CC_Name").getSimpleValue());
            }
        })
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Style Imported
var style = node.getParent().getID();
var CC_Country_Origin = node.getValue("a_CC_Country_of_Origin").getSimpleValue();
if (CC_Country_Origin != null) {
    if (CC_Country_Origin == "US") {
        if (marketDesignation != null) {
            if (marketDesignation.contains("US")) {
                step.executeInContext('EN_US', function (enContextManager) {
                    var enCurrentProduct = enContextManager.getProductHome().getProductByID(style);
                    enCurrentProduct.getValue("a_Style_Imported").setSimpleValue("No");
                })
            }
        }
        if (marketDesignation != null) {
            if (marketDesignation.contains("CAN")) {
                step.executeInContext('EN_CA', function (caContextManager) {
                    var caCurrentProduct = caContextManager.getProductHome().getProductByID(style);
                    caCurrentProduct.getValue("a_Style_Imported").setSimpleValue("No");
                })
            }
        }
    } else {
        if (marketDesignation != null) {
            if (marketDesignation.contains("US")) {
                step.executeInContext('EN_US', function (enContextManager) {
                    var enCurrentProduct = enContextManager.getProductHome().getProductByID(style);
                    enCurrentProduct.getValue("a_Style_Imported").setSimpleValue("Yes");
                })
            }
        }
        if (marketDesignation != null) {
            if (marketDesignation.contains("CAN")) {
                step.executeInContext('EN_CA', function (caContextManager) {
                    var caCurrentProduct = caContextManager.getProductHome().getProductByID(style);
                    caCurrentProduct.getValue("a_Style_Imported").setSimpleValue("Yes");
                })
            }
        }
    }
}
/////////////////////////////////////////
//Populating a_Market_Designation_Shot_request for linked shot requests
var objType = node.getObjectType().getID();
if (objType == "CustomerChoice") {
    var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
    if (marketDesignation != null) {
        if (marketDesignation.contains("US")) {
            updateMarketDesigShotReq(node, "EN_US");
        }
        if (marketDesignation.contains("CAN")) {
            updateMarketDesigShotReq(node, "EN_CA");
        }
    }
}
/////////////////////////////////////////////////End Block/////////////////////////////////////////////
*/
var currentContext = step.getCurrentContext().getID(); //currentContext can be EN_US, EN_CA or FR_CA
var wfErrorMessage = null;
var order = 0;
var objType = node.getObjectType().getID();
if (objType == "CustomerChoice") {
    var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue(); //it may contain US, CAN or US/CAN
    if (marketDesignation != null) {
        if ((currentContext == "EN_US" && marketDesignation.contains("US")) || ((currentContext == "EN_CA" || currentContext == "FR_CA") && marketDesignation.contains("CAN"))) {
            var status = node.getValue("a_Source_CC_Life_Cycle_Status").getSimpleValue();
            if (status == "Draft") {
                order = 1;
              //  triggerCCEnrichmentWorkflow(node, order);
            } else if (status == "In Progress") {
                var isMainP1Shot = false;
                var shotRef = new java.util.ArrayList();
                shotRef.addAll(node.getReferences(shotRequestRef));
                for (var i = 0; i < shotRef.size(); i++) {
                    var shotRequest = shotRef.get(i).getTarget();
                    if (shotRequest.getValue("a_Site_Placement").getLOVValue().getID() == 5) {
                        isMainP1Shot = true;
                        var shotLifeCycleStatus = shotRequest.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
                    }
                }
                if (isMainP1Shot == false) {
                    order = 2;
                   // triggerCCEnrichmentWorkflow(node, order);
                } else {
                    if (shotLifeCycleStatus == "Submitted") {
                        order = 3;
                      //  triggerCCEnrichmentWorkflow(node, order);
                    }
                    if (shotLifeCycleStatus == "Ready for Review") {
                        order = 4;
                       // triggerCCEnrichmentWorkflow(node, order);
                    }
                    if (shotLifeCycleStatus == "Complete") {
                        order = 5;
                       // triggerCCEnrichmentWorkflow(node, order);
                    }
                }
            //} else if ((status == "Approved" && (node.isInWorkflow("wf_CCEnrichment") || node.isInWorkflow("wf_CCEnrichmentCanada"))) || (status == "Approved" && node.getApprovalStatus() == "Not in Approved workspace")) {
            //To Cover PPIM-1802 & 2940 cases. Removing approval status check
            } else if (status == "Approved" && node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != "Approved") {
                order = 6;
              //  triggerCCEnrichmentWorkflow(node, order);
            } else if (status == "Approved" && node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && !node.isInWorkflow("wf_CCEnrichment") && !node.isInWorkflow("wf_CCEnrichmentCanada") && node.getApprovalStatus() != "Not in Approved workspace") {
                node.approve();
            }
            
             // trigger workflow transition depending on context
            if (order != 0) {
                if (currentContext == "EN_US") {
                    triggerCCEnrichmentWorkflow(node, order, "wf_CCEnrichment");
                } else {
                    triggerCCEnrichmentWorkflow(node, order, "wf_CCEnrichmentCanada");
                }
            }
            
            
        } else {
            node.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is not valid for executing context");
        }
    } else {
        node.getValue("a_error_message").setSimpleValue(step.getCurrentContext().getID() + " : a_Market_Designation is missing");
    }
}

}