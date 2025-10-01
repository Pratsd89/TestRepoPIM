/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Set_NP_CategoryName",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set NP Category Name",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "NonProductCategory" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,stepManager,lookupTable) {
var currentContext = stepManager.getCurrentContext().getID();
var inheritValue = node.getValue("a_WebCategory_Inherit_US").getSimpleValue();

if (inheritValue == "Yes" && currentContext == 'EN_US') {
  //get parent
  var parent = node.getParent();
  //get parent object type
  var parentType = parent.getObjectType().getID();

  //then keep getting parent until type is NonProductBusinessUnit
  while (parentType != "NonProductBusinessUnit") {
    parent = parent.getParent();
  }
  //get a_Brand_Number
  var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
  var desc = node.getValue("a_Category_Description").getSimpleValue();
  var cid = node.getValue("a_WebCategory_CID").getSimpleValue();
  var note = node.getValue("a_WebCategory_Note").getSimpleValue();
  var newName = node.getName();

  if (note != null) {
    newName = desc + "-" + cid + "-" + note;
  }
  else {
    newName = desc + "-" + cid;
  }

  node.setName(newName);

  if (brandNum != null) {
    //PPIM-9157 : Remaining Brands(AT, BRFS) changes included by using lookup table
    var contexts = lookupTable.getLookupTableValue("LKT_Brand_Number_to_Context", brandNum);
    //Copy Name will not happen if Brand is applicable only in EN_US context i.e., for GO and BRFS Brands
    if (contexts.contains(";")) {

      contexts = contexts.split(";");

      contexts.forEach(function (context) {

        if (context != 'EN_US') {

          stepManager.executeInContext(context, function (otherManager) {
            var otherNode = otherManager.getObjectFromOtherManager(node);

            otherNode.setName(newName);
          });
        }
      })
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
    "value" : "br_SetMainLastUpdateDateforNPCategory"
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (node,stepManager,log,lookupTable) {
//PPIM-9157 : Execute below functiona to copy the attribute value from EN_US to all other applicable contexts based on Brand using lookup table
function executeLKTBasedOnDependencyOfAttribute(lookupTableToBeUsed, brandNum, attributeValue,attributeId) {
    //PPIM-9157 : Remaining Brands(AT, BRFS) changes included by using lookup table
    var contexts = lookupTable.getLookupTableValue(lookupTableToBeUsed, brandNum);
    //Copy Attribute value will not happen if Brand is applicable only in EN_US context i.e., for GO and BRFS Brands
    if (contexts.contains(";")) {
        contexts = contexts.split(";");
        contexts.forEach(function(context) {
            if (context != 'EN_US') {
                stepManager.executeInContext(context, function(otherManager) {
                    var otherNode = otherManager.getObjectFromOtherManager(node);
                    otherNode.getValue(attributeId).setSimpleValue(attributeValue);
                })
            }
        });
    }
}

//PPIM-6322 Correcting the logic from PPIM-2527, If The attribute "Inherit Category Attributes from US" is set to Yes, copy all attribute information set up in US market context into CA context's both EN_CA and FR_CA
var inheritValue = node.getValue("a_WebCategory_Inherit_US").getSimpleValue();

if (inheritValue == "Yes") {
    //Only copy attributes if the attribute "inherit attribute" is set to "Yes"
    stepManager.executeInContext("EN_US", function(cntxManager) {
        var cntxNode = cntxManager.getClassificationHome().getClassificationByID(node.getID());

        var parent = cntxNode.getParent();

        //get parent object type
        var parentType = parent.getObjectType().getID();

        //then keep getting parent until type is NonProductBusinessUnit
        while (parentType != "NonProductBusinessUnit") {
            parent = parent.getParent();
        }
        //get a_Brand_Number
        var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();

        //PPIM-9157 : Updated the Attribute group specific to Non Product Category Attributes which have Dimension Dependency as Market and needs to be copied when Inherit from US is YES
        var attributeGroupMarket = cntxManager.getAttributeGroupHome().getAttributeGroupByID("ag_NP_Category_CopyEligible_Attributes");
        var marketAttributes = attributeGroupMarket.getAttributes().toArray();
        for (var i = 0; i < marketAttributes.length; i++) {
            var attributeId = marketAttributes[i].getID();
            var attributeValue = cntxNode.getValue(attributeId).getSimpleValue();
            var lookupTableToBeUsed = "LKT_Brand_Number_to_Market"
            executeLKTBasedOnDependencyOfAttribute(lookupTableToBeUsed, brandNum, attributeValue,attributeId)

        }

        //PPIM-9157 : Used the Attribute group already present in System which has a context specific Attribute - a_Category_Description which needs to be copied when Inherit from US is YES
        var attributeGroupMarLang = cntxManager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Language_Dependent_ATTs");
        var marLangAttributes = attributeGroupMarLang.getAttributes().toArray();
        for (var i = 0; i < marLangAttributes.length; i++) {
            var attributeId = marLangAttributes[i].getID();
            var attributeValue = cntxNode.getValue(attributeId).getSimpleValue();
            var lookupTableToBeUsed = "LKT_Brand_Number_to_Context"
            executeLKTBasedOnDependencyOfAttribute(lookupTableToBeUsed, brandNum, attributeValue,attributeId)
        }
    });
}
node.approve();




}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Append_StartDate_EndDate"
  } ],
  "pluginType" : "Operation"
}
*/
