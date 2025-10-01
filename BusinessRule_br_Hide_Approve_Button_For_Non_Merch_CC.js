/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Hide_Approve_Button_For_Non_Merch_CC",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Hide or Show Approve Button",
  "description" : "Hide or Show Approve Button based on CC Photo Status",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,log) {
var ccPhotoStatus = node.getValue("a_CC_Photo_Status").getSimpleValue();
var ccStatus = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();

if (ccPhotoStatus == "Ready For Review" && ccStatus != "Draft") {
    return true;
}
else if (ccStatus == "Waiting for Style Approval") {
    return true;
}
else {
    return false;
}



/*var ccPhotoStatus = node.getValue("a_CC_Photo_Status").getSimpleValue();
//log.info("Photo status " + approvalStatus);
if (ccPhotoStatus == "Ready For Review"){
	return true;
} 
else return false;*/



//var shotRequestReferences = node.getReferences(CCToShotRequestRef).toArray();
//
//for (var i = 0; i < shotRequestReferences.length; i++) {
//
//    var shotRequest = shotRequestReferences[i].getTarget();
//    if (shotRequest === "Ready_to_Review") {
//        return true;
//     
//    }
//    
//}
}