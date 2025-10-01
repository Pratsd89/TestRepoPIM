/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "FR_Marketing Flag Trigger event for CC",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "FR_Marketing Flag Trigger event for CC",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeFacetCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
var children1 = node.getChildren().toArray(); 

	for( var i =0;i<children1.length;i++){

	if(children1[i].getObjectType().getID() == "Style")
		triggerEvent(children1[i]);
		
	else{
	
		//logger.info("Brand Level"+children1)
		var children2 = children1[i].getChildren().toArray();
		//logger.info(children2.length)
					
		for( var j =0;j<children2.length;j++){

			
			if(children2[j].getObjectType().getID() == "Style")						
			triggerEvent(children2[j]);
	   
			else{

				//logger.info("Division Level"+children2)
				
				var children3 = children2[j].getChildren().toArray();
	
				for( var k =0;k<children3.length;k++){

					if(children3[k].getObjectType().getID() == "Style")
					triggerEvent(children3[k]);
					
						else{	

							//logger.info("Department Level"+children3)
							var children4 = children3[k].getChildren().toArray();			
	
							for( var  l=0;l<children4.length;l++){

								if(children4[l].getObjectType().getID() == "Style")
								triggerEvent(children4[l]);
				
								else{	

									//logger.info("Class Level "+children4)
									var children5 = children4[l].getChildren().toArray();
	
									//logger.info("Sub Class Level "+children5)
									for(var m=0;m<children5.length;m++)
									{
										
										if(children5[m].getObjectType().getID() == "Style")
										triggerEvent(children5[m]);
									}
									
		
		
		
									}				
							}		
						}											
				}		


			}
		}

	}
}

function triggerEvent(Style)
{

	/*var lifecycle = Style.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

	if(!(lifecycle == "DRAFT" || lifecycle == "Draft"))
	{
			//Triggering Style
			OutboundQueue.queueDerivedEvent(Outbound,Style);
	}*/
	
	
	var CC = Style.getChildren().toArray();
	
	if(CC.length!=0)
	{
		for(var i=0;i<CC.length;i++){

				var lifecycle = CC[i].getValue("a_Style_Life_Cycle_Status").getSimpleValue();

				if(!(lifecycle == "DRAFT" || lifecycle == "Draft"))
				{
					//Triggering CC
					//Removal of file based outbound
					//OutboundQueue.queueDerivedEvent(Outbound,CC[i]);
				}
			
		
		}
	}

}
}