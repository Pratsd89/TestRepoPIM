/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_completenessChecks",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Completeness Checks Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function attributeCompletenessCheck(node, step, attrGroup) {
	var emptyAttributes = [];
	var attributeGroup = step.getAttributeGroupHome().getAttributeGroupByID(attrGroup);
	var attributeList = attributeGroup.getAttributes().toArray();
	for (var i = 0; i < attributeList.length; i++) {
		var attrID = attributeList[i].getID();
		var attrVal = node.getValue(attrID).getSimpleValue();
		var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
		var sizeChartPtrn = new RegExp("^a_Size_Chart_" + brandNum + "$");

		if (sizeChartPtrn.test(attrID)) {

			if (attrVal == null || attrVal == '') {

				emptyAttributes.push(attributeList[i].getName());
				result = false;
			}
		}
		else if (attrID.contains("a_Size_Chart_") == false) {

			var context = step.getCurrentContext().getID();
			if (context == "EN_SA" && attrID == "a_Tax_Code") {
				continue;
			}
			else if (attrVal == null || attrVal == '') {
				emptyAttributes.push(attributeList[i].getName());
				result = false;
			}
		}
	}

	if (emptyAttributes.length == 0) {
		return true;
	}
	else {
		return emptyAttributes.join(', ');
	}

}

function styleCompletenessCheck(style, step) {
	/* Style Completeness Criteria 
		Do I have a child CC?
		Does that child CC have a child Sku? Do that child CC and Sku pass their completeness checks?
		Do I have my a_Required_Style_Attributes complete?
	 */

	// check Style attributes

	var attributeCheck = null;
	var gpsBrandValue = style.getValue("a_Brand_Number").getSimpleValue();

	if (gpsBrandValue == "GPS") {
		attributeCheck = attributeCompletenessCheck(style, step, "ag_Required_Style_Attributes_GPS");
	} else {
		attributeCheck = attributeCompletenessCheck(style, step, 'ag_Required_Style_Attributes');
	}

	if (attributeCheck != true) {
		return "Following Required Style Attributes are not populated: " + attributeCheck;
	}
	// check CC and SKU
	var children = style.getChildren();
	var ccCheck = false;
	var childSKUCheck = false;

	if (children.size() > 0) {
		var childIter = children.iterator();
		while (childIter.hasNext()) {
			var child = childIter.next();
			ccCheck = attributeCompletenessCheck(child, step, 'ag_Required_CC_Attributes');
			// check if Children SKU(s) exist if the attribute completeness is true for the CC
			var childSKUs = child.getChildren();
			if (childSKUs.size() > 0 && ccCheck == true) {
				var skuIter = childSKUs.iterator();
				while (skuIter.hasNext()) {
					if (attributeCompletenessCheck(skuIter.next(), step, 'ag_Required_Sku_Attributes') == true) {
						//at this point, at least one CC and one SKU has passed completeness check so return true
						return true;
					}
				}
			}
		}
	} else {
		// no children objects exist
		return "No child CCs found.";
	}

	if (ccCheck != true || childSKUCheck != true)
		return "Child CC and/or SKU failed completeness check."

	return true;
}

function nonMerchStyleCompletenessCheck(style, step) {
	/* Style Completeness Criteria 
		Do I have a child CC?
		Does that child CC have a child Sku? Do that child CC and Sku pass their completeness checks?
	 */

	// check CC and SKU
	var children = style.getChildren();
	var ccCheck = false;
	var childSKUCheck = false;

	if (children.size() > 0) {
		var childIter = children.iterator();
		while (childIter.hasNext()) {
			var child = childIter.next();
			// check if Children SKU(s) exist 
			var childSKUs = child.getChildren();
			if (childSKUs.size() > 0) {
				var skuIter = childSKUs.iterator();
				while (skuIter.hasNext()) {
					if (attributeCompletenessCheck(skuIter.next(), step, 'ag_Nonmerch_Required_Sku_Attributes') == true) {
						//at this point, at least one CC and one SKU has passed completeness check so return true
						return true;
					}
				}
			}
		}
	} else {
		// no children objects exist
		return "No child CCs found.";
	}

	if (ccCheck != true || childSKUCheck != true)
		return "Child CC and/or SKU failed completeness check."

	return true;
}

function ccCompletenessCheck(cc, step) {
	/* CC Completeness Criteria
	   Do I have my ag_Required_CC_Attributes complete?
	   Do I have a child Sku and does it pass completeness check?
	   Does the parent Style pass completeness check
	*/

	//check CC attributes
	var attributeCheck = attributeCompletenessCheck(cc, step, 'ag_Required_CC_Attributes');
	if (attributeCheck != true) {
		return "Following Required CC Attributes are not populated: " + attributeCheck;
	}

	// check SKU completeness
	var childSKUCheck = false;
	var children = cc.getChildren();
	if (children.size() == 0) {
		return "No child SKUs found."
	} else {
		var skuIter = children.iterator();
		while (skuIter.hasNext()) {
			if (attributeCompletenessCheck(skuIter.next(), step, 'ag_Required_Sku_Attributes') == true) {
				childSKUCheck = true;
			}
		}
	}

	if (!childSKUCheck)
		return "Children SKU(s) failed completeness checks."

	// CC can't move forward until the parent style is ready
	var styleCheck = styleCompletenessCheck(cc.getParent(), step);
	if (styleCheck != true)
		return styleCheck;

	return true;
}

function nonMerchCcCompletenessCheck(cc, step) {
	/* CC Completeness Criteria
	   Do I have a child Sku and does it pass completeness check?
	*/

	//check CC attributes

	// check SKU completeness
	var childSKUCheck = false;
	var children = cc.getChildren();
	if (children.size() == 0) {
		return "No child SKUs found."
	} else {
		var skuIter = children.iterator();
		while (skuIter.hasNext()) {
			if (attributeCompletenessCheck(skuIter.next(), step, 'ag_Nonmerch_Required_Sku_Attributes') == true) {
				childSKUCheck = true;
			}
		}
	}

	if (!childSKUCheck)
		return "Children SKU(s) failed completeness checks."

	// CC can't move forward until the parent style is ready
	var styleCheck = nonMerchStyleCompletenessCheck(cc.getParent(), step);
	if (styleCheck != true)
		return styleCheck;

	return true;
}

function skuCompletenessCheck(sku, step) {
	/* SKU Completeness Criteria
	   Do I have my ag_Required_Sku_Attributes complete?
	 */
	// check SKU attributes
	var attributeCheck = attributeCompletenessCheck(sku, step, 'ag_Required_Sku_Attributes');
	if (attributeCheck != true) {
		return "Following Required SKU Attributes are not populated: " + attributeCheck;
	}

	// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
	/* var a_Size_Dim1_Description = sku.getValue("a_Size_Dim1_Description").getSimpleValue();
	  if (a_Size_Dim1_Description == null || a_Size_Dim1_Description == "") {
		   return sku.getID() + " is missing Sku Size Description.";
	  }*/

	// SKU can't move forward until the parent style and CC are ready. CC check will check for Style completeness automatically.

	var ccCheck = ccCompletenessCheck(sku.getParent(), step);
	if (ccCheck != true)
		return ccCheck;

	return true;
}

function nonMerchSkuCompletenessCheck(sku, step) {
	/* SKU Completeness Criteria
	   Do I have my ag_Nonmerch_Required_Sku_Attributes complete?
	 */
	// check SKU attributes
	var attributeCheck = attributeCompletenessCheck(sku, step, 'ag_Nonmerch_Required_Sku_Attributes');
	if (attributeCheck != true) {
		return "Following Required SKU Attributes are not populated: " + attributeCheck;
	}

	// SKU can't move forward until the parent style and CC are ready. CC check will check for Style completeness automatically.

	return nonMerchCcCompletenessCheck(sku.getParent(), step);

}

function checkCCAssetCompleteness(cc, step) {
	var primaryApprovedFlag = false;
	var otherContentExistFlag = false;
	var primaryContentExistFlag = false;
	var swatchContentExistFlag = false;


	var shotRequestReferences = cc.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef")).toArray();
	if (shotRequestReferences.length != 0) {
		for (var i = 0; i < shotRequestReferences.length; i++) {
			var shotRequest = shotRequestReferences[i].getTarget();
			var externalAssetReferences = shotRequest.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToExternalAsset")).toArray();
			if (shotRequest.getValue('a_Site_Placement').getLOVValue() != null) {
				var sitePlacement = shotRequest.getValue('a_Site_Placement').getLOVValue().getID();

				if (sitePlacement == "5") {
					if (externalAssetReferences.length != 0) {
						for (var n = 0; n < externalAssetReferences.length; n++) {
							var externalAsset = externalAssetReferences[n].getTarget();
							var contentTypeId = externalAsset.getValue('a_Content_Type_ID').getSimpleValue();

							if (contentTypeId != '216' && contentTypeId != '12') {
								otherContentExistFlag = true;
							} else if (contentTypeId == '216') {
								primaryContentExistFlag = true;
							}

							if (contentTypeId != 216 && contentTypeId != 12) {
								otherContentExistFlag = true;
							} else if (contentTypeId == 216) {
								primaryContentExistFlag = true;
							}
						}
					}
				}
			}
		}
	} else {
		return "CC does not have any Shot Requests."
	}

	var swatchReferences = cc.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("Swatch")).toArray();
	if (swatchReferences.length != 0) {
		swatchContentExistFlag = true;
	}

	if (otherContentExistFlag == true && primaryContentExistFlag == true && swatchContentExistFlag == true) {
		return true;
	} else {
		return 'CC ' + cc.getName() + ' is missing image crops. ';
	}
}

function checkCCNameAndColorInContext(cc, step, contextID) {
	var result = true;
	step.executeInContext(contextID, function (enContextManager) {
		var enCurrentProduct = enContextManager.getObjectFromOtherManager(cc);
		var enProductName = enCurrentProduct.getName();

		if (enProductName == null || enProductName == "") {

			result = "Missing CC Name in " + contextID + " Context.";
		}
	});

	return result;
}

function checkCCNameAndColor(cc, step, lookupTable) {
	//grab shared markets to see which contexts to run the following check in
	var sharedMarkets = cc.getValue("a_Market_Designation").getSimpleValue();

	if (sharedMarkets == null || sharedMarkets == "") {
		return "Please enter valid Market Designation value for CC.";
	}

	var ccMarkets = cc.getValue("a_Market_Designation").getSimpleValue();

	var ccMarketsArray = [];

	if (ccMarkets.contains(";")) {
		ccMarkets.split(";").forEach(function (mkt) {
			ccMarketsArray.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", mkt));
		});
	}
	else if (ccMarkets.contains("<multisep/>")) {
		ccMarkets.split("<multisep/>").forEach(function (mkt) {
			ccMarketsArray.push(lookupTable.getLookupTableValue("LKT_MarketDesignationToMarket", mkt));
		});
	}

	ccMarketsArray.forEach(function (mkt) {
		var temp = checkCCNameAndColorInContext(cc, step, mkt);
		if (temp != true) {
			return temp;
		}
	});

	return true;
}

//PPIM-12814
function checkSKUDimensionForCC(cc, step) {
	var logArray = new Array();
	var CCLcs = cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
	var children = cc.getChildren();
	var expectOnlyDim1 = false;
	var expectBoth = false;
	var varaintDimMap = new java.util.HashMap();
	var dimDifferences = new java.util.HashSet();
	var variants = new java.util.HashSet();
	if (children.size() > 0) {
		//if (CCLcs == "Waiting for Style Approval") {
		var approvedSkus = [];
		var unapprovedSkus = [];
		var skuIter = children.iterator();
		while (skuIter.hasNext()) {
			var currSku = skuIter.next();
			var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
			var classificationType = classificationTypeHome.getLinkTypeByID('SKUToSizeCode');
			var refSizeCodeList = currSku.getClassificationProductLinks(classificationType);
			var skuLcs = currSku.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
			var skuEndDate = currSku.getValue("a_SKU_End_Date").getSimpleValue();
			var today = new Date().toISOString().substring(0, 10);

			//PPIM-13258
			if (skuLcs != null && skuLcs != "Draft" && skuLcs != "Purged" && (skuEndDate == null || skuEndDate > today)) {
				if (refSizeCodeList.size() == 1) {

					var refSizeCode = step.getClassificationHome().getClassificationByID(refSizeCodeList.get(0).getClassification().getID());
					var variant = refSizeCode.getValue("a_SizeCodeVariant").getSimpleValue();
					var dim1DimValue = refSizeCode.getValue("a_Dim1_Dimension_value").getSimpleValue();
					var dim2 = refSizeCode.getValue("Dim2(child)").getSimpleValue();
					if (CCLcs == "Waiting for Style Approval") {
						if (variant == null || variant == "" || dim1DimValue == null || dim1DimValue == "") {
							return "The Size Code Hierarchy needs to be enriched for product approval.";
						}
						else {
							if (dim2 != null && dim2 != "") {
								var dim2DimValue = refSizeCode.getValue("a_Dim2_Dimension_value").getSimpleValue();
								if (dim2DimValue == "" || dim2DimValue == null) {
									return "The Size Code Hierarchy needs to be enriched for product approval.";
								}
							}
						}
					}
					//PPIM-15068 

					//approvedSkus.push(sku);
					//log.info(variant);
					if(variant!=null){
					variants.add(variant);
					var dim2DimValue = refSizeCode.getValue("a_Dim2_Dimension_value").getSimpleValue();
					if (!dimDifferences.contains(variant)) {
						if (dim1DimValue && (!dim2DimValue || dim2DimValue == "")) {
							if (!varaintDimMap.get(variant)) {
								varaintDimMap.put(variant, "expectOnlyDim1")
							} else {
								if (varaintDimMap.get(variant) != "expectOnlyDim1") {
									dimDifferences.add(variant);
									//+ "\n";
								}
							}
							//expectOnlyDim1 = true;

						} else if (dim1DimValue && dim2DimValue && (dim1DimValue != "" && dim2DimValue != "")) {
							if (!varaintDimMap.get(variant)) {
								varaintDimMap.put(variant, "expectBoth")
							} else {
								if (varaintDimMap.get(variant) != "expectBoth") {
									dimDifferences.add(variant)
									//+ "\n";
								}
							}
							//expectBoth = true;
						}
					}
					}
				}
			}
		}
		//if (expectOnlyDim1 && expectBoth) {
		log.info(dimDifferences.size()+","+variants.size())
		if (dimDifferences.size() == variants.size() ) {
			log.info(variants+","+dimDifferences)
			//log.info("This style has discrepancies in Dim1-Dim2 Pattern for the below size Variants,Please Correct them.\n" + dimDifferences)
			return "This Product has discrepancies in Dim1-Dim2 Pattern for the Size Variants "+dimDifferences + " Please Correct them.";
			//webUI.showAlert("ERROR", "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.")
			//dim_dif = true;
			//return false;
		}
		else if(dimDifferences.size()>0){
			log.info("This Product has discrepancies in Dim1-Dim2 Pattern for the Size Variants "+dimDifferences + " Please Correct them.")
			//webUI.showAlert("WARNING", "This Product has discrepancies in Dim1-Dim2 Pattern for the Size Variants "+dimDifferences + "Please Correct them.")
		}
		log.info(variants)
		return true;
		//}
		return true;
		
	} else {
		return "CC does not have any SKUs."
	}
	
}

//PPIM-15068
function checkDimensionAtSKULevel_backup(node, sizeModelRef) {

	var sizecode, dim1, dim2;
	node.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
		sizecode = referenceInstance.getClassification();
		return true;
	});
	dim1 = sizecode.getValue("a_Dim1_Dimension_value").getSimpleValue();
	dim2 = sizecode.getValue("a_Dim2_Dimension_value").getSimpleValue();
	var variant = sizecode.getValue("a_SizeCodeVariant").getSimpleValue();
	var parentCC = node.getParent();

	var siblingSKUs = [];

	var expectOnlyDim1 = false;
	var expectBoth = false;
	
	var skus = parentCC.getChildren().iterator();
	while (skus.hasNext()) {
		sku = skus.next();
		if (sku.getID() != node.getID()) {
			sku.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
				var sizecode1 = referenceInstance.getClassification();
				var sDim1 = sizecode1.getValue("a_Dim1_Dimension_value").getSimpleValue();
				var sDim2 = sizecode1.getValue("a_Dim2_Dimension_value").getSimpleValue();
				var sVariant = sizecode1.getValue("a_SizeCodeVariant").getSimpleValue();
				if (sVariant == variant) {
					if (sDim1 && (!sDim2 || sDim2 == "")) {
						expectOnlyDim1 = true;

					} else if (sDim1 && sDim2 && (sDim1 != "" && sDim2 != "")) {
						expectBoth = true;
					}
				}
				return true;
			});

		}
		else {
			log.info("same nodeee")
		}
	}
	log.info(expectOnlyDim1 + "," + expectBoth + "," + dim1 + "," + dim2)
	if (expectOnlyDim1 && expectBoth) {
		log.info("This CC has discrepancies in Dim1-Dim2 Pattern for the size Variant " + variant +", Please Correct them. ")
		//webUI.showAlert("ERROR", "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.")
		return "This CC has discrepancies in Dim1-Dim2 Pattern for the Size Variant " + variant +", Please Correct them.";
	}
	log.info(dim2 != "")
	log.info(dim2)

	// Enforce the rule on current SKU
	if (expectOnlyDim1 && (dim1 && dim2 != "")) {
		//if(!(dim1 && !dim2)) { 
		log.info("This CC only uses Dim1 — Dim2 must be empty.")
		//webUI.showAlert("ERROR", "This style only uses Dim1 — Dim2 must be empty.");
		return "This CC only uses Dim1 — Dim2 must be empty for the Size Variant " + variant;
		//}
	} else if (expectBoth && (!(dim1 && dim2) || !(dim1 != "" && dim2 != ""))) {
		//if(!(dim1 && dim2) || !(dim1!="" && dim2!="")){
		log.info("This CC uses both Dim1 and Dim2 — please populate both.")
		//webUI.showAlert("ERROR", "This style uses both Dim1 and Dim2 — please populate both.");
		return "This CC uses both Dim1 and Dim2 — please populate both for the Size Variant " + variant;
		//}
	}
	return true;

}


//PPIM-15068
function checkDimensionAtSKULevel(node, sizeModelRef) {

    var sizecode, dim1, dim2;
    node.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
        sizecode = referenceInstance.getClassification();
        return true;
    });
    dim1 = sizecode.getValue("a_Dim1_Dimension_value").getSimpleValue();
    dim2 = sizecode.getValue("a_Dim2_Dimension_value").getSimpleValue();
    var variant = sizecode.getValue("a_SizeCodeVariant").getSimpleValue();
    var parentCC = node.getParent();
    var approved_expectOnlyDim1 = false;
    var approved_expectBoth = false;
    var unapproved_expectOnlyDim1 = false;
    var unapproved_expectBoth = false;
    approved_sku_exists = false;
    var today = new Date().toISOString().substring(0, 10);
    var skus = parentCC.getChildren().iterator();
    while (skus.hasNext()) {
        sku = skus.next();
        sku_end_date = sku.getValue("a_SKU_End_Date").getSimpleValue();
        if (sku.getID() != node.getID()) {
        	  if(sku_end_date== null || sku_end_date > today){
            var approved = sku.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
            sku.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
                var sizecode1 = referenceInstance.getClassification();
                var sDim1 = sizecode1.getValue("a_Dim1_Dimension_value").getSimpleValue();
                var sDim2 = sizecode1.getValue("a_Dim2_Dimension_value").getSimpleValue();
                var sVariant = sizecode1.getValue("a_SizeCodeVariant").getSimpleValue();

                if (sVariant == variant) {

                    if (sDim1 && (!sDim2 || sDim2 == "")) {
                    	log.info("sku "+sku.getID())
                        if (approved == "Approved") {
                            approved_expectOnlyDim1 = true;
                        }
                        else unapproved_expectOnlyDim1 = true;

                    } else if (sDim1 && sDim2 && (sDim1 != "" && sDim2 != "")) {
                    	log.info("sku1 "+sku.getID())
                        if (approved) {
                            approved_expectBoth = true;
                        } else {
                            unapproved_expectBoth = true;
                        }


                    }
                    if (approved) {
                        approved_sku_exists = true;
                    }
                }
                return true;
            });
        	  }
        	  else{
        	  	log.info("sku is endedd ")
        	  }

        }
        else {
            log.info("same nodeee "+sku.getID())
        }

    }
    //log.info(expectOnlyDim1 + "," + expectBoth + "," + dim1 + "," + dim2)
    log.info("approved_sku_exists " + approved_sku_exists)
    if (approved_sku_exists) {
        return compare_values(approved_expectOnlyDim1, approved_expectBoth, dim1, dim2, variant)
    }
    else {
        return compare_values(unapproved_expectOnlyDim1, unapproved_expectBoth, dim1, dim2, variant)
    }
    return true;

}
//PPIM-15068
function compare_values(expectOnlyDim1, expectBoth, dim1, dim2, variant) {
    if (expectOnlyDim1 && expectBoth) {
        log.info("This CC has discrepancies in Dim1-Dim2 Pattern for the size Variant " + variant + ", Please Correct themm. ")
        //webUI.showAlert("ERROR", "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.")
        return "This CC has discrepancies in Dim1-Dim2 Pattern for the Size Variant " + variant + ", Please Correct them.";
    }
    // Enforce the rule on current SKU
    if (expectOnlyDim1 && (dim1 && dim2 != "")) {
        //if(!(dim1 && !dim2)) { 
        log.info("This CC only uses Dim1 — Dim2 must be empty.")
        //webUI.showAlert("ERROR", "This style only uses Dim1 — Dim2 must be empty.");
        return "This CC only uses Dim1 — Dim2 must be empty for the Size Variant " + variant;
        //}
    } else if (expectBoth && (!(dim1 && dim2) || !(dim1 != "" && dim2 != ""))) {
        //if(!(dim1 && dim2) || !(dim1!="" && dim2!="")){
        log.info("This CC uses both Dim1 and Dim2 — please populate both for the Size Variant " + variant)
        //webUI.showAlert("ERROR", "This style uses both Dim1 and Dim2 — please populate both.");
        return "This CC uses both Dim1 and Dim2 — please populate both for the Size Variant " + variant;
        //}
    }
    return true;
}

function checkCCPrimaryImageStatus(cc, step) {
	var result = "";
	var approvedP1 = false;
	var shots = cc.getReferences(step.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef"));

	for (i = 0; i < shots.size(); i++) {
		var photoShot = shots.get(i).getTarget();
		var shotRequestStatus = photoShot.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue();
		// first check placement value
		if (photoShot.getValue('a_Site_Placement').getLOVValue() != null) {
			var placementValue = photoShot.getValue('a_Site_Placement').getLOVValue().getID();
			if (placementValue == 5 && shotRequestStatus == "Complete") {
				approvedP1 = true;
			}
		}
	}

	if (!approvedP1) {
		result += "Main P1 Shot Request is not complete";
	}

	return result;
}

function ccApprovalCheckInContext(cc, step, contextID) {
	//grab shared markets to see which contexts to run the following check in
	var markets = cc.getValue("a_Market_Designation").getSimpleValue();
	var message = "";

	step.executeInContext(contextID, function (otherManager) {
		var otherNode = otherManager.getObjectFromOtherManager(cc);
		message += checkCCPrimaryImageStatus(cc, step);
		if (message.length > 0) {
			message += " in " + contextID + " Context.\n";
		}

		// check mandatory attributes - 
		var attributeCheck = attributeCompletenessCheck(otherNode, step, "ag_Required_CC_Attributes");
		if (attributeCheck != true) {
			message += "Following attributes are mandatory and needs to be filled in " + contextID + " Context to proceed: " + attributeCheck;
		}

		var imageCheck = checkCCAssetCompleteness(otherNode, step);

		if (imageCheck != true) {
			message += imageCheck;
		}
	});

	if (message.length > 0) {
		return message;
	} else {
		return true;
	}
}

function styleApprovalCheckInContext(style, step, contextID) {
	// check if Style has mandatory attributes - Required Style Fields (ag_Required_Style_Fields) fulfilled.
	var message = "";
	step.executeInContext(contextID, function (otherManager) {
		var otherNode = otherManager.getObjectFromOtherManager(style);
		// check mandatory attributes - 
		var attributeCheck = attributeCompletenessCheck(otherNode, step, "ag_Required_Style_Fields");
		if (attributeCheck != true) {
			message += "Following attributes are mandatory and needs to be filled in " + contextID + " Context to proceed: " + attributeCheck;
		}
	});

	if (message.length > 0) {
		return message;
	} else {
		return true;
	}
}

/*===== business library exports - this part will not be imported to STEP =====*/
exports.attributeCompletenessCheck = attributeCompletenessCheck
exports.styleCompletenessCheck = styleCompletenessCheck
exports.nonMerchStyleCompletenessCheck = nonMerchStyleCompletenessCheck
exports.ccCompletenessCheck = ccCompletenessCheck
exports.nonMerchCcCompletenessCheck = nonMerchCcCompletenessCheck
exports.skuCompletenessCheck = skuCompletenessCheck
exports.nonMerchSkuCompletenessCheck = nonMerchSkuCompletenessCheck
exports.checkCCAssetCompleteness = checkCCAssetCompleteness
exports.checkCCNameAndColorInContext = checkCCNameAndColorInContext
exports.checkCCNameAndColor = checkCCNameAndColor
exports.checkSKUDimensionForCC = checkSKUDimensionForCC
exports.checkDimensionAtSKULevel_backup = checkDimensionAtSKULevel_backup
exports.checkDimensionAtSKULevel = checkDimensionAtSKULevel
exports.compare_values = compare_values
exports.checkCCPrimaryImageStatus = checkCCPrimaryImageStatus
exports.ccApprovalCheckInContext = ccApprovalCheckInContext
exports.styleApprovalCheckInContext = styleApprovalCheckInContext