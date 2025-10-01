/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Move_Web_Category_To_Division",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Move Web Category To Division",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebDivision" ],
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
    "alias" : "MoveCategoryToDivisionReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MoveCategoryToDivision",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,MoveCategoryToDivisionReference) {
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
var webCategoryList = node.getChildren().toArray();
var sortOrder = 0;
var newSortOrder;
for(var i=0;i<webCategoryList.length;i++){
	var webCategory = webCategoryList[i];
	var reference = webCategory.getReferences(MoveCategoryToDivisionReference).toArray();
	if(reference.length!=0){
		var divisionID = reference[0].getTarget().getID();
		var classification = stepManager.getClassificationHome().getClassificationByID(divisionID);
		var newDivisionChildren = classification.getChildren().toArray();
		for(var j=0;j<newDivisionChildren.length;j++){
			var existingSortOrder  = newDivisionChildren[j].getValue('a_WebCategory_Sort_Order').getSimpleValue();
			if(existingSortOrder > sortOrder){
				sortOrder = existingSortOrder;
			}
			
		}
		
		var objectType = classification.getObjectType().getID();
		if(objectType =='WebDivision'){
			webCategory.setParent(classification);
			newSortOrder = parseInt(sortOrder) + 20;
			webCategory.getValue('a_WebCategory_Sort_Order').setSimpleValue(newSortOrder);
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