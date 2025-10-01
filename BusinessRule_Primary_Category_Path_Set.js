/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Primary_Category_Path_Set",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Primary_Category_Path_Set",
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
if (manager.getCurrentWorkspace().getID() == "Main") {
	var currentContext = manager.getCurrentContext().getID();
	var flag = 0;
	var id = 0;
	var par_division = 0;
	var clas;
	var par = 0;
	//US CONTEXT EXECUTION--- FOR PRIMARY CATEGORY CHECK
	if (currentContext == "EN_US" || currentContext == "EN_CA" || currentContext == "EN_JP") {
		var obj = node.getObjectType().getID();
		//log.info(obj);

		if (obj == "Style" || obj == "Division" || obj == "Department" || obj == "Class" || obj == "SubClass") {
			var primarycategory = node.getValue("a_Primary_Category").getSimpleValue();
			//log.info("Primary Category" + primarycategory);
			//log.info(primarycategory);
			if (primarycategory != null) {
				if(obj == 'Style')
					var brandNum = node.getParent().getValue("a_Brand_Number").getSimpleValue();
				else
					var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
				var id = LKT.getLookupTableValue("LKT_Brand_Number_to_WebBU", brandNum);

				if (id == null || id == "" || id == "undefined") {
					//for remaining Brands conditions will be applied under this.
					throw new Error("Brand is not being defined in the Business Rule Primary_Category_Path_Set");
				}
				//id = CategoryNode.getValue("Property_Value").getSimpleValue();  //CLASSIFICATION ID Fetch   //replace this CategoryNode
				var id_classification = manager.getClassificationHome().getClassificationByID(id);
				//log.info(id_classification);
				var refs_webdivision = new java.util.ArrayList();
				refs_webdivision.addAll(id_classification.getChildren());
				for (var i = 0; i < refs_webdivision.size(); i++) {
					var id_parent_webdivision = refs_webdivision.get(i);
					//log.info("webdivision: " +refs_webdivision.get(i).getID());
					par_division = refs_webdivision.get(i).getID();
					var refs_webcategory = new java.util.ArrayList();
					refs_webcategory.addAll(id_parent_webdivision.getChildren());
					for (var j = 0; j < refs_webcategory.size(); j++) {
						var id_parent_webcategory = refs_webcategory.get(j);
						//log.info("webdivision: " +refs_webdivision.get(i).getID() + "web category" +refs_webcategory.get(j).getID());
						var value_category = refs_webcategory.get(j).getValue("a_WebCategory_CID").getSimpleValue();
						//log.info(refs_webcategory.get(j).getID() +"----" + value_category);

						if (value_category == primarycategory) {
							par = par_division;
							flag = flag + 1;
							clas = refs_webcategory.get(j).getID();
						}
					}
				}
				if (flag == 1) {
					var catName = manager.getClassificationHome().getClassificationByID(clas).getValue("a_Category_Description").getSimpleValue();

					node.getValue("a_Old_Primary_Category").setSimpleValue(primarycategory);
					node.getValue("a_Primary_Category_Path").setSimpleValue(manager.getClassificationHome().getClassificationByID(id).getName() + " ~~~ " + manager.getClassificationHome().getClassificationByID(par).getName() + " ~~~ " + manager.getClassificationHome().getClassificationByID(clas).getName());
					//PPIM-8888 - Including logic for the a_Category_Description to populate into a_Primary_Category_Name

					if (catName != null) {
						node.getValue("a_Primary_Category_Name").setSimpleValue(catName);
					}
					//log.info("test" + node.getValue("a_Primary_Category_Path").getSimpleValue());	
				}
				else if (flag == 0) {
					node.getValue("a_Old_Primary_Category").setSimpleValue(primarycategory);
					node.getValue("a_Primary_Category").setSimpleValue(null);
					//PPIM-8888 - Including logic for a_Primary_Category_Name
					//
					node.getValue("a_Primary_Category_Name").setSimpleValue(null);
					//
					node.getValue("a_Primary_Category_Path").setSimpleValue(null);
					//log.info("test" + node.getValue("a_Primary_Category_Path").getSimpleValue());	
				}
				//"More than one category have same CID"
				else {
					node.getValue("a_Old_Primary_Category").setSimpleValue(primarycategory);
					node.getValue("a_Primary_Category_Path").setSimpleValue("Path cannot be set. More than one category have same CID.");
					//log.info("test" + node.getValue("a_Primary_Category_Path").getSimpleValue());	
				}

			}
			else {
				node.getValue("a_Old_Primary_Category").setSimpleValue(null);
				node.getValue("a_Primary_Category").setSimpleValue(null);
				//PPIM-8888 - Including logic for a_Primary_Category_Name
				//
				node.getValue("a_Primary_Category_Name").setSimpleValue(null);
				//	
				node.getValue("a_Primary_Category_Path").setSimpleValue(null);
				//log.info("test" + node.getValue("a_Primary_Category_Path").getSimpleValue());	
			}
			var inheritanceUS = node.getValue("a_Primary_Category").isInherited();
			if (inheritanceUS == true) {
				node.getValue("a_Primary_Category_Path").setSimpleValue(null);
			}
		}
	}

}
}
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
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
exports.operation1 = function (node,manager,portal,LKT) {
if (manager.getCurrentWorkspace().getID() == "Main") {
	var currentContext = manager.getCurrentContext().getID();
	var id = 0;
	var flag = 0;
	var clas;
	var obj = node.getObjectType().getID();
	//log.info(obj);
	//US CONTEXT EXECUTION--- FOR PRIMARY CATEGORY CHECK
	if (currentContext == "EN_US" || currentContext == "EN_CA" || currentContext == "EN_JP") {
		//var primarycategory = node.getValue("a_Primary_Category").getSimpleValue();
		var primarycategory = node.getValue("a_Old_Primary_Category").getSimpleValue();
		//log.info(primarycategory);
		if (primarycategory != null) {
			if(obj == 'Style')
				var brandNum = node.getParent().getValue("a_Brand_Number").getSimpleValue();
			else
				var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
			var id = LKT.getLookupTableValue("LKT_Brand_Number_to_WebBU", brandNum);
			//log.info("Brand Number" + brandNum);
			if (id == "" || id == null || id == "undefined") {
				//for remaining Brands conditions will be applied under this.
				throw new Error("Brand is not being defined in the Business Rule Primary_Category_Path_Set");
			}


			flag = 1;
			//var id = CategoryNode.getValue("Property_Value").getSimpleValue();  //CLASSIFICATION ID Fetch
			var id_classification = manager.getClassificationHome().getClassificationByID(id);
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
						flag = flag + 1;
						clas = refs_webcategory.get(j).getID();

					}

				}

			}
			if (flag == 1) {

				portal.showAlert("Warning", " Primary Category entered does not exist. Please re-enter a valid Web Category CID. ");
				node.getValue("a_Old_Primary_Category").setSimpleValue(null);
			}

		}
	}

}
else if (manager.getCurrentWorkspace().getID() == "Approved") {
	portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}