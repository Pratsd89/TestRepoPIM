/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "NonProductCategoryApproval",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Non Product Category Approval",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation0 = function (stepManager,node) {
var webCategoryCID = node.getValue('a_WebCategory_CID').getSimpleValue();
var categoryDescription = node.getValue('a_Category_Description').getSimpleValue();
var categoryDisplayType = node.getValue('a_Web_NP_Category_Display_Type').getSimpleValue();
var categoryStartDate = node.getValue('a_Non_Product_Category_Start_Date').getSimpleValue();
var categoryInheritUS = node.getValue('a_WebCategory_Inherit_US').getSimpleValue();
//PPIM-2527 If The attribute "Inherit Category Attributes from US" is set to Yes, copy "Category Note" information set up in US market context into CA context's both EN_CA and FR_CA 
var inheritValue = node.getValue('a_WebCategory_Inherit_US').getSimpleValue();

if(webCategoryCID == null || webCategoryCID == '' || categoryDisplayType == null || categoryDisplayType == '' || categoryDescription == null || categoryDescription == '' || categoryStartDate == null || categoryStartDate == '' || categoryInheritUS =='' || categoryInheritUS == null)
{
	return "Missing Required Attribute";
	//portal.showAlert("ERROR" , null , "Missing Required Attribute.");
}
var attributeGroup=stepManager.getAttributeGroupHome().getAttributeGroupByID("ag_Non_Product_Category_Attributes");
var attributes=attributeGroup.getAttributes().toArray();
stepManager.executeInContext('EN_US',function(enContextManager) {
        var enClassification = enContextManager.getClassificationHome().getClassificationByID(node.getID());
        for(var i=0;i<attributes.length;i++){
            var attributeId=attributes[i].getID();
            var copy = true;
            if(attributeId == 'a_WebCategory_Note' && inheritValue != 'Yes') // only copy Category Note if inherit value is set to Yes.
            	copy = false;
            if(copy) {
            var attributeValue=enClassification.getValue(attributeId).getSimpleValue();
            stepManager.executeInContext('EN_CA',function(caContextManager) {
                var caClassification = caContextManager.getClassificationHome().getClassificationByID(node.getID());
                caClassification.getValue(attributeId).setSimpleValue(attributeValue);
            })
            stepManager.executeInContext('FR_CA',function(frContextManager) {
                 var frClassification = frContextManager.getClassificationHome().getClassificationByID(node.getID());
                 frClassification.getValue(attributeId).setSimpleValue(attributeValue);
            })
          }      
        }
    });
    
node.approve();

return true;
}