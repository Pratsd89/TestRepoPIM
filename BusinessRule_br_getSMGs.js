/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_getSMGs",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_getSMGs",
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
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
exports.operation0 = function (node,stepManager,ref,mail) {
var outputFilePath = "/opt/stibo/SMG_Duplicate_CCs_Report.csv";
var outputFile = new java.io.File(outputFilePath);
if (!outputFile.exists()) {
    outputFile.createNewFile();
}
var fw = new java.io.FileWriter(outputFile, false);
fw.write("Brand,SMG ID,STYID,CC ID,CC Number,CC Name,CC Life Cycle Status,Duplicate CC Name Item\n");

var superPDPRoot = stepManager.getProductHome().getProductByID("SuperPDPRoot");
//log.info(superPDPRoot);
var brandFolders = superPDPRoot.getChildren().iterator();

while (brandFolders.hasNext()) {
    var brandFolder = brandFolders.next();
    if (brandFolder.getObjectType().getID() != "ProductGroupingsBrand") continue;

    var brand = getAttributeValue(brandFolder, "a_Brand_Number");
    //log.info("checking brand: " + brand);

    var divisionFolders = brandFolder.getChildren().iterator();
    while (divisionFolders.hasNext()) {
        var divFolder = divisionFolders.next();
        if (divFolder.getObjectType().getID() != "ProductGroupingsDivision") continue;

        var smgList = divFolder.getChildren().iterator();
        while (smgList.hasNext()) {
            var smg = smgList.next();
            if (smg.getObjectType().getID() != "Product_Group") continue;

            var smgID = smg.getID();
            //log.info("checking smg: " + smgID);

            var ccNameMap = {};
            var smgRefs = smg.getReferences(ref);
            //log.info(smgID + "," + smgRefs.size());

            for (var i = 0; i < smgRefs.size(); i++) {
                var style = smgRefs.get(i).getTarget();
                if (style.getObjectType().getID() != "Style") continue;

                var styleID = style.getID();
                //log.info("checking style: " + styleID);

                var children = style.getChildren().iterator();
                while (children.hasNext()) {
                    var cc = children.next();
                    if (cc.getObjectType().getID() != "CustomerChoice") continue;

                    var ccID = cc.getID();
                   // var duplicateCCNameItem = "Yes";
                    //log.info("checking cc: " + ccID);

                    var ccName = cc.getName();
                    var ccNumber = cc.getValue("a_CC_Number").getSimpleValue();
                    var ccLcs = cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
                    if (ccName != null && ccNumber != null) {
                        if (!ccNameMap[ccName]) {
                            ccNameMap[ccName] = [];
                        }
                        ccNameMap[ccName].push({
                            brand: brand,
                            smgID: smgID,
                            styleID: styleID,
                            ccID: ccID,
                            ccNumber: ccNumber,
                            ccName: ccName,
                            ccLcs: ccLcs
                            
                        });
                    }
                }
            }

            for (var name in ccNameMap) {
                var list = ccNameMap[name];
                if (list.length > 1) {
                    for (var j = 0; j < list.length; j++) {
                        var row = list[j];
                        fw.write([
                            row.brand,
                            row.smgID,
                            row.styleID,
                            row.ccID,
                            row.ccNumber,
                            row.ccName,
                            row.ccLcs,
                            "Yes"
                        ].join(",") + "\n");
                    }
                }
                 if (list.length == 1) {
                    for (var j = 0; j < list.length; j++) {
                        var row = list[j];
                        fw.write([
                            row.brand,
                            row.smgID,
                            row.styleID,
                            row.ccID,
                            row.ccNumber,
                            row.ccName,
                            row.ccLcs,
                            "No"
                        ].join(",") + "\n");
                    }
                }
                
                
            }
        }
    }
}

fw.flush();
fw.close();

var fileInputStream = new java.io.FileInputStream(outputFile);
var asset = stepManager.getAssetHome().getAssetByID("SmgDuplicateCcReport");
asset.upload(fileInputStream, outputFilePath);

var mailMethod = mail.mail();
mailMethod.addTo("Sri_Indu_Dekkapati@gap.com;jagadish_beejapu@gap.com");
mailMethod.subject("SMG Duplicate CCs Report");
mailMethod.plainMessage("Attached is the SMG Duplicate CCs Report.");
var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("SMG_Duplicate_CCs_Report.csv");
attachment.attach();
mailMethod.send();

function getAttributeValue(obj, attrID) {
    try {
        return obj.getValue(attrID).getSimpleValue();
    } catch (e) {
        return "";
    }
}

}