/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_InheritUSCopyOption_Update",
  "type" : "BusinessAction",
  "setupGroups" : [ "Bulk Updates/One Time Updates" ],
  "name" : "br_InheritUSCopyOption_Update",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
exports.operation0 = function (node,step,LKT) {
inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
				var styleMktDsg = node.getValue("a_Style_Market_Designation").getSimpleValue();
				var marketsArray = [];
				marketsArray = styleMktDsg.split("<multisep/>");
				marketsArray.forEach(function (mkt) {
				     if(mkt != 'US'){	
			               var otherCtxt = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
						step.executeInContext(otherCtxt, function (otherManager) {
							var otherCtxtNode = otherManager.getProductHome().getProductByID(node.getID());
							var copyStatus = otherCtxtNode.getValue("a_Copy_Complete_Status").getSimpleValue();
							var lifeCycleStatus = otherCtxtNode.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
							if ((copyStatus == "In Progress" || copyStatus == "Complete") && lifeCycleStatus != "Approved"){
								if (inheritOption == null) {
									node.getValue("a_Inherit_US_Copy_Option").setSimpleValue(mkt);
								}
								else if (inheritOption.contains(mkt) == false) {
									node.getValue("a_Inherit_US_Copy_Option").addValue(mkt);
								}
								inheritOption = node.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
							}
						});
					}
			    });
}