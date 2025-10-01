/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_Revive Web Category",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test_Revive Web Category",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT) {
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
						//webUI.showAlert("WARNING", null, "The revived Web Division was moved to bottom of Web Division list in market(s) " + sortedMkts + ". Please navigate to parent Web BU and adjust accordingly, for all applicable markets.");
					}
				}
			}
		}
		else {
			var oldParentCID = oldParent.getValue("a_WebCategory_CID").getSimpleValue();
			var oldParentObjectType = oldParent.getObjectType().getName();

			//webUI.showAlert("WARNING", null, "The old parent " + oldParentObjectType + " with CID " + oldParentCID + " is in the Archive. Please revive the old " + oldParentObjectType + " before reviving this category.");
		}
	}
	else if (oldParentID == null && webBUType == "WebHierarchyArchiveBU") {
		var archivedParent = getRevivableParent(node);
		var archivedParentCID = archivedParent.getValue("a_WebCategory_CID").getSimpleValue();;
		var archivedParentObjectType = archivedParent.getObjectType().getName();

		//webUI.showAlert("WARNING", null, "The old parent " + archivedParentObjectType + " with CID " + archivedParentCID + " is in the Archive. Please revive the old " + archivedParentObjectType + " to revive this category.");
	}
}

}