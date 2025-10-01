/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckApprovedObjectUS",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "CheckApprovedObjectUS",
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
var result = true;
var objType = node.getObjectType().getID();
if(objType == "Style"){
	step.executeInContext("EN_US",function(usContextManager){	
			var usCurrentProduct = usContextManager.getProductHome().getProductByID(node.getID());
			 var lifecycle = usCurrentProduct.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
			 if(lifecycle != "Approved"){
				 result = false;
				}
		   });
}
	else if(objType == "CustomerChoice"){
		step.executeInContext("EN_US",function(usContextManager){	
				var usCurrentProduct = usContextManager.getProductHome().getProductByID(node.getID());
				 var lifecycle = usCurrentProduct.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
				 if(lifecycle != "Approved"){
					result = false;
					}
			   });
		}
			else if(objType == "SKU"){
				step.executeInContext("EN_US",function(usContextManager){	
						var usCurrentProduct = usContextManager.getProductHome().getProductByID(node.getID());
						 var lifecycle = usCurrentProduct.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
						 if(lifecycle != "Approved"){
							result = false;
							}
					   });
			}
return result;
}