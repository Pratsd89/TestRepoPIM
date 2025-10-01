/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetParentforColorPallet",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetParentforColorPallet",
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
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "SeasonCode",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "SeasonCode",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "Color",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "ColorPalette",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,SeasonCode,Color) {


var nodeID=node.getID();
var brand = node.getValue("a_Color_Palette_Brand").getSimpleValue();
var seasonCode = node.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue();
var seasonYear = node.getValue("a_Source_Color_Palette_Season_Year").getSimpleValue();

log.info(brand)
log.info(seasonCode)
log.info(seasonYear)

var seasonCodeExistFlag = false;
var seasonYearExistFlag = false;
if(seasonCode != null && seasonYear != null)
{

	var classification_a = manager.getClassificationHome().getClassificationByID(nodeID);
	log.info(classification_a)
	
	 if(classification_a != null)
	{
		
		var brandClassification = manager.getClassificationHome().getClassificationByID(brand);
		log.info(brandClassification)
		if(brandClassification !=null){
			var yearChildren= brandClassification.getChildren().toArray();
			for(var i=0;i<yearChildren.length;i++){
				var year = yearChildren[i].getName();
				if(year == seasonYear){
                    seasonYearExistFlag= true;
                    log.info(seasonYearExistFlag)
					var seasonChildren= yearChildren[i].getChildren().toArray();
					for(var j=0;j<seasonChildren.length;j++)
					{
						var season = seasonChildren[j].getName();
						if(season == seasonCode){
							var seasonID = seasonChildren[j].getID();
							log.info(seasonID)
                            		seasonCodeExistFlag=true;
                            		log.info(seasonCodeExistFlag)
							var a_parent = manager.getClassificationHome().getClassificationByID(seasonID);		
							//add the final color palette here
							node.setParent(a_parent);
							log.info("done")
											}
	
					}
				}
			}

		}
	}
}
}