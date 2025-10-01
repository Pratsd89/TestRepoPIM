/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Save_SetLastupdateDate_DeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Size Model Classification Delta Load",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Dim1", "Dim2", "SizeCode" ],
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
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
exports.operation0 = function (node,sizeCodeRef,log) {
log.info("BR Save_SetLastupdateDate");
var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			//logger.info(iso.format(time));
			node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			//log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
var obj = node.getObjectType().getID();

/* PPIM-8108 Removed validity for Size Model. Publish events on Styles is not necessary during data load
if(obj == "SizeModel"){
var classStyle = node.getClassificationProductLinks();
if(classStyle){
            		var chIter11=classStyle.iterator();
            		while(chIter11.hasNext()){
            			var chprod11 = chIter11.next(); 
						var x = chprod11.getProduct();
						log.info("PUBLISH styles are "+x.getID());
						x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
						log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
            		}
		   }
}
*/
if (obj == "SizeCode"){
	var variant = null;
	var sDim1 = null;
	var sDim2 = null;
	var skuDim2 = null;
	variant = node.getValue("a_SizeCodeVariant").getSimpleValue();
	var refDimObj = new java.util.ArrayList();
	refDimObj.addAll(node.getChildren());
	for(var i=0;i<refDimObj.size();i++){
		if (refDimObj.get(i).getObjectType().getID() == "Dim1"){
			sDim1 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();		
			}
		if (refDimObj.get(i).getObjectType().getID() == "Dim2"){
			sDim2 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();		
			}
		}
	var skuDim1 = variant+" "+sDim1;
	if(sDim2 != null){
	skuDim2 = variant+" "+sDim2;
		}
	var refSKU = new java.util.ArrayList();
	refSKU.addAll(node.getClassificationProductLinks());
	// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
	/*
	for(var j=0;j<refSKU.size();j++){
		refSKU.get(j).getProduct().getValue("a_Size_Dim1_Description").setSimpleValue(skuDim1);
		if(sDim2 != null){
		refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").setSimpleValue(skuDim2);
		}
		else if(refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").getSimpleValue() != null){
			refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").deleteCurrent();
			}
		}
		*/
}
if (obj == "Dim1" || obj == "Dim2"){
var sDim1 = null;
var sDim2 = null;
var skuDim2 = null;
var variant = node.getParent().getValue("a_SizeCodeVariant").getSimpleValue();
var refDimObj = new java.util.ArrayList();
refDimObj.addAll(node.getParent().getChildren());
for(var i=0;i<refDimObj.size();i++){
		if (refDimObj.get(i).getObjectType().getID() == "Dim1"){
			sDim1 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();		
			}
		if (refDimObj.get(i).getObjectType().getID() == "Dim2"){
			sDim2 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();		
			}
		}
var skuDim1 = variant+" "+sDim1;
if(sDim2 != null){
	skuDim2 = variant+" "+sDim2;
		}
	var refSKU = new java.util.ArrayList();
	refSKU.addAll(node.getParent().getClassificationProductLinks());
	// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
	/*
	for(var j=0;j<refSKU.size();j++){
		refSKU.get(j).getProduct().getValue("a_Size_Dim1_Description").setSimpleValue(skuDim1);
		if(sDim2 != null){
		refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").setSimpleValue(skuDim2);
		}
		else if(refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").getSimpleValue() != null){
			refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").deleteCurrent();
			}
		}
	*/
}
}