/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CheckBadgingInheritance",
  "type" : "BusinessAction",
  "setupGroups" : [ "Badges" ],
  "name" : "br_CheckBadgingInheritance",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,badgingGroup,manager) {
var logArray = new Array();
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var badgingFlags = badgingGroup.getDataContainerTypes().toArray();
var badgingFlagIDs = new Array();
badgingFlags.forEach(function(flag) {
    badgingFlagIDs.push(flag.getID());
});
var currentContext = manager.getCurrentContext().getID();
const [currLang, currMkt] = currentContext.split("_");
var pattern = new RegExp(currMkt);
var loop = 0;
/*for (var x = 0; x <= badgingFlagIDs.length - 1; x++) {
    if (!pattern.test(badgingFlagIDs[x])) {
        badgingFlagIDs.splice(x, 1);
        x--
    }
    loop++
    if (loop > 100) {
        break;
    }
}*/


for (var x = badgingFlagIDs.length - 1; x >= 0; x--) {
    if (!pattern.test(badgingFlagIDs[x])) {
        badgingFlagIDs.splice(x, 1);
    }
    
}




log.info("badgingFlagIDs" + badgingFlagIDs);
badgingFlagIDs.forEach(function(idf) {
    //log.info(idf);
    var nodeDCKey;
    var ParentDCKey;
    var dataContainer = node.getDataContainerByTypeID(idf).getDataContainers().toArray();
    log.info("dataContainer.length: " + dataContainer.length);
    if (dataContainer.length == 1 && idf.indexOf("Badges") != -1) {
        var dataContainerObject = dataContainer[0].getDataContainerObject();
        if (dataContainerObject != null) {
            var nodeDCKey = getDCKey(dataContainerObject);
            log.info("nodeDCKey=" + nodeDCKey);
            var Parent = node.getParent();
            var ParentdataContainer = Parent.getDataContainerByTypeID(idf).getDataContainers().toArray();
            if (ParentdataContainer.length > 0) {
                var ParentdataContainerObject = ParentdataContainer[0].getDataContainerObject();
                if (ParentdataContainerObject != null) {
                    var ParentDCKey = getDCKey(ParentdataContainerObject);
                    log.info("ParentDCKey=" + ParentDCKey);
                }
            }

            if (nodeDCKey == ParentDCKey) {
            	log.info("nodeDCKey == ParentDCKey, continer will be deleted in next step");
                dataContainer[0].deleteLocal();
               
            }
        }
    } else if (dataContainer.length > 1) {
    	
        log.info("idf value: " + idf);
        var DC_ID = new Array();
        var latestDC_ID;
        var OldDC_ID;
        var LatestDCObject;
        var OldDCObject;
        var LatestDCValueTobeDeleted = true;
        for (var i in dataContainer) {
            var dataContainerObject = dataContainer[i].getDataContainerObject();
            if (dataContainerObject != null) {
                log.info(dataContainerObject.getID());
                DC_ID.push(dataContainerObject.getID());
            }

        }
        var latestDC_ID = largestElement(DC_ID);
        log.info("latestDC_ID -" +latestDC_ID);
        
        var OldDC_ID = smallestElement(DC_ID);
         log.info("OldDC_ID -" +OldDC_ID);
     

        for (var i in dataContainer) {
            var dataContainerObject = dataContainer[i].getDataContainerObject();
            if (latestDC_ID == dataContainerObject.getID()) {
            	log.info("LatestDC_ID is equal to the DataConatinerObjectID");
                LatestDCObject = dataContainerObject;
                log.info("LatestDCObject" + LatestDCObject);
                var attr = ["a_badge_AT", "a_badge_BR", "a_badge_BRFS", "a_badge_GAP", "a_badge_GO", "a_badge_ON"];
                for (var j in attr) {
                    var value = LatestDCObject.getValue(attr[j]).getSimpleValue();
                    log.info("Value is " + value);
                    if (value != null) {
                    	log.info("Value is not equal to Null-   "+ value);
                    	LatestDCValueTobeDeleted = false;
                        break;
                    }
                }

            }
            
            if (OldDC_ID == dataContainerObject.getID()) {
            	log.info("OldDCID is equal to the DataConatinerObjectID");
                OldDCObject = dataContainerObject;
                log.info("OldDCObject" + OldDCObject);
            }
        }

        if (LatestDCValueTobeDeleted == true) {
        	log.info("LatestDCValueTobeDeleted == true has been executed");
            deleteAllDC(dataContainer);
        } else {
        	log.info("latest DC Valueto be deleted is false");
            copyNewtoOldDC(OldDCObject, LatestDCObject);
            if (dataContainer.length > 1) {
                for (var i in dataContainer) {
                    var dataContainerObject = dataContainer[i].getDataContainerObject();
                    if (latestDC_ID == dataContainerObject.getID()) {
                        dataContainer[i].deleteLocal();
                       
                    }
                }
            }
        }
        
    }
});



/*function largestElement(arr) {
    return arr.reduce((largest, current) =>
        (current > largest ? current : largest), arr[0]);
}

function SmallestElement(arr) {
    return arr.reduce((Smallest, current) =>
        (current < Smallest ? current : Smallest), arr[0]);
}*/

function largestElement(arr) {
    if (arr.length === 0) return undefined; // Handle empty array case
    return arr.reduce((largest, current) => 
        (current > largest ? current : largest), arr[0]);
}

function smallestElement(arr) {
    if (arr.length === 0) return undefined; // Handle empty array case
    return arr.reduce((smallest, current) => 
        (current < smallest ? current : smallest), arr[0]);
}


function getDCKey(dataContainerObject) {
    var DCkey;
    //var a_badge_type = dataContainerObject.getValue("a_badge_type").getSimpleValue();
    var a_badge_start_date = dataContainerObject.getValue("a_badge_start_date").getSimpleValue();
    var a_badge_AT = dataContainerObject.getValue("a_badge_AT").getSimpleValue();
    var a_badge_BRFS = dataContainerObject.getValue("a_badge_BRFS").getSimpleValue();
    var a_badge_end_date = dataContainerObject.getValue("a_badge_end_date").getSimpleValue();
    var a_badge_GO = dataContainerObject.getValue("a_badge_GO").getSimpleValue();
    var a_badge_GAP = dataContainerObject.getValue("a_badge_GAP").getSimpleValue();
    //var a_badge_position = dataContainerObject.getValue("a_badge_position").getSimpleValue();
    var a_badge_BR = dataContainerObject.getValue("a_badge_BR").getSimpleValue();
    var a_badge_ON = dataContainerObject.getValue("a_badge_ON").getSimpleValue();

    var DCkey =  a_badge_start_date + "_" + a_badge_AT + "_" + a_badge_BRFS + "_" + a_badge_end_date + "_" + a_badge_GO + "_" + a_badge_GAP + "_" + a_badge_BR + "_" + a_badge_ON;
    log.info("DCkey - " +DCkey); 
    return DCkey;
}

function copyNewtoOldDC(OldDCObject, LatestDCObject) {
    log.info("Badges:copyNewtoOldDC: OldDCObject-"+OldDCObject+"LatestDCObject- "+ LatestDCObject);
    var attr = ["a_badge_start_date", "a_badge_AT", "a_badge_BRFS", "a_badge_GO", "a_badge_end_date", "a_badge_GAP", "a_badge_BR", "a_badge_ON"];
    for (var i in attr) {
        var value = LatestDCObject.getValue(attr[i]).getSimpleValue();
        log.info("Badges:copyNewtoOldDC: value" + value);
        if (value != null) {
        	log.info("Badges:copyNewtoOldDC: value is not equal" + value);
            OldDCObject.getValue(attr[i]).setSimpleValue(value);
        }
    }
}

function deleteAllDC(dataContainer) {
	 log.info("Badges: deleteAllDC" + dataContainer);
    for (var i in dataContainer) {
        var dataContainerObject = dataContainer[i].getDataContainerObject();
        dataContainer[i].deleteLocal();
    }
}


}