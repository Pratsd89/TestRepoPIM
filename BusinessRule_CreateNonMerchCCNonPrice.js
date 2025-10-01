/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateNonMerchCCNonPrice",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CreateNonMerchCCNonPrice",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "ccName",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">A_attr</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,portal,ccName,lookupTable) {
/*
 * This rule works as follows:
 * -First get current context and set Market Code
 * -Second set sequence number for current CC under the parent Style
 * -Third Suffix above two to Parent Style ID
 */

//PPIM-9060 Create CC Number based on Brand and Market choosen such that 9th digit of CC number as '2','3' and'6' for US, CAN and JPN markets respectively and '1' for GO/BRFS
function setCCNumberBasedOnBrandMarket(styleID, seqNum, brandNum, market) {
    var ccID = null;
    if (styleID == null) //value to be inserted in CC Number without prefix handled as per existing behaviour
        styleID = '';
    if ((brandNum == 'GO' || brandNum == 'BRFS') && market == 'US')
        ccID = styleID + seqNum + '1';
    else {
        if (market == 'US')
            ccID = styleID + seqNum + '2';
        else if (market == 'CAN')
            ccID = styleID + seqNum + '3';
        else if (market == 'JPN')
            ccID = styleID + seqNum + '6';
    }
    return ccID
}

var result = true;
var merchFlag = node.getValue("a_product_merch_type").getSimpleValue();

//If CC Name is NULL
if (ccName == null) {
    result = false;
    portal.showAlert("ERROR",  "The CC was not created. Please enter CC Name during creation.");
}

//If result equals true
if (result == true) {
    var styleID = node.getID();
    //get a_Style_Number for CC Number logic
    var nmStyleID = node.getValue("a_Style_Number").getSimpleValue();
    var nmCCID = null;
    var seqNum = null;
    var ccID = null;
    var currentContext = step.getCurrentContext().getID();

    //PPIM-9141 - Fetch market and marketCode from current context using lookup Table
    var market = lookupTable.getLookupTableValue("LKT_Context_to_Market", currentContext)
    var marketCode = lookupTable.getLookupTableValue("LKT_Context_to_MarketCode", currentContext)

    //PPIM-9060 - Fetch BrandNumber and Channel Number block of code moved here from CC iteration Loop below so that details can be fetched from Style level itself.
    //Get column values from Brand - Style->Subclass->Class->Department->Division->Brand (PPIM-2931)
    var brandObj = node.getParent().getParent().getParent().getParent().getParent();
    var brandNum = brandObj.getValue("a_Brand_Number").getSimpleValue();
    var channelNum = brandObj.getValue("a_Channel_Number").getSimpleValue();

    var sCC = new java.util.ArrayList();
    sCC.addAll(node.getChildren());
    seqNum = sCC.size();

    //If seqNum is NOT NULL
    if (seqNum != null) {
        seqNum = parseInt(seqNum) + 1;
        //If the seqNum parsed from string to int is less than or equals to 9
        if (parseInt(seqNum) <= 9) {
            seqNum = "0" + seqNum;
        }

        //PPIM-9060 Set Non Merch CCID and CC number
        ccID = setCCNumberBasedOnBrandMarket(styleID, seqNum, brandNum, market)
        nmCCID = setCCNumberBasedOnBrandMarket(nmStyleID, seqNum, brandNum, market)

        //Log CC ID
        log.info("CC ID " + ccID);

        //Try starting workflows
        try {
            var cc = node.createProduct(ccID, "CustomerChoice");
            //PPIM-9141 -Initiating CC Workflow based on Context using LookupTable
            var workflow = lookupTable.getLookupTableValue("LKT_Context_to_CC_Enrich_Workflows", currentContext)
            cc.startWorkflowByID(workflow, "CC " + market + " Workflow Initiation")

            //Setting up of the sort order of the CC, starting by checking if CC sort order is NULL or empty
            if (cc.getValue("a_CC_Sort_Order").getSimpleValue() == null || cc.getValue("a_CC_Sort_Order").getSimpleValue() == "") {
                var style = cc.getParent();
                var ccList = style.getChildren();

                //If style only has one CC in list
                if (ccList.size() == 1) {
                    cc.getValue("a_CC_Sort_Order").setSimpleValue("999");
                } else {
                    var sortOrder = 999;

                    //For each CC in list
                    for (var i = 0; i < ccList.size(); i++) {
                        //If CC ID is NOT equals to the CC ID at current position in list
                        if (cc.getID() != ccList.get(i).getID()) {
                            var ccSortOrder = ccList.get(i).getValue("a_CC_Sort_Order").getSimpleValue();

                            //If CC sort order is NOT NULL and NOT empty
                            if (ccSortOrder != null && ccSortOrder != "") {
                                parseInt(ccSortOrder);

                                //If CC sort order is less than sort order
                                if (ccSortOrder < sortOrder) {
                                    sortOrder = ccSortOrder;
                                }
                            }
                        }
                    }
                    var newSortOrder = sortOrder - 1;
                    cc.getValue("a_CC_Sort_Order").setSimpleValue(newSortOrder);
                }
            }
            //End of the code, catch exception
        } catch (e) {
            //If exception is an instance of a "node ID unique constraint exception" or an "object type constraint exception"
            if (e.javaException instanceof com.stibo.core.domain.NodeIdUniqueConstraintException || e.javaException instanceof com.stibo.core.domain.ObjectTypeConstraintException) {
                throw e;
            }
        }
        
        var ccList = new java.util.ArrayList();
        ccList.addAll(node.getChildren());

        //For each CC in list
        for (var k = 0; k < ccList.size(); k++) {
            //If CC ID at current position in list is equal to CC ID
            if (ccList.get(k).getID() == ccID) {
                var cCC = ccList.get(k);

                ccList.get(k).getValue("a_CC_Number").setSimpleValue(nmCCID);
                ccList.get(k).getValue("a_Market_Designation").addLOVValueByID(marketCode);
                cCC.setName(ccName);

                cCC.getValue("a_Brand_Number").setSimpleValue(brandNum);
                cCC.getValue("a_Channel_Number").setSimpleValue(channelNum);
                cCC.getValue("a_Source_CC_Color_Code").setSimpleValue(nmCCID.toString().slice(-3, -1));
            }
        }

        //If merch flag equals one of the following values
        if (merchFlag == "STORED VALUE CARDS FIXED" || merchFlag == "STORED VALUE CARDS FIXED OPTIONS") {
            portal.navigate("GAPNonMerchCCDetailsListNoName", cCC);
        } else {
            portal.navigate("GAPNonMerchCCDetailsList", cCC);
        }
    }
}
}