/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setSKUStartDate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set SKU Start Date based on CC",
  "description" : "Update SKU start date if CC publish date is changed",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var currCCPublicationDate = node.getValue("a_CC_Start_Date").getSimpleValue();

var currRevision = node.getRevision().getName();
var revisions = node.getRevisions().iterator();
var prevRevisionNode = null;
			
while(revisions.hasNext())
{
	var current = revisions.next();
	var revName = current.getName();
	prevRevisionNode = current.getNode();
	if(currRevision != revName)
		break;	
}

var prevCCStartDate = prevRevisionNode.getValue("a_CC_Start_Date").getSimpleValue();

if(currCCPublicationDate!=prevCCStartDate)
{	
	var skuList=node.getChildren().iterator();
	while(skuList.hasNext())
	{
		var sku=skuList.next();
						
		var skuStartDate = sku.getValue("a_SKU_Start_Date").getSimpleValue();
				
		if(currCCPublicationDate!=skuStartDate)
		{
			sku.getValue("a_SKU_Start_Date").setSimpleValue(currCCPublicationDate);
		}
	}
}
}