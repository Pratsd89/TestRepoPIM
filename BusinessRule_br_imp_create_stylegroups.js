/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_imp_create_stylegroups",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Import Template to Create Style Groups",
  "description" : "PPIM-10973",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "brdsg",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_imp_create_dsg",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "brssg",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_imp_create_ssg",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,brdsg,brssg) {
var styleGroupType = node.getValue("a_Style_Group_Type").getSimpleValue();
if (styleGroupType == "" || styleGroupType == null){
	 throw ("<b style='color:red;'>Style Group can't be blank.</b>");
}
else if ( styleGroupType.equals("Duplicate Style Group")){
	brdsg.execute(node);
}
else if ( styleGroupType.equals("Similar Style Group")){
	brssg.execute(node);
}

}