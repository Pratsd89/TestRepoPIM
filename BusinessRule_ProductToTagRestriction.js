/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ProductToTagRestriction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ProductToTagRestriction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "productToTag",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,productToTag,webUI) {
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var  productToTaglink= node.getClassificationProductLinks(productToTag).toArray();
for (var i = 0; i < productToTaglink.length; i++) {
	
    var productToTaglinkID = productToTaglink[i].getClassification().getID();
    var productToTaglinkBrandNum = productToTaglink[i].getClassification().getValue("a_Brand_Number").getSimpleValue();
    if (productToTaglinkBrandNum == brandNum) {

    } else {
     productToTaglink[i].delete();
     webUI.showAlert("WARNING", "PURGED or DRAFT Styles can not be added to Product to Tag Classification.");
    }
}

}