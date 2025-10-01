/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createBidirectionalReference",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Bidirectional Reference",
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
    "contract" : "ManagerBindContract",
    "alias" : "MANAGER",
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
exports.operation0 = function (NODE,MANAGER,MRG_REF,LOG) {
//commenting this code as merged style refernce is no longer maintained PPIM-15199
/**
 * This rule run as follows:
 * Get all references styles and create bidirectional references.
 * If need to merge shot request and this is primary style, set the new referenced styles as secondary.
 */

/*var needToMerge = (NODE.getValue("a_needToMerge").getSimpleValue() != null && NODE.getValue("a_needToMerge").getSimpleValue() != "" && NODE.getValue("a_needToMerge").getSimpleValue().equalsIgnoreCase('Yes'));
var isPrimary   = NODE.getValue("a_isPrimaryStyle").getSimpleValue() != null && NODE.getValue("a_isPrimaryStyle").getSimpleValue().equalsIgnoreCase('Yes');

var sRefs = NODE.getReferences().getByTypeID(MRG_REF); 

var it = sRefs.iterator();

while(it.hasNext()){
	var item = it.next();
	var targetID = item.getTarget().getID();
	var target = item.getTarget();
	var source = item.getSource();
	var secondaryStyle = MANAGER.getProductHome().getProductByID(targetID);	

	var referencedStyle = NODE.getValue("a_referencedStyle").getSimpleValue();
	var referencedStyle2 = secondaryStyle.getValue("a_referencedStyle").getSimpleValue();
	
	if(referencedStyle !=  null &&  !referencedStyle.contains(targetID)){	
		NODE.getValue("a_referencedStyle").addValue(targetID);			
	}
	if(referencedStyle == null){
		NODE.getValue("a_referencedStyle").addValue(targetID);
	}
	
	if(referencedStyle2 !=  null && !referencedStyle2.contains(NODE.getID())){		
		secondaryStyle.getValue("a_referencedStyle").addValue(NODE.getID());
	}
	if(referencedStyle2 == null){
		secondaryStyle.getValue("a_referencedStyle").addValue(NODE.getID());
	}
		

	try{
		if(!secondaryStyle.getID().equalsIgnoreCase(source.getID())){			
			secondaryStyle.createReference(source, MRG_REF);
 	               
 	          //part of PPIM-6907 requirements			
			var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			secondaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			LOG.info(iso.format(time));	
			
			if(needToMerge && isPrimary){
				secondaryStyle.getValue('a_isPrimary').setValue('No');
				secondaryStyle.getValue('a_needToMerge').setValue('Yes');
			} 
			if(needToMerge && !isPrimary){
				NODE.getValue('a_isPrimary').setValue('No');
				secondaryStyle.getValue('a_isPrimary').setValue('Yes');
				 
			}
		}
	}catch(e){
		
	}
}*/
}