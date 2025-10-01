/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ApproveSizeFacetCategory",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Approve Size Facet Category",
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
exports.operation0 = function (log,node,portal) {

if(node.getApprovalStatus() == "Completely Approved")
	{
		portal.showAlert("Error", "Category is already approved!");
	}
else
	{
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var referencecat = node.getChildren().toArray();
	for(var j=0;j<referencecat.length;j++)
	{
var referencedBy =referencecat[j].getReferencedByClassifications().toArray();
	for(var i=0;i<referencedBy.length;i++)
	{
		var x= referencedBy[i].getSource().getObjectType().getID();
		var y= referencedBy[i].getSource();
		//log.info(x);
		if(x=="Dim1" || x=="Dim2")
		{
			var scode= y.getParent();
			//log.info("scode : "+ scode);
			var classSKU = scode.getClassificationProductLinks();
				if(classSKU)
				{
					//log.info(classSKU);
            			var chIter11=classSKU.iterator();
            			while(chIter11.hasNext())
            			{
            				var chprod11 = chIter11.next();
            				//log.info(chprod11.getObjectType().getID());
            				var obj= chprod11.getProduct();
            				//log.info(obj);
						var time = new java.util.Date();
						var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			obj.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
			//log.info(obj.getID() + "   " +obj.getValue("a_main_last_modified_date").getSimpleValue());
			//log.info("sku published");
			}
		}
		}
		}
		}
		node.approve();
		portal.showAlert("success", "Category approved!");
	}
	



}