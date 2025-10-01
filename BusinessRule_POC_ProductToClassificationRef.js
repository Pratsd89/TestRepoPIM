/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "POC_ProductToClassificationRef",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "POC_ProductToClassificationRef",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log) {


//var IsValueInherited = isValueInherited(node,step);
//var GetRefMetaData = getRefMetaData(node,step);
//var GetRefMetaData = setRefMetaData(node,step);

//createHierarchyToTag ("05a2e0a4-5c7b-4006-8c21-83bb5650ca7a", "TAGVAL_129150646");

isValueInherited(node,manager);

function isValueInherited(node,manager) 
{

	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("HierarchyToTag");
	
	var ref = node.getClassificationProductLinks().asList()
	logger.warning("ref="+ref);
	for(var i=0; i < ref.size() ; i++)
	{
		var refPRoduct = ref.get(i);
		logger.warning("refPRoduct="+refPRoduct);
		var refValue = refPRoduct.getProduct()
		logger.warning("refValue="+refValue);
		log.info("node="+node);
		
		
	}
//	logger.warning(ref);
	
    }

function getRefMetaData(node,manager) 
{

	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("HierarchyToTag");
	node.queryClassificationProductLinks(linkType).forEach
	(
		function (referenceInstance){
		var Tag_Sequence = referenceInstance.getValue("a_Tag_Sequence").getSimpleValue();
		var TagValue_Sequence = referenceInstance.getValue("a_TagValue_Sequence").getSimpleValue();
		var Tag_Originated = referenceInstance.getValue("a_Tag_Originated").getSimpleValue();
		var Tag_Type = referenceInstance.getValue("a_Tag_Type").getSimpleValue();
		return true;
		}
		);

		//not working
		node.queryClassificationProductLinks(linkType).forEach
	(
		function (referenceInstance){
		var metadata1 = referenceInstance.getLinkType().isInherited();
		logger.warning(referenceInstance.getProduct());
			logger.warning(metadata1);
		return true;
		}
		);
 
    }

function setRefMetaData(node,manager) 
{
	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("HierarchyToTag");
	var constant = 121123;
	node.queryClassificationProductLinks(linkType).forEach
	(
		function (referenceInstance){
			referenceInstance.getValue("ValueSequence").setSimpleValue(constant);
		referenceInstance.getValue("TagSequence").setSimpleValue(constant);
		return true;
		
		}
		);
 
    }

function createHierarchyToTag (StyleID, classificationID){
	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("HierarchyToTag");
	var Product = manager.getProductHome().getProductByID(StyleID);
	log.info(Product);
	var Classification = manager.getClassificationHome().getClassificationByID(classificationID);
	log.info(Classification);
	var link = Product.createClassificationProductLink(Classification, linkType);
	link.getValue("a_Tag_Originated").setSimpleValue(StyleID);
}

}