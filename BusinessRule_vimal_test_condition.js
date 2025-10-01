/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "vimal_test_condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "vimal_test_condition",
  "description" : "Test rule ",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,manager,compCheck) {
/* there must be shot request referenced to the CC, 
 *  where the shot request attribute: a_Site_Placement = 5 and 
 *  has a_shot_request_lifecycle_status IValue = to Complete (P01 shot 
 *  in Complete status)
*/

// CC Copy workflow. check photoshot request associated with CC object
function checkPhotoStatus(node, contextID) {
	var result = "";
	manager.executeInContext(contextID, function(otherManager) {
		// CC Copy workflow. check photoshot request associated with CC object
		var otherNode = otherManager.getObjectFromOtherManager(node);
		var conditionStatus = false;
		
		var shots = otherNode.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef"));
		
		for (i = 0; i < shots.size(); i++) {
		  	var photoShot = shots.get(i).getTarget();
		     logger.info(photoShot.getID());
		     // first check placement value
		     var placementValue = photoShot.getValue('a_Site_Placement').getLOVValue().getID();
		     logger.info("placement = " + placementValue);
		  	if(placementValue == 5) {
		  		// check lifecycle status
		  		logger.info("status = " + photoShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue());
				if(photoShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue() == "Complete") {
					conditionStatus = true;
				}
		  	}
		     	
		}
		
		if(!conditionStatus) {
			result = "Shot requests for CC are not complete in " + contextID + " Context. \n";
		}
	});
	 
	 return result;
}
 
// first grab shared markets to see which contexts to run this in
var sharedMarkets = node.getValue("a_Market_Designation").getSimpleValue();
var message = "";

if (sharedMarkets == null || sharedMarkets == "") {
	return "Please enter valid Market Designation value for CC.";
}
// if shared market has US, run US context only because CA data can come later.
if(!(sharedMarkets.indexOf("US") < 0)) {
	 message += checkPhotoStatus(node, "EN_US");
} 

if(!(sharedMarkets.indexOf("CAN") < 0)) {
	message += checkPhotoStatus(node, "EN_CA");
}


if(message.length > 0) {
	return message;
}

//logger.info("photo status complete");
/* Run following validations 
 
	1. Primary image: assets with content type ID '216' and '12'  both associated with primary shot request
	2. Asset Crops: at least one asset whose content type ID is neither '216' nor '12' in the shot request
	3. CC name for contexts matching a_Market_Designation > Error: "Missing CC Name"
	4. Search color for contexts for all contexts matching a_Market_Designation > "Missing Search Color"
	5. All child skus have a value for a_Size_Dim1_Description > "Missing Sku Size Description"
 */ 
var imageCheck  = compCheck.checkCCAssetCompleteness(node, manager);
var nameColorCheck = compCheck.checkCCNameAndColor(node, manager);
var skuCheck = compCheck.checkSKUDimensionForCC(node);

if (imageCheck != true) {
	//logger.info("imageCheck = " + imageCheck);
	return imageCheck;
}


if (nameColorCheck != true) {
	//logger.info("nameColorCheck = " + nameColorCheck);
	return nameColorCheck;
}

if (skuCheck != true) {
	//logger.info("skuCheck = " + skuCheck);
	return skuCheck;
}

// if all conditions passed, return true
return true;


/*
 
// CC Copy workflow. check photoshot request associated with CC object

var result = false;
var sitePlacement5 = false;
var lifeCycleStatus = false;

var refs = node.getReferencedBy();
var refIterator = refs.iterator();

while(refIterator.hasNext()){
    var ref = refIterator.next();
    if(ref.getReferenceTypeString() == 'ShotRequestToStylingPieceCCRef') {
	    	var photoShot =  ref.getSource();
	     logger.info(photoShot.getID());
	     // first check placement value
	     var placementValues = photoShot.getValue("a_Site_Placement").getValues();
	     if(placementValues != null) {
	     	var placementIterator = placementValues.iterator();
	     	while(placementIterator.hasNext()) {
	     		if(placementIterator.next().getLOVValue().getID() == 5) {
	     			sitePlacement5 = true;
	   				break;
	     		}	
	     	}
	     }
		// check lifecycle status
		if(photoShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue() == "Submitted") {
			lifeCycleStatus = true;
		}
    }
}

if(sitePlacement5 && lifeCycleStatus) 
	return true;
else 
	return false;

*/
}