/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ApproveSizeFacetValueforGreyButton",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Approve Size Facet Value for Grey Button",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeFacetCategory" ],
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
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (web) {
var selection = web.getSelection().iterator();
while (selection.hasNext()){
	var node = selection.next();
	var i;
if(node.getApprovalStatus() == "Completely Approved")
{
	web.showAlert("Error", "Size Facet Value is already approved!");
}
else
{
	var referencedBy =node.getReferencedByClassifications().toArray();
	for(i=0;i<referencedBy.length;i++)
	{
		var x= referencedBy[i].getSource().getObjectType().getID();
		var y= referencedBy[i].getSource();
		log.info(x);
		if(x=="Dim1" || x=="Dim2")
		{
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
						var time = new java.util.Date();
						var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			obj.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			log.info(obj.getValue("a_main_last_modified_date").getSimpleValue());
			log.info("sku published");
			}
		}

		}
		}
		node.approve();
		web.showAlert("Success", "Size Facet Value approved!");
}	


}
}