/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_gatingCreation",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_gatingCreation",
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
//creating Restriction and delete it
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var BrandRestriction = manager.getEntityHome().getEntityByID("Restriction_Brand_AT");
var newrestriction = BrandRestriction.createEntity('', "RestrictionClassifications");
log.info(newrestriction);
newrestriction.setName("TESTARAVINDAN");
var dataContainerType = manager.getHome(com.stibo.core.domain.datacontainertype.DataContainerTypeHome).getDataContainerTypeByID('Gate');
var dataContainer = newrestriction.getDataContainer(dataContainerType).addDataContainer();
var newDataContainerObject = dataContainer.createDataContainerObject('');
newDataContainerObject.getValue("AllowedTender").setSimpleValue("Gap Inc Credit Card");
newDataContainerObject.getValue("AllowedCustomerTypes").setSimpleValue("Gap Inc CC Holder");
newDataContainerObject.getValue("AllowedActions").setSimpleValue("Add to Bag");
newDataContainerObject.getValue("Gate_Start_date").setSimpleValue(iso_product.format(time_product));
newDataContainerObject.getValue("Gate_End_date").setSimpleValue(iso_product.format(time_product));

//Delete Restriction and delete it
var container = node.getDataContainerByTypeID('Gate').getDataContainers().toArray();
for (var i in container) {
    container[i].deleteLocal();
}
node.delete();
}