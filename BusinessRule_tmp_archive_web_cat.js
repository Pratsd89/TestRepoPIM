/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "tmp_archive_web_cat",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Tmp Archive Web Category(2)",
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
//get current date
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
var zonedTime = java.time.ZonedDateTime.now();

//get archive date
var archiveDate = zonedTime.minusDays(4);

var type = node.getObjectType().getID();

//if category object type is WebCategory || WebSubCategory || WebDivision
if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
	var parent = node.getParent();
	var parentID = parent.getID();
	var parentType = parent.getObjectType().getID();
	var path = node.getValue("a_Category_Path").getSimpleValue();

	//then keep getting parent until type is WebBU
	while (parentType != "WebBU") {
		if (parentType == "WebHierarchyArchiveRoot") {
			break;
		}
		parent = parent.getParent();
		parentType = parent.getObjectType().getID();
	}

	if (parentType == "WebBU") {

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
					if (endDate < archiveDate && startDate != null) {
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
				if (endDate < archiveDate && startDate != null) {
					archiveCat++;
				}
			});
		}
		if (checkCat == archiveCat) {

			var archiveBU = LKT.getLookupTableValue("LKT_Web_Category_to_Archive", brandNum);

			log.info("Value of checkCat: " + checkCat);
			log.info("Value of archiveCat: " + archiveCat);
			log.info("Archiving the category: " + node.getID());

			node.getValue("a_Old_Category_Parent").setValue(parentID);
			node.getValue("a_Old_Category_Path").setValue(path);
			node.setParent(step.getClassificationHome().getClassificationByID(archiveBU));

		}
	}
}
}