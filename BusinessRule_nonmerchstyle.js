/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "nonmerchstyle",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Non-Merch Style Sizemodel check",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,smRef) {
var merchType = node.getValue("a_product_merch_type").getSimpleValue();
 log.info(merchType)
 var myref = node.getClassificationProductLinks(smRef).toArray()
 if(myref.length>0){
 	var sizeModelName =  myref[0].getClassification().getName();
 
 	}
 if(merchType!= "Merch Products"){ // Style is gift type
				 
		 			 	
		 	if(sizeModelName == 'NM0' || sizeModelName == 'NM1' || sizeModelName == 'NM2'){
		 		
		 		return true;
		 		}
		 	 else {
		 	 		
		 	 	return false;
		 	 	}
			 }
			 
	 
	 else { // Style is Merch Type
	 	
	 	if(sizeModelName == 'NM0' || sizeModelName == 'NM1' || sizeModelName == 'NM2'){
	 		log.info("From here 3");
		 		return false;
		 		}
		 	else return true;	
	 }

}