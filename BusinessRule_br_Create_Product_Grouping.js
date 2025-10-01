/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Product_Grouping",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Create Product Groupings",
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
var context = manager.getCurrentContext().getID();
var productGroupingTypeObj = manager.getProductHome().getProductByID(node.getID());

var brandNumber =  productGroupingTypeObj.getValue("a_Brand_Number").getSimpleValue();
log.info(brandNumber);
var newProductGroupID= brandNumber+ '-'+ 'PG'+'-'+ generateSequenceNumber();
log.info(newProductGroupID);
if (productGroupingTypeObj != null) {
var newProductGroup = productGroupingTypeObj.createProduct(newProductGroupID, "Product_Group");
newProductGroup.setName(newProductGroupID);
newProductGroup.getValue("a_Brand_Number").setSimpleValue(brandNumber);

if(context=='EN_US'){
newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
  var contextNode = manager.executeInContext("EN_CA", function(cmmanager) {
        return cmmanager.getObjectFromOtherManager(newProductGroup);
    });
contextNode.getValue("a_SuperPDP_Market").addValue("US");    
contextNode.getValue("a_SuperPDP_Market").addValue("CAN");

}
else if (context =='EN_CA' || context =='FR_CA'){
newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
 }
}




function generateSequenceNumber() {
  const timestamp = new Date().getTime(); 
  const sequenceNumber = timestamp.toString().slice(-7); 
  return sequenceNumber; 
}
}