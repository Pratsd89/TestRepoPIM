/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_oneTimeStageBulkUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "br_oneTimeStageBulkUpdate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
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
    "alias" : "create",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,create) {

    var primaryStyleNumber = '';
    var dsgUpdateRefs = node.getReferences(create).toArray();
    var groupPrimaryStyleID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
    var groupPrimaryStyleObject = manager.getProductHome().getProductByID(groupPrimaryStyleID);
    if (groupPrimaryStyleObject != null) {
        primaryStyleNumber = groupPrimaryStyleObject.getValue("a_Style_Number").getSimpleValue();
    }
    for (var i in dsgUpdateRefs) {
        var currentStyle = dsgUpdateRefs[i].getTarget();
        log.info("Current Style is " + currentStyle);
        currentStyle.getValue("a_Product_Grouping_Start_date").setSimpleValue(node.getValue("a_Product_Grouping_Start_date").getSimpleValue());
        currentStyle.getValue("a_Product_Grouping_End_Date").setSimpleValue(node.getValue("a_Product_Grouping_End_Date").getSimpleValue());
        currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
        //currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }
 

}