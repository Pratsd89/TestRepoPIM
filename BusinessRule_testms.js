/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testms",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Short Request Alert",
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
    "alias" : "shotNode",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (shotNode,step,logger,web) {
var selection = web.getSelection().iterator();
while (selection.hasNext()){
	var node = selection.next();
	var sitePlacementValue = node.getValue("a_Site_Placement").getSimpleValue();
	var sharedMarketValue = node.getValue("a_Shared_Markets").getSimpleValue();
	var shotId = node.getID();
	var message = "Please click on Proceed for approval to approve selected items";
	if(!sitePlacementValue){
		message = "The shot request with ID "+shotId+" was not approved. Please add Site Placement value."
	}

	var currshotStatus = node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
	if(currshotStatus && currshotStatus.equals("Complete")){
		message = "The shot request with ID "+shotId+" is already approved.";
	}
	var sReferencingCCs = new java.util.ArrayList();
	sReferencingCCs.addAll(node.getReferencedByProducts());
	for (var i = 0; i < sReferencingCCs.size(); i++) {
		var refCC = sReferencingCCs.get(i);
		var oStyleCC = refCC.getSource();
		var sReferenceType = step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef");
		var sCCToShotReqRefs = oStyleCC.getReferences(sReferenceType);
		if (!sCCToShotReqRefs.isEmpty()) {
			for (var j = 0; j< sCCToShotReqRefs.size(); j++) {
				var ccShot = sCCToShotReqRefs.get(j).getTarget();
				var ccshotID = ccShot.getID();
				var status = ccShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
				if(status && ccshotID != shotId){
					if(status.equals("Complete")){
						var ccShotSP = ccShot.getValue("a_Site_Placement").getSimpleValue();
						var ccShotSM = ccShot.getValue("a_Shared_Markets").getSimpleValue();
						if(ccShotSP == sitePlacementValue && ccShotSM == sharedMarketValue){
							message = "The shot request with IDs "+ccshotID+" and "+ shotId +" have the same site placement value for this customer choice. Click on Proceed for approval to approve both shot requests with duplicate site replacement. Click Cancel if you would like to change the site placement values and re-approve.";		
						}
						
					}
					else {
						ccShotSP = ccShot.getValue("a_Site_Placement").getSimpleValue();
						ccShotSM = ccShot.getValue("a_Shared_Markets").getSimpleValue();
						if(ccShotSP == sitePlacementValue && ccShotSM == sharedMarketValue){
							message = "The shot request with IDs "+ccshotID+" and "+ shotId +" have the same site placement value for this customer choice. Click on Proceed for approval to approve both shot requests with duplicate site replacement. Click Cancel if you would like to change the site placement values and re-approve.";								
						}
					}
				}
			}
		}
		web.showAlert("WARNING", message);
	}
}
}