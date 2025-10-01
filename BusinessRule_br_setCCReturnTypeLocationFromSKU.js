/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setCCReturnTypeLocationFromSKU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set CC Return Location Type from SKU",
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
var skuList=node.getChildren()
var skuSize = skuList.size()
var skuIterator = skuList.iterator();

var freeReturnCount=0
var mailReturnCount=0;
var nonReturnCount=0
var emptyReturnLocation=0;
while(skuIterator.hasNext())
{
	var sku=skuIterator.next();					
	var skuReturnLocationType = sku.getValue("a_Return_Location_Type").getSimpleValue();	
	switch(true){
		case skuReturnLocationType == 'Free Returns':
			freeReturnCount+=1;
			break;
		case skuReturnLocationType == 'Mail Only':
			mailReturnCount+=1;
			break;
		case skuReturnLocationType == 'Non-Returnable':
			nonReturnCount+=1;
			break;
		default:
			emptyReturnLocation+=1;
	}
}

if(freeReturnCount== skuSize){
	node.getValue("a_Return_Location_Type").setSimpleValue("Free Returns");	
}else if(mailReturnCount== skuSize){
	node.getValue("a_Return_Location_Type").setSimpleValue("Mail Only");
}else if(nonReturnCount== skuSize){
	node.getValue("a_Return_Location_Type").setSimpleValue("Non-Returnable");
}else{
	log.info("CC will be updated only if all SKUs have same returnLocation Type ")
}

var changesToApprove = new java.util.HashSet();
	for (var partObjects = node.getNonApprovedObjects().iterator(); partObjects.hasNext(); ) {
		var partObject = partObjects.next();
	     if (partObject instanceof com.stibo.core.domain.partobject.ValuePartObject && partObject.getAttributeID()=='a_Return_Location_Type') {
	     	changesToApprove.add(partObject);
	          break;
	     }
	}
if(node.getParent().getApprovalStatus()!='Not in Approved workspace' && node.getApprovalStatus()!='Not in Approved workspace')
	node.approve(changesToApprove);
}