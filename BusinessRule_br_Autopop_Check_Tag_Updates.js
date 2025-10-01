/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_Check_Tag_Updates",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Autopop Check for Tag Updates",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeGroupBindContract",
    "alias" : "prodTags",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeGroupImpl",
    "value" : "ag_Product_Tags",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,prodTags) {
//validate for Autopop
logger.info("BUS RULE CONDITION: br_Autopop_Save_Action: " + node.getID());

var currSize = node.getRevisions().size();

//Set tags for review
//var allAttsForReview = new java.util.ArrayList();

var allAttsForReview = prodTags.getAttributes();
var attsIt = allAttsForReview.iterator();

while (attsIt.hasNext()){
	//validate each attribute for export need
	//logger.info("Attribute: " + allAttsForReview.get(i).getID());
	var needsExport = revisionCheck(node, attsIt.next());
	if (needsExport) {
		return true;
	}
}

return false;

function revisionCheck (node, attForReview) {
	var currLovs = node.getValue("" + attForReview.getID()).getValues();
	var allRevs = node.getRevisions();
	
	//if the first revision, export
	//logger.info("allRevs.size: " + allRevs.size());
	if(allRevs.size() <= 1) {
		return true;
	}
	var prevRevNode = allRevs.get(1).getNode();
	var prevLovs = prevRevNode.getValue("" + attForReview.getID()).getValues();
	
	//if the revision lov sizes are different, export
	//logger.info("CurLOV size: " + currLovs.size() + " PrevLOV size: " + prevLovs.size());
	if(currLovs.size() != prevLovs.size()) {
		return true;
	}
	for (var t=0; t < currLovs.size(); t++) {
		var isFound = false;
		for (var s=0; s < prevLovs.size(); s++) {
			if (currLovs.get(t).getID() == prevLovs.get(s).getID()) {
				
				//if each lov is found for both versions, don't export
				//logger.info("node: " + node.getID() + " CurrLOVValue: " + currLovs.get(t).getValue() + "\nPrevObjDate: " +  node.getRevision().getCreatedDate() + " PrevLOVValue: " + prevLovs.get(s).getValue());
				isFound = true;
				
			}
		}
		if (!isFound){
			return true;
		}
	}
	return false;
}


}