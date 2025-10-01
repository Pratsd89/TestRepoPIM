/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ShotRequest_SitePlacementCheck_WebUI",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "WebUI - Shot Request Site Placement Check",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,LKT) {
function getReferencesByContext(context) {
               var sReferencingCCs = new java.util.ArrayList();
               sReferencingCCs.addAll(node.getReferencedByProducts());
               if (!sReferencingCCs.isEmpty()) {
                              for (var i = 0; i < sReferencingCCs.size(); i++) {
                                             var refCC = sReferencingCCs.get(i);
                                             var oStyleCC = refCC.getSource();
                                             manager.executeInContext(context, function (contextManager) {
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
 
var sitePlacement = node.getValue("a_Site_Placement").getSimpleValue();
 
var sharedMarket = node.getValue("a_Shared_Markets").getSimpleValue();
 
if (sitePlacement == null) {
               return true;
}
 
if (sharedMarket == null) {
               return true;
}
 
var shotReferences = new Array();

var sharedMarketsArray = node.getValue("a_Shared_Markets").getValues().toArray();
var contexts = new Array()
 	//PPIM-9163 Fetch context for each market using lookup table
    sharedMarketsArray.forEach(function (market) {
        contexts.push(LKT.getLookupTableValue("LKT_MarketDesignationToMarket",market.getSimpleValue()));
    });
    contexts.forEach(function (context) {	
        getReferencesByContext(context) 
    });
 
for (i = 0; i < shotReferences.length; i++) {
               var cc = shotReferences[i].getSource();
 
               var shots = cc.getReferences(manager.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef"));
               for (j = 0; j < shots.size(); j++) {
                              var photoShot = shots.get(j).getTarget();
                              // first check placement value
                              //var placementValues = photoShot.getValue("a_Site_Placement").getValues();
                              //Changing after Site Placement is Single valued.
                              var placementValue = photoShot.getValue("a_Site_Placement").getSimpleValue();
 
                              if ((placementValue != null) && (photoShot.getID() != node.getID())) {
                                             //var placementIterator = placementValues.iterator();
                                             //while(placementIterator.hasNext()) {
                                             var lifeCycleStatus = photoShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
 
                                             //if(sitePlacement.indexOf(placementValue) >= 0) {
                                             if (sitePlacement == photoShot.getValue("a_Site_Placement").getLOVValue().getValue() ||
                                                            sitePlacement == photoShot.getValue("a_Site_Placement").getLOVValue().getID()) {
                                                            // check lifecycle status
                                                            if ((lifeCycleStatus == "Approved") || (lifeCycleStatus == "Complete")) {
                                                                           // check shared Market values
                                                                           var marketValues = photoShot.getValue("a_Shared_Markets").getValues();
 
                                                                           var marketValuesIterator = marketValues.iterator();
 
                                                                           while (marketValuesIterator.hasNext()) {
 
                                                                                          if (sharedMarket.indexOf(marketValuesIterator.next().getLOVValue().getValue()) >= 0) {
                                                                                                         return "Product Shot Request - " + photoShot.getTitle() + " - has the same site placement already in use for Customer Choice - " + cc.getID();
                                                                                          }
                                                                           }
                                                            }
                                             }
                                             //}
                              }
               }
}
 
 
return true;
}