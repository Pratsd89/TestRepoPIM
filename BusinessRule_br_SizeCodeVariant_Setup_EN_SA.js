/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SizeCodeVariant_Setup_EN_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Size Code Variant Copy from US to SA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeCode" ],
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


var a_SizeCodeVariant;

manager.executeInContext("EN_US", function(currentContextManager) {
    var EN_US_Node = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
    a_SizeCodeVariant = EN_US_Node.getValue("a_SizeCodeVariant").getSimpleValue();
    	//log.info("a_Search_Color=" + a_Search_Color);
    //log.info("Newname=" + Newname);
    log.info(a_SizeCodeVariant);
    setValue(node, a_SizeCodeVariant);
});


function setValue(node, a_SizeCodeVariant) {
    manager.executeInContext("EN_SA", function(currentContextManager) {
        var EN_SA_Node = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
        	//log.info("a_Search_Color=" + a_Search_Color);
        	//log.info("Newname=" + Newname);
        EN_SA_Node.getValue("a_SizeCodeVariant").setSimpleValue(a_SizeCodeVariant);
        var status = EN_SA_Node.getApprovalStatus();
        if((status == "Partly approved")||(status == "Completely Approved")){
        EN_SA_Node.approve();
}
    });
}
}