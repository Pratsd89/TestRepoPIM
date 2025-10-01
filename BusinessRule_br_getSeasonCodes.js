/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_getSeasonCodes",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Get Season Codes",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "LoggerBindContract",
    "alias" : "LOG",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "MANAGER",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "COLOR_PALETTE",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "ColorPaletteRoot",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (LOG,MANAGER,COLOR_PALETTE,NODE) {
/**
 * Populates a_inSeasonCodes with all Children Season Codes. 
 */
if(NODE.getObjectType().getID().equalsIgnoreCase("Style")){
	// Recorrer todos los CC.
	var ccs = NODE.getChildren().toArray();
	var codes = new java.util.ArrayList();
	
	for (i in ccs){
		// Get all a_Source_Color_Palette_Season_Code
		var code = ccs[i].getValue("a_Source_Color_Palette_Season_Code").getSimpleValue();
		if(code != null && code.equalsIgnoreCase("")){
			if(!codes.contains(code)){
				codes.add(code);
			}
		}
	}
	
	// Add codes to Style Attribute
	NODE.getValue("a_inSeasonCodes").setSimpleValue(codes);
}

// If it is a CC, save season code into Style attr
if(NODE.getObjectType().getID().equalsIgnoreCase("CustomerChoice")){
	// Recorrer todos los CC.
	var code = NODE.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue();
	
	var codes = NODE.getParent().getValue("a_inSeasonCodes").getSimpleValue();
	if(code != null && code.equalsIgnoreCase("")){
			if(!codes.contains(code)){
				codes.add(code);
				NODE.getValue("a_inSeasonCodes").setSimpleValue(codes);
			}			
		}	
}
}