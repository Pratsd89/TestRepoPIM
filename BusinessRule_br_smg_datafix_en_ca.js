/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_smg_datafix_en_ca",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_smg_datafix_en_ca",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group", "Style" ],
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

var context = step.getCurrentContext().getID();
var primaryStyle = node.getValue("a_Primary_Product").getSimpleValue();
logger.info("Primary Style ID: " + primaryStyle); 

var styleNumber = step.getAttributeHome().getAttributeByID("a_Style_Number");
logger.info("Style Attribute Name is: " + styleNumber.getName());

var styleObject = step.getObjectTypeHome().getObjectTypeByID("Style");
logger.info("Object Name is: " + styleObject.getName());

var cond = com.stibo.query.condition.Conditions;
var home = step.getHome(com.stibo.query.home.QueryHome);

//var querySpecification = home.queryFor(com.stibo.core.domain.Product).where(cond.valueOf(styleNumber).eq(primaryStyle).and(cond.getProductByID(styleObject)));
var querySpecification = home.queryFor(com.stibo.core.domain.Product).where(cond.objectType(styleObject).and(cond.valueOf(styleNumber).eq(primaryStyle)));
  // logger.info("Query Executed: " + querySpecification);  
var result = querySpecification.execute();
//logger.info("Query Executed: "+result); 

var resultSet = result.toArray();

for (var j = 0; j < resultSet.length; j++) {

	var styleID = resultSet[j].getID();
	logger.info("Primary Style ID: "+styleID);
}

}