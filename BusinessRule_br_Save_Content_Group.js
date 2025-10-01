/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Save_Content_Group",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Content_Group" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "slug"
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "Attribute",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Content_Group_ID",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,Attribute,queryHome,web,slug) {
var objType = node.getObjectType().getID();
if (objType == "CMS_Content_Group") {
	var brand = node.getParent().getParent();
	var Context = step.getCurrentContext().getID();
	var locale = new java.util.HashMap();
	var name = node.getName();
	if (name.length() > 60) {
		name = name.substring(0, 60).trim();
		if (name.length() > 0) {
			node.setName(name);
			web.showAlert("WARNING", "The name exceeds the maximum allowed length of 60 characters and has been automatically trimmed.");
		} else {
			throw "<b>The trimmed name is invalid. Please provide a proper name.</b>";
		}
	}



	locale.put("EN_US", "en");
	locale.put("FR_CA", "fr");
	locale.put("EN_CA", "en");

	var finallocale = locale.get(Context);
	slug_value = slug.slugify(String(name), {
		locale: finallocale
	});

	if (slug_value != null) {
		if (node.getValue("a_Content_Group_ID").getSimpleValue() == null) {
			resultsize = searchForExistingName(slug_value, Attribute, brand)
			log.info(resultsize);
			if (resultsize == 0) {
				node.getValue("a_Content_Group_ID").setSimpleValue(slug_value);
				//category_group.getValue("a_Category_Description").setSimpleValue(slug_value);		
			}
			else {
				throw "<b>The given Content Group Name already exists under this brand. Please provide a new name</b>";
			}
		}

	}
}




function searchForExistingName(name, Attribute, Parent) {
	var condition = com.stibo.query.condition.Conditions;
	var isBelowCondition = condition.hierarchy().simpleBelow(Parent);
	var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
		.and(condition.valueOf(Attribute).eq(name))
	);
	var result = querySpecification.execute();
	var resultsize = result.asList(500).size();

	if (resultsize == 1) {
		var list = result.asList(500).toArray();
		for (var i in list) {
			var ID = list[i].getID();
			log.info(ID);
		}
		if (ID == node.getID()) {
			resultsize = 0;
		}
	}

	return resultsize;

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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (node,step,webUI,slug) {
var inheritToCAN = node.getValue("a_Content_Group_Can_InheritOption").getSimpleValue();
var currentContext = step.getCurrentContext().getID();
if (inheritToCAN == "CAN") {
    if (currentContext == "EN_US") {
        step.executeInContext("EN_CA", function (otherManager) {
            var caNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
            var encaName = node.getName();
            if (encaName.length() > 60) {
                encaName = encaName.substring(0, 60).trim();
                //    			node.setName(encaName);
                webUI.showAlert("WARNING", "<b>The name exceeds the maximum allowed length of 60 characters and has been automatically trimmed.</b>");
            }
            caNode.setName(encaName);
            caNode.getValue("a_Content_Group_ID").setSimpleValue(node.getValue("a_Content_Group_ID").getSimpleValue());
        });
        step.executeInContext("FR_CA", function (otherManager) {
            var caNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
            var frcaName = node.getName();
            if (frcaName.length() > 60) {
                frcaName = frcaName.substring(0, 60).trim();
                //    			node.setName(frcaName);
                webUI.showAlert("WARNING", "<b>The name exceeds the maximum allowed length of 60 characters and has been automatically trimmed.</b>");
            }
            caNode.setName(frcaName);
            caNode.getValue("a_Content_Group_ID").setSimpleValue(node.getValue("a_Content_Group_ID").getSimpleValue());
        });
    }

    if (currentContext == "EN_CA") {
        step.executeInContext("EN_US", function (otherManager) {
            var usNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
            node.setName(usNode.getName());
            webUI.showAlert("WARNING", "<b>Modification in context EN_CA will not apply, as this ContentGroup is inheriting values from the US market. Please switch to EN_US to modify.</b>");
        });
    }
}
else{
	if (currentContext == "EN_CA") {
		  step.executeInContext("FR_CA", function (otherManager) {
            var caNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
            var frcaName = node.getName();
            if (frcaName.length() > 60) {
                frcaName = frcaName.substring(0, 60).trim();
                //    			node.setName(frcaName);
                webUI.showAlert("WARNING", "<b>The name exceeds the maximum allowed length of 60 characters and has been automatically trimmed.</b>");
            }
            caNode.setName(frcaName);
            caNode.getValue("a_Content_Group_ID").setSimpleValue(node.getValue("a_Content_Group_ID").getSimpleValue());
        });
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,step,webUI,slug) {
var objType = node.getObjectType().getID();
if (objType == "CMS_Slot") {
    var sortEmpty = new Array();
    var groups = node.getChildren();
    for (var i = 0; i < groups.size(); i++) {
        var cg = groups.get(i);
        var startDate = cg.getValue("a_WebCategory_Start_Date").getSimpleValue();
        var sortOrder = cg.getValue("a_WebCategory_Sort_Order").getSimpleValue();
        if (startDate != null && sortOrder == null) {
            var cgID = cg.getValue("a_Content_Group_ID").getSimpleValue();
            var oldSortOrder = cg.getValue("a_Old_WebCategory_Sort_Order").getSimpleValue();
            cg.getValue("a_WebCategory_Sort_Order").setSimpleValue(oldSortOrder);
            sortEmpty.push(cgID);
        }
        var inheritToCAN = cg.getValue("a_Content_Group_Can_InheritOption").getSimpleValue();
        if (inheritToCAN != null) {
            step.executeInContext("EN_CA", function (ctxManager) {
                var canCG = ctxManager.getObjectFromOtherManager(cg);
                var canStartDate = cg.getValue("a_WebCategory_Start_Date").getSimpleValue();
                var canSortOrder = cg.getValue("a_WebCategory_Sort_Order").getSimpleValue();
                if (canStartDate != null && canSortOrder == null) {
                    var canCgID = cg.getValue("a_Content_Group_ID").getSimpleValue();
                    var canOldSortOrder = canCG.getValue("a_Old_WebCategory_Sort_Order").getSimpleValue();
                    canCG.getValue("a_WebCategory_Sort_Order").setSimpleValue(canOldSortOrder);
                    if (!sortEmpty.includes(cg.getID())) {
                        sortEmpty.push(canCgID);
                    }
                }
            });
        }
    }

    if (sortEmpty.length > 0) {
        webUI.showAlert("WARNING", "<b>" + "The following ContentGroup(s) are missing a Sort order value. Please navigate to the parent Slot and update the sort order for this market. </b>" + sortEmpty.toString());
    }
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_CG_Inheritance_Actions"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_CG_Sort_Order_Buffer"
  } ],
  "pluginType" : "Operation"
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation5 = function (node,slug) {
object_type = node.getObjectType().getID()
var today = java.time.ZonedDateTime.now();
log.info(node.getObjectType().getID())
if (node.getObjectType().getID() == "CMS_Slot") {
	    log.info("at slot")
    publish(node)

    var catChildren = node.getChildren().iterator();
    while (catChildren.hasNext()) {
        var childCat = catChildren.next();
        var childCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
        var childCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();
        log.info("child content group")
        if (childCatStart == null) continue;

        if (childCatEnd == null) {
            publish(node);
        } else {
            if (childCatEnd < childCatStart) {
                throw "End Date cannot be before Start Date for Content Group: " + childCat.getID();
            }
            if (childCatEnd > today) {
                publish(node);
            }
        }
    }
}

else if (node.getObjectType().getID() == "CMS_Content_Group") {
    var startTime = node.getValue('a_WebCategory_Start_Date').getSimpleValue();
    var endTime = node.getValue('a_WebCategory_End_Date').getSimpleValue();
    log.info("at content group")
    if (startTime != null /*&& endTime > today */|| startTime != null && endTime == null) {
        publish(node)
    }
    
}


function publish(node) {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    log.info("Current last update date: " + node.getValue("a_main_last_modified_date").getSimpleValue());
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    log.info("New last update date: " + node.getValue("a_main_last_modified_date").getSimpleValue());
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation6 = function (node,slug) {
node.getValue("a_SEO_Meta_Description").setSimpleValue(node.getValue("a_Content_Group_ID").getSimpleValue());
node.getValue("a_Natural_Language_URL").setSimpleValue(node.getValue("a_Content_Group_ID").getSimpleValue());
node.getValue("a_SEO_Page_Title").setSimpleValue(node.getValue("a_Content_Group_ID").getSimpleValue());
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Slot_MaintenanceLastUpdateDate"
  } ],
  "pluginType" : "Operation"
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
exports.operation8 = function (node,manager,slug) {
var contextID = manager.getCurrentContext().getID();
var USValue = null;
var CAValue = null;
var USNode;
var CANode;
manager.executeInContext("EN_US", function(currentContextManager) {
     USNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
    USValue = USNode.getValue("a_WebCategory_Assortment_Type").getSimpleValue();
});
manager.executeInContext("EN_CA", function(currentContextManager) {
     CANode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
    CAValue = CANode.getValue("a_WebCategory_Assortment_Type").getSimpleValue();
});

if (contextID == "EN_US" && USValue != null && CAValue == null) {
    CANode.setName("US Exclusive CMS Group");
    CANode.getValue("a_Content_Group_ID").setSimpleValue("US-Exclusive-CMS-Group");
}
if (contextID == "EN_CA" && CAValue != null && USValue == null) {   
    USNode.setName("CANADA Exclusive CMS Group");
    USNode.getValue("a_Content_Group_ID").setSimpleValue("CANADA-Exclusive-CMS-Group");
}
}