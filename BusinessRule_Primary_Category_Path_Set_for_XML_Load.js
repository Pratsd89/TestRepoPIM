/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Primary_Category_Path_Set_for_XML_Load",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Primary_Category_Path_Set_for_XML_Load",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "Department", "Division", "Style", "SubClass" ],
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
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,LKT) {
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var flag = 0;
var id = 0;
var par_division = 0;
var clas;
var par = 0;
if (brandNum != null) {

	//PPIM-9134
	var id = LKT.getLookupTableValue("LKT_Brand_Number_to_WebBU", brandNum);
	//log.info(id)

	// get Primary Category Value from Node
	var primaryCategory = node.getValue("a_Primary_Category").getSimpleValue();
	//log.info(primaryCategory)

	// set Old Primary Category to Primary Category for historical reasons?
	node.getValue("a_Old_Primary_Category").setSimpleValue(primaryCategory);

	//id = CategoryNode.getValue("Property_Value").getSimpleValue();  //CLASSIFICATION ID Fetch   //replace this CategoryNode
	var id_classification = manager.getClassificationHome().getClassificationByID(id);

	var refs_webdivision = new java.util.ArrayList();
	refs_webdivision.addAll(id_classification.getChildren());
	for (var i = 0; i < refs_webdivision.size(); i++) {
		var id_parent_webdivision = refs_webdivision.get(i);
		//log.info("webdivision: " +refs_webdivision.get(i).getID());
		par_division = refs_webdivision.get(i).getID();
		var refs_webcategory = new java.util.ArrayList();
		refs_webcategory.addAll(id_parent_webdivision.getChildren());
		for (var j = 0; j < refs_webcategory.size(); j++) {
			var value_category = refs_webcategory.get(j).getValue("a_WebCategory_CID").getSimpleValue();
			//log.info(refs_webcategory.get(j).getID() +"----" + value_category);


			if (value_category == primaryCategory) {
				par = par_division;
				flag = flag + 1;
				clas = refs_webcategory.get(j).getID();
			}
		}
	}
	if (flag == 1) {
		node.getValue("a_Primary_Category_Path").setSimpleValue(manager.getClassificationHome().getClassificationByID(id).getName() + " ~~~ " + manager.getClassificationHome().getClassificationByID(par).getName() + " ~~~ " + manager.getClassificationHome().getClassificationByID(clas).getName());
		//PPIM-8888 - Including logic for the a_Category_Description to populate into a_Primary_Category_Name
		//
		var catName = manager.getClassificationHome().getClassificationByID(clas).getValue("a_Category_Description").getSimpleValue();
		if (catName != null) {
			node.getValue("a_Primary_Category_Name").setSimpleValue(catName);
		}

		//log.info("test" + node.getValue("a_Primary_Category_Path").getSimpleValue());	
	}
	else if (flag == 0) {
		node.getValue("a_Primary_Category").setSimpleValue(null);
		node.getValue("a_Primary_Category_Path").setSimpleValue(null);
		node.getValue("a_Primary_Category_Name").setSimpleValue(null);
		//log.info("test" + node.getValue("a_Primary_Category_Path").getSimpleValue());	
	}
	//"More than one category have same CID"
	else {
		node.getValue("a_Primary_Category_Path").setSimpleValue("Path cannot be set. More than one category have same CID.");
		log.info("test" + node.getValue("a_Primary_Category_Path").getSimpleValue());
	}
	var inheritanceUS = node.getValue("a_Primary_Category").isInherited();

	if (inheritanceUS == true) {
		node.getValue("a_Old_Primary_Category").setSimpleValue(null);
		node.getValue("a_Primary_Category_Path").setSimpleValue(null);
		node.getValue("a_Primary_Category_Name").setSimpleValue(null);
	}
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,manager) {
var currentContext = manager.getCurrentContext().getID();
var primaryCategory = node.getValue("a_Primary_Category").getSimpleValue();
var oldPrimaryCategory = node.getValue("a_Old_Primary_Category").getSimpleValue();
var result = false;

if (currentContext == "EN_US" || currentContext == "EN_CA" || currentContext == "EN_JP") {
	if (primaryCategory != null && primaryCategory != oldPrimaryCategory || (primaryCategory == null && oldPrimaryCategory != null)) {
		result = true;
	}
}
return result;

}