/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CopyStatusShotApprovalAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CopyStatusShotApprovalAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
    "alias" : "CCPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,log,CCPhotoShotRef,lookupTable) {
//PPIM-1897 - Entry to Approved State Part

//Context agnostic changes added as part of PPIM-7557 to integrate Japan Market
function copyStatusShotApprove(validContext) {
	step.executeInContext(validContext,function(contextManager) {
		log.info("Executing in Context "+validContext);
		var currentProduct = contextManager.getEntityHome().getEntityByID(node.getID());
		var sReferencingCCs = new java.util.ArrayList();
		sReferencingCCs.addAll(currentProduct.getReferencedByProducts());
		if (!sReferencingCCs.isEmpty()) {
			for (var num = 0; num < sReferencingCCs.size(); num++) {
				var cc = sReferencingCCs.get(num).getSource();			
			}
		}
		log.info("cc "+cc);
		if(cc != null){
			var ccPhotoStatus = cc.getValue("a_CC_Photo_Status").getSimpleValue();
			log.info("ccPhotoStatus "+ccPhotoStatus);
			if(ccPhotoStatus == "Complete: Ready for Review"){
				var ssReferencingCCs = new java.util.ArrayList();
				ssReferencingCCs.addAll(cc.getReferences(CCPhotoShotRef));
				if (!ssReferencingCCs.isEmpty()){
					var comFlag = false;
					var subFlag = false;
					var rrFlag = false;
					for (var i = 0; i < ssReferencingCCs.size(); i++) {
						var shotLife = ssReferencingCCs.get(i).getTarget().getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
						log.info("shotLife" +shotLife);
						if(shotLife == "Submitted" || shotLife == "Ready for Review"){
							comFlag = true;
							log.info("check clause 1");
						}
						if(shotLife == "Ready for Review"){
							log.info("check clause 2");
							rrFlag = true;					
						}
						if(shotLife == "Submitted"){
							log.info("check clause 3");
							subFlag = true;
							}
					}
					if(comFlag == false){
						log.info("setting photo status to complete");
						cc.getValue("a_CC_Photo_Status").setSimpleValue("Complete");
					}
					else if(rrFlag == true){
						log.info("Leave photo status to Complete: Ready for Review");
					}
					else if(subFlag == true){
						log.info("setting photo status to Complete: Request Submitted");
						cc.getValue("a_CC_Photo_Status").setSimpleValue("Complete: Request Submitted");
					}
					else{
						log.info("Leave photo status to Complete: Ready for Review");
					}
				}
			}
		}
	});
}

var sharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();
var contexts = new Array();
log.info('a_Shared_Markets'+ sharedMarkets)
if (sharedMarkets != null) {
	//get context ID for each market from lookup table
  	sharedMarkets.forEach(function (market) {
    		contexts.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
  	});
  	contexts.forEach(function (context) {
		copyStatusShotApprove(context);
 	});
}
}