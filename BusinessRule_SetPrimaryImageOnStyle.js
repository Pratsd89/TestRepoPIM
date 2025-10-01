/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetPrimaryImageOnStyle",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetPrimaryImageOnStyle",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "alias" : "step",
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
    "alias" : "primRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,primRef) {
//var children = node.getChildren();
var obj = node.getObjectType().getID();
if(obj == "Style"){
var sReferencingCCs = new java.util.ArrayList();
			sReferencingCCs.addAll(node.getChildren());
			if (!sReferencingCCs.isEmpty()) {
			var ref1 = sReferencingCCs.get(0).getValue('a_CC_Sort_Order').getSimpleValue();
			var numPro = sReferencingCCs.get(0).getReferences(primRef).toArray();
			//log.info("numpro"+sReferencingCCs.get(0).getReferences(primRef).size());
			if (sReferencingCCs.get(0).getReferences(primRef).size() != 0){
			var accTarget = numPro[0].getTarget();
			}
			
			if(ref1 == null || ref1 == '' || sReferencingCCs.get(0).getReferences(primRef).size() == 0){
				ref1=999999;				
				}
			//log.info("first element "+ref1);
			//log.info("total elements "+sReferencingCCs.size());
			ref1=parseInt(ref1);
			for (var i = 1; i < sReferencingCCs.size(); i++) {
				//log.info("iterate"+sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue()+"size"+sReferencingCCs.get(i).getReferences(primRef).size());
				if(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() !=null && sReferencingCCs.get(i).getReferences(primRef).size()!= 0){
				//log.info("sortOrder "+sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue());
				if(parseInt(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue()) < ref1 ){
					ref1 = sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
					//log.info("reference "+sReferencingCCs.get(i).getReferences(primRef));
					//var numPro=0;
					//var accTarget =0;
					var numPro = sReferencingCCs.get(i).getReferences(primRef).toArray();
					var accTarget = numPro[0].getTarget();
					//log.info(accTarget);
					//var CCRefs = sReferencingCCs.get(i).getReferences(primRef);
					
					}
				//if(!(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() == null || sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() == '')){
			//if(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() < ref1){
				//ref1=sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
				//log.info("sortOrder "+ref1);
			//}
				//}
				}
			}
			//log.info("in if clause "+ref1);
			//adding image reference
			if(ref1 != null && accTarget != null){
				//log.info("in final addition");
			var currNode = node.getReferences(primRef).size();
			if(parseInt(currNode) == 0){			
			node.createReference(accTarget, primRef);
			}
			else
			{
				var delImg = node.getReferences(primRef).toArray();
				for(var k=0; k<currNode; k++){
					//log.info("in deletion");
					delImg[k].delete();					
					}
				node.createReference(accTarget, primRef);
				
				}
			}
			
			}
}

else if(obj == "CustomerChoice"){
var nodeP = node.getParent();
var sReferencingCCs = new java.util.ArrayList();
			sReferencingCCs.addAll(nodeP.getChildren());
			if (!sReferencingCCs.isEmpty()) {
			var ref1 = sReferencingCCs.get(0).getValue('a_CC_Sort_Order').getSimpleValue();
			var numPro = sReferencingCCs.get(0).getReferences(primRef).toArray();
			//log.info("numpro"+sReferencingCCs.get(0).getReferences(primRef).size());
			if (sReferencingCCs.get(0).getReferences(primRef).size() != 0){
			var accTarget = numPro[0].getTarget();
			}
			
			if(ref1 == null || ref1 == '' || sReferencingCCs.get(0).getReferences(primRef).size() == 0){
				ref1=999999;				
				}
			//log.info("first element "+ref1);
			//log.info("total elements "+sReferencingCCs.size());
			ref1=parseInt(ref1);
			for (var i = 1; i < sReferencingCCs.size(); i++) {
				//log.info("iterate"+sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue()+"size"+sReferencingCCs.get(i).getReferences(primRef).size());
				if(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() !=null && sReferencingCCs.get(i).getReferences(primRef).size()!= 0){
				//log.info("sortOrder "+sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue());
				if(parseInt(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue()) < ref1 ){
					ref1 = sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
					//log.info("reference "+sReferencingCCs.get(i).getReferences(primRef));
					//var numPro=0;
					//var accTarget =0;
					var numPro = sReferencingCCs.get(i).getReferences(primRef).toArray();
					var accTarget = numPro[0].getTarget();
					//log.info(accTarget);
					//var CCRefs = sReferencingCCs.get(i).getReferences(primRef);
					
					}
				//if(!(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() == null || sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() == '')){
			//if(sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue() < ref1){
				//ref1=sReferencingCCs.get(i).getValue('a_CC_Sort_Order').getSimpleValue();
				//log.info("sortOrder "+ref1);
			//}
				//}
				}
			}
			//log.info("in if clause "+ref1);
			//adding image reference
			if(ref1 != null && accTarget != null){
				//log.info("in final addition");
			var currNode = nodeP.getReferences(primRef).size();
			if(parseInt(currNode) == 0){			
			nodeP.createReference(accTarget, primRef);
			}
			else
			{
				var delImg = nodeP.getReferences(primRef).toArray();
				for(var k=0; k<currNode; k++){
					//log.info("in deletion");
					delImg[k].delete();					
					}
				nodeP.createReference(accTarget, primRef);
				
				}
			}
			
			}
}
}