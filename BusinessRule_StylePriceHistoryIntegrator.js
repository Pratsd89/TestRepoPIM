/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StylePriceHistoryIntegrator",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "Style Price History Integrator",
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
var styleId = node.getID();
var styleNumber = node.getValue('a_Style_Number').getSimpleValue();
var brandNumber=node.getValue('a_Brand_Number').getSimpleValue();
var channelNumber=node.getValue('a_Channel_Number').getSimpleValue();
var context = step.getCurrentContext().getID();
var marketNumber = LKT.getLookupTableValue("LKT_Context_to_Market",  context);
var objectType = node.getObjectType().getID()
if(objectType == 'CustomerChoice')
	objectType = 'CC'
if(styleId==null || brandNumber==null || channelNumber==null || marketNumber==null)
	 throw new Error("All the Mandatory values :: Brand Number, Channel Number and Market Number to view the products.")
//Url = "https://" + setHostName + "/browse/category.do?cid=" + CID + "&locale=" + setCurrentCtxForUrl;
//https://pim-ui-stage.apps.cfcommerce.dev.azeus.gaptech.com/price-history/:productid/:brand/:market/:channel
var Url="https://pim-ui.aks.stage.azeus.gaptech.com/price-history/"+styleId+"/"+brandNumber+"/"+marketNumber+"/"+channelNumber + "/" + objectType;

log.info("Url:" + Url);

//return "<html><iframe id=\"approve\" width=\"930\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"https://"+setHostName+"/browse/category.do?cid="+CID+"&locale="+setCurrentCtxForUrl+"\"></iframe></html>"

return "<html><iframe id=\"approve\" width=\"100%\" height=\"800\" frameborder=\"0\" style=\"display: block;max-height:72vh;\" src=\"" + Url + "\"></iframe></html>"
}