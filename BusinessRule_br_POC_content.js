/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_POC_content",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_POC_content",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Content" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var contentReference = node.getReferences().asList();
	                        			for(var m = 0;m<contentReference.size();m++){
	                        				var contentReferenceType = contentReference.get(m).getReferenceType().getID();
	                        				var targetID = contentReference.get(m).getTarget().getObjectType().getID();
	                        				if(targetID == 'CustomerChoice' || targetID == 'Style'){
	                        					logger.info(contentReferenceType);
	                        				}
	                        			}
}