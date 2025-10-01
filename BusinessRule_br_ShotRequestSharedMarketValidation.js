/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ShotRequestSharedMarketValidation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Shot Request Shared Market Validation",
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
exports.operation0 = function (node,step,portal) {
var isShotCreationEligible = false;
var shotReferencingCCs = new java.util.ArrayList();
var newsharedMarket = null
var ccID = null;

//Fetch CC details from the shot request
shotReferencingCCs.addAll(node.getReferencedByProducts());
if (!shotReferencingCCs.isEmpty()) {
		ccID=shotReferencingCCs.get(0).getSource().getID();				
}

var currentContext = step.getCurrentContext().getID()
var referencedCC = step.getProductHome().getProductByID(ccID);
var ccMarketDesignation = referencedCC.getValue("a_Market_Designation").getSimpleValue();
var shotSharedMarkets = node.getValue("a_Shared_Markets").getValues().toArray();

shotSharedMarkets.forEach(function (market) {
	if(ccMarketDesignation.indexOf(market.getSimpleValue()) > 0)	
		isShotCreationEligible = true
})

if(isShotCreationEligible) {
	shotSharedMarkets.forEach(function (market) {
		if(ccMarketDesignation.indexOf(market.getSimpleValue()) != -1 ) {
		
			//Add the shared market from CC market designation only if CC life cycle status is not in Draft/NULL
          	if(referencedCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != 'Draft' ) {
         			if(referencedCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != null && referencedCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue() != '') {
					if(newsharedMarket != null)
						newsharedMarket = newsharedMarket + '<multisep/>'+ market.getSimpleValue()
                    	else
                        		newsharedMarket = market.getSimpleValue()
              		}	
          	}
		}
	})
	
	if(newsharedMarket == null) {
		portal.showAlert("Warning", "CC's Life Cycle Status are in Draft/Blank status. Proceed enriching the Product before Shot is Saved/Submitted");
		//log.info('CCs Life Cycle Status are in Draft/Blank status. Proceed enriching the Product before Shot is Saved/Submitted')
	}else {
		node.getValue("a_Shared_Markets").setSimpleValue(newsharedMarket)
	}
}
else {
	portal.showAlert("Warning", "Please modify the Shared Market value according to the CC's Eligible Market Designation.");
	//log.info('Shot request shared market is only Valid in'+ ccMarketDesignation)
}
}