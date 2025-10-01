/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_updateChildAttributeFromParent_Style",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Update Child Attributes From Parent Style",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
function checkAttributeObjectValidity(node, attribute) {
    var validityFlag = false;
    var validObjectTypes = attribute.getValidForObjectTypes().toArray();
    for (var j = 0; j < validObjectTypes.length; j++) {
        if (validObjectTypes[j].getID() == node.getObjectType().getID()) {
            validityFlag = true;
            break;
        }
    }
    return validityFlag;
}


/*PPIM-11012 - This BR works only for Style based on the latest requirement(7th Sept 2023) in below confluence :
             - https://gapinc.atlassian.net/wiki/spaces/PPIM/pages/1277366812/Functionality+of+Backorderable+ReturnLocationType+and+Start+End+Date+for+Style+and+CC 
             - This BR works only for Return Location Type Attribute if modified at Style level.
*/

var today = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var objectType = node.getObjectType().getID();
var childPublishAttributesGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID('ag_ChildPublishAttributes');
var childPublishAttributesList = childPublishAttributesGroup.getAttributes().toArray();

if (objectType == "Style") {
    for (var i = 0; i < childPublishAttributesList.length; i++) {
        try {
            //Check Attribute Validity with current node
            if (checkAttributeObjectValidity(node, childPublishAttributesList[i])) {

                var childPublishAttribute = childPublishAttributesList[i].getID();
                var oldChildPublishAttribute = 'a_Old_' + childPublishAttribute.substring(2)

                var updatedAttributeValue = node.getValue(childPublishAttribute).getSimpleValue();
                log.info(updatedAttributeValue + " ");
                var oldAttributeValue = node.getValue(oldChildPublishAttribute).getSimpleValue();

                if (oldAttributeValue != updatedAttributeValue) {
                    var CCList = node.getChildren();
                    for (var j = 0; j < CCList.size(); j++) {
                        var CC = CCList.get(j);
                        // If CC ReturnLocation Type is inherited from Parent, then Publish all CCs and SKUs
                        if (CC.getValue(childPublishAttribute).isInherited() || (updatedAttributeValue == null || updatedAttributeValue == "")) {

                            //publish all CCs
                            CC.getValue("a_main_last_modified_date").setSimpleValue(iso.format(today));

                            //publish all SKUs
                            var childSKUList = CC.getChildren();
                            for (var k = 0; k < childSKUList.size(); k++) {
                                var SKU = childSKUList.get(k);
                                SKU.getValue("a_main_last_modified_date").setSimpleValue(iso.format(today));
                            }
                        }
                    }

                    node.getValue(oldChildPublishAttribute).setSimpleValue(updatedAttributeValue);

                }
            }
        } catch (e) {
            log.info('Error occurred in BR: br_updateChildAttributeFromParent_Style : ' + e)
        }
    }
}
}