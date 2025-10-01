/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Revive_Web_Category",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Revive Web Category",
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
exports.operation0 = function (node,step,LKT,webUI,queryHome,Natural_Language_URL,slug) {
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
var nlumsg = slug.checkNLUmessage(node);
log.info(nlumsg);
node.getValue("a_Is_Revived").setSimpleValue("Yes");
//only allow revive when the category is re-activated
if (startDate != null && endDate == null || startDate != null && endDate > today) {
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
				node.getValue("a_Old_Category_Parent").setValue("");
				node.getValue("a_Old_Category_Path").setValue("");
				setSeoNonIndexable(node);
				checkNLUDuplicacy(node);

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
							var inheritCAN = cntxtNode.getValue("a_CAN_Inherit_Option").getSimpleValue();
							var inheritJPN = cntxtNode.getValue("a_JPN_Inherit_Option").getSimpleValue();
						
							//get all child cats to set new sorts
							var newParentChildCats = cntxtNode.getParent().getChildren().toArray();
							var sortOrder = 0;

							//only set sort order in active markets unless inheriting from US
							if (cntxtStart == null || cntxtEnd < today){
								if (inheritFromUS != "Yes") {
									//PPIM-13314
									if ((mktCntxt == "EN_CA" && inheritCAN == null) || (mktCntxt == "EN_JP" && inheritJPN == null)){
									     cntxtNode.getValue('a_WebCategory_Sort_Order').setSimpleValue(null);
									}
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
			
						webUI.showAlert("WARNING", "<b>" + slug.checkNLUmessage(node) + "The revived Web Division was moved to bottom of Web Division list in market(s) " + sortedMkts + ". Please navigate to parent Web BU and adjust accordingly, for all applicable markets.</b>");
					}
				}
			}
		}
		else {
			var oldParentCID = oldParent.getValue("a_WebCategory_CID").getSimpleValue();
			var oldParentObjectType = oldParent.getObjectType().getName();

			webUI.showAlert("WARNING", "<b"> + nlumsg + "The old parent " + oldParentObjectType + " with CID " + oldParentCID + " is in the Archive. Please revive the old " + oldParentObjectType + " before reviving this category.</b>");
		}
		
	}
	else if (oldParentID == null && webBUType == "WebHierarchyArchiveBU") {
		var archivedParent = getRevivableParent(node);
		var archivedParentCID = archivedParent.getValue("a_WebCategory_CID").getSimpleValue();;
		var archivedParentObjectType = archivedParent.getObjectType().getName();

		webUI.showAlert("WARNING", "<b>" + nlumsg + "The old parent " + archivedParentObjectType + " with CID " + archivedParentCID + " is in the Archive. Please revive the old " + archivedParentObjectType + " to revive this category.</b>");
	}
	removeCategoryNameInFRCA(node);
	//webUI.showAlert("ERROR",nlumsg);
		
}
//var naturalLanguageURL = node.getValue("a_Natural_Language_URL").getSimpleValue();
//if(naturalLanguageURL == null){
//	webUI.showAlert("ERROR", "Update name if needed and click save again to populate the Natural Language slug."+nlumsg);
//}


function searchExistingNaturalURL(nluValue, Attribute, Parent) {
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(Parent);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
        .and(condition.valueOf(Attribute).eq(nluValue))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
}

function checkNLUDuplicacy(node){
	
	var nodeObjectType = node.getObjectType().getID();
	var parentObjectType = node.getParent().getObjectType().getID();
	var naturalLanguageURL = node.getValue("a_Natural_Language_URL").getSimpleValue();
	if(naturalLanguageURL!=null){
	var count=searchExistingNaturalURL(naturalLanguageURL,Natural_Language_URL,node.getParent());
     if(count!=0){
     	 var SubCtyCID = node.getValue("a_WebCategory_CID").getSimpleValue();
     	 webUI.showAlert("WARNING", " <b>Archive Web SubCategory " + node.getID() + " with CID " +  SubCtyCID + " is having Sub Category Slug name same as one off the active Web sub category, Please review slug name by updating category description for Web Sub Category "+ node.getID()+".</b>"
     	 );
     	}
	
		}
	
	}

	// added to set the value for the SEO page index tag attribute 
	
function getContextSpecificObject(object, context)
	{
		var contextSpecificObject = "";
		contextSpecificObject = step.executeInContext(context, function(specificManager) {
				var ObjectinContext =  specificManager.getObjectFromOtherManager(object);
				if (ObjectinContext != "undefined" && ObjectinContext !=  null  ){
				 return ObjectinContext; }
			});		
			return contextSpecificObject ;
	}

function setValuesAcrossContexts(nodeObject){
		
		var currentContext=step.getCurrentContext().getID();
		if(currentContext == "EN_US")
		{
		var en_CAObject = getContextSpecificObject(nodeObject,"EN_CA");
		var fr_CAObject = getContextSpecificObject(nodeObject,"FR_CA");
		setValuesForChildern(nodeObject);
		setValuesForChildern(en_CAObject);
		setValuesForChildern(fr_CAObject);
		
		}
		else if (currentContext == "EN_CA"){
	
		var fr_CAObject = getContextSpecificObject(nodeObject,"FR_CA");
		var en_USObject = getContextSpecificObject(nodeObject,"EN_US");
		setValuesForChildern(nodeObject);
		setValuesForChildern(fr_CAObject);
		setValuesForChildern(en_USObject);
		}
}

function setValuesForChildern (nodeObject)
{
		var objectTypeName = nodeObject.getObjectType().getName();
		if(objectTypeName != "Web BU" ){
		nodeObject.getValue("a_SEO_Non_Indexable").setSimpleValue("Index");
		nodeObject.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("Index");
		nodeObject.getValue("a_SEO_Index_Automation").setSimpleValue(null);
		
		}
}

	
function setSeoNonIndexable(nodeObject)
{
		var objectTypeName = nodeObject.getObjectType().getName();
		if (objectTypeName == "Web Sub Category"){
			setValuesAcrossContexts(nodeObject);
			
		}else if (objectTypeName == "Web Category")
		{
			var webCtyChildren  =  nodeObject.getChildren();
			setValuesAcrossContexts(nodeObject);
			if(webCtyChildren != null )
			{
				for(var webCtyChildrenIndex = 0 ; webCtyChildrenIndex<webCtyChildren.size();webCtyChildrenIndex ++)
				{
					var subCtyObject= webCtyChildren.get(webCtyChildrenIndex); 
					setValuesAcrossContexts(subCtyObject);
				}
				
			}			
		}else if (objectTypeName == "Web Division") {
			var divChildren  =  nodeObject.getChildren();
			setValuesAcrossContexts(nodeObject);
			if(divChildren != null )
			{
				for(var divChildrenIndex = 0 ;divChildrenIndex<divChildren.size();divChildrenIndex ++)
				{
					var ctyObject= divChildren.get(divChildrenIndex); 
					setValuesAcrossContexts(ctyObject);
					var ctyChildren  =  ctyObject.getChildren();
					if(ctyChildren != null)
					{
							
						for(var ctyChildrenIndex = 0 ; ctyChildrenIndex<ctyChildren.size();ctyChildrenIndex ++)
						{
							var subCtyObjectNode= ctyChildren.get(ctyChildrenIndex); 
							setValuesAcrossContexts(subCtyObjectNode);
						}
					
					} 
				}

				
			}	

		}
		
}

function removeCategoryNameInFRCA (node){
	var ObjectType = node.getObjectType().getID();
	if (objectType == "WebDivision") {
	    removeCategorynameFRCA(node);
			var Category = node.getChildren().toArray();
        			for (var j in Category) {
            				removeCategorynameFRCA(Category[j]);
            				var SubCat = Category[j].getChildren().toArray();
            				  for (var k in SubCat) {
            				  	 removeCategorynameFRCA(SubCat[k]);
            				  }
                     }
	}
	if (objectType == "WebCategory") {
	    removeCategorynameFRCA(node);
			var SubCat = node.getChildren().toArray();
        			for (var j in SubCat) {
            				removeCategorynameFRCA(SubCat[j]);       				
                     }
	}
	if (objectType == "WebSubCategory") {
	    removeCategorynameFRCA(node);			
	}
}

function removeCategorynameFRCA (node){
	step.executeInContext("FR_CA",function(otherContext){
				var source = otherContext.getClassificationHome().getClassificationByID(node.getID());
				//source.setName(null);
                var NLU = source.getValue("a_Natural_Language_URL").getSimpleValue();
				if(NLU==null || NLU ==""){
				source.getValue("a_Category_Description").setSimpleValue(null);
		          var startDate = source.getValue("a_WebCategory_Start_Date").getSimpleValue();
		          var CID = source.getValue("a_WebCategory_CID").getSimpleValue();
		          source.setName(CID+" - "+"("+startDate+")");
				}

				});
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,slug) {

var parent = getParent(node);
	
if(parent == "WebHierarchyArchive"){
	return true;
} else {
	return false;
}

function getParent(node) {
var parent = node.getParent();
var parentID = parent.getID();
	while(parentID != "WebHierarchyArchive" || parentID != "101130") {
		if (parentID == "WebHierarchyArchive" || parentID == "101130") {
			break;
		}
		
		parent = parent.getParent();
		parentID  = parent.getID();
		log.info(parentID);
		
	}
	return parentID;
}

}