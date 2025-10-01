/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "StyleAndCCSitePreview",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "StyleAndCCSitePreview",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
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
var currentCtx = step.getCurrentContext().getID();
var setCurrentCtxForUrl;
var setHostName;

var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var currentCtx = step.getCurrentContext().getID();
var setCurrentCtxForUrl;
var setHostName;
var time = new java.util.Date();
var previewDate = new Date();
previewDate.setMonth(time.getMonth() + 3);
var convertedPreviewDate = previewDate.toISOString().slice(0,10);

var hostName = LKT.getLookupTableValue("LKT_Brand_Number_to_Host_Name", brandNum);
var domName = LKT.getLookupTableValue("LKT_Context_to_Domain_Name", currentCtx);
var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Context", brandNum);
if (contexts.contains(currentCtx)) {
    log.info("context valid for brand")
    //split on ";"
    //contexts = contexts.split(";");
    showPreview = true
    setHostName = hostName + domName
    setCurrentCtxForUrl = currentCtx.toString();
    setCurrentCtxForUrl = setCurrentCtxForUrl.replace(setCurrentCtxForUrl.substring(0, 2), setCurrentCtxForUrl.substring(0, 2).toLowerCase());
}
else {
    showPreview = false
}


var objID = "";
var objTypeID = node.getObjectType().getID();
if ("Style" == objTypeID) {
    objID = node.getValue('a_Style_Number').getSimpleValue();
}
else {
    objID = node.getValue('a_CC_Number').getSimpleValue();
}
/*if (showPreview) {
    logger.info("<html><iframe id=\"approve\" width=\"930\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"https://" + setHostName + "/browse/product.do?pid=" + objID + "&previewDate=" + convertedPreviewDate + "&amp;locale=" + setCurrentCtxForUrl + "\"></iframe></html>");
    return "<html><iframe id=\"approve\" width=\"930\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"https://" + setHostName + "/browse/product.do?pid=" + objID + "&previewDate=" + convertedPreviewDate + "&amp;locale=" + setCurrentCtxForUrl + "\"></iframe></html>";
}*/
if (showPreview) {
    return '<iframe id="approve" width="930" height="800" frameborder="0" style="display: block;" ' +
           'src="https://onol.wip.stage.gaptecholapps.com/browse/product.do?pid=508719072&previewDate=2025-05-07&locale=en_US&cacheBust=123456&timestamp=123456789">' +
           '</iframe>';
}


/*if (showPreview) {
    var  directLink = "https://" + setHostName + "/browse/product.do?pid=" + objID + "&previewDate=" + convertedPreviewDate + "&locale=" + setCurrentCtxForUrl;
    
    logger.info("<html><a href=\"" + directLink + "\" target=\"_blank\">View Product</a></html>");
    
    return "<html><a href=\"" + directLink + "\" target=\"_blank\">View Product</a></html>";
}*/
else {
    return "Brand is not applicable for the current context";
}

}