/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_stage",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test_stage",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log) {
function getSimilarStyleGroup(style) {
    var ssg = null;
    var refBySSG = style.getReferencedBy().toArray();
    for (var i = 0; i < refBySSG.length; i++) {
        if (refBySSG[i].getReferenceType().getID() == "rt_styles") {
            ssg = refBySSG[i].getSource();
        }
    }
    return ssg;
}

var context = manager.getCurrentContext().getID();
var SSG = getSimilarStyleGroup(node); 
var superPDPMarket = null;
if (SSG == null){
	if(context == "EN_US"){
		superPDPMarket = "CAN";
	}
	else if (context == "EN_CA"){
		superPDPMarket = "US";
	}
	throw ("SSG is created in " + superPDPMarket + "only. This should not be deleted from " + context);
}else{
	//node.delete();
	log.info ("deleting node")
}



}