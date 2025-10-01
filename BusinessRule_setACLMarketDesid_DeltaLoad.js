/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "setACLMarketDesid_DeltaLoad",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "set Market Designation Delta Load",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU" ],
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

    // get market designations
    var mktDsgVal = null;
    var mktDsgValInherited = ctxtNode.getValue('a_Market_Designation').isInherited();
	//log.info(mktDsgValInherited);
    if (mktDsgValInherited == false) {
      mktDsgVal = ctxtNode.getValue('a_Market_Designation').getSimpleValue();
    }
	//log.info(mktDsgVal);
    // get context node's ACL market designation
    var ctxtNodeACLMktDsg = ctxtNode.getValue('a_ACL_Market_Designation');
    var ctxtNodeACLMktDsgVal = ctxtNode.getValue('a_ACL_Market_Designation').getSimpleValue();

    if (ctxtNodeACLMktDsg.isInherited() == false && ctxtNodeACLMktDsgVal != null) {

      if (mktDsgVal == null) {
        
        ctxtNode.getValue("a_Market_Designation").setSimpleValue(ctxtNodeACLMktDsgVal);
      }
      else if (mktDsgVal.contains(ctxtNodeACLMktDsgVal) == false) {
      	
        ctxtNode.getValue("a_Market_Designation").addValue(ctxtNodeACLMktDsgVal);
      }
    }
  });
});
//log.info(node.getValue('a_Market_Designation').isInherited());
//log.info(node.getValue('a_Market_Designation').getSimpleValue());
}