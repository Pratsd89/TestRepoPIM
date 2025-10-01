/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_updateChildMaintenanceDateTime",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "UpdateChildMaintainenceDateTime",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
  "allObjectTypesValid" : false,
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
//PPIM-8959 - Validity for Attribute and Object added
function checkAttributeObjectValidity(node, attribute){
	var validityFlag = false;
	var validObjectTypes = attribute.getValidForObjectTypes().toArray();
	for(var j=0;j<validObjectTypes.length;j++){
		if(validObjectTypes[j].getID()==node.getObjectType().getID()){
			validityFlag=true;
        		break;
        	}
     }
     return validityFlag;
}

//PPIM-8681
var isChildPublishAttributeModified = false

var childPublishAttributesGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID('ag_ChildPublishAttributes');
var childPublishAttributesList = childPublishAttributesGroup.getAttributes().toArray();
var isCCPublicationDateModified = false
var isCCDeactivationDateModified = false

for(var i = 0 ; i < childPublishAttributesList.length ; i++){
	var substringChildPublishAttribute = childPublishAttributesList[i].getID().substring(2)
	var oldAttributeIdPrefix = 'a_Old_'
	var oldChildPublishAttribute = oldAttributeIdPrefix + substringChildPublishAttribute

	try{
		var oldChildPublishAttributeValue = node.getValue(oldChildPublishAttribute).getSimpleValue();
		var newChildPublishAttributeValue = node.getValue(childPublishAttributesList[i].getID()).getSimpleValue();
		
		//Check Attribute Validity with current node
		if(checkAttributeObjectValidity(node, childPublishAttributesList[i]))
		{
			//PPIM-8959 - Additional check for Attribute :a_CC_Start_Date
			if(childPublishAttributesList[i].getID().equals('a_CC_Start_Date') && oldChildPublishAttributeValue != newChildPublishAttributeValue){
				isChildPublishAttributeModified = true
				isCCPublicationDateModified = true
				node.getValue(oldChildPublishAttribute).setSimpleValue(newChildPublishAttributeValue)
				var ccPublicationDate = node.getValue(childPublishAttributesList[i].getID()).getSimpleValue()	
				
			} 
			//PPIM-9174 - Additional check for Attribute :a_CC_End_Date
			else if(childPublishAttributesList[i].getID().equals('a_CC_End_Date') && oldChildPublishAttributeValue != newChildPublishAttributeValue)
                            {
                                isChildPublishAttributeModified = true
                                isCCDeactivationDateModified = true
                                node.getValue(oldChildPublishAttribute).setSimpleValue(newChildPublishAttributeValue)
                                var ccDeactivationDate = node.getValue(childPublishAttributesList[i].getID()).getSimpleValue()
                                
                             }
			else if(oldChildPublishAttributeValue != newChildPublishAttributeValue) {
				isChildPublishAttributeModified = true
				node.getValue(oldChildPublishAttribute).setSimpleValue(newChildPublishAttributeValue)
				
			}
		}
	}
	catch(e) {
		log.info('Error occurred in BR: br_updateChildMaintenanceDateTime : ' +e)
	}

}

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

if(isChildPublishAttributeModified) {
	if(node.getObjectType().getID()=='CustomerChoice') {
		
		var childList=node.getChildren();
		for(var j=0;j<childList.size();j++) {
			
			//PPIM-8959 - Included CC Publication Date to add it to SKU Level
			if(isCCPublicationDateModified && node.getObjectType().getID()=='CustomerChoice') {
				childList.get(j).getValue("a_SKU_Start_Date").setSimpleValue(ccPublicationDate);
			}
			//PPIM-9174 - Included CC Deactivation Date to add it to SKU Level
			if(isCCDeactivationDateModified && node.getObjectType().getID()=='CustomerChoice') 
            {
             childList.get(j).getValue("a_SKU_End_Date").setSimpleValue(ccDeactivationDate);
            }
			childList.get(j).getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		}
	}
}

}