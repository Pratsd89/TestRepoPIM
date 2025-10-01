/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_MarketUpdate",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Market Update Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "GlobalUtil"
  }, {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  }, {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  }, {
    "libraryId" : "lib_PhotoShot",
    "libraryAlias" : "photo"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
/**
 * JP changes adde as part of PPIM-7581
 */
//function to update Style Market Designation on parent Style of the CC
//Changes are done as a part of PPIM-9130
function updateStyleMarketDesignation(cc, step, LKT) {
    var cc_markets = cc.getValue("a_Market_Designation").getSimpleValue();
    if (cc_markets) {
        var style = cc.getParent();
        var cc_markets_array = cc_markets.split("<multisep/>");
        var style_markets = style.getValue("a_Style_Market_Designation").getSimpleValue();
        //logger.info("style markets before = " + style_markets);

        if (style_markets) {
            for (var i = 0; i < cc_markets_array.length; i++) {
                var market = cc_markets_array[i];
                if (style_markets.indexOf(market) < 0) {
                    var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", market);

                    style.getValue("a_Style_Market_Designation").addValue(market);
                    updateStyleForMarket(style, step, context)
                }
            }
        }
        else {
            // setting market designation for the first time.
            style.getValue("a_Style_Market_Designation").setSimpleValue(cc_markets);
        }
        //logger.info("style markets after = " + cc.getParent().getValue("a_Style_Market_Designation").getSimpleValue());
    }
}

function updateStyleForMarket(style, step, context) {

    if (style.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "In Progress") {
        // style is in progress
        if (context != "EN_US") {
            if (style.isInState("wf_NewStyleEnrichment", "NewStyleEnrich_Copy1")) {

                style.getValue("a_Translation_Status").setSimpleValue("Needed");
            }
            else {

                helper.copyAttributesFromOneContextToAnother(style, step, "ag_Style_Copy_Attributes", "EN_US", context);
                triggerTranslation(style, step, context);
            }
        }
    }
    else if (style.getValue('a_Style_Life_Cycle_Status').getSimpleValue() == "Approved") {
        // style is approved
        if (context != "EN_US") {

            helper.copyAttributesFromOneContextToAnother(style, step, "ag_Style_Copy_Attributes", "EN_US", context);
            triggerTranslation(style, step, context);
        }

        checkAndApproveStyleInContext(style, step, context);
    }
}

function checkAndApproveStyleInContext(style, step, contextID) {
    var approvalCheck = compCheck.styleApprovalCheckInContext(style, step, contextID);

    if (approvalCheck != true) {

        style.getValue("a_Validation_Failed").setSimpleValue("Yes");
        style.getValue("a_Validation_Failed_Reason").setSimpleValue(approvalCheck);
    }
    else {
        step.executeInContext(contextID, function (otherManager) {
            var otherStyle = otherManager.getProductHome().getProductByID(style.getID());

            otherStyle.approve();
            otherStyle.getValue("a_Style_Start_Date").setSimpleValue(new Date().toISOString().substring(0, 10));
        });
    }
}

function triggerTranslation(style, step, context) {
    var urgency = style.getValue("a_Translation_Urgency").getSimpleValue();
    // If copy is complete, set a_Translation_Status=Needed, copy US English to CA English (a_Replicate_US_English_Copy=Y by default) 
    // and trigger translation.
    // trigger translation event. defaulting urgency to Standard if not set
    //logger.info('Translation Urgency :' + urgency)
    if (urgency == "Urgent") {

        GlobalUtil.setTranslationDueDate(style, step, context);
        style.getValue("a_Translation_Status").setSimpleValue("Submitted");
    }
    else {

        style.getValue("a_Translation_Urgency").setLOVValueByID("Standard");
        GlobalUtil.setTranslationDueDate(style, step, context);
        style.getValue("a_Translation_Status").setSimpleValue("Submitted");
    }
}

function updateCCForMarket(cc, step, enContext, nonEnContext, overrideContext, LKT) {
	log.info("InsideUpdateMarket");
    var overrideCCNameFlag = cc.getValue("a_Override_CC_Name").getSimpleValue();
    var ccStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();

    if (overrideCCNameFlag == "Yes") {
        var CCName = helper.getCCNameFromContext(cc, step, overrideContext);

        if (CCName != null) {

            step.executeInContext(enContext, function (otherManager) {
                var cntxtCC = otherManager.getProductHome().getProductByID(cc.getID());

                cntxtCC.setName(CCName);
            });
        }

        if (nonEnContext != null) {

            helper.setCCNameFromColorPallette(cc, step, nonEnContext);
        }
    }
    else if (overrideCCNameFlag == "No") {
    	log.info("OverrideCheckNo");
    	if (!isNotDraftAtleastInOneMarket(cc, step, LKT)){
    		log.info("inside Draft Check");

        helper.setCCNameFromColorPallette(cc, step, enContext);

        if (nonEnContext != null) {

            helper.setCCNameFromColorPallette(cc, step, nonEnContext);
        }
    	}
    }

    if (nonEnContext != null) {

        if (ccStatus == "Approved") {
            var approvalCheck = compCheck.ccApprovalCheckInContext(cc, step, enContext);

            if (approvalCheck != true) {

                cc.getValue("a_Validation_Failed").setSimpleValue("Yes");
                cc.getValue("a_Validation_Failed_Reason").setSimpleValue(approvalCheck);
            }
            else {

                step.executeInContext(enContext, function (otherManager) {
                    var otherNode = otherManager.getProductHome().getProductByID(cc.getID());

                    otherNode.getValue("a_CC_Start_Date").setSimpleValue(new Date().toISOString().substring(0, 10));
                    otherNode.approve();
                });
            }
        }
    }
    else {

        cc.getValue("a_CC_Autoapproval").setSimpleValue("Yes");
    }
}


function isNotDraftAtleastInOneMarket(node, manager, LKT) {
    var CCMarkets = node.getValue("a_Market_Designation").getSimpleValue().split("<multisep/>");
    var lifecycleStatus = null;
    var flag = false;

    CCMarkets.forEach(function (mkt) {
        var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
        manager.executeInContext(context, function (otherManager) {
            var otherNode = otherManager.getObjectFromOtherManager(node);
            lifecycleStatus = otherNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();

            if (lifecycleStatus != null && lifecycleStatus != "Draft" && lifecycleStatus != "Purged") {
                flag = true;
            }
        });
    });

    return flag;
}

/*===== business library exports - this part will not be imported to STEP =====*/
exports.updateStyleMarketDesignation = updateStyleMarketDesignation
exports.updateStyleForMarket = updateStyleForMarket
exports.checkAndApproveStyleInContext = checkAndApproveStyleInContext
exports.triggerTranslation = triggerTranslation
exports.updateCCForMarket = updateCCForMarket
exports.isNotDraftAtleastInOneMarket = isNotDraftAtleastInOneMarket