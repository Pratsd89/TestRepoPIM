/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleAndCCImagePreview",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "(DEP) StyleAndCCImagePreview",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ ]
}
*/
exports.operation0 = function (step,log) {
var currentCtx=step.getCurrentContext();
var setCurrentCtxForUrl;

if(currentCtx=="EN_US")
	setCurrentCtxForUrl="en_US";
if(currentCtx=="EN_CA")
	setCurrentCtxForUrl="en_CA";
if(currentCtx=="FR_CA")
	setCurrentCtxForUrl="fr_CA";

//log.info(setCurrentCtxForUrl);
return "<html><iframe id=\"approve\" width=\"930\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"https://oldnavy-wip-stage.apps.cfcommerce.dev.azeus.gaptech.com/browse/product.do?pid="+node.getID()+"&amp;date=10/23/2019&amp;locale="+setCurrentCtxForUrl+"\"></iframe></html>"
}