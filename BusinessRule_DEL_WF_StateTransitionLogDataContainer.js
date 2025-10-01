/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DEL_WF_StateTransitionLogDataContainer",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DEL_WF_StateTransitionLogDataContainer",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
var wfStateTransitionContainers = node.getDataContainerByTypeID('WF_StateTransitionLogDataContainer').getDataContainers().toArray();
logger.info("Current container count: " + wfStateTransitionContainers.length);

var len = wfStateTransitionContainers.length;
//Check if the count exceeds 5
if (len > 5) {
    try {
    	   len = len - 5;
        // logger.info("Container count exceeds 5, start deletion of 3 containers.");
        for (var i = 0; i < len; i++) {
            wfStateTransitionContainers[i].deleteLocal();
            // logger.info("Deleted container: " + wfStateTransitionContainers[i]);
        }
        // logger.info("3 containers deleted successfully.");
    } catch (e) {
        logger.error("An error occurred while deleting containers: " + e.message);
        return false; // operation failed
    }
} /* else {
    logger.info("Container count is below 5, no deletion needed.");
} */
return true; // Process completed without issues
}