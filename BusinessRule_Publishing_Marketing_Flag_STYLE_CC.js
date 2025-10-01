/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Publishing_Marketing_Flag_STYLE_CC",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Publishing_Marketing_Flag_STYLE_CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "Class", "Department", "Division", "SubClass" ],
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
var styleExist = false;
var ccExist = false;
var styleObjects = null;
var styleObjects = isStyleExists(node);


if(styleObjects){
	logger.info("Style Level "+styleObjects.length);
	if(styleObjects.length!=0){
	styleExist = true;

	/*for(var i=0;i<styleObjects.length;i++){

		var styleArray = styleObjects[i];
		if(styleArray.getChildren().toArray().length!=0)
		ccExist = true;
		logger.info("CC Level ");
}*/
}
}

if(styleExist)
	return true;
else
	return false;

function isStyleExists(objectID){


		var children1 = objectID.getChildren().toArray(); 
	
			for( var i =0;i<children1.length;i++){
		
			if(children1[i].getObjectType().getID() == "Style")
				return children1;
				
			else{
			
				logger.info("Brand Level"+children1)
				var children2 = children1[i].getChildren().toArray();
				logger.info(children2.length)
							
				for( var j =0;j<children2.length;j++){

					
					if(children2[j].getObjectType().getID() == "Style")						
					return children2;
			   
					else{

						logger.info("Division Level"+children2)
						
						var children3 = children2[j].getChildren().toArray();
			
						for( var k =0;k<children3.length;k++){
		
							if(children3[k].getObjectType().getID() == "Style")
							return children3;
							
								else{	

									logger.info("Department Level"+children3)
									var children4 = children3[k].getChildren().toArray();			
			
									for( var  l=0;l<children4.length;l++){
		
										if(children4[l].getObjectType().getID() == "Style")
										return children4;
						
										else{	

											logger.info("Class Level "+children4)
											var children5 = children4[l].getChildren().toArray();
			
											logger.info("Sub Class Level "+children5)
												if(children5.length!=0)
												return children5;
				
				
				
											}				
									}		
								}											
						}		
		
		
					}
				}
	
			}
		}


}
}