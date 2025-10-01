/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Autopop_WebClass_Update",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Autopop Set WebClass Update Value",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepMan",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "aAutoWebUpdate",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "Autopop_WebClass_Update",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refWebClass",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,logger,stepMan,aAutoWebUpdate,refWebClass) {
var WebClassUpdate = node.getValue(aAutoWebUpdate.getID()).getSimpleValue();

//if attr isn't null make it null
if (WebClassUpdate != null && WebClassUpdate != "") {
	node.getValue(aAutoWebUpdate.getID()).setSimpleValue("");
}

var myRefs = node.getClassificationProductLinks(refWebClass);
var myIDs = "";

for(var x=0; x < myRefs.size(); x++) {
	myIDs += myRefs.get(x).getClassification().getID() + ",";
}

node.getValue(aAutoWebUpdate.getID()).setSimpleValue(myIDs);

var allChild = node.getChildren();

for(var y=0; y < allChild.size(); y++) {
	var WebClassUpdate = allChild.get(y).getValue(aAutoWebUpdate.getID()).getSimpleValue();
	
	if(WebClassUpdate != null && WebClassUpdate != "") {
		allChild.get(y).getValue(aAutoWebUpdate.getID()).setSimpleValue("");
	}
		
	myRefs = allChild.get(y).getClassificationProductLinks(refWebClass);
	myIDs = "";
	
	for(var t=0; t < myRefs.size(); t++) {
		myIDs += myRefs.get(t).getClassification().getID() + ",";
	}

	allChild.get(y).getValue(aAutoWebUpdate.getID()).setSimpleValue(myIDs);
}
}