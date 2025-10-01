/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Product_tag_type_test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Product_tag_type",
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
exports.operation0 = function (node,step) {
var tagType = step.getClassificationHome().getClassificationByID(node.getID());
//Tag Name
var tagName = node.getName();
log.info(tagName);

var enUSAltNames = null;
var enUSAltNamesArray = [];
var frCAAltNames = null;
var frCAAltNamesArray = [];
var jaJPAltNames = null;
var jaJPAltNamesArray = [];

var enUSDisplayDefault = null;
var frCADisplayDefault = null;
var jaJPDisplayDefault = null;

var enUSIsFlexFacet = null;
var frCAIsFlexFacet = null;
var jaJPIsFlexFacet = null;

step.executeInContext('EN_US', function (usContextManager) {
    var usNode = usContextManager.getClassificationHome().getClassificationByID(node.getID());
    enUSAltNames = usNode.getValue("AlternateNames").getSimpleValue();
    enUSAltNames.split("<multisep/>").forEach(function (AltName) {
        enUSAltNamesArray.push(AltName);
    });

    enUSDisplayDefault = usNode.getValue("DisplayDefault").getSimpleValue();
    enUSIsFlexFacet = usNode.getValue("IsFlexFacet").getSimpleValue();
});

step.executeInContext('FR_CA', function (caContextManager) {
    var caNode = caContextManager.getClassificationHome().getClassificationByID(node.getID());
    frCAAltNames = caNode.getValue("AlternateNames").getSimpleValue();
    frCAAltNames.split("<multisep/>").forEach(function (AltName) {
        frCAAltNamesArray.push(AltName);
    });

    frCADisplayDefault = caNode.getValue("DisplayDefault").getSimpleValue();
    frCAIsFlexFacet = caNode.getValue("IsFlexFacet").getSimpleValue();
});

step.executeInContext('JA_JP', function (jpContextManager) {
    var jpNode = jpContextManager.getClassificationHome().getClassificationByID(node.getID());
    jaJPAltNames = jpNode.getValue("AlternateNames").getSimpleValue();
    jaJPAltNames.split("<multisep/>").forEach(function (AltName) {
        jaJPAltNamesArray.push(AltName);
    });

    jaJPDisplayDefault = jpNode.getValue("DisplayDefault").getSimpleValue();
    jaJPIsFlexFacet = jpNode.getValue("IsFlexFacet").getSimpleValue();
});

log.info(enUSAltNamesArray);
log.info(frCAAltNamesArray);
log.info(jaJPAltNamesArray);

log.info(enUSDisplayDefault);
log.info(frCADisplayDefault);
log.info(jaJPDisplayDefault);

log.info(enUSIsFlexFacet);
log.info(frCAIsFlexFacet);
log.info(jaJPIsFlexFacet);
}