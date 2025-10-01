/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Dim1_CopyName_US_TO_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Copy Name of Dim1 US to SA",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Dim1", "Dim2" ],
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


var Newname;


manager.executeInContext("EN_US", function(currentContextManager) {
    var EN_US_Node = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
    
    Newname = EN_US_Node.getName();
    log.info("Newname=" + Newname);
    setValue(node, Newname);
});


function setValue(node, Newname) {
    manager.executeInContext("EN_SA", function(currentContextManager) {
        var EN_SA_Node = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
        	
        EN_SA_Node.setName(Newname);
        var status = EN_SA_Node.getApprovalStatus();
        if((status == "Partly approved")||(status == "Completely Approved")){
        EN_SA_Node.approve();
}
    });
}
}