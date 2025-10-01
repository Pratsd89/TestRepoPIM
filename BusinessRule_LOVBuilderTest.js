/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "LOVBuilderTest",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "LOVBuilderTest",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
  }, {
    "contract" : "ListOfValuesBindContract",
    "alias" : "LOV",
    "parameterClass" : "com.stibo.core.domain.impl.ListOfValuesImpl",
    "value" : "All_Contexts_LoV",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "lovconfig",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "List Of Values group type",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,logger,LOV,lovconfig) {
function createLOV(lovId, lovName) {
    var lovBuilder = new ListOfValuesBuilder()
        .id(lovId)
        .name(lovName);

    var listOfValues = lovBuilder.create();
    logger.info("LOV created");

    return listOfValues;
}

function createAttributeWithLOV(attributeId, attributeName, lov) {
    var attributeBuilder = new AttributeBuilder()
        .id(attributeId)
        .name(attributeName)
        .withListOfValues(lov);

    var attribute = attributeBuilder.create();
    logger.info("Attribute created");

    return attribute;
}

function main() {
    var lovId = "New_LOV";

    var lovName = "LOV";

    var lov = createLOV(lovId, lovName);

    var attributeId = "New_attribute";
    var attributeName = "LOV";
    createAttributeWithLOV(attributeId, attributeName, lov);
    
    logger.info(manager.getListOfValuesHome().getListOfValuesByID(node.getID()));
    logger.info(node.getValueById("New_attribute").getSimpleValue());
    
    
}
//var lovHome = com.stibo.core.domain.ListOfValuesHome;
//var builder = com.stibo.core.domain.listofvalues.builder.ListOfValuesBuilder;
//log.info(lovconfig);
//var lovv= com.stibo.core.domain.listofvalues.builder.ListOfValuesBuilder;
//log.info(lovv.create());
//manager.getListOfValuesHome().createListOfValues();
//log.info(builder);
manager.getListOfValuesHome().createListOfValues().create();
manager.getListOfValuesHome().getListOfValuesByID("Lov_POC_Variant");

//main();

}