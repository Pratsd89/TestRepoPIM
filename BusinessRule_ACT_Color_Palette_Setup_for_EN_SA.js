/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ACT_Color_Palette_Setup_for_EN_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ACT_Color Palette Setup for EN SA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ColorPalette" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
//PPIM-11211 -- FSAL Color Palette Setup for EN SA

var Newname;
var a_Search_Color;

manager.executeInContext("EN_US", function(currentContextManager) {
    var EN_US_Node = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
    a_Search_Color = EN_US_Node.getValue("a_Search_Color").getSimpleValue();
    	//log.info("a_Search_Color=" + a_Search_Color);
    Newname = EN_US_Node.getName();
    //log.info("Newname=" + Newname);
    setValue(node, a_Search_Color, Newname);
});


function setValue(node, a_Search_Color, Newname) {
    manager.executeInContext("EN_SA", function(currentContextManager) {
        var EN_SA_Node = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
        	//log.info("a_Search_Color=" + a_Search_Color);
        	//log.info("Newname=" + Newname);
        EN_SA_Node.getValue("a_Search_Color").setSimpleValue(a_Search_Color);
        EN_SA_Node.setName(Newname);
        var status = EN_SA_Node.getApprovalStatus();
        if((status == "Partly approved")||(status == "Completely Approved")){
        EN_SA_Node.approve();
}
    });
}
}