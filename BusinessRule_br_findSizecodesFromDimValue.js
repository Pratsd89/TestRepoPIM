/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_findSizecodesFromDimValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "MarketingFlagActions" ],
  "name" : "findSizecodesFromDimValue",
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
var contextID = manager.getCurrentContext().getID();
var advancedDim2ValueMap =  new java.util.HashMap();
var dimensions =   new java.util.ArrayList();
var sizeCodes =   new java.util.ArrayList();

manager.executeInContext(contextID, function(currentContextManager) {

    var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
  

    var attribute = manager.getAttributeHome().getAttributeByID("a_Advanced_Dimension_Value");
    searchHome = manager.getHome(com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome);
    searchArg = new com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome.SingleAttributeQuerySpecification(com.stibo.core.domain.Classification, attribute, "S");
    var searchResult = "";
    
        searchResult = searchHome.querySingleAttribute(searchArg).asList(200);
        log.info(searchResult);
        dimensions.add(searchResult);
     for(i=0;i<dimensions.size();i++){
			var codes= dimensions.get(i);
			var temp = manager.getClassificationHome().getClassificationByID(dimensions.get(i));
			log.info(temp);
			//var temp= codes.getClassification().getParent().getID();
		}
		log.info(codes);
    
});

}