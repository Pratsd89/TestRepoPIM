/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleSizeModelApprovalCAN",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "StyleSizeModelApprovalCAN",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref_Style",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref_SKU",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
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
    "contract" : "ClassificationBindContract",
    "alias" : "node_Class",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "101471",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,ref_Style,ref_SKU,log,manager,node_Class) {
var result = true;
var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
var classificationType = classificationTypeHome.getLinkTypeByID('SizeModelRef'); 
var x = node.getClassificationProductLinks(classificationType).toArray();
var tarLen= x.length;//Target length
if(x[0] != null && x[0] !=''){
var a_TarObj = x[0].getClassification().getID();
var status = x[0].getClassification().getValue("a_Size_Model_Status").getSimpleValue();
log.info("size model status "+status);
var time = new java.util.Date();

// PPIM-3306 - Remove the check of size model status required to be in "Approved" workspace status for New style enrichment workflow style approval.
/*
if (status != "approved"){
result = "The size Model is not in approved status.";
}
*/

log.info("Parent Style classification id "+x[0].getClassification().getID());

	}

//var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SizeModelRef");
//log.info("style classification code: "+linkType.getID());
if(a_TarObj == null){
	result = "No Size Model Classification found.";
	}
	else{
		var refs = new java.util.ArrayList();
		refs.addAll(node.getChildren());
		//log.info("CC number "+refs.size());
		if(refs.size()!=0){
			for(var i=0;i<refs.size();i++){
						
						var CC_ID = refs.get(i).getID();
						//PPIM-6590 -- Don't validate draft status CCs/SKUs
						var lifeCycleStatus = refs.get(i).getValue('a_CC_Life_Cycle_Status').getSimpleValue();
						//log.info("CC"+CC_ID);
						if(CC_ID !=null)
						{
							var refs1 = new java.util.ArrayList();
							var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
							//log.info("test: "+SKUCheck);
							refs1.addAll(SKUCheck.getChildren());
							if(refs1.size()!=0 && lifeCycleStatus != "Draft" && lifeCycleStatus != "" && lifeCycleStatus != null){
								for(var j=0;j<refs1.size();j++)
									{
									//PPIM-11775
									var SKU_Status = refs1.get(j).getValue('a_SKU_Life_Cycle_Status').getSimpleValue();
									var skuEndDate = refs1.get(j).getValue('a_SKU_End_Date').getSimpleValue();
									var sku = refs1.get(j).getValue('a_SKU_Number').getSimpleValue()
									var isSkuAtive = (skuEndDate == null || skuEndDate >= time);
									if(refs1.get(j).getValue('a_Market_Designation').getSimpleValue().indexOf("CAN") >= 0 && isSkuAtive == "true" && SKU_Status != "Draft" && SKU_Status != "" && SKU_Status != null ){
									var SKU_ID = refs1.get(j).getID();
									log.info("SKU"+SKU_ID);
									//var sku_class = manager.getProductHome().getProductByID(SKU_ID).getClassificationProductLinkTypeByID("SKUToSizeCode");
									var classificationType1 = classificationTypeHome.getLinkTypeByID('SKUToSizeCode'); 
										var x1 = refs1.get(j).getClassificationProductLinks(classificationType1).toArray();
										var tarLen1= x1.length;//Target length
										if(x1[0] != null && x1[0] !=''){
										var a_TarObj1 = x1[0].getClassification().getID();
										log.info("sku class"+x1[0].getClassification().getID());
										
											}
									
									if(x1[0] != null && x1[0] !=''){
									var sku_code_id=x1[0].getClassification().getParent().getID();
									log.info("sku id "+sku_code_id);
									// PPIM-3306 - Remove the check of size model status required to be in "Approved" workspace status for New style enrichment workflow style approval.
									/* 
									  var status1 = x1[0].getClassification().getParent().getValue("a_Size_Model_Status").getSimpleValue();
										if (status1 != "approved"){
										result = "The SKU's Parent Style Size Model is not in approved status.";
										}
										*/
									log.info("sku parent code: "+sku_code_id);
									}
									else{
										var sku_code_id = 0;
										result = "SKU has no Web Size Code linked.";
									}
									//log.info("style classification code: "+linkType.getID());
									if(sku_code_id != a_TarObj)
									{
										result = "Size Code is missing for current Size Model.";
										}
									
									}
									}
							}
							/*else{
								
								result="No Skus found.";
								}*/
	}
	else{
		result = "No CC found.";
		}
	}
		}
		else{
			result="Style has no CC";
			}
	
		}
		if(result !=true){
			node.getValue('a_error_message').setSimpleValue(result);
		}
		return result;
		
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "StyleMandatoryAttributeCheck"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/
