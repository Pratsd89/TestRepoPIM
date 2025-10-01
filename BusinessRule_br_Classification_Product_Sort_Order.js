/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Classification_Product_Sort_Order",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Classification_Product_Sort_Order",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refclass",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,refclass) {
var obj=node.getID();
var sort_order =0;
log.info("sort_order:" +sort_order);
var refs = new java.util.ArrayList();
refs.addAll(node.getClassificationProductLinks(refclass));
log.info(refs.size());
if (refs != null)
{
for( var i=0; i< refs.size(); i++)
{
	var b= refs.get(i).getProduct().getID();
	log.info(b);
	sort_order= sort_order+20;
	log.info(sort_order)
	//b.getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(sort_order);
     refs.get(i).getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(sort_order);
     var e = refs.get(i).getValue("a_WebCategory_Product_Sort_Order").getSimpleValue();
	log.info(e)
}
}
else
{
	log.info("detail not found")
}

}