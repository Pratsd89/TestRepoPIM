/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MVGSmartsheetAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_MVGSmartsheetAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "MultiVariantGroup" ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MultiVariant_Group_Reference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,MultiVariant_Group_Reference) {
var ParentID = null;
var Parent = null;
var StyleList = node.queryReferences(MultiVariant_Group_Reference).asList(1000).toArray();
for (var k in StyleList) {
	var Style = StyleList[k].getTarget();
    var Brand = Style.getValue("a_Brand_Number").getSimpleValue();
    var Division = Style.getValue("a_Division_Number").getSimpleValue();
    ParentID = Brand + "_" + Division + "_MultiVariantGroups"  
     
}
var Parent = manager.getProductHome().getProductByID(ParentID);
log.info(Parent);
if(Parent != null){
	node.setParent(Parent);
}



}