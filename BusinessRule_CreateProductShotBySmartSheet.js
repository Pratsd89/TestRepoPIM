/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateProductShotBySmartSheet",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CreateProductShotBySmartSheet",
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
    "alias" : "step",
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
exports.operation0 = function (node,step,log) {
var oShotReqRoot = step.getEntityHome().getEntityByID("126402");
var oNewShotRequest = oShotReqRoot.createEntity(null, "ProductShotRequest");
var t_ShotType = node.getValue("a_Shot_Type").getSimpleValue();
log.info(t_ShotType);
oNewShotRequest.getValue("a_Shot_Type").setSimpleValue(t_ShotType);
log.info("shot created "+oNewShotRequest);


/*var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
if(marketDesignation == "US"){
	oNewShotRequest.getValue("a_Market_Designation_Shot_Request").setSimpleValue(marketDesignation);
}else if(marketDesignation == "CAN"){
	oNewShotRequest.getValue("a_Market_Designation_Shot_Request").setSimpleValue(marketDesignation);
}else{
	oNewShotRequest.getValue("a_Market_Designation_Shot_Request").setSimpleValue("BOTH");
}
oNewShotRequest.getValue("a_Shared_Markets").setSimpleValue(marketDesignation);

node.createReference(oNewShotRequest, "CCToPhotoShotRef");
log.info("----------2---------- Shot Request Created" + oNewShotRequest.getID());

portal.navigate("GAPPhotoShotDetails", oNewShotRequest);*/

}