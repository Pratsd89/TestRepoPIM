/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Move",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TEST Move Web Category",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "slug"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "WebUiContextBind",
    "alias" : "web",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
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
    "contract" : "BusinessActionBindContract",
    "alias" : "Save_Category",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Web_Hierarchy_Sort_Order_Buffer",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (web,log,LKT,step,Save_Category,slug) {
/*
	RULE STARTS HERE
*/
// table
const table = {
	EN_US: {
		EN_US: true, EN_CA: false, EN_JP: false, "EN_US;EN_CA": "CAN market.", "EN_US;EN_JP": "JPN market.", "EN_CA;EN_JP": false, "EN_US;EN_CA;EN_JP": "CAN & JPN markets."
	},
	EN_CA: {
		EN_US: false, EN_CA: true, EN_JP: false, "EN_US;EN_CA": false, "EN_US;EN_JP": false, "EN_CA;EN_JP": "JPN market.", "EN_US;EN_CA;EN_JP": false
	},
	EN_JP: {
		EN_US: false, EN_CA: false, EN_JP: true, "EN_US;EN_CA": false, "EN_US;EN_JP": false, "EN_CA;EN_JP": false, "EN_US;EN_CA;EN_JP": false
	}
};

function getBrandNumber(category) {
	//get category object type
	var type = category.getObjectType().getID();
	displayLog.push("\n - Category Object Type is: " + type);

	//get parent
	var parent = category.getParent();

	//get parent object type
	var parentType = parent.getObjectType().getID();
	displayLog.push("\n - First Parent Object Type is: " + parentType);

	//if category object type is WebCategory || WebSubCategory || WebDivision
	if (type == "WebSubCategory" || type == "WebCategory" || type == "WebDivision") {
		//then keep getting parent until type is WebBU
		while (parentType != "WebBU") {
			parent = parent.getParent();

			parentType = parent.getObjectType().getID();
		}
		displayLog.push("\n - Final Parent Found. Object Type is: " + parentType + ".\n<-- Getting Brand Number...");

		//get a_Brand_Number
		var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
	}

	//else get Brand Number
	else {
		displayLog.push("\n<-- Getting Brand Number...");
		var brandNum = category.getValue("a_Brand_Number").getSimpleValue();
	}

	displayLog.push("\n - Brand Number is: " + brandNum);
	return brandNum;
}

//Get todays date
var today = java.time.ZonedDateTime.now();

//set a_main_last_modified_date on new category
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

//array for webUI log message
var displayLog = new Array();

//get selected categories
var selected = web.getSelection().iterator();

//for each selected category
while (selected.hasNext()) {
	//current selected category
	var cat = selected.next(); displayLog.push("\nCurrent category is: " + cat.getID());

	//get categories from picker
	var pickerClass = web.getSelectedSetOfNodes();
	var pickerClassIter = pickerClass.iterator();

	if (pickerClass.size() == 1) {
		//for each picker category
		while (pickerClassIter.hasNext()) {
			//current picker category
			var picked = pickerClassIter.next(); displayLog.push("\nCurrent picked category is: " + picked.getID());

			var updateParent = false;

			//get the brand number for the category
			var catBrandNumber = getBrandNumber(cat);

			//For each applicable Market, set the sort order for the parent categories child categories
			var pickedBrandNumber = getBrandNumber(picked);

			if (catBrandNumber == pickedBrandNumber) {
				var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", pickedBrandNumber);
				var currentContext = step.getCurrentContext().getID();
				var checkArray = [];
				var activeMarkets = [];
				var activeParentMarkets = [];

				if (markets.contains(";")) {
					markets.split(";").forEach(function (ctxt) {
						checkArray.push(ctxt);
					});
				}
				else {
					checkArray.push(markets);
				}

				//for each “Market/Context”
				checkArray.forEach(function (ctxt) {
					//determine if category is active 
					// Start Date is not null, End Date in Future OR Start Date is not null, End Date is null
					step.executeInContext(ctxt, function (manager) {
						var cntxtParentCat = manager.getClassificationHome().getClassificationByID(picked.getID());
						var cntxtParentCatStart = cntxtParentCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
						var cntxtParentCatEnd = cntxtParentCat.getValue("a_WebCategory_End_Date").getSimpleValue();
						var cntxtCat = manager.getClassificationHome().getClassificationByID(cat.getID());
						var cntxtCatStart = cntxtCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
						var cntxtCatEnd = cntxtCat.getValue("a_WebCategory_End_Date").getSimpleValue();

						if ((cntxtParentCatStart != null && cntxtParentCatEnd > today) || (cntxtParentCatStart != null && cntxtParentCatEnd == null)) {
							activeParentMarkets.push(ctxt);
						}
						if ((cntxtCatStart != null && cntxtCatEnd > today) || (cntxtCatStart != null && cntxtCatEnd == null)) {
							activeMarkets.push(ctxt);
						}
					});
				});

				if (!(activeMarkets.length > activeParentMarkets.length)) {

					var allowMove = table[currentContext][activeMarkets.join(";")];

					//determine if Move can apply (i.e. check current context against active markets in table
					if (allowMove != false) {
						checkArray.forEach(function (mkt) {
							displayLog.push("\n<-> Copying attributes in market: <b style='color:Green;'>" + mkt + "</b>");

							step.executeInContext(mkt, function (manager) {
								//fetch context specific selected category
								var cntxtCat = manager.getClassificationHome().getClassificationByID(cat.getID());
								//fetch context specific target parent category
								var newParentCat = manager.getClassificationHome().getClassificationByID(picked.getID());
								//set variables to determine if category is active
								var cntxtCatStart = cntxtCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
								var cntxtCatEnd = cntxtCat.getValue("a_WebCategory_End_Date").getSimpleValue();

								var newParentChildCats = newParentCat.getChildren().toArray();
								displayLog.push("\n - Number of child cats found is: " + newParentChildCats.length);

								if (cntxtCatStart != null && cntxtCatEnd > today || cntxtCatStart != null && cntxtCatEnd == null) {
									updateParent = true;

									cntxtCat.getValue('a_WebCategory_Sort_Order').setSimpleValue("1");
									displayLog.push("\n - New sort order value is: 1 in context " + mkt);

									if (activeMarkets) {
										if (activeMarkets.indexOf("EN_US") == -1 && currentContext != "EN_US") {
											var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
											var inheritAtt = "a_" + currentMarket + "_Inherit_Option";
											var parentInheritOption = cntxtCat.getParent().getValue(inheritAtt).getSimpleValue();

											if (parentInheritOption == "Attributes & Sort Order") {
												cntxtCat.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue("Yes");
											}
										}
									}
								}
								else {
									cntxtCat.getValue('a_WebCategory_Sort_Order').setSimpleValue("999999");
								}
							});
						});

						if (allowMove != true) {
							web.showAlert("WARNING", "This move also caused Category to move in the " + allowMove);
						}
					}
					else {
						if (activeMarkets.indexOf(currentContext) == -1) {
							throw "\n<b>Moving this category is not allowed in " + currentContext + ". Please work with a " + activeMarkets[0].split("_")[1] + " merchant to move this category.</b>";
						}
					}
				}
				else {
					var pickedObjectType = picked.getObjectType().getName();
					var catCID = cat.getValue("a_WebCategory_CID").getSimpleValue();

					throw "\n<b>Unable to move web category with CID " + catCID + ". This category is currently active in market(s) " + activeMarkets + ", but the selected " + pickedObjectType + " is only active in market(s) " + activeParentMarkets + ". Please work with all merchants and adjust start/end dates prior to moving this category.</b>";
				}
			}
			else {
				throw "\n<b>You cannot move a web category under " + catBrandNumber + " to a different web hiearchy.</b>";
			}

			//Move the selected web category to the picked parent category
			cat.setParent(picked);

			// publish the new parent category and the moved category with all changes
			displayLog.push("\nSetting last modify date to: " + iso.format(time));
			cat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

			// get children of selected category
			if (cat.getObjectType().getID() == "WebCategory") {
				var subCats = cat.getChildren().toArray();

				// publish child categories
				if (subCats != null) {
					subCats.forEach(function (subCat) {
						subCat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
						displayLog.push("\nSetting last modify date on subCat " + subCat.getID() + " to: " + iso.format(time));
					});
				}
			}

			if (updateParent == true) {
				Save_Category.execute(picked);
			}
		}
	}
	else {
		throw "<b>You cannot move categories to multiple parents. Please select only one new parent to move the category to.</b>";
	}
}

//final display message. comment out line when not in development
//web.showAlert("Warning", "Selected Nodes:", displayLog);
}
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
    "contract" : "AttributeBindContract",
    "alias" : "divisionSlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Division_Slug",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
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
    "contract" : "AttributeBindContract",
    "alias" : "categorySlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Slug",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "subCategorySlug",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_SubCategory_Slug",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "Natural_Language_URL",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Natural_Language_URL",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,divisionSlug,queryHome,stepManager,categorySlug,subCategorySlug,Natural_Language_URL,web,slug) {
//global variable to check the Context 
//var currentContext=stepManager.getCurrentContext().getID();
//br_move_Web_Cat
var selected = web.getSelection().iterator();
while (selected.hasNext()) {
    var node = selected.next();
    var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
    var objectType = node.getObjectType().getID();
    log.info(objectType);
    var divisionNLUExists = node.getValue("a_Natural_Language_URL").getSimpleValue();
    var CANInheritOption = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
    var children = node.getChildren().toArray();
    var slugpath = node.getValue("a_Natural_Language_URL").getSimpleValue();


    if (objectType == "WebCategory") {
    	  // node.getValue("a_SEO_Page_Title").setSimpleValue(null);
    	   //node.getValue("a_SEO_Meta_Description").setSimpleValue(null);
    	   //var BusinessRuleHome = stepManager.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
    	   //BusinessRuleHome.getBusinessActionByID("br_SEOPageTitleGeneration").execute(node);
    	   //BusinessRuleHome.getBusinessActionByID("br_SEO_PopulatePageDescription").execute(node);

        var categorySlugValue = slug.slugify(String(stiboValue), {
            locale: "en"
        });
        if (categorySlugValue.length > 60) {
            categorySlugValue = categorySlugValue.slice(0, 60);
        }

        var modifiedCategorySlugValue = categorySlugValue;
        var nluCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedCategorySlugValue;
        var isURLExists = searchExistingNaturalURL(nluCategory, Natural_Language_URL, node.getParent().getParent());
        var OldCategorySlug = node.getValue('a_Old_Category_Slug').getSimpleValue();
		//setValuesAcrossContexts(node);
		// added to populate a_Old_Natural_Langauge_URL
		var ctySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
        if (isURLExists != 0) {
        	  var ctyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
        	  web.showAlert("WARNING", "<b> Moved  Web Category " + node.getID() + " with CID " +  ctyCID + " is having Category slug name same as one off the active WebCategory ,Please review slug name by updating category description for WebCategory "+ node.getID()+" and generate slug path for it's children.</b>");
            node.getValue('a_WebCategory_Note').setSimpleValue(stiboValue);
            node.getValue('a_Category_Description').setSimpleValue(null);
            node.getValue('a_Division_Slug').setSimpleValue(null);
            node.getValue("a_Natural_Language_URL").setSimpleValue(null);
        } else {
            node.getValue('a_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue('a_Old_Category_Slug').setSimpleValue(modifiedCategorySlugValue);
            node.getValue("a_Natural_Language_URL").setSimpleValue(nluCategory);
			// added to populate a_Old_Natural_Langauge_URL
			var updatedCtySlugVaue = node.getValue("a_Natural_Language_URL").getSimpleValue();
			if(ctySlugValue != updatedCtySlugVaue){node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(ctySlugValue);}
        	
            web.showAlert("ACKNOWLEDGMENT", "<b> The  Web Category has been moved successfully</b>");
        }

        var children = node.getChildren().toArray();
        for (var j in children) {
            WebSubCategory(children[j]);
        }
    } else if (objectType == "WebSubCategory") {

        WebSubCategory(node);
    }
}

function WebSubCategory(node) { //(objectType == "WebSubCategory")
   //var stiboValue = node.getValue('a_Category_Description').getSimpleValue();
  // node.getValue("a_SEO_Page_Title").setSimpleValue(null);
   //node.getValue("a_SEO_Meta_Description").setSimpleValue(null);
   //var BusinessRuleHome = stepManager.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
   //BusinessRuleHome.getBusinessActionByID("br_SEOPageTitleGeneration").execute(node);
   //BusinessRuleHome.getBusinessActionByID("br_SEO_PopulatePageDescription").execute(node);
   
   var slugpath = node.getValue("a_Natural_Language_URL").getSimpleValue();
    var subCategorySlugValue = slug.slugify(String(stiboValue), {
        locale: "en"
    });
    if (subCategorySlugValue.length > 60) {
        subCategorySlugValue = subCategorySlugValue.slice(0, 60);
    }

    var modifiedSubCategorySlugValue = subCategorySlugValue;
    var nluSubCategory = node.getParent().getValue('a_Natural_Language_URL').getSimpleValue() + "/" + modifiedSubCategorySlugValue;
    var isURLExists = searchExistingNaturalURL(nluSubCategory, Natural_Language_URL, node.getParent().getParent().getParent());
    var OldSubCategorySlug = node.getValue('a_Old_SubCategory_Slug').getSimpleValue();
	// added to populate a_Old_Natural_Langauge_URL
	var subCtySlugValue = node.getValue("a_Natural_Language_URL").getSimpleValue();
	//setValuesAcrossContexts(node);
    if (isURLExists != 0) {
        var SubCtyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
        web.showAlert("WARNING", " <b>Moved Web SubCategory " + node.getID() + " with CID " +  SubCtyCID + " is having Sub Category Slug name same as one off the active Web sub category, Please review slug name by updating category description for Web Sub Category "+ node.getID()+".</b>");
        node.getValue('a_WebCategory_Note').setSimpleValue(stiboValue);
        node.getValue('a_Category_Description').setSimpleValue(null);
        node.getValue('a_Division_Slug').setSimpleValue(null);
        node.getValue("a_Natural_Language_URL").setSimpleValue(null);

    } else {

        node.getValue('a_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
        node.getValue('a_Old_SubCategory_Slug').setSimpleValue(modifiedSubCategorySlugValue);
        node.getValue("a_Natural_Language_URL").setSimpleValue(nluSubCategory);
		// added to populate a_Old_Natural_Langauge_URL
		var updatedSubCtySlugVaue = node.getValue("a_Natural_Language_URL").getSimpleValue();
		if(subCtySlugValue != updatedSubCtySlugVaue){node.getValue("a_Old_Natural_Langauge_URL").setSimpleValue(subCtySlugValue);}
        	
        web.showAlert("ACKNOWLEDGMENT", "<b> The  Web Sub Category has been moved successfully</b>");
    }

}


if (CANInheritOption != null) {
    if (objectType == "WebDivision") {
        var Attributes = ['a_Division_Slug', 'a_Old_Division_Slug', 'a_Natural_Language_URL'];
        for (var m in Attributes) {
            CopyAttributeValues(node, Attributes[m]);
        }
        var children = node.getChildren().toArray();
        for (var j in children) {
            CopyWebCategoryAttributes(children[j]);
        }
		//setValuesAcrossContexts(node);
    }
    if (objectType == "WebCategory") {
        CopyWebCategoryAttributes(node);
			//setValuesAcrossContexts(node);
    }
    if (objectType == "WebSubCategory") {
        CopySubCategoryAttributes(node);
			//setValuesAcrossContexts(node);
    }
}

function searchExistingNaturalURL(nluValue, Attribute, Parent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(Parent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(nluValue))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
}


function searchExistingSlugValue(slugValue, objectType, slugType) {
    var condition = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(
        condition.valueOf(slugType).eq(slugValue)
        .and(condition.objectType(stepManager.getObjectTypeHome().getObjectTypeByID(objectType)))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
}

function generateSequenceNumber() {
    const timestamp = new Date().getTime();
    const sequenceNumber = timestamp.toString().slice(-6);
    return sequenceNumber;
}


function CopyAttributeValues(node, attributeID) {
    //log.info("attributeID="+attributeID);
    var AttributeValue;
    stepManager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
        AttributeValue = currentContextNode.getValue(attributeID).getSimpleValue();
        //log.info("AttributeValue="+AttributeValue);
        if (AttributeValue != null) {
            var context = ["EN_CA"];
            for (var j in context) {
                stepManager.executeInContext(context[j], function(currentContextManager) {
                    //log.info("context="+context[j]);
                    var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
                    currentContextNode.getValue(attributeID).setSimpleValue(AttributeValue);
                });
            }
        }
    });
}

function CopyWebCategoryAttributes(node) {
    var Attributes = ["a_Category_Slug", "a_Old_Category_Slug", "a_Natural_Language_URL", "a_Web_Catergory_Start_Time"];
    for (var m in Attributes) {
        CopyAttributeValues(node, Attributes[m]);
    }
    var children = node.getChildren().toArray();
    for (var k in children) {
        CopySubCategoryAttributes(children[k]);
    }
}

function CopySubCategoryAttributes(node) {
    var Attributes = ["a_SubCategory_Slug", "a_Old_SubCategory_Slug", "a_Natural_Language_URL"];
    for (var m in Attributes) {
        CopyAttributeValues(node, Attributes[m]);
    }
}



}