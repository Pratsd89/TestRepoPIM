/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Approval_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Approval_CC",
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,portal) {
//Check to ignore validation for Non Merch - PPIM-1406
var nonMerchType = node.getParent().getValue("a_product_merch_type").getSimpleValue();
var nonMerchFlag = true;
if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){
	nonMerchFlag = false;
	}
//end non merch check
var fcheck_1=0;
if(nonMerchFlag == false){
var marketCode= node.getValue('a_Market_Designation').getValues().toArray();
var CC_ID =node.getID();
log.info(CC_ID)
if( marketCode != null)
{
marketCode.sort();
var temp = [];
for(var j=0;j<marketCode.length;j++)
{
	temp.push(marketCode[j].getSimpleValue());		
}
temp = temp.sort();
marketCode = temp.join(',');
log.info(marketCode);
}
if(marketCode == 'US')
{
      manager.executeInContext('EN_US',function(enContextManager) 
      {	
	
	var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
	var enProductName = enCurrentProduct.getName();
	var enSearchColor = enCurrentProduct.getValue('a_Override_Search_Color').getSimpleValue();
	log.info(enProductName);
	log.info(enSearchColor);
	if(enProductName == null && enSearchColor == null)
	{
		portal.showAlert("Error", "Missing CC Name and Missing Search Color");
		fcheck_1=1;
	}
	else if(enProductName == null)
	{
		portal.showAlert("Error", "Missing CC Name");
		fcheck_1=1;
	}
	else if(enSearchColor == null)
	{
		portal.showAlert("Error", "Missing Search Color");
		fcheck_1=1;
	}
	  })
}
else if(marketCode == 'CAN,US')
{
	manager.executeInContext('EN_US',function(enContextManager) 
      {	
	var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
	var enProductName = enCurrentProduct.getName();
	var enSearchColor = enCurrentProduct.getValue('a_Override_Search_Color').getSimpleValue();
	log.info(enProductName);
	log.info(enSearchColor);
	if(enProductName == null && enSearchColor == null)
	{
		portal.showAlert("Error", "Missing CC Name and Missing Search Color");
		fcheck_1=1;
	}
	else if(enProductName == null)
	{
		portal.showAlert("Error", "Missing CC Name");
		fcheck_1=1;
	}
	else if(enSearchColor == null)
	{
		portal.showAlert("Error", "Missing Search Color");
		fcheck_1=1;
	}
	  })
	 manager.executeInContext('EN_CA',function(caContextManager) 
      {
	var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
	var caProductName = caCurrentProduct.getName();
	var caSearchColor = caCurrentProduct.getValue('a_Override_Search_Color').getSimpleValue();
	log.info(caProductName);
	log.info(caSearchColor);
	if(caProductName == null && caSearchColor == null)
	{
		portal.showAlert("Error", "Missing CC Name and Missing Search Color");
		fcheck_1=1;
	}
	else if(caProductName == null)
	{
		portal.showAlert("Error", "Missing CC Name");
		fcheck_1=1;
	}
	else if(caSearchColor == null)
	{
		portal.showAlert("Error", "Missing Search Color");
		fcheck_1=1;
	}
	  })
}

else if(marketCode == 'CAN')
{

      manager.executeInContext('EN_CA',function(caContextManager) 
      {
	var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
	var caProductName = caCurrentProduct.getName();
	var caSearchColor = caCurrentProduct.getValue('a_Override_Search_Color').getSimpleValue();
	log.info(caProductName);
	log.info(caSearchColor);
		if(caProductName == null && caSearchColor == null)
	{
		portal.showAlert("Error", "Missing CC Name and Missing Search Color");
		fcheck_1=1;
	}
	else if(caProductName == null)
	{
		portal.showAlert("Error", "Missing CC Name");
		fcheck_1=1;
	}
	else if(caSearchColor == null)
	{
		portal.showAlert("Error", "Missing Search Color");
		fcheck_1=1;
	}	 
	})
	  
}
}
//CHECK FOR SKU ATTRIBUTE
// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306. Removing the check
/*
if(fcheck_1 == 0)
{
var refs = new java.util.ArrayList();
refs.addAll(node.getChildren());
for(var i=0;i<refs.size();i++)
	{
	var SKU_ID = refs.get(i).getID();
	log.info("children of CC (SKUs): "+refs.size());
	log.info("children of CC (SKUs): "+refs);
	var a_Size_Dim1_Description = manager.getProductHome().getProductByID(SKU_ID).getValue("a_Size_Dim1_Description").getSimpleValue();
	log.info(a_Size_Dim1_Description);
	if(a_Size_Dim1_Description == null)
	{
		
		portal.showAlert("Error",null, SKU_ID+" : Missing Sku Size Description");
	}
	}

}
*/

}
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "PrimaryProductImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotRequestToExternalAsset",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToExternalAsset",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,PrimaryProductImage,manager,ShotRequestToExternalAsset) {
//log.info(node.getAssetReferences())//.getAssetReferencesByID("PrimaryProductImage"));
log.info("abc test" +node.getReferences(PrimaryProductImage));

var ref_asset = new java.util.ArrayList();
ref_asset.addAll(node.getReferences(PrimaryProductImage));
for(var i=0;i<ref_asset.size();i++)
	{
	var asset_ID =ref_asset.get(i).getTarget().getID();
	log.info("Primary asset reference size: "+ref_asset.size());
	log.info("Primary asset refernce: " +asset_ID);
	var content_type = ref_asset.get(i).getTarget().getValue("a_Content_Type_ID").getSimpleValue();
	log.info(content_type);
	log.info(/*ref_asset.get(i)*/asset_ID.getReferences(ShotRequestToExternalAsset));
	}
	if(content_type == "216" || content_type == "12")
	{
//.getTarget().getID());
	}
}