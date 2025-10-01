/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setInternationalShippableExclude",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set International Shippable Exclude (No)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "alias" : "manager",
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
exports.operation0 = function (node,manager,logger,LKT) {
var marketDesignationArray = node.getValue('a_Style_Market_Designation').getValues().toArray();
var needPublish=false;
  marketDesignationArray.forEach(function (mkt) {  
  	if(mkt.getValue()== "US"){          
      var context = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", mkt.getValue());              
               manager.executeInContext(context, function (manager) {                    
                    var contextStyle = manager.getProductHome().getProductByID(node.getID());
                  contextStyle.getValue('a_International_Shippable').setSimpleValue("No");    
                  needPublish=true;                            
            })
            }
        })
if(needPublish){
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}
}