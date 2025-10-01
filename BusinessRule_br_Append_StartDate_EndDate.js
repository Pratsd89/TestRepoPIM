/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Append_StartDate_EndDate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Append StartDate and EndDate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceCategory", "CustomerServiceHome", "NonProductCategory", "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "global"
  }, {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  } ]
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
exports.operation0 = function (node,stepManager,global,helper) {
/**
 * Modified as part of PPIM-8195
 */
function updateName(name) {
	if (name.length > 100) {
		name = name.substring(0, 100);
	}
	return name;
}

function othercontext(node,contextID){
	stepManager.executeInContext(contextID, function(otherManager) {
     	var otherNode = otherManager.getObjectFromOtherManager(node);   

		//PPIM_7125 - Included Changes w.r.t JP context 
		var catName = otherNode.getValue("a_Category_Description").getSimpleValue();
		if(node.getObjectType().getID()=='CustomerServiceCategory' || node.getObjectType().getID()=='CustomerServiceHome'){
			var catStartDate = otherNode.getValue("a_Customer_Service_Category_Start_Date").getSimpleValue();
			var catEndDate = otherNode.getValue("a_Customer_Service_Category_End_Date").getSimpleValue();
		} else if (node.getObjectType().getID()=='NonProductCategory'){
			var catStartDate = otherNode.getValue("a_Non_Product_Category_Start_Date").getSimpleValue();
			var catEndDate = otherNode.getValue("a_Non_Product_Category_End_Date").getSimpleValue();
		} else{
			var catStartDate = otherNode.getValue("a_WebCategory_Start_Date").getSimpleValue();
			var catEndDate = otherNode.getValue("a_WebCategory_End_Date").getSimpleValue();
		}
		var catId = otherNode.getValue("a_WebCategory_CID").getSimpleValue();
		var catNote = otherNode.getValue("a_WebCategory_Note").getSimpleValue();
		var catNameNew=""
		
		if(catName!=null){
			catNameNew+=catName
		}
		
		if(catNote!=null && catNameNew!=""){
			catNameNew+=" - "+catNote
		} else if(catNote!=null){
			catNameNew+=catNote
		}
		
		if(catId!=null && catNameNew!=""){
			catNameNew+=" - "+catId
		}else if(catId!=null){
			catNameNew+=catId
		}
		
		if(catStartDate!=null && catNameNew!=""){
			catNameNew+=" - ("+catStartDate
		}else if(catStartDate!=null){
			catNameNew+="("+catStartDate
		}
		
		if(catEndDate!=null && catNameNew!=""){
			catNameNew+=" - "+catEndDate+")"
		}else if(catEndDate!=null){
			catNameNew+="("+catEndDate+")"
		}else if(catStartDate!=null){
			catNameNew+=")"
		}
		
		/*if(catStartDate != null && catEndDate != null) {
			var newName = catName+'1' + ": " + catStartDate + " - " + catEndDate
			if(!(otherNode.getName()!= null && otherNode.getName().trim().equals(newName.trim())))
				otherNode.setName(newName.trim())
		}
		else if(catStartDate != null && catEndDate == null) {
			var newName = catName + ": " + catStartDate
			if(!(otherNode.getName()!= null && otherNode.getName().trim().equals(newName.trim())))
				otherNode.setName(newName.trim())
		}
		else if (catStartDate == null && catEndDate == null) {
			if(otherNode.getName()!= null && catName!=null){
				if(!(otherNode.getName().trim().equals(catName.trim())))
					otherNode.setName(catName.trim())
			}
		}*/
		catNameNew=updateName(catNameNew)
		if(otherNode.getName()!= null && catNameNew!=null){
				if(!(otherNode.getName().trim().equals(catNameNew.trim())))
					otherNode.setName(catNameNew.trim())
		} else if(otherNode.getName()== null && catNameNew!=null){
			otherNode.setName(catNameNew.trim())
		}
	})
		
}

if(node.getObjectType().getID() == "WebDivision" || node.getObjectType().getID() == "WebCategory"|| node.getObjectType().getID() == "WebSubCategory" || node.getObjectType().getID() == "NonProductCategory" || node.getObjectType().getID() == "CustomerServiceCategory") {	
	
	//PPIM_7125 - Included Changes w.r.t JP context 
	var contextListItr = stepManager.getListOfValuesHome().getListOfValuesByID("All_Contexts_LoV").queryValidValues().asList(10).iterator();
	while(contextListItr.hasNext()){
		var contextID=contextListItr.next().getID();
		othercontext(node,contextID);
	}
} else if(node.getObjectType().getID() == "CustomerServiceHome") {	
	var currentContext=stepManager.getCurrentContext().getID();
	othercontext(node,currentContext);
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,global,helper) {
var categoryDescription = node.getValue("a_Category_Description").getSimpleValue();
if(categoryDescription!=null){
	return true;
} else return false;
}