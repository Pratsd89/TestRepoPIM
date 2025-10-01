/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PublishCatScheduler",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Publish Category and SubCategory Scheduler",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,LKT,node) {
function publishObj(obj){
	var BusinessRuleHome = step.getHome(com.stibo.core.domain.businessrule.BusinessRuleHome);
	BusinessRuleHome.getBusinessActionByID("br_SetMainLastUpdateDateAllObj").execute(obj);
}
function getMarketsArray(obj){
	var brand = obj.getValue("a_Brand_Number").getSimpleValue();
	var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brand);
	return markets.split(";");
}

var todayDate = new java.util.Date();
var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");

marketArray = getMarketsArray(node);
publishedFlag = false;
marketArray.forEach(function(market){
	
	if(publishedFlag){
	     return;
	}
	
	step.executeInContext(market, function(cntxtManager) {
		var mktObj = cntxtManager.getObjectFromOtherManager(node);
		var startDate = mktObj.getValue("a_WebCategory_Start_Date").getSimpleValue();
		var endDate = mktObj.getValue("a_WebCategory_End_Date").getSimpleValue();
		
		if(startDate !=null) {
			if(endDate == null){
				publishObj(node);
				publishedFlag = true;
				return;
			}
			else {
				endDate = dateFormat.parse(endDate);
				if(endDate.after(todayDate)){
					publishObj(node);
					publishedFlag = true;
					return;
				}
			}
		}
	});
});

//var webHierarchy = step.getClassificationHome().getClassificationByID("101130");
//var divisions = webHierarchy.getChildren().iterator();
//while(divisions.hasNext()){
//	var division = divisions.next();
//	var categories = division.getChildren().iterator();
//	while(categories.hasNext()){
//		var category = categories.next();
//		var subCategories = category.getChildren().iterator();
//		while(subCategories.hasNext()){
//			var subCategory = subCategories.next();
//			
//		}
//	}
//}

// ^not needed, handled by configuration

}