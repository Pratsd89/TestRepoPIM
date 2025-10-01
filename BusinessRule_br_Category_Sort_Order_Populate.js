/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Category_Sort_Order_Populate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Category Product Sort Order Null Value Population",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager) {

var a;
var x=0;
var sortref=0;
if(node.getValue("a_WebCategory_Assortment_Type").getSimpleValue()=='Manual')
{
    //log.info(b.getID());
    //log.info(b.getClassificationProductLinks());
    var refs1 = new java.util.ArrayList();
    refs1.addAll(node.getClassificationProductLinks());
    for( a=0; a< refs1.size(); a++)
    {	
        sortref=refs1.get(a).getValue("a_WebCategory_Product_Sort_Order").getSimpleValue(); 	
        if(sortref!=null)
        {
            if(parseInt(x) < parseInt(sortref))
            {
                x=0;
                x=sortref;	
            }
        }
    }
    for( a=0; a< refs1.size(); a++)
    {
        var sortref=refs1.get(a).getValue("a_WebCategory_Product_Sort_Order").getSimpleValue();
        if( sortref == null)
        {
            x = parseInt(x) + 20;
            //log.info("Assigning incremented sort order value as :" + x);
            refs1.get(a).getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(x);
        }
    }
    x=0;
}
	

}