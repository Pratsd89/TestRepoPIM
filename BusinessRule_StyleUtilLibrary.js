/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleUtilLibrary",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Style Util Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "completenessLib"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
//Used on the Final Validation Step on the Creation Workflow
function checkAttributesAndName(node, stepManager, context) {
	var status = stepManager.executeInContext(context, function (enContextManager) {

		var enCurrentProduct = enContextManager.getProductHome().getProductByID(node.getID());
		var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_Style_Copy_Attributes');
		var attributeList = attributeGroup.getAttributes().toArray();
		var attributeExistFlag = false;
		var bullet1 = enCurrentProduct.getValue("a_Overview_Bullet1").getSimpleValue();
		
		for (var i = 0; i < attributeList.length; i++) {
			if (enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() != null && enCurrentProduct.getValue(attributeList[i].getID()).getSimpleValue() != '') {
				attributeExistFlag = true;
				break;
			}
		}
		if (attributeExistFlag == false) {
			return "Please fill atleast one Copy Attribute in " + context + " Context.";
		}

		if (enCurrentProduct.getName() == '' || enCurrentProduct.getName() == null) {
			return "Please enter STEP Name for the Style in " + context + " Context.";
		}

		if (bullet1 == '' || bullet1 == null) {
			return "Please enter a value for a_Overview_Bullet1 in " + context + " Context.";
		}

		return true;
	});
	
	return status;
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.checkAttributesAndName = checkAttributesAndName