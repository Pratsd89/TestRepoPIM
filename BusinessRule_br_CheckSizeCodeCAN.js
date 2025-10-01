/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckSizeCodeCAN",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check SKU Size Code CAN",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
// Return true if sku has value for a_Size_Code
var result = true;
step.executeInContext('EN_CA',function(caContextManager) {
					var caCurrentProduct = caContextManager.getProductHome().getProductByID(node.getID());
					var skuNum = caCurrentProduct.getValue("a_SKU_Number").getSimpleValue();
					if(skuNum == null){
						result = false;
						}
					if(result != false){
					var sizeCode = caCurrentProduct.getValue("a_Size_Code").getSimpleValue();
					if (sizeCode == null){
						result = false;
						}
					}
					if(result != false){
						var marDesig = caCurrentProduct.getValue("a_ACL_Market_Designation").getSimpleValue();
						if (marDesig != "CAN"){
							result = false;
							}
							else{
								if(caCurrentProduct.getValue("a_ACL_Market_Designation").isInherited() != false){
									result = false;
									}
								}
						}
			});
if(result != false){
var lastModifiedUser = node.getRevision().getUserID();
if (lastModifiedUser.toUpperCase() != "STIBOACLUSER"){
	result = false;
	}
}
return result;
}