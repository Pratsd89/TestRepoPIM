/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "cc",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "IsCategoryReferencingCC_JP(2)",
  "description" : "Business Condition to check for Flag visibility",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "WebCategoryToBadgeRef",
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
exports.operation0 = function (node,step,ref,portal) {
//var currentContext = manager.getCurrentContext().getID();
//var obj = node.getValue("a_WebCategory_Product_Type").getSimpleValue();
//if(currentContext == "EN_JP" || currentContext == "JA_JP")
//{
//	if(obj == "CC")
//	{
//		return true;
//	}
//	else
//	{
//		return false;
//	}
//}
//else
//{
//	return false;
//}

objectType = node.getObjectType().getID();
var category;
if (objectType == "Badge") {
    category = node.queryReferencedBy(ref).asList(10).get(0).getSource();
}
else {
    categoryid = node.getValue("a_Badge_Category").getSimpleValue();
    category = step.getClassificationHome().getClassificationByID(categoryid)
}
//
////deleteLink("EN_US", node)
////deleteLink("EN_CA", node)
//
//
portal.navigate("WebCategory_Details_Screen", category);
return true;
//node.delete();
//
//
//function deleteLink(context, node) {
//    step.executeInContext(context, function (manager) {
//        linkExists = false;
//        var context_badge = manager.getObjectFromOtherManager(node);
//        context_badge.queryReferencedBy(ref).forEach(function (refInstance) {
//            refInstance.delete()
//        });
//    });
//}

}