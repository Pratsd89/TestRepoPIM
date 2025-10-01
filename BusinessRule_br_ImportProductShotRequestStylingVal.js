/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ImportProductShotRequestStylingVal",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Product Shot Request Bulk Import - Styling CC Validation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "cc",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "CustomerChoice",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,qh,ccAttr,cc) {
function getCCByShotCCNumber(shotCCNumber) {
	if (shotCCNumber != null) {
		var c = com.stibo.query.condition.Conditions;
		var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
			c.valueOf(ccAttr).eq(shotCCNumber)
			.and(c.objectType(step.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
		);
		var res = querySpecification.execute();
		// if search returns something, just get the first CC. a_CC_Number is a unique value so should only get one record in result.
		if (res.asList(1).size() > 0) {
			var ccRes = res.asList(1).get(0);
			//logger.info(ccRes.getID());	
			return ccRes;
		}
	}
	// if search didn't return or shot_cc_number is blank, return null
	return null;
}

// check if styling piece CC Numbers are valid 
var stylingPieceCCs = node.getValue("a_Styling_Piece_CC_Number_Import").getSimpleValue();
if(stylingPieceCCs != null) {
	var stylingPieceCCArray = stylingPieceCCs.split(",");
	//PPIM-1839 - Replacing styling piece seperator from comma to semicolon
	//PPIM-4445 - Changing styling piece seperator back to comma from semicolon
	//var stylingPieceCCArray = stylingPieceCCs.split(";");
	for (var x = 0; x < stylingPieceCCArray.length; x++) {
		var sCC = getCCByShotCCNumber(stylingPieceCCArray[x]);
		if(sCC == null) {
			return "Shot request was created. Styling Piece was not added because CC with following CC Number was not found - " + 	stylingPieceCCArray[x];
		}
	}
}


// validations passed, return true
return  true;
}