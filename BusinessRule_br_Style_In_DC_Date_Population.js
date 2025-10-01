/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Style_In_DC_Date_Population",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Prod Data Correction Style in DC Date Population",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation0 = function (step,node) {
var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
var CC_ID = node.getID();

if (marketDesignation != null) {
    if (marketDesignation.contains("US")) {
        step.executeInContext('EN_US', function (enContextManager) {
            var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
            var a_CC_Planned_in_DC_Date = enCurrentProduct.getValue('a_CC_Planned_in_DC_Date').getSimpleValue();
            
            //Copying planned in DC Date to Source in DC Date
            enCurrentProduct.getValue("a_CC_Source_in_DC_Date").setSimpleValue(a_CC_Planned_in_DC_Date);
            var CC_Source_Date = enCurrentProduct.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
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

            //Approving the parent style
            var styleLifeCycleStatus = enCurrentParentProduct.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
            if(styleLifeCycleStatus=='Approved' && enCurrentParentProduct.getApprovalStatus() !='Not in Approved workspace'){
                enCurrentParentProduct.approve();
            }

            //Approving the CC
            var ccLifeCycleStatus = enCurrentProduct.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
            if(ccLifeCycleStatus=='Approved' && enCurrentProduct.getApprovalStatus() !='Not in Approved workspace'){
                enCurrentProduct.approve();
            }
        });
    }
}



if (marketDesignation != null) {
    if (marketDesignation.contains("CAN")) {
        step.executeInContext('EN_CA', function (caContextManager) {
            var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
            var a_CC_Planned_in_DC_Date = caCurrentProduct.getValue('a_CC_Planned_in_DC_Date').getSimpleValue();
            
            //Copying planned in DC Date to Source in DC Date
            caCurrentProduct.getValue("a_CC_Source_in_DC_Date").setSimpleValue(a_CC_Planned_in_DC_Date);
            var CC_Source_Date = caCurrentProduct.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
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

            //Approving the parent style
            var styleLifeCycleStatus = caCurrentParentProduct.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
            if(styleLifeCycleStatus=='Approved' && caCurrentParentProduct.getApprovalStatus() !='Not in Approved workspace'){
                caCurrentParentProduct.approve();
            }

            //Approving the CC
            var ccLifeCycleStatus = caCurrentProduct.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
            if(ccLifeCycleStatus=='Approved' && caCurrentProduct.getApprovalStatus() !='Not in Approved workspace'){
                caCurrentProduct.approve();
            }
            
        });
    }
}
}