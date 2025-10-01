/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CAcolorPalette",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_CAcolorPalette",
  "description" : null,
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var context = step.getCurrentContext().getID();
if(context != "EN_US"){
	return;
}

var ColorPalette = node.getValue('a_Search_Color').getSimpleValue();
var name = node.getName();


 var setColorPaletteCA = step.executeInContext("EN_CA", function(manager) {
 	
//	log.info(manager.getCurrentContext().getID()); // EN_CA

	var obj = manager.getClassificationHome().getClassificationByID(node.getID());
	
//	log.info(obj.getValue('a_Search_Color').getSimpleValue()); // null
//	log.info(obj.getName());
	
 	obj.getValue('a_Search_Color').setSimpleValue(ColorPalette);
 	obj.setName(name);

//     log.info(obj.getName());
 	

// 	log.info(obj.getValue('a_Search_Color').getSimpleValue()); // correct value
 });
}