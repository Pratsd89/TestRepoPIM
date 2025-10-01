/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Category_Group",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Create_Category_Group",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Slot" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "name",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
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
exports.operation0 = function (node,name,web,Attribute,step,queryHome,LKT,webUI,slug) {
if (name == null || name == "")
{
	throw "<b>Please provide a Name for Content Group</b>";
}
if (name.length > 60) {
    name = name.substring(0, 60).trim();
    web.showAlert("WARNING", "The name exceeds the maximum allowed length of 60 characters and has been automatically trimmed.");
}

brand = node.getParent();
var Context = step.getCurrentContext().getID();
var locale = new java.util.HashMap();
locale.put("EN_US", "en");
locale.put("FR_CA", "fr");
locale.put("EN_CA", "en");

var finallocale = locale.get(Context);
slug_value = slug.slugify(String(name), {
                locale: finallocale
            });

if(slug_value!=null) {
	resultsize = searchForExistingName(slug_value, Attribute, brand)
	if(resultsize ==0) {
		var category_group = node.createClassification(null, "CMS_Content_Group");
		category_group.setName(name);
		category_group.getValue("a_Content_Group_ID").setSimpleValue(slug_value);
		category_group.getValue("a_Category_Description").setSimpleValue(slug_value);	
		//Default start date
		var currentDate = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
		category_group.getValue("a_WebCategory_Start_Date").setSimpleValue(iso.format(currentDate));	
		//Start
		var stiboValue = category_group.getValue('a_Content_Group_ID').getSimpleValue();
		if (stiboValue != null) 
		{
		var divisionSlugValue = slug.slugify(String(stiboValue));
			if (divisionSlugValue.length > 60) 
			{
			divisionSlugValue = divisionSlugValue.slice(0, 60);
          	}
	    		var nluDivision = "/" + divisionSlugValue;
  			category_group.getValue("a_Natural_Language_URL").setSimpleValue(nluDivision);
		//end	
}
var parent = node.getParent();
var BrandNumber = parent.getValue("a_Brand_Number").getSimpleValue();
var Brand = LKT.getLookupTableValue("LKT_BrandNumberToText", BrandNumber);
var SEOPageTitle = category_group.getValue("a_SEO_Page_Title").getSimpleValue();
 if (stiboValue != null && Brand != null && SEOPageTitle == null) {
                var SEOTitle = stiboValue + " | " + Brand;
                if (SEOTitle.length > 60) {
                    for (var i = 0; 60 < SEOTitle.length; i++) {
                        stiboValue = stiboValue.slice(0, -1);
                        SEOTitle = stiboValue + " | " + Brand;
                    }
                }
                category_group.getValue("a_SEO_Page_Title").setSimpleValue(SEOTitle);
            }
 

var SEOMetaDescription = node.getValue("a_SEO_Meta_Description").getSimpleValue();
if (SEOMetaDescription == null) {
        
        slug.generatePageDescription(step, category_group);
    }
		web.navigate("CMS_Category_Group_Details_Screen", category_group);
		//PPIM-14603

var slugValue;
step.executeInContext("EN_US", function(currentContextManager) {
    var EN_US_Node = currentContextManager.getClassificationHome().getClassificationByID(category_group.getID());
    slugValue = EN_US_Node.getValue("a_Natural_Language_URL").getSimpleValue();    
});

 step.executeInContext("EN_CA", function(currentContextManager) {
        var EN_CA_Node = currentContextManager.getClassificationHome().getClassificationByID(category_group.getID());
        EN_CA_Node.getValue("a_Natural_Language_URL").setSimpleValue(slugValue);
    });
    
//PPIM-14603
	}
	if(resultsize >0) {
		web.showAlert("ERROR", "<b>The given Content Group Name already exists under this brand. Please provide a new name</b>");
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
    return resultsize;

}
}