/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Export_ShortRequest_And_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Export_ShortRequest_And_CC",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AssetBindContract",
    "alias" : "assetHome",
    "parameterClass" : "com.stibo.core.domain.impl.FrontAssetImpl",
    "value" : "SOX_111405",
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
exports.operation0 = function (manager,assetHome,mail) {

// create file 
var filePath = "/opt/stibo/Test_12.txt";
var file = new java.io.File(filePath);
//log.info("does file has a value " +file);
if(!file.exists())
{
log.info(" file   Does not exists " );
file.createNewFile();
}
log.info(" file      " +file);	
// write to file 
var fw= new java.io.FileWriter(file,false);
fw.write("this is new one \n");
fw.flush();
fw.close();
// completed writing to file 
// Uploading the file as asset 
var fileInputStream = new java.io.FileInputStream(file);
var asset = manager.getAssetHome().getAssetByID("SOX_111405");
var uploaded = asset.upload(fileInputStream,filePath);
log.info("info  uploaded -------------------?" +uploaded );
//var asset1 = manager.getAssetHome().getAssetByID("SOX_111405");
// create mail parameters 
var mailMethod  = mail.mail();
var emailIDTO  = mailMethod.addTo("Rambhupalreddy_Thatiparthy@gap.com;");
var emailSubject  = mailMethod.subject("Test Mail send from Business rule");
var emailBody  = mailMethod.plainMessage("Test Mail send from Business rule which is very critical for the testng ");


// set attachment 
var 	attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
log.info(" attachmentobject   --->>>>   "  +attachment);
var setAttachMentName  =  attachment.name("FirstAttachment.txt");
log.info(" setAttachMentName    --->>>>   "  +setAttachMentName);

log.info("fromAsssest     --->>>>>"+fromAsssest);
attachment.attach();
//var attachedment = mailMethod.attach().fromAsset(asset);
//log.info( "<<<<<<--mailsentValue -->>>>>>"+   attchment.fromAsset( asset));
var mailSentStatus =  mailMethod.send() ;
log.info( "<<<<<<--mailsentValue -->>>>>>" +mailSentStatus);




}