/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Copying_Image_From_CC_To_Style",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Copying Image Ref From CC To Style Conditon",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "PrimaryProductImage",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,PrimaryProductImage) {
var style = stepManager.getProductHome().getProductByID(node.getID());
var CCList = style.getChildren();
var CCArray = [];
var sortOrderArray = [];

//PPIM-10685 - Handling Error message
var isCCSortOrderPresent = false;
var isCCActiveOrStatusPresent = false;
var ccWaitingForStyleApproval = false;
var ccMarketDesignationMatching =false;

for (var i = 0; i < CCList.size(); i++) {
    var sortOrder = CCList.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
    if (sortOrder != null) {
        if (CCList.get(i).getValue('a_Market_Designation').getSimpleValue().indexOf("US") >= 0) {
            var today = new Date().toISOString().substring(0, 10);
            var CCEndDate = CCList.get(i).getValue('a_CC_End_Date').getSimpleValue();
            if (CCList.get(i).getValue('a_CC_Life_Cycle_Status').getSimpleValue() != null && (CCEndDate > today || CCEndDate == null)) {
                var ccLifeCycleStatus = CCList.get(i).getValue('a_CC_Life_Cycle_Status').getLOVValue().getID();
                if (ccLifeCycleStatus.toUpperCase() == "WAITING_FOR_STYLE_APPROVAL") {
                    CCArray.push(CCList.get(i).getID());
                    sortOrderArray.push(sortOrder);
                    ccWaitingForStyleApproval = true
                }
                isCCActiveOrStatusPresent = true
            }
            ccMarketDesignationMatching = true
        }
        isCCSortOrderPresent = true
    }
}
if(sortOrderArray.length != 0){
	var minIndexOfSort = indexOfMax(sortOrderArray);	
	var requiredCCId = CCArray[minIndexOfSort];
	var CC = stepManager.getProductHome().getProductByID(requiredCCId);
	var references = CC.getReferences().asList();
	var referenceExistFlag = false;
	for(var k=0;k<references.size();k++){
		
		var referenceTypeID=references.get(k).getReferenceType().getID();
		if(referenceTypeID == 'PrimaryProductImage'){
			var referenceExistFlag =true;
			var referenceType=references.get(k).getReferenceType();
			var target = references.get(k).getTarget();
			var stylePrimaryReferences = node.getReferences(PrimaryProductImage).toArray();
			if(stylePrimaryReferences.length !=0){
				stylePrimaryReferences[0].delete();
			}
			node.createReference(target,referenceType);
			break;
		}
		
	}
	if(referenceExistFlag == false){
		node.getValue('a_error_message').setSimpleValue('Missing P01 Photo');
		return "Missing P01 Photo";
	}
	else{
		return true;
	}
}
else{
	//PPIM-10685 - Handling Error message
	if(!isCCSortOrderPresent){
		node.getValue('a_error_message').setSimpleValue('There is no CC with CC Sort Order Value.');
		return 'There is no CC with CC Sort Order Value.';
	} else if(!ccMarketDesignationMatching){
		node.getValue('a_error_message').setSimpleValue('There is no CC with Valid Market Designation Value i.e., US in this case.');
		return 'There is no CC with Valid Market Designation Value i.e., US in this case.';
	} else if(!isCCActiveOrStatusPresent){
		node.getValue('a_error_message').setSimpleValue('There is no CC with a LifeCycleStatus. (or) All the CCs for this Style are end-dated.');
		return 'There is no CC with a LifeCycleStatus. (or) All the CCs for this Style are end-dated.';
	} else if(!ccWaitingForStyleApproval){
		node.getValue('a_error_message').setSimpleValue('There is no CC with status "Waiting for StyleApproval"');
		return 'There is no CC with status "Waiting for StyleApproval"';
	}
}


function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}
}