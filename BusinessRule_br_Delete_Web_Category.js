/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Delete_Web_Category",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Web Category",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "LINK_TYPE",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,LINK_TYPE) {
function deleteAllRefInAllContexts(classification) {
	var contextHome = manager.getContextHome();
	var contexts = contextHome.getContexts();
	var itr = contexts.iterator();

	//for each context
	while (itr.hasNext()) {
		//current context
		var ctx = itr.next().getID();

		//execute in context
		manager.executeInContext(ctx, function (manager) {
			//get context specific classification
			var curContextClass = manager.getClassificationHome().getClassificationByID(classification.getID());

			//get classification sub products
			var prodRefs = curContextClass.getClassificationProductLinks().toArray();

			//make sure not null
			if (prodRefs.length > 0) {
				//loop through each sub product
				prodRefs.forEach(function (prodRef) {
					//get product of link
					var product = prodRef.getProduct().getID();

					var stepProduct = manager.getProductHome().getProductByID(product);

					//get references of the product
					var refs = stepProduct.getClassificationProductLinks(LINK_TYPE).toArray();

					//for each reference
					refs.forEach(function (ref) {
						
						//if classification target of reference == curContextClass
						if (ref.getClassification().getID() == curContextClass.getID()) {
							//delete reference
							log.info("deleting reference: " + ref);
							ref.delete();
						}
					});
				});
			}
		});
	}
}

function deleteWebSubCategory(webSubCatNode) {
	if (!((node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow")) == null)) {
		node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow").delete("");
	}

	deleteAllRefInAllContexts(webSubCatNode);

	webSubCatNode.delete();
}

function deleteWebCategory(webCatNode) {
	var childWebSubCats = webCatNode.getChildren();

	for (var i = 0; i < childWebSubCats.size(); i++) {
		deleteWebSubCategory(childWebSubCats.get(i));
	}

	if (!((node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow")) == null)) {
		node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow").delete("");
	}

	deleteAllRefInAllContexts(webCatNode);
	
	webCatNode.delete();
}

function deleteWebDivision(webDivisionNode) {
	var childWebCats = webDivisionNode.getChildren();

	for (var i = 0; i < childWebCats.size(); i++) {
		deleteWebCategory(childWebCats.get(i));
	}

	if (!((node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow")) == null)) {
		node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow").delete("");
	}

	webDivisionNode.delete();
}

var objType = node.getObjectType().getID();
var reUse = node.getValue("a_WebCategory_Reusable").getSimpleValue();

if (objType == "WebDivision" && reUse != "Yes") {
	deleteWebDivision(node);
}
else if (objType = "WebCategory" && reUse != "Yes") {
	deleteWebCategory(node);
}
else if (objType = "WebSubCategory" && reUse != "Yes") {
	deleteWebSubCategory(node);
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
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,step,LKT) {
//get current date
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
var zonedTime = java.time.ZonedDateTime.now();

//get archive date
var archiveDate = zonedTime.minusDays(31);

var type = node.getObjectType().getID();

//if category object type is WebCategory || WebSubCategory || WebDivision
if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
	var parent = node.getParent();
	var parentID = parent.getID();
	var parentType = parent.getObjectType().getID();
	var path = node.getValue("a_Category_Path").getSimpleValue();

	//then keep getting parent until type is WebBU
	while (parentType != "WebHierarchyArchiveBU") {
		if (parentType == "WebBU") {
			break;
		}
		parent = parent.getParent();
		parentType = parent.getObjectType().getID();
	}

	if (parentType == "WebHierarchyArchiveBU") {

		//get a_Brand_Number
		var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();

		//query a_Brand_Number against LKT_Brand_Number_to_Market
		var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);

		var checkCat = 0;
		var archiveCat = 0;

		if (markets.contains(";")) {
			//split on ";"
			markets = markets.split(";");

			//for each market
			markets.forEach(function (mkt) {
				step.executeInContext(mkt, function (manager) {
					//fetch context specific selected category from executing manager
					var webCat = manager.getClassificationHome().getClassificationByID(node.getID());
					var startDate = webCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
					var endDate = webCat.getValue("a_WebCategory_End_Date").getSimpleValue();

					if (startDate != null) {
						checkCat++;
					}
					if (endDate < archiveDate) {
						archiveCat++;
					}
				});
			});
		}
		else {

			step.executeInContext(markets, function (manager) {
				var webCat = manager.getClassificationHome().getClassificationByID(node.getID());
				var startDate = webCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
				var endDate = webCat.getValue("a_WebCategory_End_Date").getSimpleValue();

				if (startDate != null) {
					checkCat++;
				}
				if (endDate < archiveDate) {
					archiveCat++;
				}
			});
		}
		if (checkCat == archiveCat) {
			//delete category since it was ended 31 days ago in all applicable contexts
			return true;
		}
		else {
			return false;
		}
	}
	if (parentType != "WebHierarchyArchiveBU") {
		return false;
	}
}
}