/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ValidateCCAtts_UpdateChildren",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ValidateCCAtts Update Children",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepMan",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (currObj,attCatgTag,attProdTag,attDeptTag,currLog,stepMan) {
//Publish all chidren of style if binded attributes updated
currLog.info("BUS RULE: ValidateStyleTag_UpdateChildren");
currLog.info("OBJ: " + currObj.getID());

//Set tags for review
var allAttsForReview = new java.util.ArrayList();
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_Override_CC_Name"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_Override_Search_Color"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_Start_Date"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_End_Date"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_Deactivation_Reason"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_BOPIS_Exclusion_Start"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_BOPIS_Exclusion_End"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_Tax_Code"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_Attribute_Smartsheet_Identifier"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_Life_Cycle_Status"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_Photo_Status"));
allAttsForReview.add(stepMan.getAttributeHome().getAttributeByID("a_CC_Sort_Order"));

for (var i=0; i < allAttsForReview.size(); i++) {
	//validate each attribute for export need
	//currLog.info("Attribute: " + allAttsForReview.get(i).getID());
	var needsExport = revisionCheck(currObj, allAttsForReview.get(i));
	if (needsExport) {
		setUpdateCC(currObj);
		exportChildren(currObj);
		break;
	}
}

function exportChildren (currObj) {
	var allChildren = currObj.getChildren();
	for (var i=0; i < allChildren.size(); i++) {
		setUpdateSku(allChildren.get(i));
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
	currLog.info("ATT: " + attForReview.getID());
	if(attForReview.hasLOV() && attForReview.isMultiValued()){
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
	} else {
		var currValue = currObj.getValue("" + attForReview.getID()).getSimpleValue();
		var allRevs = currObj.getRevisions();
	
		//if the first revision, export
		//currLog.info("allRevs.size: " + allRevs.size());
		if(allRevs.size() <= 1) {
			return true;
		}
		var prevRevNode = allRevs.get(1).getNode();
		var prevValue = prevRevNode.getValue("" + attForReview.getID()).getSimpleValue();
		if(currValue != prevValue){
			return true;
		}
		return false;
	}
	return false;
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_Autopop_In-Progress"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "true"
  } ],
  "pluginType" : "Precondition"
}
*/
