/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set_CC_Sort_Order_Inbound",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set CC Sort Order Inbound",
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
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
exports.operation0 = function (node,stepManager,LKT) {
function setSortOrder(node){
    if(node.getObjectType().getID()=='CustomerChoice'){
        var aclMarketDesignation = node.getValue('a_ACL_Market_Designation').getSimpleValue();
        if(aclMarketDesignation != null && aclMarketDesignation != ''){
            if(node.getValue('a_CC_Sort_Order').getSimpleValue() == null || node.getValue('a_CC_Sort_Order').getSimpleValue() == ''){
                var style = node.getParent();
                var ccList = style.getChildren();                
                var sortOrder = 1000;
                    for(var i = 0 ; i < ccList.size();i++){
                        if(node.getID() != ccList.get(i).getID()){
                            var ccSortOrder = ccList.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
                            if(ccSortOrder != null && ccSortOrder != ''){
                            		parseInt(ccSortOrder);
	                            if(ccSortOrder < sortOrder){
	                                sortOrder = ccSortOrder;
	                            }
                            }
                            
                        }
                            
                    }
                    var newSortOrder= sortOrder - 1;
                    node.getValue('a_CC_Sort_Order').setSimpleValue(newSortOrder);
            }
        }
        
    }
}

var mkd = node.getValue("a_ACL_Market_Designation").getSimpleValue();
var arr=[];
arr=mkd.split("<multisep/>");
for(var i=0;i<arr.length;i++)
{
	 var market = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", arr[i]);
	 stepManager.executeInContext(market, function(step) {
      var cxtCC = step.getProductHome().getProductByID(node.getID());
      setSortOrder(cxtCC);
      });
}
}