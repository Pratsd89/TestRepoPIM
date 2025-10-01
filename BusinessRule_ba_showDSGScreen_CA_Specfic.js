/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_showDSGScreen_CA_Specfic",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "ba_showDSGScreen_CA_Specfic",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_ProductGroups",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,rt_ProductGroups) {
var context = manager.getCurrentContext().getID();
var count = 0;
if (context == "EN_CA" || context == "FR_CA") {
/*var References;
var ObjectType = node.getObjectType().getID();
if (context == "EN_CA" || context == "FR_CA") {
	
    manager.executeInContext(context, function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        if (ObjectType == "DuplicateStyleGroup") {
        References = getReferences(currentContextNode, rt_mergeDuplicateStyles);
        }
        if (ObjectType == "SimilarStyleGroup") {
        	 References = getReferences(currentContextNode, rt_styles);
        }
    });
    if (References.length > 0) {
        return true;
    }
}  
 return false;




function getReferences(node, RefType) {
    var References = node.getReferences(RefType).toArray();
    return References;
}*/
manager.executeInContext(context, function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        var Market = currentContextNode.getValue("a_SuperPDP_Market").getSimpleValue();
        if(Market!= null){
        if(Market.indexOf("multisep")!= -1){
        	    count = 1;	
        }
        }
    });
}
if(count == 1){
	return true;
}
else return false;
}