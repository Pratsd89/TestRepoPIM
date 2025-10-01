/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_UpdateProductCasing",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Update Product Name Casing",
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
function toTitleCase(str) {
    return str.replace(/\S+/g, word => {
        if (word == word.toUpperCase()) return word;
        return word
            .split(/([^a-zA-Z0-9]+)/)
            .map(part => {
                if (/^[a-zA-Z0-9]/.test(part)) {
                    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
                }
                return part;
            })
            .join("");
    });
}

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var overrideStyleName = node.getValue("a_Bypass_Casing_Rules").getSimpleValue();
if (overrideStyleName != "Yes") {
    var brand = node.getValue("a_Brand_Number").getSimpleValue();
    var objectType = node.getObjectType().getID();
    if (objectType == "Style") {
        if (brand == "AT" || brand == "ON" || brand == "GAP" || brand == "GO") {
            var name = String(node.getName());
            node.setName(toTitleCase(name));
        } else if (brand == "BR" || brand == "BRFS") {
            node.setName(node.getName().toUpperCase());
        }
    }
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}

}