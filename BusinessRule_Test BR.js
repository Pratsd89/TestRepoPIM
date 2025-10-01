/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test BR",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Duplicate Style Group(2)",
  "description" : "Runs behind \"Save Duplicate Style Group\" button on the screen with ID “DuplicateStyleGroup_Details_Screen”",
  "scope" : "Global",
  "validObjectTypes" : [ "DuplicateStyleGroup" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MergeDuplicateStyles",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_mergeDuplicateStyles",
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
exports.operation0 = function (node,step,MergeDuplicateStyles,webUI) {

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var referencedStyles = node.getReferences(MergeDuplicateStyles).toArray();
if (referencedStyles.length < 2) {
	webUI.showAlert("ERROR",  "Please add at least 2 Styles to this DuplicateStyleGroup and mark one as the Primary Selling Style prior to saving");
}
else {
	var primaryCount = 0;
	var primaryStyle = null;

	for (var i = 0; i < referencedStyles.length; i++) {
		var currentStyle = referencedStyles[i].getTarget();
		var primaryRefValue = referencedStyles[i].getValue("a_Primary_Selling_Style").getSimpleValue();
		if (primaryRefValue == "Yes") {
			primaryCount = primaryCount + 1;
			primaryStyle = currentStyle;
		}
		else if (primaryRefValue == null) {
			referencedStyles[i].getValue("a_Primary_Selling_Style").setSimpleValue("No");
		}
	}
	if (primaryCount > 1) {
		// reset ref values
		for (var i = 0; i < referencedStyles.length; i++) {
			var currentStyle = referencedStyles[i].getTarget();
			var primaryRefValue = referencedStyles[i].getValue("a_Primary_Selling_Style").getSimpleValue();
			var primaryValue = currentStyle.getValue("a_Primary_Selling_Style").getSimpleValue();
			if (primaryRefValue != primaryValue) {
				referencedStyles[i].getValue("a_Primary_Selling_Style").setSimpleValue(primaryValue);
			}
		}
		webUI.showAlert("ERROR",  "There should be only one Style marked as Primary Selling Style for a DuplicateStyleGroup. Please fix prior to saving");
	}
	else if (primaryCount == 0) {
		// reset ref values
		for (var i = 0; i < referencedStyles.length; i++) {
			var currentStyle = referencedStyles[i].getTarget();
			var primaryRefValue = referencedStyles[i].getValue("a_Primary_Selling_Style").getSimpleValue();
			var primaryValue = currentStyle.getValue("a_Primary_Selling_Style").getSimpleValue();
			if (primaryRefValue != primaryValue) {
				referencedStyles[i].getValue("a_Primary_Selling_Style").setSimpleValue(primaryValue);
			}
		}
		webUI.showAlert("ERROR",  "You must mark one of the Styles as the Primary Selling Style for this DuplicateStyleGroup. Please fix prior to saving");
	}
	else {
		var primaryEndDate = primaryStyle.getValue("a_Style_End_Date").getSimpleValue();
		if (primaryEndDate != null) {
			primaryStyle.getValue("a_Style_End_Date").setSimpleValue(null);
			primaryStyle.getValue("a_Style_Deactivation_Reason").setSimpleValue(null);
			webUI.showAlert("ERROR",  "Primary Selling Style deactivation date has been removed as Primary Selling Styles cannot be ended");
		}

		var primaryID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
		var fixStyleValues = false;
		if (primaryID != primaryStyle.getID()) {
			var primaryNum = primaryStyle.getValue("a_Style_Number").getSimpleValue();
			var parentSubClass = primaryStyle.getValue("a_SubClass_Description").getSimpleValue();
			var newSupportingStyles = [];
			node.getValue("a_SubClass_Description").setSimpleValue(parentSubClass);
			node.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryNum);
			node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
			node.setName(primaryStyle.getName());
			fixStyleValues = true;
		}

		for (var i = 0; i < referencedStyles.length; i++) {
			var currentStyle = referencedStyles[i].getTarget();
			if (fixStyleValues == true && primaryStyle.getID() != currentStyle.getID()) {
				var supportingStyles = currentStyle.getValue("a_Supporting_Styles").getSimpleValue();
				if (supportingStyles != null) {
					currentStyle.getValue("a_Supporting_Styles").setSimpleValue(null);
				}

				newSupportingStyles.push(currentStyle.getID());
				currentStyle.getValue("a_Primary_Selling_Style").setSimpleValue("No");
				currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryNum);
				currentStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
				currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			}
			else {
				currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			}
		}

		if (fixStyleValues == true) {
			primaryStyle.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
			primaryStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryNum);
			primaryStyle.getValue("a_Primary_Selling_Style_ID").setSimpleValue(primaryStyle.getID());
			primaryStyle.getValue("a_Supporting_Styles").setSimpleValue(newSupportingStyles.join("<multisep/>"));
			primaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		}
	}
}

}