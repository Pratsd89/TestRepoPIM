/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setStyleToPreview",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Maintenance Last Update Date for Selected",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "WebUiContextBind",
    "alias" : "web",
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
    "contract" : "EventQueueBinding",
    "alias" : "PublishStyleToDGL_Main_EN_US",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishStyleToDGL_Main_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "PublishStyleToDGL_Main_EN_CA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishStyleToDGL_Main_EN_CA",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "StyleDerivedEventUS",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_style",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "StyleDerivedEventCA",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_style_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "PublishStyleToDGL_Main_EN_JP",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishStyleToDGL_Main_EN_JP",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "StyleDerivedEventJP",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_style_JP",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,web,stepManager,PublishStyleToDGL_Main_EN_US,PublishStyleToDGL_Main_EN_CA,StyleDerivedEventUS,StyleDerivedEventCA,PublishStyleToDGL_Main_EN_JP,StyleDerivedEventJP) {
/***
 * JP chnages are added as part of PPIM-7538
 */
//loop through each selected product in Web UI
var selection = web.getSelection().iterator();
while (selection.hasNext()) {
	node = selection.next();
	var obj = node.getObjectType().getID();
	log.info("br_setStyleToPreview node id = " + node.getID() + " | node type = " + node.getObjectType());

	log.info("Active in Workflow States: NewStyleEnrich_Copy=" + node.isInState('wf_NewStyleEnrichment','NewStyleEnrich_Copy')
		+ " | NewStyleEnrich_Copy1=" + node.isInState('wf_NewStyleEnrichment','NewStyleEnrich_Copy1')
		+ " | NewStyleEnrich_WebMerchandising=" + node.isInState('wf_NewStyleEnrichment','NewStyleEnrich_WebMerchandising')
		+ " | NewStyleEntrich_WebMerch1=" + node.isInState('wf_NewStyleEnrichment','NewStyleEntrich_WebMerch1')
		+ " | WaitingForFirst_CC=" +  + node.isInState('wf_NewStyleEnrichment','WaitingForFirst_CC')
		+ " | NewStyleEnrich_Final=" +  + node.isInState('wf_NewStyleEnrichment','NewStyleEnrich_Final')
		);
	//Publish to Preview operation is only applicable for Missing Web Merchandising state
	if (!node.isInState('wf_NewStyleEnrichment','NewStyleEntrich_WebMerch1')) {
		log.info("Return error message");
		web.showAlert("ERROR", "Operation Restriction", "Publish to Preview can be executed for Missing Web Merchandising state");
		return;
	}
	log.info("continuing operation...");
	
	if( obj == 'Style' ) {
		
		var marketingFlagDataContainer1 = node.getDataContainerByTypeID('StyleMarketingFlag1');
		var marketingFlagDataContainer2 = node.getDataContainerByTypeID('StyleMarketingFlag2');
		var marketingFlagDataContainer3 = node.getDataContainerByTypeID('StyleMarketingFlag3');
		var marketingFlagDataContainer4 = node.getDataContainerByTypeID('StyleMarketingFlag4');
		var marketingFlagDataContainer5 = node.getDataContainerByTypeID('StyleMarketingFlag5');
		//extra marketing flag added
		var marketingFlagDataContainer6 = node.getDataContainerByTypeID('StyleMarketingFlag6');
		var marketingFlagDataContainer7 = node.getDataContainerByTypeID('StyleMarketingFlag7');
		var marketingFlagDataContainer8 = node.getDataContainerByTypeID('StyleMarketingFlag8');
		var marketingFlagDataContainer9 = node.getDataContainerByTypeID('StyleMarketingFlag9');
		var marketingFlagDataContainer10 = node.getDataContainerByTypeID('StyleMarketingFlag10');
		// CA marketing flag added
		var marketingFlagDataContainerCA1 = node.getDataContainerByTypeID('StyleMarketingFlagCA1');
		var marketingFlagDataContainerCA2 = node.getDataContainerByTypeID('StyleMarketingFlagCA2');
		var marketingFlagDataContainerCA3 = node.getDataContainerByTypeID('StyleMarketingFlagCA3');
		var marketingFlagDataContainerCA4 = node.getDataContainerByTypeID('StyleMarketingFlagCA4');
		var marketingFlagDataContainerCA5 = node.getDataContainerByTypeID('StyleMarketingFlagCA5');
		var marketingFlagDataContainerCA6 = node.getDataContainerByTypeID('StyleMarketingFlagCA6');
		var marketingFlagDataContainerCA7 = node.getDataContainerByTypeID('StyleMarketingFlagCA7');
		var marketingFlagDataContainerCA8 = node.getDataContainerByTypeID('StyleMarketingFlagCA8');
		var marketingFlagDataContainerCA9 = node.getDataContainerByTypeID('StyleMarketingFlagCA9');
		var marketingFlagDataContainerCA10 = node.getDataContainerByTypeID('StyleMarketingFlagCA10');
		// JP marketing flag added
		var marketingFlagDataContainerJP1 = node.getDataContainerByTypeID('StyleMarketingFlagJP1');
		var marketingFlagDataContainerJP2 = node.getDataContainerByTypeID('StyleMarketingFlagJP2');
		var marketingFlagDataContainerJP3 = node.getDataContainerByTypeID('StyleMarketingFlagJP3');
		var marketingFlagDataContainerJP4 = node.getDataContainerByTypeID('StyleMarketingFlagJP4');
		var marketingFlagDataContainerJP5 = node.getDataContainerByTypeID('StyleMarketingFlagJP5');
		var marketingFlagDataContainerJP6 = node.getDataContainerByTypeID('StyleMarketingFlagJP6');
		var marketingFlagDataContainerJP7 = node.getDataContainerByTypeID('StyleMarketingFlagJP7');
		var marketingFlagDataContainerJP8 = node.getDataContainerByTypeID('StyleMarketingFlagJP8');
		var marketingFlagDataContainerJP9 = node.getDataContainerByTypeID('StyleMarketingFlagJP9');
		var marketingFlagDataContainerJP10 = node.getDataContainerByTypeID('StyleMarketingFlagJP10');
		var dataContainerArray = [marketingFlagDataContainer1,marketingFlagDataContainer2,marketingFlagDataContainer3,marketingFlagDataContainer4,marketingFlagDataContainer5,marketingFlagDataContainer6,marketingFlagDataContainer7,marketingFlagDataContainer8,marketingFlagDataContainer9,marketingFlagDataContainer10];
		var dataContainerArrayCA = [marketingFlagDataContainerCA1,marketingFlagDataContainerCA2,marketingFlagDataContainerCA3,marketingFlagDataContainerCA4,marketingFlagDataContainerCA5,marketingFlagDataContainerCA6,marketingFlagDataContainerCA7,marketingFlagDataContainerCA8,marketingFlagDataContainerCA9,marketingFlagDataContainerCA10];
		var dataContainerArrayJP = [marketingFlagDataContainerJP1,marketingFlagDataContainerJP2,marketingFlagDataContainerJP3,marketingFlagDataContainerJP4,marketingFlagDataContainerJP5,marketingFlagDataContainerJP6,marketingFlagDataContainerJP7,marketingFlagDataContainerJP8,marketingFlagDataContainerJP9,marketingFlagDataContainerJP10];
		
		for(var i = 0;i<dataContainerArray.length;i++){
			var dataContainerObject = dataContainerArray[i].getDataContainerObject();
			if(dataContainerObject != null){
				dataContainerObject.getValue('a_marketing_flag_position').setSimpleValue(i+1);
			}
		}
		for(var j = 0;j<dataContainerArrayCA.length;j++){
			var dataContainerObjectCA = dataContainerArrayCA[j].getDataContainerObject();
			if(dataContainerObjectCA != null){
				dataContainerObjectCA.getValue('a_marketing_flag_position').setSimpleValue(j+1);
			}
		}
		for(var k = 0;k<dataContainerArrayJP.length;k++){
			var dataContainerObjectJP = dataContainerArrayJP[k].getDataContainerObject();
			if(dataContainerObjectJP != null){
				dataContainerObjectJP.getValue('a_marketing_flag_position').setSimpleValue(k+1);
			}
		}
	}
	else if( obj == 'CustomerChoice' ) {
		
		var marketingFlagDataContainer1 = node.getDataContainerByTypeID('CCMarketingFlag1');
		var marketingFlagDataContainer2 = node.getDataContainerByTypeID('CCMarketingFlag2');
		var marketingFlagDataContainer3 = node.getDataContainerByTypeID('CCMarketingFlag3');
		var marketingFlagDataContainer4 = node.getDataContainerByTypeID('CCMarketingFlag4');
		var marketingFlagDataContainer5 = node.getDataContainerByTypeID('CCMarketingFlag5');
		//extra marketing flag added
		var marketingFlagDataContainer6 = node.getDataContainerByTypeID('CCMarketingFlag6');
		var marketingFlagDataContainer7 = node.getDataContainerByTypeID('CCMarketingFlag7');
		var marketingFlagDataContainer8 = node.getDataContainerByTypeID('CCMarketingFlag8');
		var marketingFlagDataContainer9 = node.getDataContainerByTypeID('CCMarketingFlag9');
		var marketingFlagDataContainer10 = node.getDataContainerByTypeID('CCMarketingFlag10');
		//CA marketing flag added
		var marketingFlagDataContainerCA1 = node.getDataContainerByTypeID('CCMarketingFlagCA1');
		var marketingFlagDataContainerCA2 = node.getDataContainerByTypeID('CCMarketingFlagCA2');
		var marketingFlagDataContainerCA3 = node.getDataContainerByTypeID('CCMarketingFlagCA3');
		var marketingFlagDataContainerCA4 = node.getDataContainerByTypeID('CCMarketingFlagCA4');
		var marketingFlagDataContainerCA5 = node.getDataContainerByTypeID('CCMarketingFlagCA5');
		var marketingFlagDataContainerCA6 = node.getDataContainerByTypeID('CCMarketingFlagCA6');
		var marketingFlagDataContainerCA7 = node.getDataContainerByTypeID('CCMarketingFlagCA7');
		var marketingFlagDataContainerCA8 = node.getDataContainerByTypeID('CCMarketingFlagCA8');
		var marketingFlagDataContainerCA9 = node.getDataContainerByTypeID('CCMarketingFlagCA9');
		var marketingFlagDataContainerCA10 = node.getDataContainerByTypeID('CCMarketingFlagCA10');
		// JP marketing flag added
		var marketingFlagDataContainerJP1 = node.getDataContainerByTypeID('CCMarketingFlagJP1');
		var marketingFlagDataContainerJP2 = node.getDataContainerByTypeID('CCMarketingFlagJP2');
		var marketingFlagDataContainerJP3 = node.getDataContainerByTypeID('CCMarketingFlagJP3');
		var marketingFlagDataContainerJP4 = node.getDataContainerByTypeID('CCMarketingFlagJP4');
		var marketingFlagDataContainerJP5 = node.getDataContainerByTypeID('CCMarketingFlagJP5');
		var marketingFlagDataContainerJP6 = node.getDataContainerByTypeID('CCMarketingFlagJP6');
		var marketingFlagDataContainerJP7 = node.getDataContainerByTypeID('CCMarketingFlagJP7');
		var marketingFlagDataContainerJP8 = node.getDataContainerByTypeID('CCMarketingFlagJP8');
		var marketingFlagDataContainerJP9 = node.getDataContainerByTypeID('CCMarketingFlagJP9');
		var marketingFlagDataContainerJP10 = node.getDataContainerByTypeID('CCMarketingFlagJP10');
		var dataContainerArray = [marketingFlagDataContainer1,marketingFlagDataContainer2,marketingFlagDataContainer3,marketingFlagDataContainer4,marketingFlagDataContainer5,marketingFlagDataContainer6,marketingFlagDataContainer7,marketingFlagDataContainer8,marketingFlagDataContainer9,marketingFlagDataContainer10];
		var dataContainerArrayCA = [marketingFlagDataContainerCA1,marketingFlagDataContainerCA2,marketingFlagDataContainerCA3,marketingFlagDataContainerCA4,marketingFlagDataContainerCA5,marketingFlagDataContainerCA6,marketingFlagDataContainerCA7,marketingFlagDataContainerCA8,marketingFlagDataContainerCA9,marketingFlagDataContainerCA10];
		var dataContainerArrayJP = [marketingFlagDataContainerJP1,marketingFlagDataContainerJP2,marketingFlagDataContainerJP3,marketingFlagDataContainerJP4,marketingFlagDataContainerJP5,marketingFlagDataContainerJP6,marketingFlagDataContainerJP7,marketingFlagDataContainerJP8,marketingFlagDataContainerJP9,marketingFlagDataContainerJP10];
		
		for(var i = 0;i<dataContainerArray.length;i++){
			var dataContainerObject = dataContainerArray[i].getDataContainerObject();
			if(dataContainerObject != null){
				dataContainerObject.getValue('a_marketing_flag_position').setSimpleValue(i+1);
			}
		}
		for(var j = 0;j<dataContainerArrayCA.length;j++){
			var dataContainerObjectCA = dataContainerArrayCA[j].getDataContainerObject();
			if(dataContainerObjectCA != null){
				dataContainerObjectCA.getValue('a_marketing_flag_position').setSimpleValue(j+1);
			}
		}
		for(var k = 0;k<dataContainerArrayJP.length;k++){
			var dataContainerObjectJP = dataContainerArrayJP[k].getDataContainerObject();
			if(dataContainerObjectJP != null){
				dataContainerObjectJP.getValue('a_marketing_flag_position').setSimpleValue(k+1);
			}
		}
	}
	
	if( obj == "SKU") {
		var Life_Cycle = node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue();
		log.info(Life_Cycle);
		if(Life_Cycle == "Draft" )
		{
			log.info("entered Draft")
		}
		else
		{
			var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		}
	}
	else {
		//PPIM-3040: Blocking a_main_last_modified_date modification, Outbound will be triggered explicitly
		/* var time1 = new java.util.Date();
		var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1)); */
	}
	//log.info(node.getID() + ": a_main_last_modified_date value set to " + node.getValue("a_main_last_modified_date").getSimpleValue());

	//PPIM-3040: Explicitly trigger outbound for Style only
	if( obj == 'Style' ) {
		PublishStyleToDGL_Main_EN_US.queueDerivedEvent(StyleDerivedEventUS, node);
		PublishStyleToDGL_Main_EN_CA.queueDerivedEvent(StyleDerivedEventCA, node);
		PublishStyleToDGL_Main_EN_JP.queueDerivedEvent(StyleDerivedEventJP, node);
		
	}
	
} //ends while

}