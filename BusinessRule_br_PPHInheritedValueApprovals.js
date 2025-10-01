/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PPHInheritedValueApprovals",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "PPH Inherited Value Approvals",
  "description" : "This is a new business rule that runs on approval of a PPH hierarchy object (Brand, Division, Department, Class, SubClass) and similar to \"br_PPHInheritedValueChanges\", checks the CCs that have modified values inherited and publishes those Styles and CCs to Approved endpoints.",
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "Class", "Department", "Division", "SubClass" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Trigger",
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,queryHome) {
/*Commenting as part of prod data load - 05th Aug 2022 - Unnat Sinha - Availability - Gangi, Kishore, Jesse
 function getApprovedNode(mgr)    {
     return mgr.getProductHome().getProductByID(node.getID());
}

function triggerUpdatesForObjectType(pphNode, triggerObjectType, modified_attrs) {
		//loop through all objects to see if the modified attributes are used by the object using query function
			var c = com.stibo.query.condition.Conditions;
			var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
				//c.valueOf(modified_attr).eq(node.getValue(modified_attr.getID()).getSimpleValue())
				c.objectType(step.getObjectTypeHome().getObjectTypeByID(triggerObjectType))
				.and(c.hierarchy().simpleBelow(pphNode))
			);
			var res = querySpecification.execute();
			//logger.info("res size = "+res.asList(10000).size());
			// if search returns something, just get the first CC. a_CC_Number is a unique value so should only get one record in result.
			res.forEach(function(resNode) {
				//logger.info("res node = " + resNode.getID());
			     //check if the style's value is same as the value on PPH Node
			     var resNodeUpdated = false;
			     var iterator2 = modified_attrs.iterator(); 
				while(iterator2.hasNext()){
					var modified_attr = iterator2.next();
					if(!resNodeUpdated) {
						// if the PPH node's modified value is same as the Style's value then Style is impacted and needs to be republished
						if ((pphNode.getValue(modified_attr.getID()).getSimpleValue() == resNode.getValue(modified_attr.getID()).getSimpleValue()) && resNode.getValue(modified_attr.getID()).isInherited() ) {
							// if style is impacted, republish it to approved endpoints 
							//Removal of Non-DGL Outbound
							//enUS.republish(resNode);
							//enCA.republish(resNode);
							//frCA.republish(resNode);
							//logger.info(resNode.getID() + " published");
							resNodeUpdated = true;
						}	
					}
				}
			     return true; // this is needed for the "res.forEach" function
			 });	

	
}



var approvedNode = step.executeInWorkspace("Approved", getApprovedNode);

if(approvedNode) {
	//logger.info("found approved node");
	var modified_attrs = new java.util.HashSet();
	var attrs = step.getAttributeGroupHome().getAttributeGroupByID("ag_PPH_Inherit_Attributes").getAttributes();
	var iterator = attrs.iterator(); 
	while(iterator.hasNext()){
		var attr = iterator.next();
		if(node.getValue(attr.getID()).getSimpleValue() != approvedNode.getValue(attr.getID()).getSimpleValue())
			modified_attrs.add(attr);
	}

	if(modified_attrs.size() > 0) {
		triggerUpdatesForObjectType(node, "Style", modified_attrs);
		triggerUpdatesForObjectType(node, "CustomerChoice", modified_attrs);
		//added
		triggerUpdatesForObjectType(node, "SKU", modified_attrs);
	}
}
* 
 */
}