/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_all_cc_part2",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "All CC Report",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "CC_ShotRequest_Input_Library",
    "libraryAlias" : "lib"
  } ]
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV1",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotreqRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV2",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV3",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV4",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV5",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV6",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV7",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV8",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV9",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV10",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV10",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV11",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV11",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "P01",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,AV1,ShotreqRef,mail,AV2,AV3,AV4,AV5,AV6,AV7,AV8,AV9,AV10,AV11,P01,lib) {
var filePath = "/opt/stibo/CC_Shot_Request_Report.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
    file.createNewFile();
    log.info("File created at: " + filePath);
}
var fw = new java.io.FileWriter(file, false);
fw.write("Brand, CC ID,CC Number, CC Life Cycle Status, Style Life Cycle Status, CC Publication Date, Shot Request ID,Site Placement, Shot Type, Content ID, Content Path ID, Markets\n");

function compareDetails(node, refType, shotrequest, context, sitePlacementLabel) {
    var flag = true;
    var srName = shotrequest.getName();
//    log.info("name: "+srName);
    if (!srName) {
        srName = shotrequest.getID();
        log.info("Shot request name missing, using ID: " + srName);
    }
    var shotReqRefs = cc.queryReferences(ShotreqRef).asList(50);
	if (shotReqRefs && shotReqRefs.size() !=0) {
    shotReqRefs.forEach(function(shots) {

    	 var shot = shots.getTarget();
    	 var shotName = shot.getName();
    	 if(srName == shotName){
    	 	shotrequest = shot;
    	 }
//    	 else{
//    	 	log.info("not match "+srName+" " + shotName);
//    	 }
    });}
    
    

    step.executeInContext(context, function(contextManager) {
        var marketsAttr = shotrequest.getValue("a_Shared_Markets");
        var marketsRaw = marketsAttr ? marketsAttr.getSimpleValue() : null;
        var markets = marketsRaw ? marketsRaw.replace("<multisep/>", ";") : "";

        if (context == "EN_CA" && markets.indexOf("US") !== -1) {
            flag = false;
//            log.info("Skipping EN_CA context with US market");
        }

        if (flag) {
            node.queryReferences(refType).forEach(function(referenceInstance) {
                var ref = referenceInstance.getTarget();
                if (!ref) return;

                var refID = ref.getID();
                var contentPath = ref.getValue("a_Content_Path").getSimpleValue();

                fw.write(
                    node.getValue("a_Brand_Number").getSimpleValue() + "," +
                    node.getID() + "," +
                    node.getValue("a_CC_Number").getSimpleValue() + "," +
                    node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() + "," +
                    node.getValue("a_Style_Life_Cycle_Status").getSimpleValue() + "," +
                    node.getValue("a_CC_Start_Date").getSimpleValue() + "," +
                    shotrequest.getID() + "," +
                    sitePlacementLabel + "," +
                    shotrequest.getValue("a_Shot_Type").getSimpleValue() + "," +
                    refID + "," +
                    contentPath + "," +
                    markets + "\n"
                );

//                log.info("Data written for CC: " + node.getID() + " and placement: " + sitePlacementLabel);
                return false;
            });
        }
    });
}

// Reference map
var sitePlacements = {
    "AV1": AV1,
    "AV2": AV2,
    "AV3": AV3,
    "AV4": AV4,
    "AV5": AV5,
    "AV6": AV6,
    "AV7": AV7,
    "AV8": AV8,
    "AV9": AV9,
    "AV10": AV10,
    "AV11": AV11,
    "Main P1": P01
};

// Set brand folder
//var brandFolder = step.getProductHome().getProductByID("5835bdbc-ef28-4aec-be14-a9fe6a8f8938"); // AT
//
//var divisionFolders = brandFolder.getChildren().iterator();
//while (divisionFolders.hasNext()) {
//    var divisionFolder = divisionFolders.next();
//    if (divisionFolder.getObjectType().getID() != "Division") continue;
    var divisionFolder = step.getProductHome().getProductByID("05a2e0a4-5c7b-4006-8c21-83bb5650ca7a");
    var departmentFolders = divisionFolder.getChildren().iterator();
    while (departmentFolders.hasNext()) {
        var departmentFolder = departmentFolders.next();
        if (departmentFolder.getObjectType().getID() != "Department") continue;

        var classFolders = departmentFolder.getChildren().iterator();
        while (classFolders.hasNext()) {
            var classFolder = classFolders.next();
            if (classFolder.getObjectType().getID() != "Class") continue;

            var subclassFolders = classFolder.getChildren().iterator();
            while (subclassFolders.hasNext()) {
                var subclassFolder = subclassFolders.next();
                if (subclassFolder.getObjectType().getID() != "SubClass") continue;

                var styles = subclassFolder.getChildren().iterator();
                while (styles.hasNext()) {
                    var style = styles.next();
                    if (style.getObjectType().getID() != "Style") continue;

                    var CCs = style.getChildren().iterator();
                    while (CCs.hasNext()) {
                        var cc = CCs.next();
//var cc = step.getProductHome().getProductByID('000100031000');

                        Object.keys(sitePlacements).forEach(function(sitePlacement) {
                            var refType = sitePlacements[sitePlacement];
                            var references = cc.queryReferences(refType).asList(50);
                            if (!references || references.size() === 0) return;

                            references.forEach(function(referenceInstance) {
                                var shotrequest = referenceInstance.getTarget();
                                if (!shotrequest) return;

                                compareDetails(cc, refType, shotrequest, "EN_US", sitePlacement);
                                compareDetails(cc, refType, shotrequest, "EN_CA", sitePlacement);
                            });
                        });
                    }
                }
            }
        }
    }
//}

fw.flush();
fw.close();
log.info("CSV file writing completed.");

// Upload file to asset
var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("CC_Shot_Request_Report");
var uploaded = asset.upload(fileInputStream, filePath);
log.info("File uploaded to asset: " + uploaded);

// Send email
var mailMethod = mail.mail();
mailMethod.addTo("aditsin@gap.com");
mailMethod.subject("All CC Report");
mailMethod.plainMessage("test");

var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("ShotRequestReport.csv");
attachment.attach();

var mailSentStatus = mailMethod.send();
log.info("Mail sent status: " + mailSentStatus);

}