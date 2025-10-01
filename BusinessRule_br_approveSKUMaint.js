/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_approveSKUMaint",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Approve SKU Maintenance",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "completnesslib"
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
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,webUI,sizeModelRef,completnesslib) {
if (step.getCurrentWorkspace().getID() == "Main") {
	/*//PPIM-15068
	var sizecode, dim1, dim2;
	node.queryClassificationProductLinks(sizeModelRef).forEach(function (referenceInstance) {
		sizecode = referenceInstance.getClassification();
		return true;
	});
	dim1 = sizecode.getValue("a_Dim1_Dimension_value").getSimpleValue();
	dim2 = sizecode.getValue("a_Dim2_Dimension_value").getSimpleValue();
	varaint = sizecode.getValue("a_SizeCodeVariant").getSimpleValue();
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
				var svaraint = sizecode1.getValue("a_SizeCodeVariant").getSimpleValue();
				if (varaint == svaraint) {
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
		log.info("This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.")
		//webUI.showAlert("ERROR", "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.")
		return "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them."
		//return false;
	}
	log.info(dim2 != "")
	log.info(dim2)

	// Enforce the rule on current SKU
	if (expectOnlyDim1 && (dim1 && dim2 != "")) {
		//if(!(dim1 && !dim2)) { 
		log.info("This style only uses Dim1 — Dim2 must be empty.")
		//webUI.showAlert("ERROR", "This style only uses Dim1 — Dim2 must be empty.");
		return "This style only uses Dim1 — Dim2 must be empty."
		//}
		return false;
	} else if (expectBoth && (!(dim1 && dim2) || !(dim1 != "" && dim2 != ""))) {
		//if(!(dim1 && dim2) || !(dim1!="" && dim2!="")){
		log.info("This style uses both Dim1 and Dim2 — please populate both.")
		//webUI.showAlert("ERROR", "This style uses both Dim1 and Dim2 — please populate both.");
		return "This style uses both Dim1 and Dim2 — please populate both.";
		//}
		return false;
	}*/
	//PPIM-15068
    var dimCheck = completnesslib.checkDimensionAtSKULevel(node, sizeModelRef)
    log.info(dimCheck)
    if(dimCheck != true){    	
    	return dimCheck;
    	}


	//PPIM-13175
	var context = step.getCurrentContext().getID();
	var marketDesg = node.getValue("a_Market_Designation").getSimpleValue();
	var market = LKT.getLookupTableValue("LKT_Context_to_Market", context);
	var skuWorkflow = LKT.getLookupTableValue("LKT_Context_to_SKU_Enrich_Workflows", context);
	log.info("heree")
	if (marketDesg != null && marketDesg.contains(market) && node.isInState(skuWorkflow, "NewSKUEnrich2")) {
		var wfErrorMessage = node.getWorkflowInstanceByID(skuWorkflow).getTaskByID("NewSKUEnrich2").triggerByID("Submit", "Approving SKU from UI").getScriptMessage();
		if (wfErrorMessage != null) {
			node.getValue("a_error_message").setSimpleValue(wfErrorMessage);
			return wfErrorMessage;
		}
	}

	else if (node.isInState("wf_StyleMaintenanceWorkflow", "SKUMaintenance")) {
		var wf = node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
		var wfSubmit = wf.getTaskByID("SKUMaintenance").triggerByID("ApproveSKU", "Approving SKU from Style Final Validation");
		if (wfSubmit.isRejectedByScript()) {
			return wfSubmit.getScriptMessage();
		}
	}
	return true;
}
else if (step.getCurrentWorkspace().getID() == "Approved") {
	return "Modifications not allowed in Approved workspace. Please switch to Main workspace.";
}

}