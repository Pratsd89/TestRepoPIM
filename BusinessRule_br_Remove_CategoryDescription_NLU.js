/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Remove_CategoryDescription_NLU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Remove_CategoryDescription_NLU",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "alias" : "categoryDescription",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Description",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "naturalLanguageURL",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Natural_Language_URL",
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
exports.operation0 = function (node,queryHome,stepManager,categoryDescription,naturalLanguageURL,webUI) {
//br_Remove_CategoryDescription_NLU, is to remove the category name of the parent and Natural Language Urls for children while reviving from Web Category Archive 
// https://gapinc.atlassian.net/browse/PPIM-12545 
// To check if the 
function isObjectTypeArchive(node) {
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

	return parentObjectType;
}
// Function will return the Natural Language URL for the Old Parent under which division/category/Sub Category will be moved to 
function nlurlExists(archiveNlurl, Attribute, OldParent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(OldParent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(archiveNlurl))
    );
    var result = querySpecification.execute();
	log.info("result   " +result);
    return result.asList(500).size();
}
	
	var objType  = isObjectTypeArchive(node);
	// This check is to run business rule if save is attempted only in "Web Hierarchy Archive" there is no need to trigger this rule when save is triggered on Web Hierarchy 
if(objType == "WebHierarchyArchiveBU" ){
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
	      var oldParentObjForSubCty = stepManager.getClassificationHome().getClassificationByID(oldParentOfWebSubCtyID);
	      var isSubCategoryExists=  nlurlExists(archiveNlurl,naturalLanguageURL,oldParentObjForSubCty);
	      log.info("isSubCategoryExists   "+ isSubCategoryExists);
				  if(isSubCategoryExists!= 0 ){
				  var SubCtyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
				 //set category Name and Natural LangaugeURL as blank and Display information message 
				 node.getValue("a_Category_Description").setValue("");
				 webUI.showAlert("WARNING", " <b>Archive Web SubCategory " + node.getID() + " with CID " +  SubCtyCID + " is having Sub Category Slug name same as one off the active Web sub category, Please review slug name by updating category description for Web Sub Category "+ node.getID()+".</b>");
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
				 var oldParentObjForCty = stepManager.getClassificationHome().getClassificationByID(oldParentIDOfWebCty);
				 var isCategoryExists=  nlurlExists(archiveNluForCty,naturalLanguageURL,oldParentObjForCty);

					if(isCategoryExists != 0 ){
					var ctyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
				   //set category Name for category and children categories as blank and Display information message 
				   // setting the Category description for all the categories and sub categories under which the NLU is matching 
				   	node.getValue("a_Category_Description").setValue(null);
					node.getValue("a_Natural_Language_URL").setValue(null);
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
				 var oldParentObjectForDivision = stepManager.getClassificationHome().getClassificationByID(oldParentForDivision);
				 // find if the a_Natural_Language_URL is unique or not 
				 var isDivisionExists=  nlurlExists(archiveNluForDivision,naturalLanguageURL,oldParentObjectForDivision);
					if(isDivisionExists!= 0 ){
						var divisionCID = node.getValue("a_WebCategory_CID").getSimpleValue();
				  	  // to set Category description and a_Natural_Language_URL for the Division to the reviving web category archive
					  node.getValue("a_Category_Description").setValue(null);
					  node.getValue("a_Natural_Language_URL").setValue(null);
					  // Set all the category description to null for all the categories under the division 
					  	var divisionNode = stepManager.getClassificationHome().getClassificationByID(node.getID());
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

}