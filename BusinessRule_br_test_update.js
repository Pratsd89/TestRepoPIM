/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_test_update",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_test_update",
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "TagType_To_AlternateNames",
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "brandHome",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "Brand_Tags_Root",
    "description" : null
  }, {
    "contract" : "EntityBindContract",
    "alias" : "idGenerator",
    "parameterClass" : "com.stibo.core.domain.impl.entity.FrontEntityImpl$$Generated$$6",
    "value" : "AlternateNameID_Generator",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType,brandHome,idGenerator) {
function generateSequenceNumber() {
    var IDCounter = idGenerator.getValue("a_Last_ID_Value").getSimpleValue();
    var IDCounter = parseFloat(IDCounter);
    var ID = IDCounter + 1;
    idGenerator.getValue("a_Last_ID_Value").setSimpleValue(ID);
    return ID;
}

var canadaManager = "";
step.executeInContext("FR_CA", function (contextManager) {
    canadaManager = contextManager;
});

brandHome.getChildren().forEach(function (brand) {
    if (brand.getID() == "ProductTags_AT") {
        var tagTypes = brand.getChildren();
        var brandANHome = step.getEntityHome().getEntityByID("AN_" + brand.getID().substring(12));
        tagTypes.forEach(function (type) {
            var name = type.getValue("DisplayDefault").getSimpleValue();
            var frTag = canadaManager.getObjectFromOtherManager(type);
            var frName = frTag.getValue("DisplayDefault").getSimpleValue();
            var ID = "AN_Object_" + generateSequenceNumber();
            var newEntity = brandANHome.createEntity(ID, "AlternateNameObject");
            newEntity.setName(name);
            var frEntity = canadaManager.getObjectFromOtherManager(newEntity);
            frEntity.setName(frName);

            var ref = type.createReference(newEntity, refType);
            ref.getValue("a_Display_Default_Flag").setSimpleValue("Yes");
        });
    }
});

}