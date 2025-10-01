/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetStyleWPT_Attributes",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_SetStyleWPT_Attributes",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
//Updating the Style WPT attributes from the linked WPT reference 

//Fetch the StyleToWebProductTypeRef
var classificationTypeHome = manager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
var classificationType = classificationTypeHome.getLinkTypeByID('StyleToWebProductTypeRef');
var x = node.getClassificationProductLinks(classificationType).toArray();
var tarLen = x.length; //Target length
if (x[0] != null && x[0] != '') {
	var Wpt = x[0].getClassification();
}
//log.info(Wpt);

//Fetch the WPT's attributes
var WptLabel = Wpt.getValue('a_WPT_CC_Selector_Label').getSimpleValue();
var WptDim1Lbl1 = Wpt.getValue('a_WPT_Dimension1Label1').getSimpleValue();
var WptDim2Lbl1 = Wpt.getValue('a_WPT_Dimension2Label1').getSimpleValue();
var WptDim2Lbl2 = Wpt.getValue('a_WPT_Dimension2Label2').getSimpleValue();
var WptDesc = Wpt.getValue('a_WPT_Description').getSimpleValue();


//Set the values on Style level WPT attributes
node.getValue('a_WPT_CCLabel').setValue(WptLabel);
node.getValue('a_WPT_Dim1Label1').setValue(WptDim1Lbl1);
node.getValue('a_WPT_Dim2Label1').setValue(WptDim2Lbl1);
node.getValue('a_WPT_Dim2Label2').setValue(WptDim2Lbl2);
node.getValue('a_Web_Product_Type').setSimpleValue(WptDesc);

}