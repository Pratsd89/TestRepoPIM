/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DoNotPublish",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Do Not Publish",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,LKT) {
//Get Object Type
var objType = node.getObjectType().getID();

//If current node object type is Style, set MktDsg array with Style Market Designations
if (objType == "Style") {
	var MktDsg = node
		.getValue("a_Style_Market_Designation")
		.getValues()
		.toArray();
}
//If current node object type is CC or SKU, set MktDsg array with CC/SKU Market Designations
if (objType == "CustomerChoice" || objType == "SKU") {
	var MktDsg = node
		.getValue("a_Market_Designation")
		.getValues()
		.toArray();
}

var Contexts = new Array();

//Get Context ID for each market from lookup table
MktDsg.forEach(function (Mkt) {
	Contexts.push(
		LKT.getLookupTableValue(
			"LKT_MarketDesignationToMarket",
			Mkt.getSimpleValue()
		)
	);
});

//For each context, set Do Not Publish == Yes, if Lifecycle Status == Purged
Contexts.forEach(function (Ctxt) {
	manager.executeInContext(Ctxt, function (tManager) {
		var tNode = tManager.getProductHome().getProductByID(node.getID());
		var tObjType = tNode.getObjectType();

		if (tObjType = "Style") {
			if (tNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "Purged")
				tNode.getValue("do_not_publish").setSimpleValue("Yes");
		}
		if (tObjType = "CustomerChoice") {
			if (tNode.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Purged")
				tNode.getValue("do_not_publish").setSimpleValue("Yes");
		}
		if (tObjType = "SKU") {
			if (tNode.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == "Purged")
				tNode.getValue("do_not_publish").setSimpleValue("Yes");
		}
	});
});
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMaintLastUpdateDate"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "AttributeComparatorCondition",
  "parameters" : [ {
    "id" : "Attribute1",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "do_not_publish"
  }, {
    "id" : "Attribute2",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : null
  }, {
    "id" : "Constant",
    "type" : "java.lang.String",
    "value" : "Yes"
  }, {
    "id" : "Operator",
    "type" : "java.lang.String",
    "value" : "<>"
  } ],
  "pluginType" : "Precondition"
}
*/
