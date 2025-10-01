/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Inheriting_ASLR_Settings",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Inheriting ASLR Settings",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "Department", "Division", "SubClass" ],
  "allObjectTypesValid" : false,
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
var ASLREntityReferenceType = stepManager.getReferenceTypeHome().getReferenceTypeByID('ASLRRef');
var ASLREntityReference = node.getReferences(ASLREntityReferenceType).toArray();
if(ASLREntityReference.length != 0){
	logger.info(ASLREntityReference[0].getReferenceType().getID());
	var ASLRDataEntity = ASLREntityReference[0].getTarget();
	var ASLRDataContainers = ASLRDataEntity.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
	if(ASLRDataContainers.length == 0 ){
		
	}
}

}