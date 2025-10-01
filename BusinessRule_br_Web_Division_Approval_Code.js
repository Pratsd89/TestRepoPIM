/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Web_Division_Approval_Code",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Web Division Approval Code",
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,portal) {
//
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
//checking mandatory attributes
var currentContext = stepManager.getCurrentContext().getID();
var categoryDescription = node.getValue('a_Category_Description').getSimpleValue();
var categoryStartDate = node.getValue('a_WebCategory_Start_Date').getSimpleValue();
var divisionDisplayType = node.getValue('a_Division_Display_Type').getSimpleValue();

if(categoryDescription == null || categoryDescription == '' || divisionDisplayType == null || divisionDisplayType == '' || categoryStartDate == null || categoryStartDate == '')
{
	throw 'Please fill the mandatory fields and try again.';
}
/*
var inheritValue = node.getValue('a_WebCategory_Inherit_US').getSimpleValue();
if(inheritValue == 'Yes' && currentContext == "EN_US")
{
var attributeGroup=stepManager.getAttributeGroupHome().getAttributeGroupByID("ag_Category_Copy_Attribute");
var attributes=attributeGroup.getAttributes().toArray();
stepManager.executeInContext('EN_US',function(enContextManager) {
        var enClassification = enContextManager.getClassificationHome().getClassificationByID(node.getID());
        for(var i=0;i<attributes.length;i++){
            var attributeId=attributes[i].getID();
            var attributeValue=enClassification.getValue(attributeId).getSimpleValue();
            stepManager.executeInContext('EN_CA',function(caContextManager) {
                var caClassification = caContextManager.getClassificationHome().getClassificationByID(node.getID());
                caClassification.getValue(attributeId).setSimpleValue(attributeValue);
            })
            stepManager.executeInContext('FR_CA',function(frContextManager) {
                 var frClassification = frContextManager.getClassificationHome().getClassificationByID(node.getID());
                // frClassification.getValue(attributeId).setSimpleValue(attributeValue);
                 if(attributeId == "a_Category_Description")
                 {
                 frClassification.getValue(attributeId).setSimpleValue(attributeValue);
                 }
                 else
                 {
                 	//frClassification.getValue(attributeId).setSimpleValue(attributeValue);
                 }
            })
                
        }
    });
}
    


if(inheritValue == 'Yes' && currentContext == "EN_US" )
{
	approvalcheck(node,"EN_US");
	approvalcheck(node,"EN_CA");
	approvalcheck(node,"FR_CA");
}
else if (inheritValue == 'Yes' && currentContext == "EN_CA" )
{
	portal.showAlert("Error",null,"Approval needs to happen in US context.");
}
else if (inheritValue == 'Yes' && currentContext == "FR_CA" )
{
	portal.showAlert("Error",null,"Approval needs to happen in US context.");
}
else if (inheritValue == 'No')
{
	node.approve();
}
*/
/*else if (inheritValue == null || inheritValue == '')
{
	portal.showAlert("Warning", null , "Attribute 'Inherit Category Attributes from US' is a mandatory field for object approval.");
}*/
}
function approvalcheck (node,contextID) {
	stepManager.executeInContext(contextID, function (otherManager) {
		var othernode= otherManager.getClassificationHome().getClassificationByID(node.getID());
		othernode.approve();
		})
		}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : null
  } ],
  "pluginType" : "Operation"
}
*/
