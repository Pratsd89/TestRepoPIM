/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PPIM-13453",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_PPIM-13453",
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
exports.operation0 = function (node,manager,LKT) {
//var parameter1 = "CC";
//var CC = LKT.getLookupTableValue("PPIM-13453_CCList", parameter1);
//var CCList = CC.split(";");
//for (var i in CCList){
	//log.info(CCList[i]);
	//var cc = manager.getProductHome().getProductByID(CCList[i]); 
	var Oldstyle = node.getParent();
	var oldSubclass = Oldstyle.getParent().getID();
	var OldstyleID = node.getParent().getID();
	//log.info(OldstyleID);
	var NewstyleID = replaceAt(OldstyleID, 2, "9");
	//var NewstyleID ="009850860";
	
	//log.info(NewstyleID);
    
     
	var NewStyleIDObject = manager.getProductHome().getProductByID(NewstyleID);
	//log.info(NewStyleIDObject);
	if(NewStyleIDObject != null){
	var NewSubClass = NewStyleIDObject.getParent().getID();	
	if(oldSubclass == NewSubClass){	
		node.setParent(NewStyleIDObject);
	} else {
		log.info(OldstyleID + " is present under the subclass "+oldSubclass+ " and "+NewStyleIDObject.getID()+ "is present under the subclass" +NewSubClass);
	}
}
 else {
 	log.info("New Style not found "+NewstyleID);	
 }
//}


 function replaceAt ( str, index, replacement){
 	var strarray = str.split('');
 	strarray[index] = replacement;
 	var value = strarray.join('');
 	return value;
 }

}