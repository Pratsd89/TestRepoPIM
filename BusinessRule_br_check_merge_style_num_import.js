/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_check_merge_style_num_import",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Check Merge Style Numbers (Import)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "REF_TYPE",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MergedStylesRef",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ATT_STYLENUM",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Style_Number",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,REF_TYPE,step,ATT_STYLENUM) {
//commenting this code as merged style refernce is no longer maintained PPIM-15199
/*var logArray = [];

var c = com.stibo.query.condition.Conditions;

// get a_Merge_Style_Number from node
var mergeStyles = node.getValue("a_Merge_Style_Number").getSimpleValue();
//log.info("\nMerge Styles are: " + mergeStyles);

var mergeStylesArray = new Array();

if (mergeStyles != null) {
	if (mergeStyles.contains(";")) {
		mergeStyles.split(";").forEach(function (mStyle) {
			mergeStylesArray.push(mStyle.trim());
		});
	}
	else if (mergeStyles.contains("<multisep/>")) {
		mergeStyles.split("<multisep/>").forEach(function (mStyle) {
			mergeStylesArray.push(mStyle.trim());
		});
	}
	else {
		mergeStylesArray.push(mergeStyles.trim());
	}
}

currentContext = step.getCurrentContext().getID();

step.executeInContext(currentContext, function (manager) {
	//log.info("\nExecuting in context: " + currentContext);
	var qh = manager.getHome(com.stibo.query.home.QueryHome);
	
	mergeStylesArray.forEach(function (mergeStyle) {
		//log.info("current merge style is: " + mergeStyle);
		// query database to convert Style Number to ID
 		var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
 			c.objectType(step.getObjectTypeHome().getObjectTypeByID("Style"))
 			.and(c.valueOf(ATT_STYLENUM).eq(mergeStyle))
 		);
 		
 		var res = querySpecification.execute();
		//log.info("\nresult size is: " + res.asList(1).size());
 		if (res.asList(1).size() > 0) {
 			var mergeStyleID = res.asList(1).get(0).getID();
 			//log.info("\nmergeStyleID is: " + mergeStyleID);
 		}
		
		// get context specific node
		var ctxtNode = manager.getProductHome().getProductByID(node.getID());
		//log.info("ctxtNode: " + ctxtNode);

		// get context specific target
		var ctxtTarget = manager.getProductHome().getProductByID(mergeStyleID);
		//log.info("ctxtTarget: " + ctxtTarget);

		// create ref from node to target
		//log.info("\nCreating Ref from " + ctxtNode.getID() + " to " + ctxtTarget.getID());
		ctxtNode.createReference(ctxtTarget, REF_TYPE);

		// create ref from target to node
		//log.info("\nCreating Ref from " + ctxtTarget.getID() + " to " + ctxtNode.getID());
		ctxtTarget.createReference(ctxtNode, REF_TYPE);

		// set "Is Primary Style" == Yes for node
		//log.info("\nSetting value a_isPrimaryStyle on " + ctxtNode.getID() + " to Yes");
		ctxtNode.getValue("a_isPrimaryStyle").setValue("Yes");

		// set "Is Primary Style" == No for target
		//log.info("\nSetting value a_isPrimaryStyle on " + ctxtTarget.getID() + " to No");
		ctxtTarget.getValue("a_isPrimaryStyle").setValue("No");
	});
});

// clear a_Merge_Style_Number
node.getValue("a_Merge_Style_Number").deleteCurrent();

//log.info(logArray); */
}