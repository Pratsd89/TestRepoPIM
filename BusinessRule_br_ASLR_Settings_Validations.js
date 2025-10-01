/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ASLR_Settings_Validations",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ASLR Settings Validations",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "Class", "Department", "Division", "SubClass" ],
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
    "contract" : "AttributeGroupBindContract",
    "alias" : "badgingGroup",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_badge_details",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "EventProcessor",
    "parameterClass" : "com.stibo.core.domain.impl.eventprocessor.EventProcessorImpl",
    "value" : "step://eventprocessor?id=EP_BadgingPublish",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,badgingGroup,manager,EventProcessor) {
var logArray = new Array();
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var badgingFlags = badgingGroup.getDataContainerTypes().toArray();
var badgingFlagIDs = new Array();
badgingFlags.forEach(function (flag) {
	badgingFlagIDs.push(flag.getID());
});
var currentContext = manager.getCurrentContext().getID();
const [currLang, currMkt] = currentContext.split("_");
var pattern = new RegExp(currMkt);
var loop = 0;
for (var x = 0; x <= badgingFlagIDs.length - 1; x++) {
	if (!pattern.test(badgingFlagIDs[x])) {
		badgingFlagIDs.splice(x, 1);
		x--
	}
	loop++
	if (loop > 100) {
		break;
	}
}


log.info(badgingFlagIDs);
badgingFlagIDs.forEach(function (idf) {
	if (idf.indexOf("Badges") != -1) {
		var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers().toArray();
		if (dataContainer.length > 1) {
			var error = "\tMultiple badges have been applied to the ";
			error = error.concat(idf);
			error = error.concat(" position, but only one badge is permitted per product. To resolve this, use the Reset button to remove the invalid badges before saving.");
			throw error;
		}
		else if (dataContainer.length == 1) {
			
			var correctBrand = "a_badge_" + brandNum;
			log.info(correctBrand +" correctBrand")
			var dataContainerObj = dataContainer[0].getDataContainerObject();
			var brandValue = dataContainerObj.getValue(correctBrand).getSimpleValue();
			log.info(dataContainerObj.getValue(correctBrand).getSimpleValue())
			//if (brandValue != null) {
				var allBrands = ["GO", "AT", "BR", "ON", "BRFS", "GAP"];
				for (var i = 0; i < allBrands.length; i++) {
					if (allBrands[i] != brandNum) {
						var eachBrandValue = "a_badge_" + allBrands[i];
						var currentValue = dataContainerObj.getValue(eachBrandValue).getSimpleValue();
						if (currentValue != null) {
							var error = "\tThe badge for the ";
							error = error.concat(idf);
							error = error.concat(" position has been assigned to the incorrect brand. Please use the Reset button to correct this before saving.");
							throw error;
						}
					}
				}
				if(brandValue == null) {
			//}
			//else {
				var error = "\tThe badge for the ";
				error = error.concat(idf);
				error = error.concat(" position has been not been assigned. Please use the Reset button to correct this before saving.");
				throw error;
				}
				if( brandValue =="All Dynamic" || brandValue =="All Static") {
					//log.info(idf)
					var error = "\tThe badge for the ";
					error = error.concat(idf);
					error = error.concat(" position cannot be ").concat(brandValue).concat(",Please use the Reset button to correct this before saving.");
					throw error;
					
				}

		}
	}
});


EventProcessor.republish(node);
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Marketing_Flag_Brand_Validation"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "PPHTagInheritAction"
  } ],
  "pluginType" : "Operation"
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation3 = function (node,stepManager,portal) {
//getting old data entries of the entity from the approved workspace
if (stepManager.getCurrentWorkspace().getID() == "Main")
{
var dataContainer = node.getDataContainerByTypeID('a_Old_ASLR_Entry_Data_Container').getDataContainers().toArray();
var oldCombination = {};
var oldCombinationArray=[];
if(dataContainer.length != 0){
	for(var n=0;n<dataContainer.length;n++){
		
		var dataContainerObject = dataContainer[n]. getDataContainerObject();
        	var shotType = dataContainerObject.getValue('a_Shot_Type').getSimpleValue();
        	var shotCode = dataContainerObject.getValue('a_Shot_Code').getSimpleValue();
        	var sitePlacement = dataContainerObject.getValue('a_ASLR_Site_Placement').getSimpleValue();	
        	oldCombination['shotCode'] = shotCode;
        	oldCombination['sitePlacement'] = sitePlacement;
        	oldCombination['shotType'] = shotType;
        	oldCombinationArray.push(oldCombination);
        	oldCombination={};
        	
	}
}
//end of code
//Checking number of ASLR Entries
var lov = stepManager.getListOfValuesHome().getListOfValuesByID('Shot_Site_Placements');
var list = lov.queryValidValues().asList(100);
var lovArray = list.toArray();
var lovLength;
var dataContainer;
if(lovArray != null){
	lovLength = lovArray.length;
	dataContainer = node.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
	if(dataContainer.length > lovLength){
		getOldCombination();
		throw "<< You can not add more entries than the available site placements >>";
	}
}

//Checking Unique ASLR Entry
var dataContainer = node.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
var combination = {};
var combinationArray=[];
for(var n=0;n<dataContainer.length;n++)
{    
        var dataContainerObject = dataContainer[n]. getDataContainerObject();
        var shotType = dataContainerObject.getValue('a_Shot_Type').getSimpleValue();
        var shotCode = dataContainerObject.getValue('a_Shot_Code').getSimpleValue();
        var sitePlacement = dataContainerObject.getValue('a_ASLR_Site_Placement').getSimpleValue();
        combination['shotCode'] = shotCode;
        combination['shotType'] = shotType;
        combination['sitePlacement'] = sitePlacement;
        logger.info(shotCode);
        if(shotCode == '' || shotType == '' || sitePlacement == '' || shotCode == null || shotType == null || sitePlacement == null){
        	dataContainer[n].deleteLocal();
        	portal.showAlert('ERROR', 'One of the fields of the ASLR Entry is empty. Please fill all the fields and try again.');       	
        	
        }
        
        if(combinationArray.length == 0 ){
        	combinationArray.push(combination);
        	combination = {};
        	continue;
      
        }
        else{
        	for(var k=0;k<combinationArray.length;k++){     
        		if(combinationArray[k]['shotCode'] == shotCode){
        			getOldCombination();
        			throw "<< Duplicate shot code not allowed >>";
        			
        		}
        		if(combinationArray[k]['sitePlacement']==sitePlacement){
        			getOldCombination();
        			throw "<< Duplicate Site Placement not allowed >>";
        			
        		}
        	}		
        	combinationArray.push(combination);
        	combination = {};
        	continue;
        }

        
}


// if the validation succeeds then remove the old data container values and copy the new data container to the old data container 
var dataContainer = node.getDataContainerByTypeID('a_Old_ASLR_Entry_Data_Container').getDataContainers().toArray();
for(var n=0;n<dataContainer.length;n++)
{
    dataContainer[n].deleteLocal();
}

for(var k=0;k<combinationArray.length;k++){

    var newShotCode = combinationArray[k]['shotCode'];		
    var newSitePlacement = combinationArray[k]['sitePlacement'];
    var newShotType = combinationArray[k]['shotType'];
    var dataContainerType = stepManager.getHome(com.stibo.core.domain.datacontainertype.DataContainerTypeHome).getDataContainerTypeByID('a_Old_ASLR_Entry_Data_Container');
    var dataContainer = node.getDataContainer(dataContainerType).addDataContainer();
    var newDataContainerObject = dataContainer.createDataContainerObject('');
    newDataContainerObject.getValue('a_Shot_Type').setSimpleValue(newShotType);
    newDataContainerObject.getValue('a_Shot_Code').setSimpleValue(newShotCode);
    newDataContainerObject.getValue('a_ASLR_Site_Placement').setSimpleValue(newSitePlacement);

}
}
else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning",  "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}


// copying the old data container value to the new data container if the validation fails
function getOldCombination(){
	var dataContainer = node.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
	for(var n=0;n<dataContainer.length;n++)
	{
		dataContainer[n].deleteLocal();
	}
	
	for(var k=0;k< oldCombinationArray.length;k++){
		
		var oldShotCode = oldCombinationArray[k]['shotCode'];		
		var oldSitePlacement = oldCombinationArray[k]['sitePlacement'];
		var oldShotType = oldCombinationArray[k]['shotType'];
		var dataContainerType = stepManager.getHome(com.stibo.core.domain.datacontainertype.DataContainerTypeHome).getDataContainerTypeByID('a_ASLR_Data_Container');
		var dataContainer = node.getDataContainer(dataContainerType).addDataContainer();
		var newDataContainerObject = dataContainer.createDataContainerObject('');
		newDataContainerObject.getValue('a_Shot_Type').setSimpleValue(oldShotType);
        	newDataContainerObject.getValue('a_Shot_Code').setSimpleValue(oldShotCode);
        	newDataContainerObject.getValue('a_ASLR_Site_Placement').setSimpleValue(oldSitePlacement);
		
	}
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_PPHInheritedValueChanges"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_pph_setmain_LastUpdated_date"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "Primary_Category_Path_Set"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "Marketing_Flag_Update_Outbound_Trigger"
  } ],
  "pluginType" : "Operation"
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
    "contract" : "AttributeGroupBindContract",
    "alias" : "ATG",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_badge_details",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation8 = function (node,manager,ATG) {
//br_validate_Badge_StartEndDates

var logArray = new Array();

//get the Brand Number for the node
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

//get badge IDs from attribute group
var badgeFlags = ATG.getDataContainerTypes().toArray();
var badgeFlagIDs = new Array();

badgeFlags.forEach(function (badge) {
	badgeFlagIDs.push(badge.getID());
});

// filter badge array based on currnet context
var currentContext = manager.getCurrentContext().getID();
const [currLang, currMkt] = currentContext.split("_");

var pattern = new RegExp(currMkt);

var flagsFiltered = new Array();

badgeFlagIDs.forEach(function (id) {
	if (pattern.test(id)) {
		flagsFiltered.push(id);
	}
}); 

//infinite loop protection
var loop = 0;

// filter out other markets
for (var x = 0; x <= flagsFiltered.length - 1; x++) {	
	if (!pattern.test(flagsFiltered[x])) {
		flagsFiltered.splice(x, 1);
		x--
	}	
	
	loop++
	if (loop > 100) {break;}
}

//for each badge ID left in array, get that badge's data from the node
flagsFiltered.forEach(function (idf) {
	log.info(idf);
	//get badge from node by ID
	var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers().toArray();
log.info(dataContainer.length);
	 if (dataContainer.length>0 && idf.indexOf("Badges")!= -1) {
		//get data container object so we can get the values
		var dataContainerObject = dataContainer[0].getDataContainerObject();

		if (dataContainerObject != null) {
			//ensure data container is not inherited
			if (dataContainerObject.getOwnerObject().getID() == node.getID()) {
				//get values from data container object
				var values = dataContainerObject.getValues().toArray();
				

				//get badge start and end date from data container object
				values.forEach(function (val) {
					var valID = val.getAttribute().getID();
					var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
					var ptrn = new RegExp("^a_badge_" + brandNum + "$");

					if (ptrn.test(valID)) {
						//date value found, check if null
						var badgeName = dataContainerObject.getValue(valID).getSimpleValue();
						var startDate = dataContainerObject.getValue("a_badge_start_date").getSimpleValue();
						var endDate = dataContainerObject.getValue("a_badge_end_date").getSimpleValue();
						//var badgeType = dataContainerObject.getValue("a_badge_type").getSimpleValue();

						/*if(badgeName != null && badgeType == null){
							logArray.push("\n<b>Missing a value for Badge Type</b>");
						}*/

						//logic to not allow Start Date>End Date

						if ( startDate > endDate) {

                                logArray.push("\n<b>\"Badge Start Date\" should not be greater than \"Badge End Date\" .</b>");
					}
						
					}
				});
			}
		}
	}
});

var type = node.getObjectType().getName();

if (logArray.length > 0) {
	if(type == "CC"){
		var error = "\tThe Badge update rejected for CC ";
				error = error.concat(node.getValue("a_CC_Number").getSimpleValue());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
	}
	else if(type == "Style"){
		var error = "\tThe Badge update rejected for Style ";
				error = error.concat(node.getValue("a_Style_Number").getSimpleValue());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
		
	}

	else if(type == "Division"){
		var error = "\tThe Badge update rejected for Division ";
				error = error.concat(node.getName());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
	}

	else if(type == "Department"){
		var error = "\tThe Badge update rejected for Department ";
				error = error.concat(node.getName());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
		
	}

	else if(type == "Class"){
		var error = "\tThe Badge update rejected for Class ";
				error = error.concat(node.getName());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
	}

	else if(type == "Sub Class"){
		var error = "\tThe Badge update rejected for SubClass ";
				error = error.concat(node.getName());
				error = error.concat(" due to the following reasons: ");
				error = error.concat(logArray);
				throw error;
		//return "<b>Badge update rejected for SubClass " + node.getName() + " due to the following reasons: </b>" + logArray; 
	}
}




}