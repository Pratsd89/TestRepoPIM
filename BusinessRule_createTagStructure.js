/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "createTagStructure",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "createTagStructure",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "tagToStyleRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "TagToStyleRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "tagToWebCatSubCatRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "TagToWebCatSubCatRef",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "style",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "Style",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,tagToStyleRef,tagToWebCatSubCatRef,qh,style) {
var tagMeta = [
	["Category_Group_Tag","1211669","1211675"],
	["Category_Tag","1211671","1211677"],
	["Department_Product_Tag", "1211667", "1211673"],
	["Style_Tag", "1211670", "1211676"],
	["Product_Type_Tag", "1211668", "1211674"],
	["Boutique_Tag", "1211672", "1211678"]
];

//get all style
var c = com.stibo.query.condition.Conditions;
var allStyles = h.queryFor(com.stibo.core.domain.Product).where(c.objectType(style));
allStyles.forEach(function(styleNode) {
	styleNode
});


function createTagHierarchy()
{
	for(var i=0;i<tagMeta.length;i++)
	{ 
		var lov = manager.getListOfValuesHome().getListOfValuesByID(tagMeta[i][0]);
		var allValues = lov.queryValidValues();
		allValues.forEach(function(lovValue) {
			var tagNode = manager.getClassificationHome().getClassificationByID(tagMeta[i][1]);
			var newClassification = tagNode.createClassification(tagMeta[i][0] + "_" + lovValue.getID(),"ProductTag");
			logger.info(lovValue.getValue());
			newClassification.setName(lovValue.getValue());
			var tagExcludeNode = manager.getClassificationHome().getClassificationByID(tagMeta[i][2]);
			var newExcludeClassification = tagExcludeNode.createClassification(tagMeta[i][0] + "_Excln_" + lovValue.getID(),"ProductTag");
			logger.info(lovValue.getValue());
			newExcludeClassification.setName(lovValue.getValue());
			return true;
		});	
	}
}



}