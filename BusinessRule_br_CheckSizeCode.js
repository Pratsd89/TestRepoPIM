/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckSizeCode",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check SKU Size Code",
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
//PPIM-2940/1802 - US and CAN to have seperate workflow.
/*var noAccesstoUS = false;
var userGroups = new java.util.ArrayList();
userGroups.addAll(step.getCurrentUser().getGroups());
for(var n=0;n<userGroups.size();n++){
	if(userGroups.get(n).getID() == "CA-PIM-MC-Security-Group"){
		noAccesstoUS = true;
		}
	}*/
//if(noAccesstoUS != true){
var currContext = step.getCurrentContext().getID();
if(currContext == "EN_US"){
	result = true;
	}
	else{
		result = false;
		}
if(result == true){
step.executeInContext('EN_US',function(usContextManager) {
					var usCurrentProduct = usContextManager.getProductHome().getProductByID(node.getID());
					var skuNum = usCurrentProduct.getValue("a_SKU_Number").getSimpleValue();
					if(skuNum == null){
						result = false;
						}
					if(result != false){
						var sizeCode = usCurrentProduct.getValue("a_Size_Code").getSimpleValue();
						if (sizeCode == null){
							result = false;
							}
						}
					if(result != false){
						var marDesig = usCurrentProduct.getValue("a_ACL_Market_Designation").getSimpleValue();
						if (marDesig != "US"){
							result = false;
							}
							else{
								if(usCurrentProduct.getValue("a_ACL_Market_Designation").isInherited() != false){
									result = false;
									}
								}
						}
			});
}
if(result == true){
var lastModifiedUser = node.getRevision().getUserID();
if (lastModifiedUser.toUpperCase() != "STIBOACLUSER"){
	result = false;
	}
	}
//}
else{
	result = false;
	}
return result;
}