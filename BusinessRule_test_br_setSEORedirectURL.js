/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "test_br_setSEORedirectURL",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "test_br_setSEORedirectURL",
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
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
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
    "contract" : "AttributeBindContract",
    "alias" : "cidAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_WebCategory_CID",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (queryHome,node,stepManager,cidAttr) {
var objectType = node.getObjectType().getID();
log.info(objectType);
var attr="a_Redirect_URL";
//log.info(product);

/*
function getAttributeValueAsPerContext(objectNode, attribute, context) {
	var asignValue = "";
	if (context == "EN_US") {
		asignValue = getAttributeValue(objectNode, attribute);
	} else {
		asignValue = "";
	}
	return asignValue;
}

function getAttributeValue(currentNode, attribute) {
	var attributeValue = "";
	attributeValue = currentNode.getValue(attribute).getSimpleValue();
	if (attributeValue == null) {
		attributeValue = " "; // to replace null with ""
	} else if (containsDoubleQuotes(attributeValue) == true) {
		attributeValue = "\"" + attributeValue + "\"" + '"';
	} else if (attributeValue.contains(",")) {
		// SKIP " and warp text that contains ","
		attributeValue = "\"" + attributeValue + "\"";
	} else {
		attributeValue = attributeValue;
	}
	return attributeValue.trim();
}
*/

if (objectType == "WebCategory") 
{
    var url = node.getValue("a_Redirect_URL").getSimpleValue();
    log.info(url);
    url = String(url);

    var cidMatch = url.match(/cid=(\d+)/);
    if (cidMatch && cidMatch[1]) 
    {
        var cidValue = cidMatch[1];
        log.info("cid found");
        log.info(cidValue);

		// getObjectByKey, getID
        
        

        var r = stepManager.getClassificationHome().getObjectByKey("a_WebCategory_CID","50123");
        log.info(r);

        var r1=stepManager.getNodeHome().getObjectByKey("a_WebCategory_CID","3007211");
        log.info(r1);

        var r2=stepManager.getClassificationHome().getClassificationByID("WC-52046998");
        log.info(r2);
        log.info(r2.getValue("a_WebCategory_CID").getSimpleValue());
        /*
		var c = com.stibo.query.condition.Conditions;
		for each (var lovID in LOVIDs) {
		var query = qh.queryFor(com.stibo.core.domain.Classification).where(c.valueOf(attr).lov().id(lovID));
		var resList = query.execute().asList(100000);
		resStr += lovID+" = "+resList.size()+" | ";
		}
		log.info(resStr);
	*/

        //var res=searchExistingSlugValue("a_WebCategory_CID","WebCategory",cidValue);
        //var res=CopyAttributeValues(node,"a_WebCategory_CID",cidValue);
//        var condition = com.stibo.query.condition.Conditions;
//	    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(
//	        condition.valueOf("a_WebCategory_CID").eq(cidValue)
//	    );
//	    var result = querySpecification.execute();
//	    return result.asList(500).size();
//        log.info(res);

/*

		var c = com.stibo.query.condition.Conditions;
		 var h = stepManager.getHome(com.stibo.query.home.QueryHome);
		 var querySpecification = h.queryFor(com.stibo.core.domain.entity.Entity).where(
		     c.valueOf(cidAttr).eq(cidValue)
		     
		 );
		 var res = querySpecification.execute();
		 log.info(res);
		 log.info(res.getObjectType());
*/
    } 
    
    else 
    {
        log.info("cid not found");
    }
}


/*
function CopyAttributeValues(node, attributeID, cidValue) {
    //log.info("attributeID="+attributeID);
    var AttributeValue;
    stepManager.executeInContext("EN_US", function (currentContextManager) {
        var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(node.getID());
        AttributeValue = currentContextNode.getValue(attributeID).getSimpleValue();
        //log.info("AttributeValue="+AttributeValue);
        if (AttributeValue != null) {
            stepManager.executeInContext("EN_US", function(currentContextManager) 
            {
               //log.info("context="+context[j]);
               var currentContextNode = currentContextManager.getClassificationHome().getClassificationByID(cidValue);
               return currentContextNode.getValue("ID");
           });
        }
    });
}
*/

/*
function searchExistingSlugValue(attr, objectType, slugType) 
{
    var condition = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(
        condition.valueOf(attr).eq(cidValue)
        .and(condition.objectType(stepManager.getObjectTypeHome().getObjectTypeByID(objectType)))
    );
    var result = querySpecification.execute();
    return result.asList(500).size();
}
*/
}