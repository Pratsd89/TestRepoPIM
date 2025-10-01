/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CC_Price_Report",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "CC Price Report",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
exports.operation0 = function (step,mail) {
var filePath = "/opt/stibo/CC_Price_Report.csv";
var file = new java.io.File(filePath);

if (!file.exists()) {
    file.createNewFile();
    log.info("File created at: " + filePath);
}

var fw = new java.io.FileWriter(file, false);
fw.write("Brand,Division,Department,Class,SubClass,styleID,CC ID,CC Number\n");

var brandFolder = step.getProductHome().getProductByID("5835bdbc-ef28-4aec-be14-a9fe6a8f8938"); // Replace with required brand
//log.info(brandFolder);

// Optional: Get brand name if needed
// var brandName = brandFolder.getValue("Name").getSimpleValue();
// log.info(brandName);

var divisionFolders = brandFolder.getChildren().iterator();
while (divisionFolders.hasNext()) {
    var division = divisionFolders.next();
 //   log.info(division);
    if (division.getObjectType().getID() != "Division") continue;

    var divisionName = division.getName();
    //log.info(divisionName);

    var departmentFolders = division.getChildren().iterator();
    while (departmentFolders.hasNext()) {
        var department = departmentFolders.next();
        if (department.getObjectType().getID() != "Department") continue;

        var departmentName = department.getName();

        var classFolders = department.getChildren().iterator();
        while (classFolders.hasNext()) {
            var classFolder = classFolders.next();
            if (classFolder.getObjectType().getID() != "Class") continue;

            var className = classFolder.getName();

            var subclassFolders = classFolder.getChildren().iterator();
            while (subclassFolders.hasNext()) {
                var subclass = subclassFolders.next();
                if (subclass.getObjectType().getID() != "SubClass") continue;

                var subclassName = subclass.getName();
//                log.info(subclass);

                var styleFolders = subclass.getChildren().iterator();
                while (styleFolders.hasNext()) {
                    var style = styleFolders.next();
                    if (style.getObjectType().getID() != "Style") continue;

                    //var styleName = style.getName();
                       var styleID = style.getID();
                    var ccFolders = style.getChildren().iterator();
                    while (ccFolders.hasNext()) {
                        var cc = ccFolders.next();
                        if (cc.getObjectType().getID() != "CustomerChoice") continue;

                        var ccID = cc.getID();
                        log.info(ccID);
                        var ccNumber = cc.getValue("a_CC_Number").getSimpleValue();
                        var ccLifeCycleStatus = cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue();

                        // Uncomment the next line if filtering by "Approved" CCs is required
                         if (ccLifeCycleStatus == "Approved") {
                        fw.write(
                            brandFolder.getName() + "," +
                            divisionName + "," +
                            departmentName + "," +
                            className + "," +
                            subclassName + "," +
                            styleID + "," +
                            ccID + "," +
                            ccNumber + "\n"
                        );
                         }
                    }
                }
            }
        }
    }
}

fw.flush();
fw.close();
log.info("CSV file writing completed.");

// Upload file to asset
var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("CC_Price_Report");

if (asset != null) {
    var uploaded = asset.upload(fileInputStream, filePath);
    log.info("File uploaded to asset: " + uploaded);
} else {
    log.error("Asset with ID 'CC_Price_Report' not found.");
}

// Send Email
var mailMethod = mail.mail();
mailMethod.addTo("aditsin@gap.com;jagadish_beejapu@gap.com");
mailMethod.subject("CC Price Report");
mailMethod.plainMessage("test");

// Attach CSV
var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("CC_Price_Report.csv");
attachment.attach();

// Send
var mailSentStatus = mailMethod.send();
log.info("Mail sent status: " + mailSentStatus);

}