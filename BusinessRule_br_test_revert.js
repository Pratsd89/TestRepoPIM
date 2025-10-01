/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_revert",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "br_test_revert",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIB_BRFS",
    "libraryAlias" : "LIB_BRFS"
  } ]
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
exports.operation0 = function (node,manager,mail,LIB_BRFS) {
var filePath = "/opt/stibo/SEO-PIM-Report_For_Legacy_NLU.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
    file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("ObjectID,CID,CurrentSortOrder,PreviousSortOrder,ObjectType\n");
 
 var previousRevisionNode = node.getRevisions().get(1).getNode();
 log.info (previousRevisionNode.getValue('a_WebCategory_Sort_Order').getSimpleValue());
 log.info (node.getValue('a_WebCategory_Sort_Order').getSimpleValue());


 function mainMethod(context) {
    var catList = LIB_BRFS.getNodeList();
   
    for (var i = 0; i < catList.size(); i++) {
        var currentNodeObject = manager.getClassificationHome().getClassificationByID(catList.get(i));
        if(currentNodeObject!=null){
            var objectID =currentNodeObject.getID();
            var objectType = currentNodeObject.getObjectType().getID();
            var currentNodeSortOrder = currentNodeObject.getValue('a_WebCategory_Sort_Order').getSimpleValue();
            var previousRevisionNode= currentNodeObject.getRevisions().get(1).getNode();
            var previousRevisionSortOrder = previousRevisionNode.getValue('a_WebCategory_Sort_Order').getSimpleValue();
            var webCategoryCID = currentNodeObject.getValue('a_WebCategory_CID').getSimpleValue();
            fw.write(objectID + "," + webCategoryCID + "," + currentNodeSortOrder + "," + previousRevisionSortOrder + "," + objectType +"\n");

        }
    
}
}


 mainMethod("EN_CA");

fw.flush();
fw.close();


var fileInputStream = new java.io.FileInputStream(file);
var asset = manager.getAssetHome().getAssetByID("TF_128577680");
var uploaded = asset.upload(fileInputStream, filePath);
// set up Email 
var mailMethod = mail.mail();
var emailIDTO = mailMethod.addTo("jagadish_beejapu@gap.com;sri_indu_dekkapati@gap.com");
var emailSubject = mailMethod.subject("Sort Order Mismatch");
var emailBody = mailMethod.plainMessage("Sort Order Mismatch EN_CA");
// set attachment 
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("SortOrderMismatch.csv");
attachment.attach();
//send email 
var mailSentStatus = mailMethod.send();


}