/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_null_value_replacement",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_null_value_replacement",
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
    "contract" : "ImportChangeInfoBind",
    "alias" : "importChangeInfo",
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
exports.operation0 = function (node,importChangeInfo,step) {
if(importChangeInfo.getChanges() != null) {
    log.info("Log 1 ID -"+node.getID());
    var previousRevisionNode = node.getRevisions().get(1).getNode(); // Directly accessing the previous revision
    var importChanges = importChangeInfo.getChanges().getAttributes();
    for (var i = 0; i < importChanges.size(); i++) {
        var attr = importChanges.get(i);
        log.info("Log 2 Attr -"+attr);
        var attrValue = node.getValue(attr).getSimpleValue();
        var oldValue = (previousRevisionNode != null) ? previousRevisionNode.getValue(attr).getSimpleValue() : null;
        log.info("Log 3 Attr -"+attrValue+ " - "+oldValue);
        if (attrValue == null || attrValue == "") {
            node.getValue(attr).setSimpleValue(oldValue);
        } else if (attrValue.equalsIgnoreCase('DELETE')) {
            node.getValue(attr).setSimpleValue(null);
        }
        
    }
 node.approve();   
}
//node.approve();
}