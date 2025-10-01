/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PrimaryCategoryCheck",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "PrimaryCategoryCheck",
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
var currentContext = manager.getCurrentContext().getID();
var flag = 0;
var clas;
var id = 0;
var obj = node.getObjectType().getID();
// CONTEXT EXECUTION--- FOR PRIMARY CATEGORY CHECK
if (currentContext == "EN_US" || currentContext == "EN_CA" || currentContext == "EN_JP") {
	//var primarycategory = node.getValue("a_Primary_Category").getSimpleValue();
	var primarycategory = node.getValue("a_Old_Primary_Category").getSimpleValue();
	log.info(primarycategory);
	if (primarycategory != null) {
		flag = 1;
		if(obj == 'Style')
			var brandNum = node.getParent().getValue("a_Brand_Number").getSimpleValue();
		else
			var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
		var id = LKT.getLookupTableValue("LKT_Brand_Number_to_WebBU", brandNum);
		//log.info("Brand Number" + brandNum);
		if (id == "" || id == null || id == "undefined") {
			//for remaining Brands conditions will be applied under this.
			throw new Error("Brand is not being defined in the Business Rule PrimaryCategoryCheck");
		}
		//var id = CategoryNode.getValue("Property_Value").getSimpleValue();  //CLASSIFICATION ID Fetch
		var id_classification = manager.getClassificationHome().getClassificationByID(id);
		log.info(id_classification);
		var refs_webdivision = new java.util.ArrayList();
		refs_webdivision.addAll(id_classification.getChildren());
		for (var i = 0; i < refs_webdivision.size(); i++) {
			var id_parent_webdivision = refs_webdivision.get(i);
			//log.info("webdivision: " +refs_webdivision.get(i).getID());
			var refs_webcategory = new java.util.ArrayList();
			refs_webcategory.addAll(id_parent_webdivision.getChildren());
			for (var j = 0; j < refs_webcategory.size(); j++) {
				var id_parent_webcategory = refs_webcategory.get(j);
				//log.info("webdivision: " +refs_webdivision.get(i).getID() + "web category" +refs_webcategory.get(j).getID());
				var value_category = refs_webcategory.get(j).getValue("a_WebCategory_CID").getSimpleValue();
				//log.info(refs_webcategory.get(j).getID() +"----" + value_category);

				if (value_category == primarycategory) {
					//log.info("value = " + value_category + "--primarycategory = " + primarycategory);
					flag = flag + 1;
					clas = refs_webcategory.get(j).getID();
				}
			}
		}

		if (flag == 1) {
			return " Primary Category entered does not exist. Please re-enter a valid Web Category CID. ";
		}
		else {
			return true;
		}
	}
	else {
		return true;
	}
}
if (currentContext == "FR_CA" || currentContext == "JA_JP" || currentContext == "EN_SA") {
	return true;
}
}