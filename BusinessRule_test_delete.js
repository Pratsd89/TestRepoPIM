/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_delete",
  "type" : "BusinessAction",
  "setupGroups" : [ "MarketingFlagActions" ],
  "name" : "test delete",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,LKT) {
var contextID = manager.getCurrentContext().getID();
//manager.executeInContext(contextID, function(currentContextManager) {
 
    var MarketingFlagName='PIM CORE test jeans';
   
    if (true) {
        
            
            var LOVObject = manager.getListOfValuesHome().getListOfValuesByID('LoV_CC_Marketing_Flags_ON');
            try {
                LOVObject.createListOfValuesValue(MarketingFlagName, null);
               
            } catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.validatorexception.NonUniqueValuelDValidatorException) {
                    log.warning("Unique Value Exception");
                }
            }
            //newMarketingFlag.approve();
           
        }
    //}
//);


}