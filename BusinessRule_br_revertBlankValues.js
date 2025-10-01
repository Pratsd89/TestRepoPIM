/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_revertBlankValues",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_revertBlankValues",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "contract" : "ImportChangeInfoBind",
    "alias" : "impChangeInfo",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,impChangeInfo) {
if(!impChangeInfo.isUnmodified()) {
	log.info("Log 1 ID -"+node.getID());
    var previousRevisionNode = node.getRevisions().get(1).getNode();
    var importChanges = impChangeInfo.getChanges().getAttributes();
    for (var i = 0; i < importChanges.size(); i++) {
        var attr = importChanges.get(i);
        log.info("Log 2 Attr -"+attr);
        var attrValue = node.getValue(attr).getSimpleValue();
        var oldValue = previousRevisionNode.getValue(attr).getSimpleValue();
        log.info("Log 3 Attr -"+attrValue+ " - "+oldValue);
        if (attrValue == null || attrValue == "") {
            node.getValue(attr).setSimpleValue(oldValue);
        }
    }
}
}