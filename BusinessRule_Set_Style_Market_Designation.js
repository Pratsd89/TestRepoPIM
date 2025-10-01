/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Set_Style_Market_Designation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set_Style_Market_Designation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,step,LKT) {
//PPIM-7125
// get market designations
var mktDsgVal = node.getValue('a_Market_Designation').getSimpleValue();

// get brand number from node
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

// use lookup table to convert brand number to contexts
var brandMarkets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);

var brandMarketsArray = [];

if (brandMarkets.contains(";")) {
  brandMarkets.split(";").forEach(function (mkt) {
    brandMarketsArray.push(mkt);
  });
}
else {
    brandMarketsArray.push(brandMarkets);	
}

brandMarketsArray.forEach(function (ctxt) {
  // execute in context
  step.executeInContext(ctxt, function (manager) {
    // get context specific node
    var ctxtNode = manager.getProductHome().getProductByID(node.getID());

    // get context node's ACL market designation
    var ctxtNodeACLMktDsg = ctxtNode.getValue('a_ACL_Market_Designation');
    var ctxtNodeACLMktDsgVal = ctxtNode.getValue('a_ACL_Market_Designation').getSimpleValue();

    if (ctxtNodeACLMktDsg.isInherited() == false) {
      if (mktDsgVal.contains(ctxtNodeACLMktDsgVal) == false) {
        ctxtNode.getValue("a_Market_Designation").addValue(ctxtNodeACLMktDsgVal);
      }
    }
  });
});

if (node.getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "Approved") {
	node.getParent().approve();
}
}