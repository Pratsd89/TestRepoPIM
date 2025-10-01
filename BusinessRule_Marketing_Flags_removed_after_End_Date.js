/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Marketing_Flags_removed_after_End_Date",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Marketing Flags to be removed after End Date",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,log,manager) {
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var flag =0;
if(node.getObjectType().getID() == 'Style')
{
	
	var marketingFlagDataContainer1 = node.getDataContainerByTypeID('StyleMarketingFlag1');
	var marketingFlagDataContainer2 = node.getDataContainerByTypeID('StyleMarketingFlag2');
	var marketingFlagDataContainer3 = node.getDataContainerByTypeID('StyleMarketingFlag3');
	var marketingFlagDataContainer4 = node.getDataContainerByTypeID('StyleMarketingFlag4');
	var marketingFlagDataContainer5 = node.getDataContainerByTypeID('StyleMarketingFlag5');
	var marketingFlagDataContainer6 = node.getDataContainerByTypeID('StyleMarketingFlag6');
	var marketingFlagDataContainer7 = node.getDataContainerByTypeID('StyleMarketingFlag7');
	var marketingFlagDataContainer8 = node.getDataContainerByTypeID('StyleMarketingFlag8');
	var marketingFlagDataContainer9 = node.getDataContainerByTypeID('StyleMarketingFlag9');
	var marketingFlagDataContainer10 = node.getDataContainerByTypeID('StyleMarketingFlag10');
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
	//PPIM-7585 Japan requirements
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
	
	var dataContainerArray = [marketingFlagDataContainer1,marketingFlagDataContainer2,marketingFlagDataContainer3,marketingFlagDataContainer4,marketingFlagDataContainer5,marketingFlagDataContainer6,marketingFlagDataContainer7,marketingFlagDataContainer8,marketingFlagDataContainer9,marketingFlagDataContainer10,marketingFlagDataContainerCA1,marketingFlagDataContainerCA2,marketingFlagDataContainerCA3,marketingFlagDataContainerCA4,marketingFlagDataContainerCA5,marketingFlagDataContainerCA6,marketingFlagDataContainerCA7,marketingFlagDataContainerCA8,marketingFlagDataContainerCA9,marketingFlagDataContainerCA10,
	marketingFlagDataContainerJP1,marketingFlagDataContainerJP2,marketingFlagDataContainerJP3,marketingFlagDataContainerJP4,marketingFlagDataContainerJP5,marketingFlagDataContainerJP6,marketingFlagDataContainerJP7,marketingFlagDataContainerJP8,marketingFlagDataContainerJP9,marketingFlagDataContainerJP10];
	for(var i = 0;i<dataContainerArray.length;i++){
		var dataContainerObject = dataContainerArray[i].getDataContainerObject();
		if(dataContainerObject != null){
			
			var end_date = dataContainerObject.getValue('a_marketing_flag_end_date').getSimpleValue();
			var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
			var date = iso.format(time);
			//if( date >end_date || date == end_date) #commeted as per PPIM-3895
			if( date >end_date )
			{
				dataContainerArray[i].deleteLocal();
				flag=flag+1;
			}
			
		}
	}
	if(flag>0)
	{
	if(node.isInWorkflow("wf_NewStyleEnrichment") || node.isInWorkflow("wf_NewStyleEnrichmentCanada") || node.isInWorkflow("wf_NewStyleEnrichmentJapan") || node.isInWorkflow("wf_StyleMaintenanceWorkflow"))
				{
					
				//	log.info(iso_product.format(time_product));
					node.getValue("a_main_last_modified_date").setSimpleValue(iso_product.format(time_product));
				}
				else
				{
					node.approve();
				}
		}
		flag=0;			
}



////////////////////////////////////////CC Marketing flag/////////////////////////////////////////////

else if(node.getObjectType().getID() == 'CustomerChoice')
{
	
	var marketingFlagDataContainer1 = node.getDataContainerByTypeID('CCMarketingFlag1');
	var marketingFlagDataContainer2 = node.getDataContainerByTypeID('CCMarketingFlag2');
	var marketingFlagDataContainer3 = node.getDataContainerByTypeID('CCMarketingFlag3');
	var marketingFlagDataContainer4 = node.getDataContainerByTypeID('CCMarketingFlag4');
	var marketingFlagDataContainer5 = node.getDataContainerByTypeID('CCMarketingFlag5');
	var marketingFlagDataContainer6 = node.getDataContainerByTypeID('CCMarketingFlag6');
	var marketingFlagDataContainer7 = node.getDataContainerByTypeID('CCMarketingFlag7');
	var marketingFlagDataContainer8 = node.getDataContainerByTypeID('CCMarketingFlag8');
	var marketingFlagDataContainer9 = node.getDataContainerByTypeID('CCMarketingFlag9');
	var marketingFlagDataContainer10 = node.getDataContainerByTypeID('CCMarketingFlag10');
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
	//PPIM-7585 Japan requirements
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

	var dataContainerArray = [marketingFlagDataContainer1,marketingFlagDataContainer2,marketingFlagDataContainer3,marketingFlagDataContainer4,marketingFlagDataContainer5,marketingFlagDataContainer6,marketingFlagDataContainer7,marketingFlagDataContainer8,marketingFlagDataContainer9,marketingFlagDataContainer10,marketingFlagDataContainerCA1,marketingFlagDataContainerCA2,marketingFlagDataContainerCA3,marketingFlagDataContainerCA4,marketingFlagDataContainerCA5,marketingFlagDataContainerCA6,marketingFlagDataContainerCA7,marketingFlagDataContainerCA8,marketingFlagDataContainerCA9,marketingFlagDataContainerCA10,
	marketingFlagDataContainerJP1,marketingFlagDataContainerJP2,marketingFlagDataContainerJP3,marketingFlagDataContainerJP4,marketingFlagDataContainerJP5,marketingFlagDataContainerJP6,marketingFlagDataContainerJP7,marketingFlagDataContainerJP8,marketingFlagDataContainerJP9,marketingFlagDataContainerJP10];
	
	
	for(var i = 0;i<dataContainerArray.length;i++){
		var dataContainerObject = dataContainerArray[i].getDataContainerObject();
		if(dataContainerObject != null){
			var end_date_ca= dataContainerObject.getValue('a_marketing_flag_end_date').getSimpleValue();
			var time = new java.util.Date();
			var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
			var date = iso.format(time);
			//if( date >end_date_ca || date == end_date_ca)#commeted as per PPIM-3895
			if( date >end_date_ca )
			{
				dataContainerArray[i].deleteLocal();
				flag =flag+1;
			}
				
				
				
				}
	}
	if(flag >0)
	{
	if(node.isInWorkflow("wf_CCEnrichment") || node.isInWorkflow("wf_CCEnrichmentCanada") || node.isInWorkflow("wf_CCEnrichmentJapan") || node.isInWorkflow("wf_StyleMaintenanceWorkflow"))
				{
					
				//	log.info(iso_product.format(time_product));
					node.getValue("a_main_last_modified_date").setSimpleValue(iso_product.format(time_product));
					//log.info("submit dgl" + node.getValue("a_main_last_modified_date").getSimpleValue());
				}
				else
				{
					node.approve();
				}
	}
	flag =0;
}
}