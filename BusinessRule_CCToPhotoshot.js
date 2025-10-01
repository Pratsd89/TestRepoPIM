/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CCToPhotoshot",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CCToPhotoshot",
  "description" : null,
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "reftype",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (log,node,manager,reftype) {
var ccstatus =node.getValue("a_CC_Photo_Status").getSimpleValue();
log.info(ccstatus+ "1")
if(ccstatus == "Complete" || ccstatus == "Complete: Ready for Review" || ccstatus == "Complete: Request Submitted"){
		
		var photoList = node.getReferences(reftype).toArray();
		if(photoList.length >0){
			
			var status = getphotostatus(photoList);
			log.info(status)
			if(status == 1){
				node.getValue("a_CC_Photo_Status").setSimpleValue("Complete");
				log.info(node.getValue("a_CC_Photo_Status").getSimpleValue());
			}
			else if(status ==2){
				node.getValue("a_CC_Photo_Status").setSimpleValue("Complete: Ready for Review");
				log.info(node.getValue("a_CC_Photo_Status").getSimpleValue());
			}
			else if(status==3){
					if(ccstatus != "Complete: Ready for Review"){
					node.getValue("a_CC_Photo_Status").setSimpleValue("Complete: Request Submitted");
					log.info(node.getValue("a_CC_Photo_Status").getSimpleValue());
				}
			}
			
		}
		else{
			log.info("No Photo Shot Request linked")
		}
}

function getphotostatus(shotlist){
	var result = 1;
	var target=null;
	for(i=0;i<shotlist.length;i++){
		target = shotlist[i].getTarget();
		var lifeCycleStatus = target.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
		
		if (lifeCycleStatus == "Ready for Review"){
			result = 2;
			break;
		}
		else if(lifeCycleStatus == "Submitted"){
			result =3;
		}
		else if(lifeCycleStatus == "Draft" || lifeCycleStatus == "Approved" || lifeCycleStatus == "Complete" ||lifeCycleStatus == "Rejected" ){
			log.info("here")
			result =0;
		}
	}
	return result;
}
}