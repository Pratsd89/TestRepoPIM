/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Web_Category_Product_Sort_Order",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Category Product Sort Order",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
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
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refclass",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,refclass) {
try{
	var a;
	var x=0;
	var sortref=0;
		if(node.getValue("a_WebCategory_Assortment_Type").getSimpleValue().equals("Manual"))
		{
			//log.info(b.getID());
			//log.info(b.getClassificationProductLinks());
			var refs1 = new java.util.ArrayList();
			refs1.addAll(node.getClassificationProductLinks());
			for( a=0; a< refs1.size(); a++)
			{	
				sortref=refs1.get(a).getValue("a_WebCategory_Product_Sort_Order").getSimpleValue(); 	
				if(sortref!=null)
				{
					if(parseInt(x) < parseInt(sortref))
					{
						x=0;
						x=sortref;	
					}
				}
			}
			for( a=0; a< refs1.size(); a++)
			{
				var sortref=refs1.get(a).getValue("a_WebCategory_Product_Sort_Order").getSimpleValue();
				if( sortref == null)
				{
					x = parseInt(x) + 20;
					//log.info("Assigning incremented sort order value as :" + x);
					refs1.get(a).getValue("a_WebCategory_Product_Sort_Order").setSimpleValue(x);
				}
			}
			x=0;
		}
	}

catch(e){
	logger.info("CC To Web Heirarchy Set of Sort Order Event Processor Failed for ID : " + node.getID());
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
