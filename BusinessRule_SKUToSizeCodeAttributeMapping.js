/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SKUToSizeCodeAttributeMapping",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SKUToSizeCodeAttributeMapping",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step,sizeCodeRef,sizeModelRef) {
var objType = node.getObjectType().getID();
if(objType == "SKU"){
	var sizeCodeName = null;
	var approvalStatus = node.getApprovalStatus();
	var refsc = new java.util.ArrayList();
	refsc.addAll(node.getClassificationProductLinks(sizeCodeRef));
	for (var k=0;k<refsc.size();k++){
		sizeCodeName = refsc.get(k).getClassification().getName();
		//log.info("size code name "+sizeCodeName);
		}
		if(sizeCodeName != null){
		//log.info("now: "+node.getValue("a_Size_Code").getSimpleValue());
		node.getValue("a_Size_Code").setSimpleValue(sizeCodeName);
		//log.info("later: "+node.getValue("a_Size_Code").getSimpleValue());
		}
		if(approvalStatus == "Completely Approved"){
			node.approve();
			}
	}
}