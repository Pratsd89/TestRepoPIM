/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetSKUDIMValuesOnSKU_DeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetSKUDIMValuesOnSKU_DeltaLoad",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  } ]
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
exports.operation0 = function (node,log,step,sizeCodeRef,sizeModelRef,helper) {
function updateDimDecsription(product,contextID){
	step.executeInContext(contextID,function(contextManager){
		var currentProduct = contextManager.getProductHome().getProductByID(product.getID());
		var refsc = new java.util.ArrayList();
		refsc.addAll(currentProduct.getClassificationProductLinks(sizeCodeRef));
		var newSizeCode = null;
		for (var k=0;k<refsc.size();k++){
			newSizeCode = refsc.get(k).getClassification();
			}
		if(newSizeCode != null){
			var scVar = newSizeCode.getValue("a_SizeCodeVariant").getSimpleValue();
			var scChild = new java.util.ArrayList();
			scChild.addAll(newSizeCode.getChildren());
			// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
			/*
			for(var j=0;j<scChild.size();j++){
				if(scChild.get(j).getObjectType().getID() == "Dim1"){
					var dimVal = scChild.get(j).getValue("a_Advanced_Dimension_Value").getSimpleValue();
					var skudim = scVar+" "+dimVal;
					currentProduct.getValue("a_Size_Dim1_Description").setSimpleValue(skudim);
				}
				if(scChild.get(j).getObjectType().getID() == "Dim2"){
					var dimVal = scChild.get(j).getValue("a_Advanced_Dimension_Value").getSimpleValue();
					var skudim = scVar+" "+dimVal;
					currentProduct.getValue("a_Size_Dim2_Description").setSimpleValue(skudim);
				}
			}
			*/
		}
		else{
			/*
			if(currentProduct.getValue("a_Size_Dim1_Description").getSimpleValue() != null){
				currentProduct.getValue("a_Size_Dim1_Description").deleteCurrent();
				}
			if(currentProduct.getValue("a_Size_Dim2_Description").getSimpleValue() != null){
				currentProduct.getValue("a_Size_Dim2_Description").deleteCurrent();
				}
			*/
			//if(currentProduct.getName() != null){
				//currentProduct.getName().deleteCurrent();
			//}
		}
		// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
		// Set name directly from Size code
		helper.setSKUNameFromSizeCode(currentProduct, contextManager);
		/*
		var nameContext = null;
		var dim1 = currentProduct.getValue("a_Size_Dim1_Description").getSimpleValue();
		var dim2 = currentProduct.getValue("a_Size_Dim2_Description").getSimpleValue();
		if(newSizeCode != null){
		if(dim1 != null){
			nameContext = dim1;
			}
		if(dim2 != null){
			nameContext = nameContext+"-"+dim2;
			}
		if(scVar !=null){
		nameContext = nameContext+"-"+scVar;
		}
		currentProduct.setName(nameContext);
		}
		*/
		}
		);

}
var objType = node.getObjectType().getID();
if(objType == "SKU"){
	var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
	if(marketDesignation != null){
	if(marketDesignation.contains("US")){
		updateDimDecsription(node,"EN_US");
		}
	if(marketDesignation.contains("CAN")){
		updateDimDecsription(node,"EN_CA");
		updateDimDecsription(node,"FR_CA");
		}
	if(marketDesignation.contains("JPN")){
		updateDimDecsription(node,"EN_JP");
		updateDimDecsription(node,"JA_JP");
		}
		}
	}
}