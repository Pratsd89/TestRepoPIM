/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_Publish_Style",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Autopop Publish Style Action",
  "description" : "Publish Style and Corresponding Web Categories impacted by Autopop",
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepMan",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "aAutoWebUpdate",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "Autopop_WebClass_Update",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refWeb",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,stepMan,aAutoWebUpdate,refWeb) {
if (node.getValue("a_Autopop_Hold") != "Yes") {
	logger.info("Autopop Async End: " + node.getID());
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	var origWebCat = node.getValue(aAutoWebUpdate.getID()).getSimpleValue() + "";
	var webRefs = node.getClassificationProductLinks(refWeb);
	for(var x=0; x < webRefs.size(); x++) {
		if((origWebCat + "").indexOf(webRefs.get(x).getClassification().getID() + "") < 0) {
			stepMan.getClassificationHome().getClassificationByID(webRefs.get(x).getClassification().getID()).getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			//logger.info("TRIGGERED: " + webRefs.get(x).getClassification().getID());
		}
	}
	var origWebCat = node.getValue(aAutoWebUpdate.getID()).setSimpleValue("");
	
	var allChild = node.getChildren();
	
	for(var t=0; t < allChild.size(); t++) {
	
		origWebCat = allChild.get(t).getValue(aAutoWebUpdate.getID()).getSimpleValue() + "";
		webRefs = allChild.get(t).getClassificationProductLinks(refWeb);
		for(var y=0; y < webRefs.size(); y++) {
			if((origWebCat + "").indexOf(webRefs.get(y).getClassification().getID() + "") < 0) {
				stepMan.getClassificationHome().getClassificationByID(webRefs.get(y).getClassification().getID()).getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			//logger.info("TRIGGERED: " + webRefs.get(x).getClassification().getID());
			}
		}
	}
	
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	node.getValue("a_Style_MF_Maintainance_Last_Update_Date").setSimpleValue(iso.format(time));
	var childCCs = node.getChildren();
	for(var i=0; i < childCCs.size(); i++) {
		childCCs.get(i).getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		childCCs.get(i).getValue("a_CC_MF_Maintainance_Last_Update_Date").setSimpleValue(iso.format(time));
		
		var childSkus = childCCs.get(i).getChildren();
		for(var x=0; x < childSkus.size(); x++) {
			childSkus.get(x).getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		}
	}
}
}