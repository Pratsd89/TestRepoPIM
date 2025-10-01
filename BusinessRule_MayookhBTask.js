/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "MayookhBTask",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test Mayookh Bulk Update",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref_shot",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,ref_shot) {
/*var marketdesig = node.getValue("a_Market_Designation").getSimpleValue();
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
*/

function getReplacement(marketdesig){
	var newVal=""
	var tokens = marketdesig.split('<multisep/>');
	log.info("------------------->"+tokens.length)
	if(tokens.length>0){
		for(i=0;i<tokens.length;i++){
			var token = tokens[i];
			if(newVal!=token && newVal!="" ){
				newVal='BOTH';
			}
			else{
				newVal = token;
			}
		}
	}

	return newVal;
}

var marketDesig = node.getValue('a_Market_Designation').getSimpleValue();
var replaceVal = getReplacement(marketDesig)
var refs = new java.util.ArrayList();
refs.addAll(node.getReferences(ref_shot));
log.info("reference: "+refs)
if (refs != null)
{
	for( var i=0; i< refs.size(); i++)
	{
		//var ent_ID= refs.get(i).getTarget().getID();
		refs.get(i).getTarget().getValue('a_Market_Designation_Shot_Request').setSimpleValue(replaceVal) 
		log.info("====>"+refs.get(i).getTarget().getValue('a_Market_Designation_Shot_Request').getSimpleValue());
	}
}
}