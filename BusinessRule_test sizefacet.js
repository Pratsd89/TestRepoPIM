/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test sizefacet",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test sizefacet",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeFacetCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log) {
var marketdesig = node.getValue("a_Market_Designation").getSimpleValue();
log.info(marketdesig)

tokens = marketdesig.split("<multisep/>")
replaceVal ="";
replaceVal+=tokens[0];
for(i=1;i<tokens.length;i++){
	
	token = tokens[i];
	for(j=0;j<tokens.length;j++){
		if(token!=tokens[j]){
			if(replaceVal.indexOf(token)<0){
			replaceVal+="<multisep/>";	
			replaceVal+=token;
			break;
			}
		}
		
	}
	
}

node.getValue('a_Market_Designation').setSimpleValue(replaceVal);
//log.info(node.getValue("a_Market_Designation").getSimpleValue())
}