/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "nonmerchsku",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Non-Merch SKU Sizecode check",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "smRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "skuLink",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,smRef,skuLink) {
var merchType = node.getValue("a_product_merch_type").getSimpleValue();
if(merchType!= "Merch Products"){
	var myref = node.getClassificationProductLinks(skuLink).toArray()
	//check if array is blank
	if(myref.length>0){
		
			var sizeCodeParent =  myref[0].getClassification().getParent().getName();//get Parent of Sizecode
			var pStyle = node.getParent().getParent();//Get Style from SKU
			var pref = pStyle.getClassificationProductLinks(smRef).toArray()
			var sizeModelName = pref[0].getClassification().getName();
			if(sizeCodeParent==sizeModelName){
				
				if(sizeModelName == 'NM0' || sizeModelName == 'NM1' || sizeModelName == 'NM2'){
					return true;
					}
				else{ return false;	}//false if Sizemodel not NM0/NM1/NM2
			}
			else {
				log.info("Here 1")
				return false;	}//false if sizecode does not belong to Sizemodel
					
		}
}
return true
}