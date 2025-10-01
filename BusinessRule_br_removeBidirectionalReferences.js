/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_removeBidirectionalReferences",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Remove Bidirectional Reference ",
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
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MRG_REF",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MergedStylesRef",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "MANAGER",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "LOG",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (NODE,MRG_REF,MANAGER,LOG) {
//commenting this code as merged style refernce is no longer maintained PPIM-15199
/**
 * This rule runs as follows: 
 * It will check if there is a referenced style that has been removed, by checking a_referencedStyle
 */ 
/*var styleID = NODE.getID();
var referencedStyles = NODE.getReferences(MRG_REF);

// 1.- Get IDs of referenced Styles
var currentReferences = referencedStyles.iterator();
var refStyles = new java.util.ArrayList();

// 2.- Get old references IDs.
var oldRef  = new java.util.ArrayList();
var currRef = new java.util.ArrayList();

var vals = NODE.getValue('a_referencedStyle').getValues().iterator();
while(vals.hasNext()){
	var val = vals.next();
	oldRef.add(val.getSimpleValue())
}

while(currentReferences.hasNext()){
	var currentReference = currentReferences.next();
	var id = currentReference.getTarget().getID();
	currRef.add(id);	
} 

var toDelete  = new java.util.ArrayList();
for(var i = 0; i<oldRef.size(); i++){
	if(!currRef.contains(oldRef.get(i))){			
		var style2 = MANAGER.getProductHome().getProductByID(oldRef.get(i));		
		if(style2 != null){
			var ref3 = style2.getReferences(MRG_REF);	
	
			var iterator = style2.getReferences(MRG_REF).iterator();
			while(iterator.hasNext()){
				var ref = iterator.next();
				if(styleID == ref.getTarget().getID()){			
					ref.delete()
				}		
			}
			if(style2.getReferences(MRG_REF).size()==0){
				style2.getValue("a_isPrimaryStyle").setSimpleValue("")
				style2.getValue("a_needToMerge").setSimpleValue("")
			}
		}
		
	}
}

var ref = NODE.getValue("a_referencedStyle").getValues();

for(var i = 0; i < toDelete.size(); i++){	
	for(var j = 0; j< ref.size();j++){
		if(ref.get(j).getSimpleValue() == toDelete.get(i)){
			ref.remove(ref.get(j))
		}
	}
	toDelete.get(i).delete()
}

 NODE.getValue("a_referencedStyle").setSimpleValue(ref);*/



}