/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Set_Name_SKU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set_Name_SKU",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  } ]
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
exports.operation0 = function (node,manager,helper) {
function othercontext(node,contextID)
{
	manager.executeInContext(contextID, function(otherManager) {
		// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
		// Set name directly from Size code
		var otherNode = otherManager.getObjectFromOtherManager(node);
		helper.setSKUNameFromSizeCode(otherNode, otherManager);
		}
		)
}

if(node.getObjectType().getID() == "SKU") {

	//PPIM-7242 as part of JP introduction we made this block as context agnostic 
	var contextListItr = manager.getListOfValuesHome().getListOfValuesByID("All_Contexts_LoV").queryValidValues().asList(10).iterator();
		while(contextListItr.hasNext()){
			var contextID=contextListItr.next().getID();
			othercontext(node,contextID);
		}
	}

function checkName(valstr){

	var tokens = valstr.split("-");
	var filterName = "";

	for(i=0;i<tokens.length;i++){
		var token = tokens[i]
		
		if(token!="null"){
			filterName+=token;
			if(i<tokens.length-1)
			filterName+="-";
		}
		
	}
	if(filterName=="")
	filterName ="("+ node.getID().toString()+")";
	return filterName;	
}
}