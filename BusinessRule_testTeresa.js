/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testTeresa",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "testTeresa",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step) {
var status = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();


if (!status.equals("Draft") && !status.equals("Purged")) {               	
     log.info(status);               	
}


/*
var sizeModelRefType = step.getLinkTypeHome().getClassificationProductLinkTypeByID("SizeModelRef");
var sizeModelReferences = node.getClassificationProductLinks(sizeModelRefType);
if (!sizeModelReferences.isEmpty()) {
            log.info("ID " + sizeModelReferences.get(0).getClassification().getID());
} else {
        	log.info("empty Refs");
}
*/
/*
var fromCategoryId = "1182007";
var toCategoryId = "3020354";
var bmcId = "GO" + "-" + "US" + "-" + "ONL";
var url = new java.net.URL("https://api.gap.com/commerce/pim/data-governance/core/categories/copy");
var conn = url.openConnection();
conn.setDoOutput(true);
conn.setRequestMethod("POST");
conn.setRequestProperty("Content-Type", "application/json");
conn.setRequestProperty("apikey", "tn23uGq0bWOdbxCAKXju1u2GGseATTvn");
conn.setRequestProperty("env", "prod");
var input = new java.lang.String("{\"bmcId\":\"" + bmcId +
	"\",\"fromCategoryId\":\"" + fromCategoryId +
	"\",\"toCategoryId\":\"" + toCategoryId +
	"\"}");
log.info(input);
var os = conn.getOutputStream();
os.write(input.getBytes());
os.flush();
os.close();
if (conn.getResponseCode() != java.net.HttpURLConnection.HTTP_OK) {
	log.info("Failed : HTTP error code : " + conn.getResponseCode());
}
log.info("HTTP code : " + conn.getResponseCode());
log.info("\n<b style='color:Blue;'> Invoked DGL API to copy products of source category to copy category </b>");
*/
}