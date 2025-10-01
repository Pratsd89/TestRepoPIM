/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "WebCategoriesIntegrator",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "WebCategories Integrator",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (step,log,LKT,node) {
var id = node.getID();
var brandNumber = node.getValue('a_Brand_Number').getSimpleValue();
var channelNumber = node.getValue('a_Channel_Number').getSimpleValue();
var context = step.getCurrentContext().getID();
var marketNumber = LKT.getLookupTableValue("LKT_Context_to_Market", context);

if (id == null || brandNumber == null || channelNumber == null || marketNumber == null) {
	throw new Error("Please fill all the Mandatory values :: ID, Brand Number, Channel Number and Market Number to view the category details.")
}
//Url = "https://" + setHostName + "/browse/category.do?cid=" + CID + "&locale=" + setCurrentCtxForUrl;
var Url = "https://pim-ui.aks.stage.azeus.gaptech.com/web-categories/" + brandNumber + "-" + marketNumber + "-" + channelNumber + "/" + id;
//log.info("Url:" + Url);

return "<html><iframe id=\"approve\" width=\"1400\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"" + Url + "\"></iframe></html>"
}