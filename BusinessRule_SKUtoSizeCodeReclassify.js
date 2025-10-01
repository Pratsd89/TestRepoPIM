/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SKUtoSizeCodeReclassify",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SKUtoSizeCodeReclassify",
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
exports.operation0 = function (node,step,log,sizeCodeRef,sizeModelRef) {
//Reclassification from old size code to new size code
var newSizeCode = step.getClassificationHome().getClassificationByID(node.getName());
if(newSizeCode != null){
if(newSizeCode.getParent().getID() == node.getParent().getID()){
	var sCodeRef = new java.util.ArrayList();
	sCodeRef.addAll(node.getClassificationProductLinks());
	for(var i=0;i<sCodeRef.size();i++){
		var sku = sCodeRef.get(i).getProduct();
		var approvalStatus = sku.getApprovalStatus();
		//log.info(approvalStatus);
		//log.info("old ref "+sku.getClassificationProductLinks(sizeCodeRef));
		sCodeRef.get(i).delete();
		sku.createClassificationProductLink(newSizeCode,sizeCodeRef);
		//log.info("new ref "+sku.getClassificationProductLinks(sizeCodeRef));
		if(approvalStatus == "Completely Approved"){
			sku.approve();
			}
		}
	}
	}
}