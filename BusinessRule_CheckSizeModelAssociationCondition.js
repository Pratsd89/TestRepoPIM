/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckSizeModelAssociationCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckSizeModelAssociationCondition",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "alias" : "manager",
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
exports.operation0 = function (node,log,manager,sizeCodeRef,sizeModelRef) {
log.info("Executing BR CheckSizeModelAssociationCondition");
var result = true;
var skuCount = 0;
var objType = node.getObjectType().getID();
if(objType == "Style"){
var sourceSizeModel = node.getValue("a_Source_Size_Model").getSimpleValue();
if (sourceSizeModel == null){
result = false;
}
else{
var refssizemodel = new java.util.ArrayList();
refssizemodel.addAll(node.getClassificationProductLinks(sizeModelRef));
if(refssizemodel.size() == 0){
	//log.info(refssizemodel.size());
	result = true;
}
else {
	log.info(manager.getClassificationHome().getClassificationByID(sourceSizeModel));
	var sizeModelClassification = manager.getClassificationHome().getClassificationByID(sourceSizeModel);
	if(sizeModelClassification != null){
	var objTypeID = manager.getClassificationHome().getClassificationByID(sourceSizeModel).getObjectType().getID();
	if(sizeModelClassification != null && objTypeID == "SizeModel"){
			
		var i = null;
		var j = null;
		var k = null;
		
		var ccmatch = 0;
		var matchsc = 0;
		var refc = new java.util.ArrayList();
		refc.addAll(node.getChildren());
		for(i=0;i<refc.size();i++){
			var cc = refc.get(i);
			var refsk = new java.util.ArrayList();
			refsk.addAll(cc.getChildren());
			skuCount = parseInt(skuCount)+parseInt(refsk.size());
			for(j=0;j<refsk.size();j++){
				var sku = refsk.get(j);
				var refsc = new java.util.ArrayList();
				refsc.addAll(sku.getClassificationProductLinks(sizeCodeRef));
				if(refsc.size() == 1){
				for (k=0;k<refsc.size();k++){
					var sizeCodeName = refsc.get(k).getClassification().getName();
					//check new size model for proper size code
					var refsmc = new java.util.ArrayList();
					refsmc.addAll(sizeModelClassification.getChildren());
					for(var m=0;m<refsmc.size();m++){
					var newScode = refsmc.get(m);
					var newSCName = refsmc.get(m).getName();
					if(newSCName == sizeCodeName){
						matchsc++;		
						}
					}
					}
					}
					else{
						matchsc++;
						}
				}
				//if(j == matchsc){
						//ccmatch++;
					//}
			}
			if(matchsc != skuCount){
				result = false;
				}
				//*************End of validation***********************	
	}
	}
	}
}
	
}
return result;
}