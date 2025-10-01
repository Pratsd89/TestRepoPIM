/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SizeChartIntegrator",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "SizeChartIntegrator",
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


/*var Url = "https://stibo-ui-stage.apps.cfcommerce.dev.azeus.gaptech.com/lookup-data/size-chart";



return "<html><div style=\"width: 98%; height: 82vh; \"><iframe id=\"approve\" frameborder=\"0\" style=\"width: 100%; height: 100%;\" src=\"" + Url + "\"></iframe></div></html>"*/


var Brand;
var userId = step.getCurrentUser();

var userGroups = userId.getAllGroups().toArray();
for (var i in userGroups) {
    var BrandValue = userGroups[i].getValue("a_Brand_Number").getSimpleValue();
    //log.info("BrandValue="+BrandValue);
    if (BrandValue != null) {
        if (Brand == null) {
            Brand = BrandValue;
        } else {
            Brand = Brand + "," + BrandValue;
        }
        log.info("Brand=" + Brand);
    }
}
var Context = step.getCurrentContext().getID();


if(Brand != null){

var Url = "https://stibo-ui.aks.stage.azeus.gaptech.com/lookup-data/size-chart?brand=" + Brand + "&context=" + Context;
} else if(Brand == null){
	var Url = "https://stibo-ui.aks.stage.azeus.gaptech.com/lookup-data/size-chart"
}


//return "<html><div style=\"width: 98%; height: 82vh; \"><iframe id=\"approve\" frameborder=\"0\" style=\"width: 100%; height: 100%;\" src=\"" + Url + "\"></iframe></div></html>"
var yourBigObjectAsJsonString = "000123456,000123457,000123458";
return "<html>" +
       "<div style=\"width: 98%; height: 82vh;\">" +
       "<iframe id=\"sizeChartIframe\" frameborder=\"0\" style=\"width: 100%; height: 100%;\" src=\"" + Url + "\"></iframe>" +
       "<script>" +
       "  const iframe = document.getElementById('sizeChartIframe');" +
       "  const postData = " + yourBigObjectAsJsonString + ";" + // Your large object serialized to JSON
       "  iframe.onload = function() {" +
       "    iframe.contentWindow.postMessage(postData, '" + Url + "');" +
       "  };" +
       "</script>" +
       "</div>" +
       "</html>";
}