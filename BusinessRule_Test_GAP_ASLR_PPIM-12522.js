/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_GAP_ASLR_PPIM-12522",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test_GAP_ASLR_PPIM-12522",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "CCToPhotoShotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "EntityBindContract",
    "alias" : "PhotoShotRoot",
    "parameterClass" : "com.stibo.core.domain.impl.entity.FrontEntityImpl$$Generated$$12",
    "value" : "126402",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "PhotoShotObject",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "ProductShotRequest",
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
exports.operation0 = function (node,stepManager,CCToPhotoShotRef,PhotoShotRoot,PhotoShotObject,LKT) {
function createShotRequest(shotCode, shotType, sitePlacement, CC) {

	// create the Shot Request
	var photoShot = PhotoShotRoot.createEntity('', PhotoShotObject);

	// set Shot Request attributes based on ASLR data container
	photoShot.getValue('a_Shot_Code').setSimpleValue(shotCode);
	photoShot.getValue('a_Shot_Type').setSimpleValue(shotType);
	photoShot.getValue('a_Site_Placement').setSimpleValue(sitePlacement);
	photoShot.getValue('a_Shared_Markets').setSimpleValue(marketCode);
	photoShot.getValue('a_Shot_Request_Method').setSimpleValue('ASLR');

	var shotMarkets = photoShot.getValue("a_Shared_Markets").getSimpleValue();
	var shotMarketsArray = photoShot.getValue("a_Shared_Markets").getValues().toArray();
	var shotMethod = photoShot.getValue("a_Shot_Request_Method").getSimpleValue();
	var shotPlacement = photoShot.getValue("a_Site_Placement").getSimpleValue();
	var shotPrimaryMkt = photoShot.getValue("a_Shot_Primary_Market").getSimpleValue();

	// fix ALSR shared markets values and references
	if (shotMethod == 'ASLR') {
		// for each market check validity of Shared Market values and correct if necessary
		shotMarketsArray.forEach(function (mkt) {
			// current market's context value
			var nextContext = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());

			stepManager.executeInContext(nextContext, function (manager) {
				// get context specific shot
				var cntxtShot = manager.getEntityHome().getEntityByID(photoShot.getID());
				var cntxtCC = manager.getProductHome().getProductByID(CC.getID());
				// establish reference
				cntxtCC.createReference(cntxtShot, CCToPhotoShotRef);
				// get CCs referencing the new shot request
				var referencingCCs = new java.util.ArrayList();

				referencingCCs.addAll(cntxtShot.getReferencedByProducts());

				if (referencingCCs.isEmpty() == false) {
					for (var num = 0; (num <= referencingCCs.size() - 1); num++) {
						var cntxtCC = referencingCCs.get(num).getSource();

						if (cntxtCC != null) {
							// get context specific CCs status
							var cntxtCCStatus = cntxtCC.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
							// get context specific CCs market designation
							var cntxtCCMarkets = cntxtCC.getValue("a_Market_Designation").getSimpleValue();
							// get current market's ID
							var marketID = mkt.getID();
							// get current market's value
							var marketValue = mkt.getValue();

							// delete market from shot if CC is in Draft
							if (cntxtCCStatus == "Draft") {
								mkt.deleteCurrent();
							}
							// if CC doesn't contain current market then delete the market from the Shot Request
							else if (cntxtCCMarkets.contains(mkt.getValue()) == false) {
								mkt.deleteCurrent();
							}
							// if CC isn't Draft status and CC contains the current market
							else {
								// set shot market number on the context specific shot request
								cntxtShot.getValue("a_Shot_Market_Number").setSimpleValue(marketID + " : " + marketValue);

								// get context CC refs
								var cntxtCCRefs = cntxtCC.getReferences(CCToPhotoShotRef).toArray();

								//if array isn't null
								if (cntxtCCRefs.length > 0) {
									//loop through array and check if reference already exists
									cntxtCCRefs.forEach(function (ref) {
										if (ref.getTarget().getID() == cntxtShot.getID()) {
											match = true;
										}
									});
								}

								//if reference doesn't already exist then make one
								if (match == false) {
									// create reference on the CC to the shot request
									cntxtCC.createReference(cntxtShot, CCToPhotoShotRef);
								}

								var ccNum = cntxtCC.getValue("a_CC_Number").getSimpleValue();

								cntxtShot.getValue("a_Shot_CC_Number").setValue(ccNum);
							}
						}
					}
				}
			});
		});

		shotMarkets = photoShot.getValue("a_Shared_Markets").getSimpleValue();
	}

	// set old shot request attributes, method & primary market
	photoShot.getValue('a_Old_Shot_Code').setSimpleValue(shotCode);
	photoShot.getValue('a_Old_Shot_Type').setSimpleValue(shotType);
	photoShot.getValue('a_Old_Site_Placement').setSimpleValue(shotPlacement);
	photoShot.getValue('a_Old_Shared_Markets').setSimpleValue(shotMarkets);

	// ensure the primary market is set for the shot request
	if (shotPrimaryMkt == null || shotPrimaryMkt == "") {
		if (shotMarkets.contains("US")) {
			photoShot.getValue("a_Shot_Primary_Market").setSimpleValue("US");
		}
		else if (shotMarkets.contains("CAN")) {
			photoShot.getValue("a_Shot_Primary_Market").setSimpleValue("CAN");
		}
		else if (shotMarkets.contains("JPN")) {
			photoShot.getValue("a_Shot_Primary_Market").setSimpleValue("JPN");
		}
		else if (shotMarkets.contains("SA")) {
			photoShot.getValue("a_Shot_Primary_Market").setSimpleValue("SA");
		}
	}

	if (photoShot.isInWorkflow("wf_ShortRequestLifeCycle")) {
		var task = photoShot.getTaskByID("wf_ShortRequestLifeCycle", "Draft");
		task.triggerByID("Submit", '');
	}

}

var marketCode = node.getValue('a_Market_Designation').getSimpleValue();
var sortOrder = node.getValue('a_CC_Sort_Order').getSimpleValue();
var ASLRDataContainers;
var subClass = node.getParent().getParent();
var context = stepManager.getCurrentContext().getID();
ASLRDataContainers = subClass.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
//Changes are done as a part of PPIM-10158
var brandNum = node.getValue('a_Brand_Number').getSimpleValue();
var brand_wpt= "a_" + brandNum + "_WebProductType";
var webProductType = node.getValue(brand_wpt).getSimpleValue();
//log.info(webProductType);

//PPIM-10043 - Adding condition to check to negate the ASLR shot request creation for Dropship Products
if (marketCode != null && context == "EN_US" &&  webProductType != "Dropship" && brandNum == "GAP") {
	if (marketCode.indexOf('US') != -1) {

		//if the CC is the first CC of the style
		if (sortOrder == '999') {
			if (ASLRDataContainers != null) {
				for (var n = 0; n < ASLRDataContainers.length; n++) {
					var dataContainerObject = ASLRDataContainers[n].getDataContainerObject();
					var shotCode = dataContainerObject.getValue('a_Shot_Code').getSimpleValue();
					var shotType = dataContainerObject.getValue('a_Shot_Type').getSimpleValue();
					var sitePlacement = dataContainerObject.getValue('a_ASLR_Site_Placement').getSimpleValue();
					createShotRequest(shotCode, shotType, sitePlacement, node);
				}
			}

		}
		//if not then create it only for siteplacement value 5
		else {
			if (ASLRDataContainers != null) {
				for (var n = 0; n < ASLRDataContainers.length; n++) {
					var dataContainerObject = ASLRDataContainers[n].getDataContainerObject();
					var shotCode = dataContainerObject.getValue('a_Shot_Code').getSimpleValue();
					var shotType = dataContainerObject.getValue('a_Shot_Type').getSimpleValue();
					var sitePlacement = dataContainerObject.getValue('a_ASLR_Site_Placement').getSimpleValue();
					if (sitePlacement == 'Main P1') {

						createShotRequest(shotCode, shotType, sitePlacement, node);
					}

				}
			}
		}
	}
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
