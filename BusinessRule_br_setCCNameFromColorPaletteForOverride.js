/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setCCNameFromColorPaletteForOverride",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetCCNameFromColorPalette-Data Correction",
  "description" : "Update CC Name with Color Palette Name  If a_CC_Override_Name is No - Data Correction",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//PPIM-8257
var today = new java.util.Date()
var mainLastModifiedDateISO = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var isPublishRequired=false;

var brand = node.getValue("a_Color_Palette_Brand").getSimpleValue();
var seasonCode = node.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue();
var seasonYear = node.getValue("a_Source_Color_Palette_Season_Year").getSimpleValue();
var colorPaletteCode = node.getValue("a_Source_Color_Palette_Code").getSimpleValue();
var colorPalletteID = brand + "_" + colorPaletteCode + "_" + seasonCode + "_" + seasonYear;
var colorPallette = null;
if (colorPalletteID){
     //var colorPallette = step.getClassificationHome().getClassificationByID(colorPalletteID);
     colorPallette = step.getClassificationHome().getClassificationByID(colorPalletteID);
}
if (colorPallette) {
  //var colorPalletteName = otherContextManager.getClassificationHome().getClassificationByID(colorPallette).getName();
  var colorPalletteName = step.getClassificationHome().getClassificationByID(colorPalletteID).getName();
  node.setName(colorPalletteName);
  isPublishRequired=true;
}

if(isPublishRequired)
	node.getValue('a_main_last_modified_date').setSimpleValue(mainLastModifiedDateISO.format(today))
}