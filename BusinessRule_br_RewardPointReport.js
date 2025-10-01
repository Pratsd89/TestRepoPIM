/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_RewardPointReport",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Reward Points Report",
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
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "RestrictionReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Restriction_Product_Ref",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,mail,RestrictionReference,lib) {
var filePath = "/opt/stibo/CC_Reward_Points_Report.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
	file.createNewFile();
	log.info("File created at: " + filePath);
}
var fw = new java.io.FileWriter(file, false);
fw.write("Brand, CC ID,CC Number, CC Life Cycle Status, Style Life Cycle Status, Reward Points Value\n");


var pph = step.getProductHome().getProductByID("Product hierarchy root");
var brands = pph.getChildren().iterator();
while (brands.hasNext()) {
	var brandFolder = brands.next();
	var divisionFolders = brandFolder.getChildren().iterator();
	while (divisionFolders.hasNext()) {
		var divisionFolder = divisionFolders.next();
		if (divisionFolder.getObjectType().getID() != "Division") continue;
		//    var divisionFolder = step.getProductHome().getProductByID("05a2e0a4-5c7b-4006-8c21-83bb5650ca7a");
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
							var cc = CCs.next(); //var cc = step.getProductHome().getProductByID('000100031000');
							var flag = false;
							
							var RewardPoints = cc.getValue("a_Reward_Points").getSimpleValue();
							if (RewardPoints == null || RewardPoints == "") {
								
								var currCntxt = step.getCurrentContext();
								
								if (currCntxt == "EN_US"){
									step.executeInContext("EN_CA", function(cntxtManager){
										var otherCntxtCC = cntxtManager.getProductHome().getProductByID(cc.getID());
										RewardPoints = otherCntxtCC.getValue("a_Reward_Points").getSimpleValue();
										if (RewardPoints == null || RewardPoints == "") {
											flag = true;
										}
									});
								}
								else if (currCntxt == "EN_CA"){
									step.executeInContext("EN_US", function(cntxtManager){
										var otherCntxtCC = cntxtManager.getProductHome().getProductByID(cc.getID());
										RewardPoints = otherCntxtCC.getValue("a_Reward_Points").getSimpleValue();
										if (RewardPoints == null || RewardPoints == "") {
											flag = true;
										}
									});
								}
								else {
									flag = true;
								}
							}
							if (flag) {
								continue;
							} else {
								var RestrictionRefs = cc.queryReferences(RestrictionReference).asList(50);
								if (RestrictionRefs.size() == 0) {
									fw.write(
										cc.getValue("a_Brand_Number").getSimpleValue() + "," +
										cc.getID() + "," +
										cc.getValue("a_CC_Number").getSimpleValue() + "," +
										cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue() + "," +
										cc.getValue("a_Style_Life_Cycle_Status").getSimpleValue() + "," +
										RewardPoints + "\n"
									);
								}
							}
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
var asset = step.getAssetHome().getAssetByID("CC Reward Points Report");
var uploaded = asset.upload(fileInputStream, filePath);
log.info("File uploaded to asset: " + uploaded);

// Send email
var mailMethod = mail.mail();
mailMethod.addTo("aditsin@gap.com;jagadish_beejapu@gap.com;venugopal_nandimandalam@gap.com;sai_preethi_mandipalli@gap.com;sri_indu_dekkapati@gap.com;venkatesh_bhimavaram@gap.com;spolebo@gap.com");
mailMethod.subject("CC Reward Point Report");
mailMethod.plainMessage("Reward Point Report for empty Restrictions");

var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("RewardPoint.csv");
attachment.attach();

var mailSentStatus = mailMethod.send();
log.info("Mail sent status: " + mailSentStatus);
}