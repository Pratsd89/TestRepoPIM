/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_KC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test_KC",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var ref = node.getReferencedBy();
//log.info(ref);
var refArray = ref.toArray();
//log.info(refArray);
for(var i=0; i<refArray.length; i++){
	var reference = refArray[i];
//	log.info(reference.getReferenceType().getID());
//	log.info(typeof reference.getReferenceType());
	if (reference.getReferenceType().getID() == "rt_ProductGroups") {
		log.info(reference.getSource().getValue("a_Product_Grouping_Start_date").getSimpleValue());
		log.info(reference.getSource().getValue("a_Product_Grouping_End_Date").getSimpleValue());
		var sourceId = reference.getSource().getID();
		log.info(sourceId);
//		log.info(JSON.stringify(reference.getTarget()));
//		var refType = step.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
		var refType = reference.getReferenceType();
		var refList = reference.getSource().getReferences(refType);
//		log.info(refList);
		for(var i=0; i< refList.size(); i++) {
			var temp = refList.get(i).getTarget().getID();
			var legacyId = refList.get(i).getTarget().getValue("a_Style_Number").getSimpleValue();
			log.info("legacyId: "+legacyId);
			log.info(temp);
			log.info("SellingStyle? "+refList.get(i).getValue("a_Primary_Selling_Style").getSimpleValue());
//			Object.keys(refList.get(i)));
//			log.info(Object.keys(refList.get(i).getTarget()));
		}
	}
}
//log.info(ref.getSource().getID());

}