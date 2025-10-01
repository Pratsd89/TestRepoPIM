/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveCC_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Approve CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (portal,log,node,stepManager,LKT,sizeModelRef,webUI,compCheck) {


checkSKUDimensionForCC(node, stepManager)

//PPIM-12814
function checkSKUDimensionForCC(cc, step) {
	var logArray = new Array();
	var CCLcs = cc.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
	var children = cc.getChildren();
	var expectOnlyDim1 = false;
	var expectBoth = false;
	var varaintDimMap =  new java.util.HashMap();
	var dimDifferences ="";
	if (children.size() > 0) {
		if (CCLcs != "Waiting for Style Approval") {
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
						//PPIM-15068 

						//approvedSkus.push(sku);
						log.info(variant)
						var dim2DimValue = refSizeCode.getValue("a_Dim2_Dimension_value").getSimpleValue();
						if(!dimDifferences.includes(variant)){
						if (dim1DimValue && (!dim2DimValue || dim2DimValue == "")) {
							if(!varaintDimMap.get(variant)){
								varaintDimMap.put(variant,"expectOnlyDim1")
							}else{
								dimDifferences +=variant+",";
							}
							//expectOnlyDim1 = true;

						} else if (dim1DimValue && dim2DimValue && (dim1DimValue != "" && dim2DimValue != "")) {
							if(!varaintDimMap.get(variant)){
								varaintDimMap.put(variant,"expectBoth")
							}else{
								dimDifferences +=variant;
							}							
							//expectBoth = true;
						}
					}
					}
				}
			}
			//if (expectOnlyDim1 && expectBoth) {
				if(dimDifferences!=""){
				log.info("This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them. "+dimDifferences)
				return "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.";
				//webUI.showAlert("ERROR", "This style has discrepancies in Dim1-Dim2 Pattern,Please Correct them.")
				//dim_dif = true;
				//return false;
			}
			return true;
		}
		return true;
	} else {
		return "CC does not have any SKUs."
	}
}
}