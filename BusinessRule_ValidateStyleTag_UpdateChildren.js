/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ValidateStyleTag_UpdateChildren",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ValidateStyleTag UpdateChildren",
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
    "alias" : "currObj",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attCatgTag",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CategoryGroup_Tag_Inherit",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attProdTag",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_ProductType_Tag_Inherit",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "attDeptTag",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Department_Tag_Inherit",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "currLog",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currObj,attCatgTag,attProdTag,attDeptTag,currLog) {
//Publish all chidren of style if binded attributes updated
currLog.info("BUS RULE: ValidateStyleTag_UpdateChildren");
currLog.info("OBJ: " + currObj.getID());

//Save from WebUI sets new revision point
//Set object major revision for comparison between saves
//First major revision will cause all children to export for initial update
var currSize = currObj.getRevisions().size();
currObj.getRevision().setMajor();

//Set tags for review
var allAttsForReview = new java.util.ArrayList();
allAttsForReview.add(attCatgTag);
allAttsForReview.add(attProdTag);
allAttsForReview.add(attDeptTag);

for (var i=0; i < allAttsForReview.size(); i++) {
	//validate each attribute for export need
	//currLog.info("Attribute: " + allAttsForReview.get(i).getID());
	var needsExport = revisionCheck(currObj, allAttsForReview.get(i));
	if (needsExport) {
		exportChildren(currObj);
		break;
	}
}

function exportChildren (currObj) {
	var allChildren = currObj.getChildren();
	for (var i=0; i < allChildren.size(); i++) {
		var ccChildren = allChildren.get(i).getChildren();
		//setUpdateCC(allChildren.get(i));
		for (var s=0; s < ccChildren.size(); s++){
			setUpdateSku(ccChildren.get(s));
		}
	}
}

function setUpdateCC(childObj) {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	childObj.getValue('a_CC_MF_Maintainance_Last_Update_Date').setSimpleValue(iso.format(time));
	currLog.info("Set CC Update: " + childObj.getID());
}

function setUpdateSku(childObj) {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	childObj.getValue('a_main_last_modified_date').setSimpleValue(iso.format(time));
	currLog.info("Set Sku Update: " + childObj.getID());
}

function revisionCheck (currObj, attForReview) {
	var currLovs = currObj.getValue("" + attForReview.getID()).getValues();
	var allRevs = currObj.getRevisions();
	
	//if the first revision, export
	//currLog.info("allRevs.size: " + allRevs.size());
	if(allRevs.size() <= 1) {
		return true;
	}
	var prevRevNode = allRevs.get(1).getNode();
	var prevLovs = prevRevNode.getValue("" + attForReview.getID()).getValues();
	
	//if the revision lov sizes are different, export
	//currLog.info("CurLOV size: " + currLovs.size() + " PrevLOV size: " + prevLovs.size());
	if(currLovs.size() != prevLovs.size()) {
		return true;
	}
	for (var t=0; t < currLovs.size(); t++) {
		var isFound = false;
		for (var s=0; s < prevLovs.size(); s++) {
			if (currLovs.get(t).getID() == prevLovs.get(s).getID()) {
				
				//if each lov is found for both versions, don't export
				//currLog.info("CurrObj: " + currObj.getID() + " CurrLOVValue: " + currLovs.get(t).getValue() + "\nPrevObjDate: " +  currObj.getRevision().getCreatedDate() + " PrevLOVValue: " + prevLovs.get(s).getValue());
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