/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_updateChildPublishAttributesOld_otf",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Update Child Publish Attributes Old otf",
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

//This Business rule created for one time data setup for new Attributes created for PPIM-8681
function updateAttributeInAllContexts(node,contextID){
	stepManager.executeInContext(contextID, function(otherManager) {
     	var otherNode = otherManager.getObjectFromOtherManager(node);   

		var isChildPublishAttributeModified = false
		var childPublishAttributesGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID('ag_ChildPublishAttributes');
		var childPublishAttributesList = childPublishAttributesGroup.getAttributes().toArray();
		
		var childPublishAttributesOldGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID('ag_ChildPublishAttributesOld');
		var childPublishAttributesOldList = childPublishAttributesOldGroup.getAttributes().toArray();
		
		for(var i = 0 ; i < childPublishAttributesList.length ; i++){
			var substringChildPublishAttribute = childPublishAttributesList[i].getID().substring(2)
			var oldAttributeIdPrefix = 'a_Old_'
			var oldChildPublishAttribute = oldAttributeIdPrefix + substringChildPublishAttribute
		
			try{
				var oldChildPublishAttributeValue = node.getValue(oldChildPublishAttribute).getSimpleValue();
				var newChildPublishAttributeValue = node.getValue(childPublishAttributesList[i].getID()).getSimpleValue();
				if(oldChildPublishAttributeValue != newChildPublishAttributeValue) {
					node.getValue(oldChildPublishAttribute).setSimpleValue(newChildPublishAttributeValue)
				}
				
			}
			catch(e) {
				log.info('Error occurred in BR: br_updateChildPublishAttributesOld_otf : ' +e)
			}
		
		}

	})
		
}

if(/*node.getObjectType().getID() == "Brand" || node.getObjectType().getID() == "Division"|| node.getObjectType().getID() == "Department" || node.getObjectType().getID() == "Class" || node.getObjectType().getID() == "Sub Class" ||*/ node.getObjectType().getID() == "Style" || node.getObjectType().getID() == "CustomerChoice"  || node.getObjectType().getID() == "SKU") {	
	
	updateAttributeInAllContexts(node,stepManager.getCurrentContext().getID());
	
}

}