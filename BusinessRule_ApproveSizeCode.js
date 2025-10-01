/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveSizeCode",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ApproveSizeCode",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeCode" ],
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
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,logger) {
logger.info("ApproveSizeCode");
 // PPIM-3306 - publish as background job for performance reasons
if (stepManager.getCurrentWorkspace().getID() == "Main") {
    node.approve();
}

//PPIM-3306 - Publish impacted SKU as background job
/*var refs = new java.util.ArrayList();
refs.addAll(node.getClassificationProductLinks());
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
for (var j = 0; j < refs.size(); j++) {
    var prod = refs.get(j).getProduct();
    if(prod.getObjectType().getID() == "SKU"){
        logger.info("Publish SKU ID: " + prod.getID());
        //PPIM-11094- SKUs are not publishing when user updates the size model and save the style in stibo
        prod.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
       }
}*/

}