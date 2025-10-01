/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setCCPublicationdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_setCCPublicationdate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "CCPublicationDate",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_CC_Start_Date</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">CCPublicationDate</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
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
exports.operation0 = function (node,CCPublicationDate,webui) {
log.info("CCPublicationDate="+CCPublicationDate);
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");    
var selection = webui.getSelection().toArray();
for( var i in selection){
	var selectedNode = selection[i];	
	selectedNode.getValue("a_CC_Start_Date").setSimpleValue(CCPublicationDate);
	selectedNode.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	var sku = selectedNode.getChildren().toArray();
	for(var j in sku){
		sku[j].getValue("a_SKU_Start_Date").setSimpleValue(CCPublicationDate);
		sku[j].getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
}

}