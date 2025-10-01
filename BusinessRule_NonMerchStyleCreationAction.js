/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "NonMerchStyleCreationAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "NonMerchStyleCreationAction",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,portal) {
var subClass = node.getParent().getID();
var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
if(nonMerchType == null){
	portal.showAlert("ERROR", "Attribute Product Merch Type is Mandatory.");
	}
	else{
if (subClass == "ON_StoredValueCards"){
	if (!(nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS OPEN")){
		node.getValue("a_product_merch_type").deleteCurrent();
		portal.showAlert("ERROR", "Attribute Product Merch Type value does not comply with SubClass ON_StoredValueCards.");
		}
	}
	else if(subClass == "ON_Gifts_Subclass"){
		if (!(nonMerchType == "GIFTS" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC")){
		node.getValue("a_product_merch_type").deleteCurrent();
		portal.showAlert("ERROR", "Attribute Product Merch Type value does not comply with SubClass ON_Gifts_Subclass.");
		}
		}
		else if(subClass == "ON_Services_Subclass"){
			if(!(nonMerchType == "MONOGRAM SERVICE")){
				node.getValue("a_product_merch_type").deleteCurrent();
				portal.showAlert("ERROR", "Attribute Product Merch Type value does not comply with SubClass ON_Services_Subclass.");
				}
			}
//			portal.navigate("GAPPhotoShotDetails", oNewShotRequest);
}
}