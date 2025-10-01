/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Check_CC_Name_Color_Palette",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Check CC Name Color Palette",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "colorPaletteRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "CCToColorPaletteRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,colorPaletteRef,LKT) {
/*
 * This rule works as follows:
 * -Gather brand and color palette info
 * -Determine classification ID based on gathered info
 * -Run checks to determine classification status and placement
 * -When necessary, create classification product link of type "CCToColorPaletteRef"
 * -Set color palette classification name in each context
 * -Set color palette additional info
 */

function setColorPaletteValues(brandNumber) {
    var contextArray = [];
    var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Context", node.getValue("a_Brand_Number").getSimpleValue());

    if (contexts.contains(";")) {
        contexts.split(";").forEach(function (ctx) {
            contextArray.push(ctx);
        });
    }

    contextArray.forEach(function (ctxt) {
        manager.executeInContext(ctxt, function (step) {
            var colorPaletteClassification = step.getClassificationHome().getClassificationByID(colorPalette.getID());

            colorPaletteClassification.setName(colorPaletteName);

        });
    });

    if(brand=="GPSA"){
    	colorPalette.getValue("a_Color_Palette_Brand").setSimpleValue("GPS");
    	}
    	else{
    colorPalette.getValue("a_Color_Palette_Brand").setSimpleValue(brand);
    	}
    colorPalette.getValue("a_Source_Color_Palette_Season_Code").setSimpleValue(seasonCode);
    colorPalette.getValue("a_Source_Color_Palette_Season_Year").setSimpleValue(seasonYear);
    colorPalette.getValue("a_Source_Color_Palette_Code").setSimpleValue(colorPaletteCode);
    colorPalette.getValue("a_Source_Color_Palette_Name").setSimpleValue(colorPaletteName);
    colorPalette.startWorkflowByID("wf_ColorPalette", "");
}

//Context and Node info
var currentContext = manager.getCurrentContext().getID();
var nodeID = node.getID();

//Brand info
var brand = node.getValue("a_Color_Palette_Brand").getSimpleValue();
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

if(brandNum== "GPS"|| brand=="GPS"){
	brand = "GPSA";
	brandNum = "GPSA";	
	}

//Color Palette info
var cpID = null;
var colorPaletteCode = node.getValue("a_Source_Color_Palette_Code").getSimpleValue();
var colorPaletteName = node.getValue("a_Source_Color_Palette_Name").getSimpleValue();
var colorPaletteAlreadyCreatedFlag = false;

//Season info
var seasonCode = node.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue();
var seasonYear = node.getValue("a_Source_Color_Palette_Season_Year").getSimpleValue();
var seasonCodeExistFlag = false;
var seasonYearExistFlag = false;

var id_classification = brand + "_" + colorPaletteCode + "_" + seasonCode + "_" + seasonYear;

//If season code, season year, color palette code, and brand are all NOT NULL
if (seasonCode != null && seasonYear != null && colorPaletteCode != null && brand != null) {
    var classification_a = manager.getClassificationHome().getClassificationByID(id_classification);
    var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("CCToColorPaletteRef");

    //If classification is NOT NULL
    if (classification_a != null) {
        var refCP = new java.util.ArrayList();
        refCP.addAll(node.getClassificationProductLinks(colorPaletteRef));

        //For each Color Palette reference
        for (var p = 0; p < refCP.size(); p++) {
            //log.info(refCP.get(p).getClassification().getID());
            cpID = refCP.get(p).getClassification().getID();
        }

        //If Color Palette ID is NULL
        if (cpID == null) {
            classification_a.createClassificationProductLink(node, linkType);
        }

        var overrideCCNameFlag = node.getValue("a_Override_CC_Name").getSimpleValue();

        //If CC Name Override Flag equals NO
        if (overrideCCNameFlag == "No") {
            var colorPaletteName = classification_a.getName();
            var CCName = node.getName();

            if (CCName == null || (colorPaletteName != null && !isNotDraftAtleastInOneMarket(node))) {  ///PPIM-12391  if atleaset one market is not Draft and purged, then it will not try to change the CC Name.
                node.setName(colorPaletteName);
            }
        }
        //Else if classification is NULL
    }
    else if (classification_a == null) {
        var brandClassification = manager.getClassificationHome().getClassificationByID(brand);

        //If branded classification is NOT NULL
        if (brandClassification != null) {
            var yearChildren = brandClassification.getChildren().toArray();

            //For each child year
            for (var i = 0; i < yearChildren.length; i++) {
                var year = yearChildren[i].getName();

                //If year equals season year
                if (year == seasonYear) {
                    seasonYearExistFlag = true;

                    var seasonChildren = yearChildren[i].getChildren().toArray();

                    //For each child season
                    for (var j = 0; j < seasonChildren.length; j++) {
                        var season = seasonChildren[j].getName();

                        //If season equals season code
                        if (season == seasonCode) {
                            seasonCodeExistFlag = true;

                            //Add final color palette here
                            var colorPalette = seasonChildren[j].createClassification(id_classification, "ColorPalette");

                            colorPalette.createClassificationProductLink(node, linkType);

                            setColorPaletteValues(brandNum);
                            var overrideCCNameFlag = node.getValue("a_Override_CC_Name").getSimpleValue();

                            //If CC Name Override Flag equals NO
                            if (overrideCCNameFlag == "No") {
                                var colorPaletteName = colorPalette.getName();
                                var CCName = node.getName();

                                if (CCName == null || (colorPaletteName != null && !isNotDraftAtleastInOneMarket(node))) {  ///PPIM-12391  if atleaset one market is not Draft and purged, then it will not try to change the CC Name.
                                    node.setName(colorPaletteName);
                                }
                            }

                            break;
                        }
                    }

                    break;
                }
            }
        } else {
            //Add brand, season year, season code, and color palette
            var classificationRoot = manager.getClassificationHome().getClassificationByID("ColorPaletteRoot");
            var brandClassification = classificationRoot.createClassification(brand, "CPBrand");

            brandClassification.setName(brand);

            var newYearClassification = brandClassification.createClassification("", "SeasonYear");

            newYearClassification.setName(seasonYear);

            var newSeasonClassification = newYearClassification.createClassification("", "SeasonCode");

            newSeasonClassification.setName(seasonCode);

            var colorPalette = newSeasonClassification.createClassification(id_classification, "ColorPalette");

            colorPalette.createClassificationProductLink(node, linkType);

            setColorPaletteValues(brandNum);
            var overrideCCNameFlag = node.getValue("a_Override_CC_Name").getSimpleValue();

            //If CC Name Override Flag equals NO
            if (overrideCCNameFlag == "No") {
                var colorPaletteName = colorPalette.getName();
                var CCName = node.getName();

                if (CCName == null || (colorPaletteName != null && !isNotDraftAtleastInOneMarket(node))) {  ///PPIM-12391  if atleaset one market is not Draft and purged, then it will not try to change the CC Name.
                    node.setName(colorPaletteName);
                }
            }


            colorPaletteAlreadyCreatedFlag = true;
        }

        //If color palette already created equals false
        if (colorPaletteAlreadyCreatedFlag == false) {
            var brandClassification = manager.getClassificationHome().getClassificationByID(brand);

            //If brand classification is NOT NULL
            if (brandClassification != null) {
                var yearChildren = brandClassification.getChildren().toArray();

                //If season year does NOT exist
                if (seasonYearExistFlag == false) {
                    //Add season year, season code, and color palette
                    var newYearClassification = brandClassification.createClassification("", "SeasonYear");
                    newYearClassification.setName(seasonYear);

                    var newSeasonClassification = newYearClassification.createClassification("", "SeasonCode");
                    newSeasonClassification.setName(seasonCode);

                    var colorPalette = newSeasonClassification.createClassification(id_classification, "ColorPalette");
                    colorPalette.createClassificationProductLink(node, linkType);

                    setColorPaletteValues(brandNum);
                    var overrideCCNameFlag = node.getValue("a_Override_CC_Name").getSimpleValue();

                    //If CC Name Override Flag equals NO
                    if (overrideCCNameFlag == "No") {
                        var colorPaletteName = colorPalette.getName();
                        var CCName = node.getName();

                        if (CCName == null || (colorPaletteName != null && !isNotDraftAtleastInOneMarket(node))) {  ///PPIM-12391  if atleaset one market is not Draft and purged, then it will not try to change the CC Name.
                            node.setName(colorPaletteName);
                        }
                    }

                }
                else {
                    //For each child year
                    for (var i = 0; i < yearChildren.length; i++) {
                        var year = yearChildren[i].getName();

                        //If year equals season year
                        if (year == seasonYear) {
                            //If season code does NOT exist
                            if (seasonCodeExistFlag == false) {
                                //Add season code and color palette here
                                var newSeasonClassification = yearChildren[i].createClassification("", "SeasonCode");

                                newSeasonClassification.setName(seasonCode);

                                var colorPalette = newSeasonClassification.createClassification(id_classification, "ColorPalette");

                                colorPalette.createClassificationProductLink(node, linkType);

                                setColorPaletteValues(brandNum);

                                var overrideCCNameFlag = node.getValue("a_Override_CC_Name").getSimpleValue();

                                //If CC Name Override Flag equals NO
                                if (overrideCCNameFlag == "No") {
                                    var colorPaletteName = colorPalette.getName();
                                    var CCName = node.getName();

                                    if (CCName == null || (colorPaletteName != null && !isNotDraftAtleastInOneMarket(node))) {  ///PPIM-12391  if atleaset one market is not Draft and purged, then it will not try to change the CC Name.
                                        node.setName(colorPaletteName);
                                    }
                                }


                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}


function isNotDraftAtleastInOneMarket(node) {
    var CCMarkets = node.getValue("a_Market_Designation").getSimpleValue().split("<multisep/>");
    var lifecycleStatus = null;
    var flag = false;

    CCMarkets.forEach(function (mkt) {
        var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
        manager.executeInContext(context, function (otherManager) {
            var otherNode = otherManager.getObjectFromOtherManager(node);
            lifecycleStatus = otherNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue();

            if (lifecycleStatus != "Draft" && lifecycleStatus != "Purged") {
                flag = true;
            }
        });
    });

    return flag;
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
