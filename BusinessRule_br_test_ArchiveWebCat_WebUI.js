/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_ArchiveWebCat_WebUI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_test_ArchiveWebCat_WebUI",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebBU", "WebCategory", "WebDivision", "WebSubCategory" ],
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
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,LKT,webui) {
//get current date
var selectedNodes = webui.getSelection().iterator();
while (selectedNodes.hasNext()) {
  	var selectNode = selectedNodes.next();
	

	var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
	var zonedTime = java.time.ZonedDateTime.now();
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	var today = simpleDateFormat.format(time)
	var type = selectNode.getObjectType().getID();
	
	
	//if category object type is WebCategory || WebSubCategory || WebDivision
	if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
		var parent = selectNode.getParent();
		var parentID = parent.getID();
		var parentType = parent.getObjectType().getID();
		//log.info(parentType)
		var path = selectNode.getValue("a_Category_Path").getSimpleValue();
	
		//then keep getting parent until type is WebBU
		while (parentType != "WebBU") {
			if (parentType == "WebHierarchyArchiveRoot") {
				break;
			}
			parent = parent.getParent();
			parentType = parent.getObjectType().getID();
		}
	
		if (parentType == "WebBU") {
			log.info('inside webBU loop')
	
			//get a_Brand_Number
			var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
			log.info(brandNum)
	
			//query a_Brand_Number against LKT_Brand_Number_to_Market
			var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);
			log.info(markets)
	
			var checkCat = 0;
			var archiveCat = 0;
	
			if (markets.contains(";")) {
				//split on ";"
				markets = markets.split(";");
	
				//for each market
				markets.forEach(function (mkt) {
					step.executeInContext(mkt, function (manager) {
						//fetch context specific selected category from executing manager
						var webCat = manager.getClassificationHome().getClassificationByID(selectNode.getID());
						var startDate = webCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
						var endDate = webCat.getValue("a_WebCategory_End_Date").getSimpleValue();
						//log.info(endDate)
						if (startDate != null) {
							checkCat++;
							
						}
						if (endDate != null && endDate > simpleDateFormat.format(time)  && startDate != null) {
							webCat.getValue("a_WebCategory_End_Date").setSimpleValue(today);
							archiveCat++;
							
						}
						if (endDate != null && (endDate == today || endDate < today)  && startDate != null){
							archiveCat++;
							
						}
						if (endDate == null && startDate != null){
							webCat.getValue("a_WebCategory_End_Date").setSimpleValue(today);
							archiveCat++;
							
						}
						
						
					});
				});
			}
			else {
				step.executeInContext(markets, function (manager) {
					var webCat = manager.getClassificationHome().getClassificationByID(selectNode.getID()); //CHG0277691 code fix for Category End Date Issue
					var startDate = webCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
					var endDate = webCat.getValue("a_WebCategory_End_Date").getSimpleValue();
	
					if (startDate != null) {
						checkCat++;
						
					}
					if (endDate != null && endDate > today  && startDate != null) {
						webCat.getValue("a_WebCategory_End_Date").setSimpleValue(today);
						archiveCat++;
						
					}
					if (endDate != null && (endDate == today || endDate < today)  && startDate != null){
						archiveCat++;
						
					}
					if (endDate == null && startDate != null){
						webCat.getValue("a_WebCategory_End_Date").setSimpleValue(today);
						archiveCat++;
					}
			
				});
			}
			
			if (checkCat == archiveCat) {
				log.info('executing archive logic')
	
				var archiveBU = LKT.getLookupTableValue("LKT_Web_Category_to_Archive", brandNum);
	
				selectNode.getValue("a_Old_Category_Parent").setValue(parentID);
				selectNode.getValue("a_Old_Category_Path").setValue(path);
				selectNode.setParent(step.getClassificationHome().getClassificationByID(archiveBU));
				selectNode.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	
				}
			}
		}
	}
}