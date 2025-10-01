/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_pph_setmain_LastUpdated_date",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Main Last Update for PPH Changes",
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
if (stepManager.getCurrentWorkspace().getID() == "Main")
{
var obj = node.getObjectType().getID(); 
//log.info(obj);

if( obj == "SKU" )
{
	var Life_Cycle = node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
}
else if (obj == "Style"){
	var Life_Cycle = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	}
else if (obj == "CustomerChoice"){
	var Life_Cycle = node.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
	}
else
{
var time1 = new java.util.Date();
var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//logger.info(iso.format(time));
	if(node.getObjectType().getID() != 'Brand'){
		node.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1));
		log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
	}
}
	
//log.info(Life_Cycle);
if(Life_Cycle == "Draft" )
{
	//log.info("Life Cycle status is draft")
	}
	else
	{
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//logger.info(iso.format(time));
		if(node.getObjectType().getID() != 'Brand'){
			node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			//log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
		}
	}
		


//iso.format(time)
}
}