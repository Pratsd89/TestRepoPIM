/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Move_Web_SubCategory_To_Category",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Move SubCategory To Category",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MoveSubCategoryToCategoryReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MoveSubCategoryToCategory",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,MoveSubCategoryToCategoryReference,webui) {
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
var subCategoryList = node.getChildren().toArray();
var sortOrder = 0;
var newSortOrder;
for(var i=0;i<subCategoryList.length;i++){
	var subCategory = subCategoryList[i];
	var reference = subCategory.getReferences(MoveSubCategoryToCategoryReference).toArray();
	if(reference.length!=0){
		var categoryID = reference[0].getTarget().getID();
		var classification = stepManager.getClassificationHome().getClassificationByID(categoryID);
		var productsList = classification.getClassificationProductLinks().toArray();
		for(var k=0;k<productsList.length;k++){
			var objectType = productsList[k].getProduct().getObjectType().getID();
			if(objectType == 'Style' || objectType == 'CustomerChoice'){
				reference[0].delete();
				//throw 'Unable to move Subcategory to Category with associated products';
				webui.showAlert("ERROR","ERROR","Unable to move Subcategory to Category with associated products");
				return;
			}
		}
		var newCategoryChildren = classification.getChildren().toArray();
		for(var j=0;j<newCategoryChildren.length;j++){
			
			var existingSortOrder  = newCategoryChildren[j].getValue('a_WebCategory_Sort_Order').getSimpleValue();
			if(existingSortOrder > sortOrder){
				sortOrder = existingSortOrder;
			}
			
		}
		var objectType = classification.getObjectType().getID();
		if(objectType =='WebCategory'){
			subCategory.setParent(classification);
			newSortOrder = parseInt(sortOrder) + 20;
			subCategory.getValue('a_WebCategory_Sort_Order').setSimpleValue(newSortOrder);
			reference[0].delete();
			var time1 = new java.util.Date();
			var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			//logger.info(iso.format(time));
			classification.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1));
			
		}
		
	}
}
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_setMainLastUpdateDate"
  } ],
  "pluginType" : "Operation"
}
*/
