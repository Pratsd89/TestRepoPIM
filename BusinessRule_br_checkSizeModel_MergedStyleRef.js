/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkSizeModel_MergedStyleRef",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_checkSizeModel_MergedStyleRef",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModel",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
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
exports.operation0 = function (node,step,sizeModel,mail) {
var filePath = "/opt/stibo/SEO-PIM-Report_For_Inactive_Categories_in_Past7Days.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
    file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("StyleID,CurrentNodeSizeModelID,RefStyleID,RefNodeSizeModelID,Result" + "\n");

var flag = true;
var currentNodeSizeModelRefs = node.getClassificationProductLinks(sizeModel);
var currentNodeSizeModelID = currentNodeSizeModelRefs.get(0).getClassification().getID();

var mergedStylesRef = step.getReferenceTypeHome().getReferenceTypeByID("MergedStylesRef");
node.queryReferences(mergedStylesRef).forEach(function (referenceInstance) {
    var refStyle = referenceInstance.getTarget();
    var sizeModelRef = refStyle.getClassificationProductLinks(sizeModel);
    var sizeModelRefID = sizeModelRef.get(0).getClassification().getID();
    if (currentNodeSizeModelID != sizeModelRef.get(0).getClassification().getID()) {
        flag = false;
    }
    fw.write(node.getID() + "," + currentNodeSizeModelID + "," + refStyle.getID() + "," + sizeModelRefID + "," + flag + "\n");
    return true;
});

fw.flush();
fw.close();

var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("SizeModelCheckMergedStylesRef");
var uploaded = asset.upload(fileInputStream, filePath);
// set up Email 
var mailMethod = mail.mail();
var emailIDTO = mailMethod.addTo("jagadish_beejapu@gap.com; sri_indu_dekkapati@gap.com;");
var emailSubject = mailMethod.subject("Size Model Check MergedStylesRef");
var emailBody = mailMethod.plainMessage("Size Model Check MergedStylesRef");
// set attachment 
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("SizeModelCheckMergedStylesRef.csv");
attachment.attach();
//send email 
var mailSentStatus = mailMethod.send();





}