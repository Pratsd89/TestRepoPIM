/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Check_US_Style_Approved",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check US Style Approved",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {

var autoTrigger = false;
if(node.getObjectType().getID()=='Style'){
	var wfErrorMessage = null;
     stepManager.executeInContext("EN_US",function(enContextManager){
        var enProduct = enContextManager.getProductHome().getProductByID(node.getID());
        var usLifeCycleStatus = enProduct.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
        if(usLifeCycleStatus == 'Approved' ){
            if(!enProduct.isInWorkflow('wf_NewStyleEnrichment')){
                autoTrigger = true;   
            }            
        }
        
     });
}
return autoTrigger;     
}