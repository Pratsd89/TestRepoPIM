/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Preview_Live_URL",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Preview_Live_URL",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
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
    "alias" : "manager",
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
exports.operation0 = function (node,manager,LKT) {
var objectType = node.getObjectType().getID();
var context = manager.getCurrentContext().getID();
var context = context.split("_");
var market = context[1];
log.info(market);
if(objectType = "WebDivision" ){
	var Brand = node.getParent().getValue("a_Brand_Number").getSimpleValue();
	var URL = LKT.getLookupTableValue("LKT_Market _To_LiveURL", Brand+"_"+market);
	log.info(URL);
	var CID = node.getValue("a_WebCategory_CID").getSimpleValue();
	var slug = node.getValue("a_Division_Slug").getSimpleValue();
	var LiveURL = URL+"/"+slug+"?"+"cid="+CID;
	log.info(LiveURL);
} 

if(objectType = "WebCategory" ){
	
}

if(objectType = "WebSubCategory" ){
	
}



}