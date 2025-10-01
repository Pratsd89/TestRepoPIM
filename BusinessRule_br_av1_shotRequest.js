/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_av1_shotRequest",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "br_av1_shotRequest",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotreqRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV1",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (ShotreqRef,AV1,node) {
	var revisions = node.getRevisions();
for(var i=0;i<revisions.size();i++ ){
	log.info(revisions.get(i).getNode().getName())
	return revisions.get(i).getNode().getName();

}
	//var Previousnode = revisions.get(revisions.size()-1).getNode();


//var av1Name;
//node.queryReferences(AV1).forEach(function (referenceInstance) {
//        var ref = referenceInstance.getTarget();
//        av1Name = ref.getName();
//        return true;
//
//    });
//var shotrequest ; 
//if(av1Name != null) {
//	node.queryReferences(ShotreqRef).forEach(function (referenceInstance) {
//        var ref = referenceInstance.getTarget();
//        sitePlacement = ref.getValue("a_Site_Placement").getSimpleValue();
//        if(sitePlacement =="AV1" && ref.getName() == av1Name) {
//        	log.info("founddd ")
//        	shotrequest = ref
//        	return false;
//        }
//        log.info("not found")
//        return true;
//    });
//}
//return shotrequest;
}