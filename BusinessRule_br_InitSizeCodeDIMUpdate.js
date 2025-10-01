/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_InitSizeCodeDIMUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Initial Load Size Code DIM Update",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
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
exports.operation0 = function (node,step,sizeCodeRef) {
var sizeCodes = node.getClassificationProductLinks(sizeCodeRef).toArray();
if(sizeCodes.length > 0) {
	var sizeCode = sizeCodes[0].getClassification();
	logger.info("size code = " + sizeCode.getID());

	//populate dim1 and dim2 on the SKU
	// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
	/*
	var sVariant = sizeCode.getValue("a_SizeCodeVariant").getSimpleValue();
	if (sVariant != null) {
		var sizeCodeChildren = sizeCode.getChildren();
		if(sizeCodeChildren){
	   		var childIter = sizeCodeChildren.iterator();
	   		while(childIter.hasNext()){
		       	var child = childIter.next();
		       	//log.info(child1.getObjectType().getID());
		       	var tObj = child.getObjectType().getID();
		       	if (tObj == "Dim1"){
		       		var sDim1 = child.getValue("a_Advanced_Dimension_Value").getSimpleValue();
		       		if(sDim1 != null){
		       			var skuDim1 = sVariant+" "+sDim1;
		       			log.info("skuDim1 "+skuDim1);
		       			node.getValue("a_Size_Dim1_Description").setSimpleValue(skuDim1);
		       		}
		       	} else if (tObj == "Dim2"){
		       		var sDim2 = child.getValue("a_Advanced_Dimension_Value").getSimpleValue();
		       		if(sDim2 != null){
		       			var skuDim2 = sVariant+" "+sDim2;
		       			log.info("skuDim2 "+skuDim2);
		       			node.getValue("a_Size_Dim2_Description").setSimpleValue(skuDim2);
		       		}
		       	}
			}
		}
	}
	*/ 
 }
}