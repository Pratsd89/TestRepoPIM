/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateProductTagEntity",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "br_CreateProductTagEntity",
  "description" : "Create Product Group button in Search Style screen &  Create Product Groups from a list of selected Styles.",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ProductGroupLibrary",
    "libraryAlias" : "pgLibrary"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,webui,node,logger,pgLibrary) {
var selection = webui.getSelection();
var selectionCount = selection.size();
if (selectionCount >= 1) {
        var tempProductTagEntityID ="Temp_Product_Tag_Root";
        var tempProductTagEntityObjType = manager.getEntityHome().getEntityByID(tempProductTagEntityID);
        if (tempProductTagEntityObjType) {
            var newTempEntityID ='Temp_' + generateSequenceNumber();
            var newTempEntity = tempProductTagEntityObjType.createEntity(newTempEntityID, "TempProductTag");
            newTempEntity.setName(newTempEntityID);
            for (var j = 0; j < selectionCount; j++) {
                var selStyle = selection.get(j).getID();
                newTempEntity.getValue("Temp_Style_ ID").addValue(selStyle);
               }
            
        }
        webui.navigate("Temp_Entity_Screen", newTempEntity);
    } 

function generateSequenceNumber() {
    const timestamp = new Date().getTime();
    const sequenceNumber = timestamp.toString().slice(-7);
    return sequenceNumber;
}


}