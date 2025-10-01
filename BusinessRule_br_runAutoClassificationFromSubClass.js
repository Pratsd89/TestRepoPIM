/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_runAutoClassificationFromSubClass",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Run AutoClassification From SubClass",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SubClass" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
//trigger autoclassification events for all Styles and CCs under the subclass
/*var children = node.getChildren();
if (children) {
    var childIter = children.iterator();
    while (childIter.hasNext()) {
        var style = childIter.next();
        queue.republish(style);
        var styleChildren = style.getChildren();

        if (styleChildren) {
            var styleChildrenIter = styleChildren.iterator();
            while (styleChildrenIter.hasNext()) {
                var cc = styleChildrenIter.next();
                queue.republish(cc);

            }
        }

    }
}*/
}