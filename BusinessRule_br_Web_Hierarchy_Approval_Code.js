/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Web_Hierarchy_Approval_Code",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Web Hierarchy Approval Code",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,portal,log) {
//
function updateTopSortOrderForExistingProducts(productsList, currentTopSortOrder, productCount, topSortedProductIDList, contextId) {

	for (var k = 0; k < productsList.length && currentTopSortOrder > 0; k++) {
		if (!topSortedProductIDList.contains(productsList[k].getProduct().getID())) {
			var existingTopSortOrder = productsList[k].getValue("a_Web_Category_Top_Sort_Order_Number").getSimpleValue()
			if (existingTopSortOrder == null)
				existingTopSortOrder = 0
			if (stepManager.getCurrentContext().getID() == contextId)
				productsList[k].getValue("a_Web_Category_Top_Sort_Order_Number").setSimpleValue(Number(existingTopSortOrder) + Number(currentTopSortOrder) - Number(productCount))
			else if (stepManager.getCurrentContext().getID() != contextId)
				productsList[k].getValue("a_Web_Category_Top_Sort_Order_Number").setSimpleValue(Number(existingTopSortOrder) + Number(currentTopSortOrder))
		}
	}
}

function displayCAProductsLater(webCategoryProductType) {

	stepManager.executeInContext('EN_US', function (enContextManager) {
		var enClassification = enContextManager.getClassificationHome().getClassificationByID(node.getID());
		var productListToBeExcluded = new java.util.ArrayList();
		enClassification.getClassificationProductLinks().toArray().forEach(function (productLink) {
			productListToBeExcluded.add(productLink.getProduct().getID());
		})
		stepManager.executeInContext('EN_CA', function (otherManager) {
			var caClassification = otherManager.getClassificationHome().getClassificationByID(node.getID());
			var productRefs = caClassification.getClassificationProductLinks().toArray();
			var filteredCAProducts = productRefs.filter(function (otherProduct) {
				if (!productListToBeExcluded.contains(otherProduct.getProduct().getID()))
					return otherProduct
			}).sort(function (product1, product2) {
				return Number(product1.getValue("a_Web_Category_Top_Sort_Order_Number").getSimpleValue()) > Number(product2.getValue("a_Web_Category_Top_Sort_Order_Number").getSimpleValue()) ? '1' : '-1'
			})
			var maxLength = productListToBeExcluded.size()

			if (webCategoryProductType == 'CC')
				webCategoryProductType = 'CustomerChoice'

			var topSortOrder = maxLength + 1
			for (var j = 0; j < filteredCAProducts.length; j++) {
				filteredCAProducts[j].getValue("a_Web_Category_Top_Sort_Order_Number").setSimpleValue(topSortOrder);
				filteredCAProducts[j].getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(20 * Number(topSortOrder));
				topSortOrder += 1
			}
		})
	})
}

function getMaxWebSortOrder(webCategoryProductType, productsList) {
	var max = productsList
		.filter(function (object) {
			return object.getProduct().getObjectType().getID() == webCategoryProductType;
		})
		.map(function (ccObject) {
			return ccObject
				.getValue("a_WebCategory_Product_Sort_Order")
				.getSimpleValue();
		})
		.reduce(function (a, b) {
			return Math.max(a, b);
		}, 0);

	return max;
}

//Doing the style and CC Validation on the web catergory and sub-category
function referencecheck(node, contextID) {
	stepManager.executeInContext(contextID, function (otherManager) {
		var othernode = otherManager.getClassificationHome().getClassificationByID(node.getID());
		var webCategoryProductType = othernode.getValue('a_WebCategory_Product_Type').getSimpleValue();
		if (webCategoryProductType == 'Style') {
			var classification = otherManager.getClassificationHome().getClassificationByID(node.getID());
			var productsList = classification.getClassificationProductLinks().toArray();

			var max = getMaxWebSortOrder(webCategoryProductType, productsList)
			var topSortOrder = 0;
			var ccsCount = 0;
			var topSortedStyleIDList = new java.util.ArrayList();
			var classificationProductLinkType = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome).getLinkTypeByID('StyleToWebSubCategoryRef');
			for (var k = 0; k < productsList.length; k++) {
				var objectType = productsList[k].getProduct().getObjectType().getID();
				if (objectType == 'CustomerChoice') {
					ccsCount += 1
					var parentStyle = productsList[k].getProduct().getParent();
					try {
						var newref = othernode.createClassificationProductLink(parentStyle, classificationProductLinkType);
						max = max + 20;
						newref.getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(max);
						newref.getValue("a_Web_Category_Top_Sort_Order_Number").setSimpleValue(++topSortOrder);
						topSortedStyleIDList.add(newref.getProduct().getID())
					}
					catch (e) {
					}
					productsList[k].delete();
				} else if (productsList[k].getValue("a_WebCategory_Product_Sort_Order").getSimpleValue() == null || productsList[k].getValue("a_WebCategory_Product_Sort_Order").getSimpleValue() == '') {
					max = max + 20;
					productsList[k].getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(max);
				}
			}

			productsList = classification.getClassificationProductLinks().toArray();
			updateTopSortOrderForExistingProducts(productsList, topSortOrder, ccsCount, topSortedStyleIDList, contextID)
		}
		else if (webCategoryProductType == 'CC') {
			var classification = otherManager.getClassificationHome().getClassificationByID(node.getID());
			var productsList = classification.getClassificationProductLinks().toArray();
			var classificationProductLinkType = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome).getLinkTypeByID('StyleToWebSubCategoryRef');

			var max = getMaxWebSortOrder("CustomerChoice", productsList)
			var topSortOrder = 0;
			var stylesCount = 0;
			var topSortedCCIDList = new java.util.ArrayList();

			for (var k = 0; k < productsList.length; k++) {
				var objectType = productsList[k].getProduct().getObjectType().getID();
				if (objectType == 'Style') {
					stylesCount += 1;
					var childCCList = productsList[k].getProduct().getChildren().toArray().sort(function (cc1, cc2) {
						return cc1.getID() > cc2.getID() ? '1' : '-1'
					});

					for (var m = 0; m < childCCList.length; m++) {
						var cc = childCCList[m];
						topSortedCCIDList.add(cc.getID())
						try {
							var newref = othernode.createClassificationProductLink(cc, classificationProductLinkType)
							max = max + 20
							newref.getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(max);
							newref.getValue("a_Web_Category_Top_Sort_Order_Number").setSimpleValue(++topSortOrder);
						}
						catch (e) {

						}
					}
					productsList[k].delete();
				} else if (productsList[k].getValue("a_WebCategory_Product_Sort_Order").getSimpleValue() == null || productsList[k].getValue("a_WebCategory_Product_Sort_Order").getSimpleValue() == '') {
					max = max + 20;
					productsList[k].getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(max);
				}
			}

			productsList = classification.getClassificationProductLinks().toArray();
			updateTopSortOrderForExistingProducts(productsList, topSortOrder, stylesCount, topSortedCCIDList, contextID)
		}
	})
}
function approvalcheck(node, contextID) {
	stepManager.executeInContext(contextID, function (otherManager) {
		var othernode = otherManager.getClassificationHome().getClassificationByID(node.getID());
		//othernode.approve();
		var categoryStartDate = othernode.getValue('a_WebCategory_Start_Date').getSimpleValue();
		if (othernode.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate == null || categoryStartDate == '')) {
			othernode.approve();
			time = new java.util.Date();
			iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
			othernode.getValue('a_WebCategory_Start_Date').setSimpleValue(iso.format(time));
			stepManager.executeInContext('EN_CA', function (otherCAManager) {
				var otherCAnode = otherCAManager.getClassificationHome().getClassificationByID(node.getID());
				var categoryStartDate = otherCAnode.getValue('a_WebCategory_Start_Date').getSimpleValue();
				if (categoryStartDate == null || categoryStartDate == '') {
					otherCAnode.getValue('a_WebCategory_Start_Date').setSimpleValue(iso.format(time));
				}
			})
		}
		else if (othernode.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate != null || categoryStartDate != '')) {
			othernode.approve();
		}
		else if (othernode.getApprovalStatus() != "Not in Approved workspace") {
			othernode.approve();
		}

	})
}

if (stepManager.getCurrentWorkspace().getID() == "Main") {
	//checking mandatory attributes
	var currentContext = stepManager.getCurrentContext().getID();
	var categoryDescription = node.getValue('a_Category_Description').getSimpleValue();
	var categoryStartDate = node.getValue('a_WebCategory_Start_Date').getSimpleValue();
	var categoryDisplayType = node.getValue('a_Category_Display_Type').getSimpleValue();

	//Below if condition is commented because of story-3025
	//if(categoryDescription == null || categoryDescription == '' || categoryDisplayType == null || categoryDisplayType == '' || categoryStartDate == null || categoryStartDate == '')
	if (categoryDescription == null || categoryDescription == '' || categoryDisplayType == null || categoryDisplayType == '') {
		throw 'Please fill the mandatory fields and try again.';
		//portal.showAlert("Error", null , "Please fill the mandatory fields and try again.");
	}



	//checking if a_Category_Display_Type == Standard:Core, then there should be atlease one product link with the category and subcategory
	var categoryDisplayType = node.getValue('a_Category_Display_Type').getSimpleValue();
	var oneProductExistFlag = false;
	/*  PPIM-7616 Deprecate VMDD
	  if(categoryDisplayType == 'Standard: Core')
	  {
		  var classification = stepManager.getClassificationHome().getClassificationByID(node.getID());
		  var productsList = classification.getClassificationProductLinks().toArray();
		  for(var k=0;k<productsList.length;k++)
		  {
			  var objectType = productsList[k].getProduct().getObjectType().getID();
			  if(objectType == 'CustomerChoice' || objectType == 'Style')
			  {
				 oneProductExistFlag = true;
			  }
		  }
		  if(oneProductExistFlag == false)
		  {
			  //throw 'There is no assigned Style or CC with this category. Please add atleast one and try again';
			  portal.showAlert("WARNING", null , "Warning : For Category Display Type Standard: Core, please ensure there are products (Style/CC) are assigned to it. In case of missing product list, the Web Category/ Web Sub Category will not display in Site");
		  }
	  }
	*/
	//copying US attributes to CA and FR
	//PPIM 4840 allow categories to be approved without product assignments
	//if((categoryDisplayType == 'Standard: Core' && oneProductExistFlag == true) || (categoryDisplayType != 'Standard: Core' && oneProductExistFlag == false))
	if ((categoryDisplayType == 'Standard: Core') || (categoryDisplayType != 'Standard: Core' && oneProductExistFlag == false)) {

		var inheritValue = node.getValue('a_WebCategory_Inherit_US').getSimpleValue();
		var attributeGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID("ag_Category_Copy_Attribute");
		var attributes = attributeGroup.getAttributes().toArray();

		if (inheritValue == 'Yes' && currentContext == "EN_US") {
			stepManager.executeInContext('EN_US', function (enContextManager) {
				var enClassification = enContextManager.getClassificationHome().getClassificationByID(node.getID());
				for (var i = 0; i < attributes.length; i++) {
					var attributeId = attributes[i].getID();
					var attributeValue = enClassification.getValue(attributeId).getSimpleValue();
					stepManager.executeInContext('EN_CA', function (caContextManager) {
						var caClassification = caContextManager.getClassificationHome().getClassificationByID(node.getID());
						caClassification.getValue(attributeId).setSimpleValue(attributeValue);
						//If 'Category Notes', 'Category Start Date' or 'Category End Date' is not empty, don't populate
						/*	if((attributeId == "a_WebCategory_Note" || attributeId == "a_WebCategory_Start_Date" || attributeId == "a_WebCategory_End_Date") 
								&& (caClassification.getValue(attributeId).getSimpleValue() != "" || caClassification.getValue(attributeId).getSimpleValue() != null)){
								//Do nothing
							} else {				
								caClassification.getValue(attributeId).setSimpleValue(attributeValue);
							}
						*/
					})
					stepManager.executeInContext('FR_CA', function (frContextManager) {
						var frClassification = frContextManager.getClassificationHome().getClassificationByID(node.getID());

						//If 'Category Notes', 'Category Start Date' or 'Category End Date' is not empty, don't populate
						if (attributeId == "a_Category_Description" && (frClassification.getValue(attributeId).getSimpleValue() == "" || frClassification.getValue(attributeId).getSimpleValue() == null)) {
							frClassification.getValue(attributeId).setSimpleValue(attributeValue);
						} else if ((attributeId == "a_WebCategory_Note" || attributeId == "a_WebCategory_Start_Date" || attributeId == "a_WebCategory_End_Date")
							&& (frClassification.getValue(attributeId).getSimpleValue() == "" || frClassification.getValue(attributeId).getSimpleValue() == null)) {
							frClassification.getValue(attributeId).setSimpleValue(attributeValue);
						} else {
							//Do nothing
						}
					})
					//PPIM-8078 - Unnat Sinha - To allow Japan Context to get attributes replicated from US if inherit is set to Yes.
					stepManager.executeInContext('EN_JP', function (jpContextManager) {
						var jpClassification = jpContextManager.getClassificationHome().getClassificationByID(node.getID());
						jpClassification.getValue(attributeId).setSimpleValue(attributeValue);
						//If 'Category Notes', 'Category Start Date' or 'Category End Date' is not empty, don't populate
						//Same logic as EN_CA
						/*  if(attributeId == "a_Category_Description" && (jpClassification.getValue(attributeId).getSimpleValue() == "" || jpClassification.getValue(attributeId).getSimpleValue() == null)){
							 jpClassification.getValue(attributeId).setSimpleValue(attributeValue);
						  } else if ((attributeId == "a_WebCategory_Note" || attributeId == "a_WebCategory_Start_Date" || attributeId == "a_WebCategory_End_Date") 
							 && (jpClassification.getValue(attributeId).getSimpleValue() == "" || jpClassification.getValue(attributeId).getSimpleValue() == null)){
							  jpClassification.getValue(attributeId).setSimpleValue(attributeValue);
						  } else {
							  //Do nothing
						  }
						  */
					})
					stepManager.executeInContext('JA_JP', function (jpContextManager) {
						var jpClassification = jpContextManager.getClassificationHome().getClassificationByID(node.getID());

						//If 'Category Notes', 'Category Start Date' or 'Category End Date' is not empty, don't populate
						if (attributeId == "a_Category_Description" && (jpClassification.getValue(attributeId).getSimpleValue() == "" || jpClassification.getValue(attributeId).getSimpleValue() == null)) {
							jpClassification.getValue(attributeId).setSimpleValue(attributeValue);
						} else if ((attributeId == "a_WebCategory_Note" || attributeId == "a_WebCategory_Start_Date" || attributeId == "a_WebCategory_End_Date")
							&& (jpClassification.getValue(attributeId).getSimpleValue() == "" || jpClassification.getValue(attributeId).getSimpleValue() == null)) {
							jpClassification.getValue(attributeId).setSimpleValue(attributeValue);
						} else {
							//Do nothing
						}
					})

				}
				/*  PPIM-7616 Deprecate VMDD
				//referencecheck called as part of PPIM-6961
				referencecheck(node, "EN_US");
				referencecheck(node, "EN_CA");
				var refs = new java.util.ArrayList();
				refs.addAll(enClassification.getClassificationProductLinks());
				var linkType = stepManager.getLinkTypeHome().getClassificationProductLinkTypeByID("StyleToWebSubCategoryRef");
				stepManager.executeInContext('EN_CA', function (otherManager) {
					var usCC = new java.util.ArrayList();
					if (refs.size() != 0) {
						var caclassification = otherManager.getClassificationHome().getClassificationByID(enClassification.getID());
						for (var j = 0; j < refs.size(); j++) {
							var sort_order = refs.get(j).getValue("a_WebCategory_Product_Sort_Order").getSimpleValue();
							var top_sort_order = refs.get(j).getValue("a_Web_Category_Top_Sort_Order_Number").getSimpleValue();

							var newrefproduct = refs.get(j).getProduct();
							usCC.add(newrefproduct.getID())
							caclassification = otherManager.getClassificationHome().getClassificationByID(enClassification.getID());
							var ccRefs = caclassification.getClassificationProductLinks().toArray();
							var product = otherManager.getProductHome().getProductByID(newrefproduct.getID());
							try {
								var filteredCaCC = ccRefs.filter(function (caCC) {
									if (caCC.getProduct().getID() == newrefproduct.getID())
										return caCC
								})
								var newref = null;
								if (filteredCaCC.length > 0 && filteredCaCC[0].getProduct().getID() == product.getID())
									newref = filteredCaCC[0];
								else
									newref = product.createClassificationProductLink(caclassification, linkType);

								newref.getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(sort_order);
								newref.getValue("a_Web_Category_Top_Sort_Order_Number").setSimpleValue(top_sort_order);
							}

							catch (e) {
							}

						}
						//perform US sort and the CA sort of CC/Styles
						// displayCAProductsLater(caclassification, usCC)
						var webCategoryProductType = caclassification.getValue('a_WebCategory_Product_Type').getSimpleValue()
						displayCAProductsLater(webCategoryProductType)
					}

				})
				*/
			})

		}
		//End of the copy code



		if (inheritValue == 'Yes' && currentContext == "EN_US") {
			var coreCategoryDisplayCheck = true;
			if ((categoryDisplayType == 'Standard: Core') || (categoryDisplayType != 'Standard: Core' && oneProductExistFlag == false))
				coreCategoryDisplayCheck = false;

			if (coreCategoryDisplayCheck) {
				referencecheck(node, "EN_US");
				referencecheck(node, "EN_CA");
			}
			approvalcheck(node, "EN_US");
			approvalcheck(node, "EN_CA");
			approvalcheck(node, "FR_CA");
		}
		else if (inheritValue == 'Yes' && currentContext == "EN_CA") {
			referencecheck(node, currentContext);
			portal.showAlert("Error", null, "Approval needs to happen in US context.");
		}
		else if (inheritValue == 'Yes' && currentContext == "FR_CA") {
			referencecheck(node, currentContext);
			portal.showAlert("Error", null, "Approval needs to happen in US context.");
		}
		else if (inheritValue == 'No') {
			referencecheck(node, currentContext);
			//node.approve();
			if (node.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate == null || categoryStartDate == '')) {
				node.approve();
				time = new java.util.Date();
				iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
				node.getValue('a_WebCategory_Start_Date').setSimpleValue(iso.format(time));
			}
			else if (node.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate != null || categoryStartDate != '')) {
				//try/catch & error message added as part of Web Category Experience Improvement PPIM-4889
				try {
					node.approve();
				}
				catch (e) {
					portal.showAlert("Error", "Error", "Parent Category is not approved yet, Please approve it first and then approve child category");
				}
			}
			else if (node.getApprovalStatus() != "Not in Approved workspace") {
				node.approve();
			}
		}
		/*else if (inheritValue == null || inheritValue == '')
		{
			portal.showAlert("Warning", null , "Attribute 'Inherit Category Attributes from US' is a mandatory field for object approval.");
		}*/
	}
}
}