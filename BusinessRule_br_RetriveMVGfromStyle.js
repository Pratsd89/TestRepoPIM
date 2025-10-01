/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_RetriveMVGfromStyle",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_RetriveMVGfromStyle",
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
    "alias" : "manager",
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
exports.operation0 = function (node,manager,log) {
var MVGTemplateClassification = getMVGTemplateFromStyle(node,manager);
if(MVGTemplateClassification != false){
var VariantObject = MVGTemplateClassification.getChildren();
}

logger.warning(MVGTemplateClassification);
logger.warning(VariantObject);


function getMVGTemplateFromStyle(node,manager) 
{
	var MVGTemplate ="false";
	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("HierarchyToVariant");
	node.queryClassificationProductLinks(linkType).forEach
	(
		function (referenceInstance){
		 MVGTemplate = referenceInstance.getClassification();
		return true;
		}
		);
 return MVGTemplate;
 }


}