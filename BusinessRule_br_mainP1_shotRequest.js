/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_mainP1_shotRequest",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "br_mainP1_shotRequest",
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
    "alias" : "mainP1",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "com.stibo.core.domain.Node",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (ShotreqRef,mainP1,node) {
var mainP1Name;
node.queryReferences(mainP1).forEach(function (referenceInstance) {
        var ref = referenceInstance.getTarget();
        mainP1Name = ref.getName();
        return true;

    });
var shotrequest ; 
if(mainP1Name != null) {
	node.queryReferences(ShotreqRef).forEach(function (referenceInstance) {
        var ref = referenceInstance.getTarget();
        sitePlacement = ref.getValue("a_Site_Placement").getSimpleValue();
        if(sitePlacement =="Main P1" && ref.getName() == mainP1Name) {
        	log.info("founddd ")
        	shotrequest = ref
        	return false;
        }
        log.info("not found")
        return true;
    });
}
return shotrequest;
}