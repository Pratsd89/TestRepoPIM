/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DeleteContentGroups",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete CGs",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (stepManager,mail) {
var outputFilePath = "/opt/stibo/Deleted_ContentGroups_Report.csv";
var outputFile = new java.io.File(outputFilePath);
if (!outputFile.exists()) outputFile.createNewFile();

var fw = new java.io.FileWriter(outputFile, false);
fw.write("Context,Brand,Parent Slot ID,Content Group ID,Content Group Name,Start Date,End Date,Assortment Type,Date of Deletion,Time of Deletion,Error\n");

var today = new java.util.Date();
var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
var timeFormat = new java.text.SimpleDateFormat("HH:mm:ss");
var deletionDate = dateFormat.format(today);
var deletionTime = timeFormat.format(today);
var deletedCount = 0;
var errorCount = 0;
var errorRows = [];

var cmsRoot = stepManager.getClassificationHome().getClassificationByID("CMS_Content_Groups_Root");

var brandFolders = cmsRoot.getChildren().iterator();
while (brandFolders.hasNext()) {
    var brandFolder = brandFolders.next();
    var brand = safeGet(brandFolder, "a_Brand_Number");

    var slotFolders = brandFolder.getChildren().iterator();
    while (slotFolders.hasNext()) {
        var slot = slotFolders.next();
        var parentSlotID = slot.getID();
        var cgList = slot.getChildren().iterator();

        while (cgList.hasNext()) {
            var cg = cgList.next();

            var canInherit = safeGet(cg, "a_Content_Group_Can_InheritOption");
            var startDates = {}, endDates = {}, endDateExpired = {}, hasStart = {};
            var contextList = ["EN_US", "EN_CA"];

            for (var i = 0; i < contextList.length; i++) {
                var contextID = contextList[i];
                stepManager.executeInContext(contextID, function (ctxMgr) {
                    var ctxCG = ctxMgr.getClassificationHome().getClassificationByID(cg.getID());
                    var sd = ctxCG.getValue("a_WebCategory_Start_Date");
                    var ed = ctxCG.getValue("a_WebCategory_End_Date");

                    startDates[contextID] = sd ? sd.getSimpleValue() : null;
                    hasStart[contextID] = !!startDates[contextID];
                    endDates[contextID] = ed ? ed.getSimpleValue() : null;

                    if (endDates[contextID] instanceof java.lang.String) {
                        try {
                            endDates[contextID] = dateFormat.parse(endDates[contextID]);
                        } catch (e) {
                            endDates[contextID] = null;
                        }
                    }

                    endDateExpired[contextID] = (endDates[contextID] && !endDates[contextID].after(today));
                });
            }

            var rowBase = [
                "", // Context
                brand,
                parentSlotID,
                cg.getID(),
                cg.getName(),
                safeGet(cg, "a_WebCategory_Start_Date"),
                safeGet(cg, "a_WebCategory_End_Date"),
                safeGet(cg, "a_WebCategory_Assortment_Type")
            ];

            var activeInUS = hasStart["EN_US"];
            var activeInCA = hasStart["EN_CA"];
            var hasEndUS = !!endDates["EN_US"];
            var hasEndCA = !!endDates["EN_CA"];

            if ((activeInUS && endDateExpired["EN_US"] && activeInCA && !endDateExpired["EN_CA"]) || (activeInCA && endDateExpired["EN_CA"] && activeInUS && !endDateExpired["EN_US"])) {
                errorRows.push([""].concat(rowBase.slice(1), ["", "", "Missing end date in other context"]).join(","));
                errorCount++;
                continue;
            }

            if (canInherit == "CAN") {
                if ((hasEndUS && hasEndCA) && !activeInUS) {
                    errorRows.push([""].concat(rowBase.slice(1), ["", "", "Missing start date in EN_US"]).join(","));
                    errorCount++;
                    continue;
                }

                if (activeInUS && endDateExpired["EN_US"] && endDateExpired["EN_CA"]) {
                    rowBase[0] = "EN_US & EN_CA";
                    fw.write(rowBase.concat([deletionDate, deletionTime, ""]).join(",") + "\n");
                    cg.delete();
                    deletedCount++;
                }
            } else {
                if (activeInUS && endDateExpired["EN_US"] && activeInCA && endDateExpired["EN_CA"]) {
                    rowBase[0] = "EN_US & EN_CA";
                    fw.write(rowBase.concat([deletionDate, deletionTime, ""]).join(",") + "\n");
                    cg.delete();
                    deletedCount++;
                }
                else if (activeInUS && endDateExpired["EN_US"] && !activeInCA) {
                    rowBase[0] = "EN_US";
                    fw.write(rowBase.concat([deletionDate, deletionTime, ""]).join(",") + "\n");
                    cg.delete();
                    deletedCount++;
                } else if (activeInCA && endDateExpired["EN_CA"] && !activeInUS) {
                    rowBase[0] = "EN_CA";
                    fw.write(rowBase.concat([deletionDate, deletionTime, ""]).join(",") + "\n");
                    cg.delete();
                    deletedCount++;
                }
            }
        }
    }
}

for (var i = 0; i < errorRows.length; i++) fw.write(errorRows[i] + "\n");

fw.flush();
fw.close();

if (deletedCount > 0 || errorCount > 0) {
    var fileInputStream = new java.io.FileInputStream(outputFile);
    var asset = stepManager.getAssetHome().getAssetByID("Deleted_CG_Report");
    asset.upload(fileInputStream, outputFilePath);

    var mailMethod = mail.mail();
    mailMethod.addTo("aditsin@gap.com;vbhimav@gap.com;lakshmi_thammineni@gap.com;jagadish_beejapu@gap.com;sdekkap@gap.com;aravindan_sakthivel@gap.com;venugopal_nandimandalam@gap.com");
    //    mailMethod.addTo("aditsin@gap.com");
    mailMethod.subject("Deleted Expired Content Groups Report");
    mailMethod.plainMessage("Total " + deletedCount + " Content Groups deleted.\nTotal " + errorCount + " Content Groups skipped due to errors.\nAttached is the full report.");
    var attachment = mailMethod.attachment();
    attachment.fromAsset(asset);
    attachment.name("Deleted_ContentGroups_Report.csv");
    attachment.attach();
    mailMethod.send();
    log.info("Mail Sent");
} else {
    log.info("Nothing to Delete, Mail not Sent");
}

function safeGet(obj, attrID) {
    try {
        var val = obj.getValue(attrID);
        return val ? val.getSimpleValue() : "";
    } catch (e) {
        return "";
    }
}

}