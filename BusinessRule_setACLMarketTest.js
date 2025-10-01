/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "setACLMarketTest",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "set Market Desig with ACL Market Desig(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,step,LKT) {
try {
	// get market designations
	var mktDsgVal = null;
	var mktDsgValInherited = node.getValue('a_Market_Designation').isInherited();
	//log.info(mktDsgValInherited);
	if (mktDsgValInherited == false) {
		mktDsgVal = node.getValue('a_Market_Designation').getSimpleValue();
	}

	// get the object type of the node
	var objType = node.getObjectType().getID();

	// get brand number from node
	var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

	// use lookup table to convert brand number to contexts
	var brandMarkets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);

	var brandMarketsArray = [];

	if (brandMarkets.contains(";")) {
		brandMarkets.split(";").forEach(function (mkt) {
			brandMarketsArray.push(mkt);
		});
	}
	else {
		brandMarketsArray.push(brandMarkets);
	}

	brandMarketsArray.forEach(function (ctxt) {
		// execute in context
		step.executeInContext(ctxt, function (manager) {
			// get context specific nodes
			var ctxtNode = manager.getProductHome().getProductByID(node.getID());
			// get the parent Style market designations
			var ctxtParentStyle = null;

			if (objType == "CustomerChoice") {
				ctxtParentStyle = ctxtNode.getParent();
			}
			else if (objType == "SKU") {
				ctxtParentStyle = ctxtNode.getParent().getParent();
			}

			var styleMktDsgVal = ctxtParentStyle.getValue('a_Style_Market_Designation').getSimpleValue();

			// get context node's ACL market designation
			var ctxtNodeACLMktDsg = ctxtNode.getValue('a_ACL_Market_Designation');
			var ctxtNodeACLMktDsgVal = ctxtNode.getValue('a_ACL_Market_Designation').getSimpleValue();

			if (ctxtNodeACLMktDsg.isInherited() == false && ctxtNodeACLMktDsgVal != null) {
				// log.info("context: " + ctxt);
				if (mktDsgVal == null) {
					// log.info("ctxtNodeACLMktDsgVal value 1: " + ctxtNodeACLMktDsgVal);
					ctxtNode.getValue("a_Market_Designation").setSimpleValue(ctxtNodeACLMktDsgVal);
					//PPIM-11036
					mktDsgVal = node.getValue('a_Market_Designation').getSimpleValue();
				}
				else if (mktDsgVal.contains(ctxtNodeACLMktDsgVal) == false) {
					// log.info("ctxtNodeACLMktDsgVal value 2: " + ctxtNodeACLMktDsgVal);
					ctxtNode.getValue("a_Market_Designation").addValue(ctxtNodeACLMktDsgVal);
					//PPIM-11036
					mktDsgVal = node.getValue('a_Market_Designation').getSimpleValue();
				}

				//set the style market designation
				if (styleMktDsgVal == null) {
					ctxtParentStyle.getValue("a_Style_Market_Designation").setSimpleValue(ctxtNodeACLMktDsgVal);
					styleMktDsgVal = ctxtParentStyle.getValue('a_Style_Market_Designation').getSimpleValue();
				}
				else if (styleMktDsgVal.contains(ctxtNodeACLMktDsgVal) == false) {
					ctxtParentStyle.getValue("a_Style_Market_Designation").addValue(ctxtNodeACLMktDsgVal);
					styleMktDsgVal = ctxtParentStyle.getValue('a_Style_Market_Designation').getSimpleValue();

					if (ctxtNodeACLMktDsgVal != "US" && styleMktDsgVal.contains("US")) {
						var inheritOption = ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();

						if (inheritOption == null) {
							ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").setSimpleValue(ctxtNodeACLMktDsgVal);
							inheritOption = ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
						}
						else if (inheritOption.contains(ctxtNodeACLMktDsgVal) == false) {
							ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").addValue(ctxtNodeACLMktDsgVal);
							inheritOption = ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
						}

						if (inheritOption != null) {
							if (styleMktDsgVal.contains(ctxtNodeACLMktDsgVal) && inheritOption.contains(ctxtNodeACLMktDsgVal)) {

								step.executeInContext('EN_US', function (enContextManager) {
									var enCurrentProduct = enContextManager.getProductHome().getProductByID(ctxtParentStyle.getID());
									var attributeGroup = enContextManager.getAttributeGroupHome().getAttributeGroupByID('ag_English_Replication_Attributes');
									var attributeList = attributeGroup.getAttributes().toArray();

									for (var y = 0; y < attributeList.length; y++) {
										var enAttributeValue = enCurrentProduct.getValue(attributeList[y].getID()).getSimpleValue();

										step.executeInContext(ctxt, function (otherContextManager) {
											var otherCurrentProduct = otherContextManager.getProductHome().getProductByID(ctxtParentStyle.getID());

											otherCurrentProduct.getValue(attributeList[y].getID()).setSimpleValue(enAttributeValue);
										});
									}
								});
							}
						}
					}
					else if (ctxtNodeACLMktDsgVal == 'US'){
						inheritOption = ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
						styleMktDsgVal = ctxtParentStyle.getValue('a_Style_Market_Designation').getSimpleValue();
						var marketsArray = [];
						marketsArray = styleMktDsgVal.split("<multisep/>");
						marketsArray.forEach(function (mkt) {
							if(mkt != 'US'){
								var otherCtxt = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt);
								step.executeInContext(otherCtxt, function (otherManager) {
									var otherCtxtNode = otherManager.getProductHome().getProductByID(node.getID());
									var otherCtxtParentStyle = null;
									otherCtxtParentStyle = otherCtxtNode.getParent();
									var copyStatus = otherCtxtParentStyle.getValue("a_Copy_Complete_Status").getSimpleValue();
									var lifeCycleStatus = otherCtxtParentStyle.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
									if ((copyStatus == "In Progress" || copyStatus == "Complete") && lifeCycleStatus != "Approved"){
										if (inheritOption == null) {
											ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").setSimpleValue(mkt);
										}
										else if (inheritOption.contains(mkt) == false) {
											ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").addValue(mkt);
										}
										inheritOption = ctxtParentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
									}
								});
							}
						});
					}
					else if (ctxtNodeACLMktDsgVal == "SA" && styleMktDsgVal.contains("JPN") && !styleMktDsgVal.contains("US") && !styleMktDsgVal.contains("CAN")){
						var inheritJPOption = ctxtParentStyle.getValue("a_Inherit_JPN_Copy_Option").getSimpleValue();
						if (inheritJPOption == null){
							ctxtParentStyle.getValue("a_Inherit_JPN_Copy_Option").setSimpleValue(ctxtNodeACLMktDsgVal);
							inheritJPOption = ctxtParentStyle.getValue("a_Inherit_JPN_Copy_Option").getSimpleValue();
						}
					}
				}
			}
		});
	});
}
catch (e) {
	logger.info("CC Created/Updated Event Processor Failed For : " + node.getID());
}
}