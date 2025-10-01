/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Handle_Special_Chars_For_Style_CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Handle_Special_Chars_For_Style_CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node) {
//br_Handle_Special_Chars_For_Style_CC
// fucntion to replace with key pair values 
//original will be the name of the node 
// what is the value to be replaced 
//replaceWith which value to be replaced 
function replaceCharacter(original, toReplace, replaceWith) {
	
    return original.split(toReplace).join(replaceWith);
}

// this Map will have the values which are to be replaced with which value 
//Example ;amp; will be re placed with ;
var specialMap = new java.util.HashMap();
// for &
specialMap.put(";",";amp;" );
// for <
specialMap.put("lt;","amp;lt;" );
//for >
specialMap.put("gt;","amp;gt;" );
//for '
specialMap.put("#39;" ,"amp;#39;" );
// for "
specialMap.put("&quot;" ,"&amp;quot;" );
// if any characters identified  then they will be added to the Map

var  name =  node.getName();
if (name != null ){
specialMap.forEach((value, key) => {
  name =  replaceCharacter(name,key,value);
});
}
node.setName(name);

//log.info(name);
//log.info(name);

}