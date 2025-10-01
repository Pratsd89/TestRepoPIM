/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "RemoveStyletoSizeModelRef",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "RemoveStyletoSizeModelRef",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,sizeModelRef,sizeCodeRef) {
var refs = new java.util.ArrayList();
var refc = new java.util.ArrayList();
var refsk = new java.util.ArrayList();
var refsc = new java.util.ArrayList();
var i = null;
var j = null;
var k = null;

//Delete Style to Size Model Link
refs.addAll(node.getClassificationProductLinks(sizeModelRef));
	//log.info(refs.size());
	for (i = 0; i < refs.size(); i++){
		refs.get(i).delete();
		}
//Traverse to SKU from Style and delete SKU to Size code link
refc.addAll(node.getChildren());
for(i=0;i<refc.size();i++){
	//var cc = refc.get(i).getID();
	var cc = refc.get(i);
	refsk.addAll(cc.getChildren());
	for(j=0;j<refsk.size();j++){		
		var sku = refsk.get(j);
		//Remove a_Size_Dim1_Description & a_Size_Dim2_Description, if values are present
		// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
		/*
		if(sku.getValue("a_Size_Dim1_Description").getSimpleValue() != null){
		sku.getValue("a_Size_Dim1_Description").deleteCurrent();
		}
		if(sku.getValue("a_Size_Dim2_Description").getSimpleValue() != null){
		sku.getValue("a_Size_Dim2_Description").deleteCurrent();
		}
		*/
		//Get Size Code link and delete
		refsc.addAll(sku.getClassificationProductLinks(sizeCodeRef));
		for (k=0;k<refsc.size();k++){
			refsc.get(k).delete()
			}
		}
	}
}