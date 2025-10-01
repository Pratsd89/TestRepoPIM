/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Save_Color_Pallete",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save_Color_Pallete",
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
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,portal) {
//Initiate Items in STEP workflow
if(manager.getCurrentWorkspace().getID()== "Main")
{
	var wf = manager.getWorkflowHome().getWorkflowByID("wf_ColorPalette");
	if(!node.getWorkflowInstanceByID("wf_ColorPalette"))
	{
		wf.start(node, "Started");
	}
}
else if (manager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,portal,stepManager,logger) {
logger.info("BR Save_Color_Pallete");
if(stepManager.getCurrentWorkspace().getID() == "Main")
{
var flag=0;
var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			//logger.info(iso.format(time));
var classColorPallete = node.getClassificationProductLinks();
if(classColorPallete){
            		var chIter11=classColorPallete.iterator();
            		if(chIter11)
            		{
            		while(chIter11.hasNext()){
            			flag=1;
            			var chprod11 = chIter11.next(); 
						var CC = chprod11.getProduct();
						var OverrideSearchColor = CC.getValue("a_Override_Search_Color").getSimpleValue();
						if(OverrideSearchColor == null)
						{
						logger.info("SKU ID PUBLISH: " + CC.getID());
						CC.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
						//log.info(CC.getValue("a_main_last_modified_date").getSimpleValue());
						}
						
            		}
            		}
  if(flag ==1)
  {
  	portal.showAlert("Success", "Saved Successfully,the referenced CC's are published");
  }
 else if(flag==0)
{
 portal.showAlert("ERROR", "No CC's attached, please attach CC"); 	
}

		   }

}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "Approve_Color_Pallete"
  } ],
  "pluginType" : "Operation"
}
*/
