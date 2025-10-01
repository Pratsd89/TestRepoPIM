/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetMainLastUpdateDateforSKU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Set Maintainence Last Update Date for SKU",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeFacetValue" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
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
exports.operation0 = function (log,node,stepManager,portal) {
log.info("BR br_SetMainLastUpdateDateforSKU");
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var i,count=0;

//pulish size facet value

node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
			
/* PPIM-3306 - br_ApprovesSizeFacetValue rule that runs as part of this BR takes care of setting maintenance last update date on SKU so commenting it out here
var referencedBy =node.getReferencedByClassifications().toArray();
	for(i=0;i<referencedBy.length;i++)
	{
		var x= referencedBy[i].getSource().getObjectType().getID();
		var y= referencedBy[i].getSource();
		log.info(x);
		if(x=="Dim1" || x=="Dim2")
		{
			count++;
			//var scode= y.getValue("a_SizeCode_Parent_of_Dim1").getSimpleValue();
			var scode= y.getParent();
			log.info("scode : "+ scode);
			var classSKU = scode.getClassificationProductLinks();
				if(classSKU)
				{
					log.info(classSKU);
            			var chIter11=classSKU.iterator();
            			while(chIter11.hasNext())
            			{
            				var chprod11 = chIter11.next();
            				//log.info(chprod11.getObjectType().getID());
            				var obj= chprod11.getProduct();
            				log.info(obj);
						
			obj.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			log.info(obj.getValue("a_main_last_modified_date").getSimpleValue());
			log.info("sku published");
			}
		}}} */
}	
else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning",  "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}	
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_ApprovesSizeFacetValue"
  } ],
  "pluginType" : "Operation"
}
*/
