/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SizeModelWorkflowApproval",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "SizeModelWorkflowApproval",
  "description" : "SizeModelWorkflowApproval",
  "scope" : "Global",
  "validObjectTypes" : [ "SizeCode", "SizeModel" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager) {
var result = true;
var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
var obj = node.getObjectType().getID();
log.info("object type is: "+obj);
if(obj == "SizeCode")
{
	log.info("its size code");
	var x = node.getClassificationProductLinks().toArray();
	var sku = x[0].getProduct()
	var cc = sku.getParent();
	var style = cc.getParent();
	//var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
	var classificationType = classificationTypeHome.getLinkTypeByID('SizeModelRef'); 
	var szmo = style.getClassificationProductLinks(classificationType).toArray();
	var szmodid = szmo[0].getClassification().getID();
	var scodPar = node.getParent().getID();
	if(szmodid == scodPar){
		node.approve();
		node.getValue("a_Size_Model_Status").setSimpleValue("approved");
		log.info("approved");
		}
		else{
			log.info("Not approved");
			result = "The Size code cant be approved. Please add it to the correct size model";
			}
	}
else if (obj == "SizeModel")
{
	//log.info("its size model");
	var smod = node.getID();
	var x1 = node.getClassificationProductLinks().toArray();
	var styl = x1[0].getProduct();
	var refs = new java.util.ArrayList();
	refs.addAll(styl.getChildren());

	if(refs.size()!=0){
			for(var i=0;i<refs.size();i++){
						
						var CC_ID = refs.get(i).getID();
						//log.info("CC"+CC_ID);
						if(CC_ID !=null)
						{
							var refs1 = new java.util.ArrayList();
							var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
							refs1.addAll(SKUCheck.getChildren());
							if(refs1.size()!=0){
								var k = 0;
								for(var j=0;j<refs1.size();j++)
									{
									var SKU_ID = refs1.get(j).getID();
									var classificationType1 = classificationTypeHome.getLinkTypeByID('SKUToSizeCode'); 
										var x1 = refs1.get(j).getClassificationProductLinks(classificationType1).toArray();
										var tarLen1= x1.length;//Target length
										if(x1[0] != null && x1[0] !=''){
										var a_TarObj1 = x1[0].getClassification().getID();
										log.info("sku class"+x1[0].getClassification().getID());

											}
									
									
									var sku_code_id=x1[0].getClassification().getParent().getID();
								//	log.info("sku parent code: "+sku_code_id);
									if(sku_code_id != smod)
									{
										result = "The Size model cant be approved.";
										}
										else{
											k++;
											}
									
									
									}
									if (j == k){
										node.approve();
										node.getValue("a_Size_Model_Status").setSimpleValue("approved");
										log.info("size model approved");
										}
							}
							else{
								
								result=false;
								}
	}
	else{
		result = false;
		}
	}
		}
		else{
			
			result = false;
			}
	
	
	}
	return result;
}