/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveObjects",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ApproveProductObjects",
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
//Approval for all 3 contexts
/*function nodeApprove(product, contextID) {
    step.executeInContext(contextID, function (contextManager) {
        var currentProduct = contextManager.getProductHome().getProductByID(product.getID());
        var objType = currentProduct.getObjectType().getID();
		if(objType == "Style"){
			if(currentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "Approved"){
				currentProduct.approve();
				}
			}
			else if (objType == "CustomerChoice"){
				if(currentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved"){
				currentProduct.approve();
				}
				}
				else if(objType == "SKU"){
					if(currentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == "Approved"){
				currentProduct.approve();
				}
					}
					else{
						if(currentProduct.getApprovalStatus() != "Not in Approved workspace"){
							currentProduct.approve();
							}
						}        
        });
       }

nodeApprove(node,"EN_US");
nodeApprove(node,"EN_CA");
//nodeApprove(node,"FR_CA");
*/
//Only one context approval

var objType = node.getObjectType().getID();
		if(objType == "Style"){
			if(node.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "Approved"){
				node.approve();
				}
			}
			else if (objType == "CustomerChoice"){
				if(node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved"){
				node.approve();
				}
				}
				else if(objType == "SKU"){
					if(node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == "Approved"){
				node.approve();
				}
					}
					else{
						if(node.getApprovalStatus() != "Not in Approved workspace"){
							node.approve();
							}
						}
}