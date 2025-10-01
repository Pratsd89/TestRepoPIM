/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TESTARA",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "TESTARA",
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
    "contract" : "ClassificationBindContract",
    "alias" : "Classification1root",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "Classification 1 root",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "SKUToSizeCode",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
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
exports.operation0 = function (node,Classification1root,SKUToSizeCode,manager) {
//node.setParent(Classification1root);

/*var ref = node.getClassificationProductLinks(SKUToSizeCode).toArray();
var List= ["SC-B57-0000"];
var count = 0;
for( var i in ref){
	var refnode = ref[i].getClassification();
	var ID  = refnode.getID();
	log.info(ID);
	for( var j in List){
		log.info(List[j]);
		if(ID == List[j]){
			count = count+1;
			log.info(count);
		}		
	}
}

if(count > 0 ){
	return true;
} else return false;*/
/*
var ref = node.queryClassificationProductLinks().asList(2);
log.info("ref"+ref);
var count = 0;
if (ref) {
    var Products = ref.iterator();
          while (Products.hasNext()) {
               var product = Products.next();
                   var obj = product.getProduct();
                     log.info(obj.getID());
                     break;
          }
}
if(count > 0 ){
	return true;
} else return false;
*/


var Parent = manager.getClassificationHome().getClassificationByID("TAGTYP_1017");
log.info(Parent);
var id = "TAGVAL_3000"
var TagValue = Parent.createClassification(null,"Tag_Value");
log.info(TagValue);

}