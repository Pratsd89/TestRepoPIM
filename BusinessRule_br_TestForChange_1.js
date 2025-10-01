/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TestForChange_1",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_TestForChange_1",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ConditionalInvalidValuesBinding",
    "alias" : "inValid",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,inValid,queryHome) {
var valueReturned = node.getValue("a_TestForChange").getSimpleValue();
log.info("valueReturned value in the debug valueReturned ------ "+valueReturned);
var parent1 = node.getParent() ;
var parent1AttrValue = parent1.getValue("a_TestForChange").getSimpleValue();

log.info("valueReturned value in the debug valueReturned for parent  ------+"+parent1AttrValue);
if(valueReturned != parent1AttrValue)
{
log.info("this is not to be published when checked with Parent ");
	
}else
{

	var parent2 = 	parent1.getParent() ;
	var parent2AttrValue = parent2.getValue("a_TestForChange").getSimpleValue();
		if(parent2AttrValue != valueReturned)
		{
			log.info("this is not to be published when checked with Parents Parent ");
			
			}else{
	
				var parent3 = parent2.getParent() ;
				var parent3AttrValue = parent3.getValue("a_TestForChange").getSimpleValue();
				
				
				if(parent3AttrValue != valueReturned)
					{
						log.info("this is not to be published when checked with Parents 2 nd Parent ");
						
					}
			}
	
}

}