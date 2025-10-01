/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Calculated_Values_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Calculated_Values_CC",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
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
exports.operation0 = function (node,manager,LKT) {
try {
    var CC_ID = node.getID();
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
    var now = java.time.ZonedDateTime.now().minusDays(30);
    var final_date = now.format(formatter);
    //log.info(final_date);


    //Below code is implemented as part of Japan Context requirements- PPIM-7408
    var marketDsgArray = node.getValue('a_Market_Designation').getValues().toArray();

    marketDsgArray.forEach(function (Mkt) {
        var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", Mkt.getValue());

        manager.executeInContext(context, function (step) {
            var cntxtCC = step.getProductHome().getProductByID(CC_ID);
            /////New Color:
            var CC_Start_Date = cntxtCC.getValue("a_CC_Start_Date").getSimpleValue();
            //log.info(CC_Start_Date);
            if (CC_Start_Date != null) {

                if (CC_Start_Date > final_date || CC_Start_Date == final_date) {
                    cntxtCC.getValue("a_New_Color").setSimpleValue("Yes");
                    log.info(cntxtCC.getValue("a_New_Color").getSimpleValue());

                }
                else {
                    cntxtCC.getValue("a_New_Color").setSimpleValue("No");
                    //log.info(cntxtCC.getValue("a_New_Color").getSimpleValue());
                }
            }
            ///CC Planned in DC Date
            var CC_Source_Date = cntxtCC.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
            var CC_Planned_Date = cntxtCC.getValue("a_CC_Planned_in_DC_Date").getSimpleValue();
           // log.info("plan" + CC_Planned_Date);
            //log.info("source" + CC_Source_Date);
            if (CC_Planned_Date == null && CC_Source_Date != null) {
                cntxtCC.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
                //log.info(cntxtCC.getValue("a_CC_Planned_in_DC_Date").getSimpleValue())
            }
            else if (CC_Source_Date != null && CC_Planned_Date != null) {

                if (CC_Source_Date < CC_Planned_Date) {
                    cntxtCC.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
                    //log.info("a_CC_Source_in_DC_Date " + cntxtCC.getValue("a_CC_Planned_in_DC_Date").getSimpleValue());
                }
            }
            ///Style IN DC Date
            var cntxtStyle = cntxtCC.getParent();
            var style_DC_Date = cntxtStyle.getValue("a_Style_IN_DC_Date").getSimpleValue();
            //log.info("date" +  style_DC_Date);
            if (style_DC_Date == null && CC_Source_Date != null) {
                cntxtStyle.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
                var lifecycle_status = cntxtStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (lifecycle_status == "Draft") {
                    cntxtStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                }
            }
            else if (CC_Source_Date != null && style_DC_Date != null) {
                if (CC_Source_Date < style_DC_Date) {
                    cntxtStyle.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
                    //log.info("Style overlap" +cntxtStyle.getValue("a_Style_IN_DC_Date").getSimpleValue());
                }
            }
            /////a_Override_CC_Name
            var Override_CC_Name = cntxtCC.getValue("a_Override_CC_Name").getSimpleValue();
            if (Override_CC_Name == null) {
                cntxtCC.getValue("a_Override_CC_Name").setSimpleValue("No");
                //log.info("a_Override_CC_Name  " + cntxtCC.getValue("a_Override_CC_Name").getSimpleValue());
            }
            //Set Style Imported Values from CC Country of Origin
            var styleImported = cntxtStyle.getValue("a_Style_Imported").getSimpleValue();
            var CC_Country_Origin = cntxtCC.getValue("a_CC_Country_of_Origin").getSimpleValue();
            var originCountry = LKT.getLookupTableValue("LKT_MktDsg_to_Country_of_Origin", Mkt.getValue());

            if (CC_Country_Origin == "USA") {
                CC_Country_Origin = "UNITED STATES OF AMERICA";
            }

            if (CC_Country_Origin != null) {
                if (CC_Country_Origin != originCountry) {
                    if (styleImported != "Yes") {
                        cntxtStyle.getValue("a_Style_Imported").setSimpleValue("Yes");
                    }
                }
                else {
                    if (styleImported == null) {
                        cntxtStyle.getValue("a_Style_Imported").setSimpleValue("No");
                    }
                }
            }
        });
    });
} catch (e) {
    logger.info("CC Created/Updated Event Processor Failed For : " + node.getID());
}
}