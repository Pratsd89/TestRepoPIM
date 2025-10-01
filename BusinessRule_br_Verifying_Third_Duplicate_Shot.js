/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Verifying_Third_Duplicate_Shot",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Verifying Third Duplicate Shot",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "utilLib"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
exports.operation0 = function (node,step,lookupTable,utilLib) {
var shotCode = node.getValue("a_Shot_Code").getSimpleValue();

var sharedMarkets = node.getValue("a_Shared_Markets").getSimpleValue();

if (shotCode == null) {
    return true;
}
if (sharedMarkets == null) {
    return true;
}

var shotReferences = [];
var sharedMarketsArray = node.getValue("a_Shared_Markets").getValues().toArray();
var contexts = new Array();
if (shotCode != null && sharedMarkets != null) {
    
    //PPIM-9163 Fetch context for each market using lookup table
    sharedMarketsArray.forEach(function (market) {
        contexts.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
    });
    contexts.forEach(function (context) {	
        getReferencesByContext(context, node) 
    });

	if(sharedMarkets.contains("<multisep/>")){
	
		sharedMarkets = sharedMarkets.replace("<multisep/>",",");
		
		sharedMarkets = sharedMarkets.split(",").sort().join(",");		
	}
    for (var j = 0; j < shotReferences.length; j++) {
        var oldTarget = shotReferences[j].getTarget();

        if (oldTarget.getID() != node.getID()) {

            var old_shotCode = oldTarget.getValue('a_Shot_Code').getValue();

            var old_lifecycle_status = oldTarget.getValue('a_Shot_Request_Lifecycle_Status').getSimpleValue();
			
            var old_shared_market = oldTarget.getValue('a_Shared_Markets').getSimpleValue();	

			if(old_shared_market.contains("<multisep/>")){
			
				old_shared_market = old_shared_market.replace("<multisep/>",",");
				
				old_shared_market =	old_shared_market.split(",").sort().join(",");		
			}
			//PPIM-10468 Context Agnostic
            if (old_shotCode == shotCode && old_lifecycle_status == "Submitted" && sharedMarkets.equals(old_shared_market)) {
                return 'This shot is a duplicate shot request as you already have an existing shot request in Submitted status with this Shot Code for your market. If you Submit this shot request, it will update the fields on the open Submitted shot request, and delete this new shot request ID. It may take up to a minute to see the duplicate shot request removed from the UI.';
            }
        }
    }

}
return true;


function getReferencesByContext(context, photoshot) {
    var sReferencingCCs = new java.util.ArrayList();
    sReferencingCCs.addAll(node.getReferencedByProducts());
    if (!sReferencingCCs.isEmpty()) {
        for (var i = 0; i < sReferencingCCs.size(); i++) {
            var refCC = sReferencingCCs.get(i);
            var oStyleCC = refCC.getSource();
            step.executeInContext(context, function (contextManager) {
                oStyleCC = contextManager.getProductHome().getProductByID(oStyleCC.getID());
                var productReferences = oStyleCC.getReferences().asList();
                for (var j = 0; j < productReferences.size(); j++) {
                    var referenceTypeID = productReferences.get(j).getReferenceType().getID();
                    if (referenceTypeID == 'CCToPhotoShotRef') {
                        shotReferences.push(productReferences.get(j));
                    }
                }
            });
        }
    }

}
}