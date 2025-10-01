/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckNonMerchSTCCSKU",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckNonMerchSTCCSKU",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log) {
var result = false;
var objType = node.getObjectType().getID();
if(objType == "SubClass"){
	var nObj = node.getID();
	if (nObj == "ON_StoredValueCards" || nObj == "ON_Gifts_Subclass" || nObj == "ON_Services_Subclass"){
	result = true;
	}
	}
	else if(objType == "Style"){
	var obj = node.getParent().getID();
	if (obj == "ON_StoredValueCards" || obj == "ON_Gifts_Subclass" || obj == "ON_Services_Subclass"){
	result = true;
	}
	}
	else if (objType == "CustomerChoice" || objType == "SKU"){
		var merchFlag = node.getParent().getValue("a_product_merch_type").getSimpleValue();
		if(merchFlag != null && merchFlag != "Merch Products"){
			result = true;
			}
		}
		
return result;
	
	
}