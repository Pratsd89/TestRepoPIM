/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Revive_WithoutWEBUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Revive Web Category(DELETE)(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : true,
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
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "Natural_Language_URL",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Natural_Language_URL",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,queryHome,Natural_Language_URL) {
function getWebBU(node) {
	var parent = node.getParent();
	var parentObjectType = parent.getObjectType().getID();

	//then keep getting parent until type is WebBU
	while (parentObjectType != "WebHierarchyArchiveBU") {
		if (parentObjectType == "WebBU") {
			break;
		}
		parent = parent.getParent();
		parentObjectType = parent.getObjectType().getID();
	}

	return parent;
}

function getRevivableParent(node) {
	var parent = node.getParent();
	var oldParentValue = parent.getValue("a_Old_Category_Parent").getSimpleValue();
	var parentObjectType = parent.getObjectType().getID();

	//then keep getting parent until old parent value is populated
	while (oldParentValue == null) {
		//stop running while loop if parent object type returns to WebBU
		if (parentObjectType == "WebBU" || parentObjectType == "WebHierarchyArchiveBU") {
			throw ("Unable to find parent category needing revived. Please contact Tech support.");
		}
		parent = parent.getParent();
		oldParentValue = parent.getValue("a_Old_Category_Parent").getSimpleValue();
		parentObjectType = parent.getObjectType().getID();
	}

	return parent;
}

//get start and end dates to determin if cat can be revived
var startDate = node.getValue("a_WebCategory_Start_Date").getSimpleValue();
var endDate = node.getValue("a_WebCategory_End_Date").getSimpleValue();

//get current date
var today = java.time.ZonedDateTime.now();
var objectType = node.getObjectType().getID();
log.info("start");
//only allow revive when the category is re-activated
if (startDate != null && endDate == null || startDate != null && endDate > today) {
	log.info("Exe");
	// if inheriting from US, do not allow revive in other markets
	var currentContext = step.getCurrentContext().getID();
	var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
	//only allow revive when the old parent is active & node is under archive
	var oldParentID = node.getValue("a_Old_Category_Parent").getSimpleValue();
	var oldParent = step.getClassificationHome().getClassificationByID(oldParentID);
	var webBU = getWebBU(node);
	var webBUType = webBU.getObjectType().getID();

	if (oldParentID != null && webBUType == "WebHierarchyArchiveBU") {
		var parentWebBU = null;
		var parentWebBUType = null;

		if (objectType != "WebDivision") {
			
			parentWebBU = getWebBU(oldParent);
			parentWebBUType = parentWebBU.getObjectType().getID();
		}
		else {
			
			parentWebBU = oldParent;
			parentWebBUType = parentWebBU.getObjectType().getID();
		}

		if (parentWebBUType != "WebHierarchyArchiveBU") {
			var wrongMarket = false;

			if (currentMarket != "US") {
				var inheritATT = "a_" + currentMarket + "_Inherit_Option";
				var inheritOption = node.getValue(inheritATT).getSimpleValue();

				if (inheritOption != null) {
					wrongMarket = true;
					throw ("\n<b>The category you are trying to Revive is set to inherit attributes from the US market. Please switch to EN_US to modify this category or remove value for " + currentMarket + " - Inherit Option.</b>");
				}
			}

			//finally allow revival of category
			if (wrongMarket == false) {
				var brandNum = parentWebBU.getValue("a_Brand_Number").getSimpleValue();
				var mktContexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);
				var mktContextsArray = [];

				if (mktContexts.contains(";")) {
					//split on ";"
					mktContexts.split(";").forEach(function (currMktContext) {
						mktContextsArray.push(currMktContext);
					});
				}
				else {
					mktContextsArray.push(mktContexts);
				}

				//revive cat
				node.setParent(oldParent);
				checkNLUDuplicacy(node);
				node.getValue("a_Old_Category_Parent").setValue("");
				node.getValue("a_Old_Category_Path").setValue("");
				

				//fix sort orders
				if (objectType != "WebDivision") {
					//set sort order to "999999" in all markets to ensure inherit actions run appropriately to set new sorts
					mktContextsArray.forEach(function (mktCntxt) {
						step.executeInContext(mktCntxt, function (manager) {
							var cntxtNode = manager.getClassificationHome().getClassificationByID(node.getID());

							cntxtNode.getValue("a_WebCategory_Sort_Order").setValue("999999");
						});
					});
				}
				else {
					//identify markets where sort order was set to end
					var sortedMkts = null;

					//set sort order in all markets
					mktContextsArray.forEach(function (mktCntxt) {
						step.executeInContext(mktCntxt, function (manager) {
							var currentMkt = LKT.getLookupTableValue("LKT_Context_to_Market", mktCntxt);
							var cntxtNode = manager.getClassificationHome().getClassificationByID(node.getID());
							var cntxtStart = cntxtNode.getValue("a_WebCategory_Start_Date").getSimpleValue();
							var cntxtEnd = cntxtNode.getValue("a_WebCategory_End_Date").getSimpleValue();

							//determine if cat is inheriting Sort Order from US and set sort accordingly
							var inheritFromUS = cntxtNode.getValue("a_WebCategory_SortOrder_Inherit_US").getSimpleValue();

							//get all child cats to set new sorts
							var newParentChildCats = cntxtNode.getParent().getChildren().toArray();
							var sortOrder = 0;

							//only set sort order in active markets unless inheriting from US
							if (cntxtStart == null || cntxtEnd < today) {
								if (inheritFromUS != "Yes") {
									cntxtNode.getValue('a_WebCategory_Sort_Order').setSimpleValue(null);
								}
							}
							else {
								for (var j = 0; j < newParentChildCats.length; j++) {
									var existingSortOrder = newParentChildCats[j].getValue('a_WebCategory_Sort_Order').getValue();

									existingSortOrder = parseInt(existingSortOrder);

									if (existingSortOrder > sortOrder) {
										sortOrder = existingSortOrder;
									}
								}
								// set the new sort order value for the moved category
								var newSortOrder = parseInt(sortOrder) + 2;

								cntxtNode.getValue('a_WebCategory_Sort_Order').setSimpleValue(newSortOrder);

								if (sortedMkts == null) {
									sortedMkts = currentMkt;
								}
								else if (sortedMkts.indexOf(currentMkt) == -1) {
									sortedMkts = sortedMkts + ";" + currentMkt;
								}
							}
						});
					});
					//notify user of sort order change(s)
					if (sortedMkts != null) {
						//webUI.showAlert("WARNING", "The revived Web Division was moved to bottom of Web Division list in market(s) " + sortedMkts + ". Please navigate to parent Web BU and adjust accordingly, for all applicable markets.");
					}
				}
			}
		}
		else {
			var oldParentCID = oldParent.getValue("a_WebCategory_CID").getSimpleValue();
			var oldParentObjectType = oldParent.getObjectType().getName();

			//webUI.showAlert("WARNING", "The old parent " + oldParentObjectType + " with CID " + oldParentCID + " is in the Archive. Please revive the old " + oldParentObjectType + " before reviving this category.");
		}
	}
	else if (oldParentID == null && webBUType == "WebHierarchyArchiveBU") {
		var archivedParent = getRevivableParent(node);
		var archivedParentCID = archivedParent.getValue("a_WebCategory_CID").getSimpleValue();;
		var archivedParentObjectType = archivedParent.getObjectType().getName();

		//webUI.showAlert("WARNING", "The old parent " + archivedParentObjectType + " with CID " + archivedParentCID + " is in the Archive. Please revive the old " + archivedParentObjectType + " to revive this category.");
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

function checkNLUDuplicacy2(node){
	
	var nodeObjectType = node.getObjectType().getID();
	var parentObjectType = node.getParent().getObjectType().getID();
	var naturalLanguageURL = node.getValue("a_Natural_Language_URL").getSimpleValue();
	if(naturalLanguageURL!=null){
	var count=searchExistingNaturalURL(naturalLanguageURL,Natural_Language_URL,node.getParent());
     if(count!=0){
     	 var SubCtyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
     	 webUI.showAlert("WARNING", " <b>Archive Web SubCategory " + node.getID() + " with CID " +  SubCtyCID + " is having Sub Category Slug name same as one off the active Web sub category, Please review slug name by updating category description for Web Sub Category "+ node.getID()+".</b>");
     	}
	
		}
	
	}

function checkNLUDuplicacy(node){
	log.info("TEST");
	var objectType = node.getObjectType().getID();
	// arhive Object type for subcategory :  Web Sub Category 
	//archive object type for category : Web Category
	//archive object type for Division : Web Division
	if (objectType == "WebSubCategory")
	{
	     //return the sub category a_Natural_Language_URL from the Archive Web Sub category , and the same will be
		 //Used to compare with the sub category a_Natural_Language_URL in the active web Hierarchy 
	     var archiveNlurl = node.getValue("a_Natural_Language_URL").getSimpleValue();
		 log.info("archiveNlurl  --->  " +archiveNlurl);	
	     // this will be fetched from the Archive Web Sub category 
		 if(archiveNlurl != null){
	   	 var oldParentOfWebSubCtyID =  node.getValue("a_Old_Category_Parent").getSimpleValue();
	      var oldParentObjForSubCty = step.getClassificationHome().getClassificationByID(oldParentOfWebSubCtyID);
	      var isSubCategoryExists=  nlurlExists(archiveNlurl,Natural_Language_URL,oldParentObjForSubCty);
	      log.info("isSubCategoryExists   "+ isSubCategoryExists);
				  if(isSubCategoryExists!= 0 ){
				  var SubCtyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
				 //set category Name and Natural LangaugeURL as blank and Display information message 
				// node.getValue("a_Category_Description").setValue("");
				node.getValue("a_Natural_Language_URL").setValue("");
				node.getValue("a_SubCategory_Slug").setValue("");
				// webUI.showAlert("WARNING", " <b>Archive Web SubCategory " + node.getID() + " with CID " +  SubCtyCID + " is having Sub Category Slug name same as one off the active Web sub category, Please review slug name by updating category description for Web Sub Category "+ node.getID()+".</b>");
					  }else{

					log.info("there is no matching sub Category Description below category  "+oldParentOfWebSubCtyID+"  hence not setting as null ");
				  }
		  }
	} else if (objectType == "WebCategory")
	{
		// get natural language url value for the web category which is moving to active web hierarchy from the Archive
		// This will be used to compare the categories for which there is same NLU in the active Web Hierarchy 
		var archiveNluForCty = node.getValue("a_Natural_Language_URL").getSimpleValue();
		if(archiveNluForCty != null )
		{
			   	 var oldParentIDOfWebCty = node.getValue("a_Old_Category_Parent").getSimpleValue();
			   	 if(oldParentIDOfWebCty !=null){
				 var oldParentObjForCty = step.getClassificationHome().getClassificationByID(oldParentIDOfWebCty);
				 var isCategoryExists=  nlurlExists(archiveNluForCty,Natural_Language_URL,oldParentObjForCty);

					if(isCategoryExists != 0 ){
					var ctyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
				   //set category Name for category and children categories as blank and Display information message 
				   // setting the Category description for all the categories and sub categories under which the NLU is matching 
				   	//node.getValue("a_Category_Description").setValue(null);
					node.getValue("a_Natural_Language_URL").setValue(null);
					node.getValue("a_Category_Slug").setValue(null);
					
				   	var cntxtNode = stepManager.getClassificationHome().getClassificationByID(node.getID());
				   	var childernSubCategories = cntxtNode.getChildren().toArray();
					for (var j = 0; j < childernSubCategories.length; j++) {
						//set a_Natural_Language_URL as null at the Sub category level 
						childernSubCategories[j].getValue("a_Natural_Language_URL").setValue(null);
						}
					webUI.showAlert("WARNING", "<b> Archive  Web Category " + node.getID() + " with CID " +  ctyCID + " is having Category slug name same as one off the active WebCategory ,Please review slug name by updating category description for WebCategory "+ node.getID()+" and generate slug path for it's children.</b>");
					  }else{

					log.info("There is no matching Category Description for "+oldParentIDOfWebCty+"  hence not setting as null ");
				  }
		}
		}
	}else{
		// get natural language url value for the Division category which is moving to active web hierarchy from the Archive
		// This will be used to compare the categories for which there is same NLU in the active Web Hierarchy 
		var archiveNluForDivision = node.getValue("a_Natural_Language_URL").getSimpleValue();
		if(archiveNluForDivision != null )
		{
			   	 var oldParentForDivision = node.getValue("a_Old_Category_Parent").getSimpleValue();
				 // Parent object type 
				 var oldParentObjectForDivision = step.getClassificationHome().getClassificationByID(oldParentForDivision);
				 // find if the a_Natural_Language_URL is unique or not 
				 var isDivisionExists=  nlurlExists(archiveNluForDivision,Natural_Language_URL,oldParentObjectForDivision);
					if(isDivisionExists!= 0 ){
						var divisionCID = node.getValue("a_WebCategory_CID").getSimpleValue();
				  	  // to set Category description and a_Natural_Language_URL for the Division to the reviving web category archive
					 // node.getValue("a_Category_Description").setValue(null);
					  node.getValue("a_Natural_Language_URL").setValue(null);
					  node.getValue("a_Division_Slug").setValue(null);
					  // Set all the category description to null for all the categories under the division 
					  	var divisionNode = step.getClassificationHome().getClassificationByID(node.getID());
						var childernCategories = divisionNode.getChildren().toArray();
						for (var ctyIndex = 0; ctyIndex < childernCategories.length; ctyIndex++) {
							//set a_Natural_Language_URL as null at the category level 
							childernCategories[ctyIndex].getValue("a_Natural_Language_URL").setValue(null);
							var subCtyNode = childernCategories[ctyIndex].getChildren().toArray();
							for (var subCtyIndex = 0; subCtyIndex < subCtyNode.length; subCtyIndex++) {
							//set a_Natural_Language_URL as null at the sub category level 
							subCtyNode[subCtyIndex].getValue("a_Natural_Language_URL").setValue(null);
							}
						}
						webUI.showAlert("WARNING", "<b> Archive Division " + node.getID() + " with CID " +  divisionCID + " is having Division slug name same as one off the active Division ,Please review slug name by updating category description for Division "+ node.getID()+" and generate slug path for it's children.</b>");
					  }else{

					log.info("There is no matching Category Description for "+oldParentForDivision+"  Division hence not setting as null ");
				  }
		}
	}
	}

function nlurlExists(archiveNlurl, Attribute, OldParent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(OldParent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(archiveNlurl))
    );
    var result = querySpecification.execute();
	//log.info("result   " +result);
    return result.asList(500).size();
}
		

	


}