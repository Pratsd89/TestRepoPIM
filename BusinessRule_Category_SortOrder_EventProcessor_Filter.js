/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Category_SortOrder_EventProcessor_Filter",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Category SortOrder EventProcessor Filter",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style", "SubClass" ],
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
exports.operation0 = function (node,manager,refclass) {
	var sortref=0;
	var flagtogenerateEvent = 0;
	var refs = new java.util.ArrayList();
	refs.addAll(node.getClassificationProductLinks(refclass));
	for( var i=0; i< refs.size(); i++)
	{
		var curCatAssortmentType = refs.get(i).getClassification().getValue("a_WebCategory_Assortment_Type").getSimpleValue();
		if(curCatAssortmentType != null && curCatAssortmentType.equals("Manual"))
		{
		  	sortref=refs.get(i).getValue("a_WebCategory_Product_Sort_Order").getSimpleValue(); 	
		    	if(sortref==null)
			{
				flagtogenerateEvent = 1;
			}
		}
		
}

	if(flagtogenerateEvent == 1)
		{
			return true;
		}
	else
		{
			return false;
		}


}