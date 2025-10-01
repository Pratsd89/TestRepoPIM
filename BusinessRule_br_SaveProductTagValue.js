/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SaveProductTagValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Product Tag",
  "description" : "Saves Product Tag Value updates and LOV associated to it.",
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Tag_Value" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,webUI) {
//Fetching from main
var setptName = false;
var classID = node.getID().substring(node.getID().lastIndexOf("-") + 1);
var tagType = node.getParent();
var lovID = tagType.getID().substring(tagType.getID().lastIndexOf("PTT-") + 4);
var newPrdTag = node.getValue("a_Product_Tag").getSimpleValue();
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
if(newPrdTag == null){
	webUI.showAlert("ERROR", null, "Product Tag was not created. Please ensure that values for required attribute have been filled : Product Tag Name");
}
//Fetch PT  from node to fetch all PTs Check if modified PT already exists
var parentPT = node.getParent();
var allChildPTs = parentPT.getChildren().toArray();
var isUniqueName = true
allChildPTs.forEach(function(ptv) {
    var existingName = ptv.getName();
    var existingId = ptv.getID()
    if (existingName != null) {
    	   //verify for all names in the Brand WPT exclude the current object check
        if (existingId != classID && existingName.trim().toUpperCase() == newPrdTag.trim().toUpperCase()) {
            isUniqueName = false
        }
    }
})
// If PT name is unique then run the existing logic, else pop error message in UI
var fetchLov = manager.getListOfValuesHome().getListOfValuesByID(lovID);
if (isUniqueName) {
    //Fetching Values from Approved Workspace comparing and set name and description to add value to LOV
        var approvedCheck = manager.executeInWorkspace("Approved", function(approvedManager) {
        var appptName = approvedManager.getObjectFromOtherManager(node).getValue("a_Product_Tag").getSimpleValue();
        if (newPrdTag != appptName) {
            setptName = true;
            var lovValue = fetchLov.getListOfValuesValueByID(classID).getValue();
            fetchLov.getListOfValuesValueByID(classID).setValue(newPrdTag, null);
        }
    });

    if (setptName) {
        node.setName(newPrdTag);
    }
    if (setptName == true) {
        node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        node.approve();
        var productTagRoot=manager.getClassificationHome().getClassificationByID("Product_Tags_Root");
        productTagRoot.getValue("Tag_Outbound_Variable").setSimpleValue(fetchLov.getID());
        webUI.showAlert("SUCCESS", null, "Product Tag is updated successfully");	
    }
} 
else {
	webUI.showAlert("ERROR", null, "Product Tag is case-insensitive. Found <b>" + newPrdTag + "</b> already present. Please Retry Save with Unique Description.");
}


}