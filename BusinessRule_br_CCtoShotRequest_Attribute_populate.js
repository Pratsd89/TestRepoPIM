/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CCtoShotRequest_Attribute_populate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_CCtoShotRequest_Attribute_populate",
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
    "alias" : "manager",
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
exports.operation0 = function (node,manager,ref_shot) {
function getReplacement(marketdesig){
	var newVal=""
	var tokens = marketdesig.split('<multisep/>');
	log.info("------------------->"+tokens.length)
	if(tokens.length>0){
		for(i=0;i<tokens.length;i++){
			var token = tokens[i];
			//log.info("value of newVal:::>"+newVal)
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


var CC_ID = node.getID();
var marketDesig = node.getValue('a_Market_Designation').getSimpleValue();
var replaceVal = getReplacement(marketDesig)
var refs = new java.util.ArrayList();
refs.addAll(node.getReferences(ref_shot));
log.info("reference: "+refs)
if (refs != null)
{
for( var i=0; i< refs.size(); i++)
{
	var ent_ID= refs.get(i).getTarget().getID();
	log.info("Entity:" +ent_ID)
	refs.get(i).getTarget().getValue('a_Market_Designation_Shot_Request').setSimpleValue(replaceVal)
	log.info("====>"+refs.get(i).getTarget().getValue('a_Market_Designation_Shot_Request').getSimpleValue());
	var marketCode= manager.getEntityHome().getEntityByID(ent_ID).getValue("a_Shared_Markets").getValues().toArray();
	log.info("Market :"+marketCode);
	if( marketCode != null)
	{
		marketCode.sort();
		var temp = [];
		for(var j=0;j<marketCode.length;j++)
		{
		temp.push(marketCode[j].getSimpleValue());		
		}
		temp = temp.sort();
		marketCode = temp.join(',');
		log.info(marketCode);
	}

	if(marketCode == 'US')
{
      manager.executeInContext('EN_US',function(enContextManager) 
      {	
      	//log.info("test "+node.getReferencedBy());
	
	var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
	var val=enCurrentProduct.getValue('a_CC_Number').getSimpleValue();
	log.info("testccnumber"+val);
	var enCurrentEntity= enContextManager.getEntityHome().getEntityByID(ent_ID);
	enCurrentEntity.getValue('a_Shot_CC_Number').setSimpleValue(val);
	log.info("entt test US"+enCurrentEntity.getValue('a_Shot_CC_Number').getSimpleValue())
      })
     
}
else if(marketCode == 'CAN,US')
{
	manager.executeInContext('EN_US',function(enContextManager) 
      {	
      	//log.info("test "+node.getReferencedBy());
	
	var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
	var val=enCurrentProduct.getValue('a_CC_Number').getSimpleValue();
	log.info("testccnumber US"+val);
	var enCurrentEntity= enContextManager.getEntityHome().getEntityByID(ent_ID);
	log.info("in context "+enCurrentEntity);
	enCurrentEntity.getValue('a_Shot_CC_Number').setSimpleValue(val);
	log.info("entt test US"+enCurrentEntity.getValue('a_Shot_CC_Number').getSimpleValue())
      })
     
      manager.executeInContext('EN_CA',function(caContextManager) 
      {
	
	var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
	var val2=caCurrentProduct.getValue('a_CC_Number').getSimpleValue();
	log.info("testccca"+val2)
	var caCurrentEntity= caContextManager.getEntityHome().getEntityByID(ent_ID);
	caCurrentEntity.getValue('a_Shot_CC_Number').setSimpleValue(val2);
	log.info("shot_cc CA"+caCurrentEntity.getValue('a_Shot_CC_Number').getSimpleValue())
      })
}

else if(marketCode == 'CAN')
{

      manager.executeInContext('EN_CA',function(caContextManager) 
      {
	
	var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
	var val2=caCurrentProduct.getValue('a_CC_Number').getSimpleValue();
	log.info("testccca"+val2)
	var caCurrentEntity= caContextManager.getEntityHome().getEntityByID(ent_ID);
	caCurrentEntity.getValue('a_Shot_CC_Number').setSimpleValue(val2);
	log.info("shot_cc_CA"+caCurrentEntity.getValue('a_Shot_CC_Number').getSimpleValue())
      })

}
else
{
	throw "Enter Market Code";
}
}
}
}