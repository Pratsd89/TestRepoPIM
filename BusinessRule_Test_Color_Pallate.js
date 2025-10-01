/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_Color_Pallate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test Color Pallate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
var season_year=node.getValue("a_Source_Color_Palette_Season_Year").getSimpleValue();
var season_code=node.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue();
var color_palette= node.getValue("a_Source_Color_Palette_Code").getSimpleValue();

log.info(season_year)
log.info(season_code)
log.info(color_palette)
if(season_year != null)
{
var classification1 = manager.getClassificationHome().getClassificationByID(season_year);
log.info(classification1);
	if (season_code != null)
       {
              var classification2 = manager.getClassificationHome().getClassificationByID(season_code);
		log.info(classification2);
		if(color_palette != null)
		{
		var classification3 =manager.getClassificationHome().getClassificationByID(color_palette);
		log.info(classification3);

		var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID(classification3);
		if(classification1 != null)
				{                             
						classification1.createClassificationProductLink(node,linkType);
						log.info("created")
					}
					
				
}     
       }
                   }
}