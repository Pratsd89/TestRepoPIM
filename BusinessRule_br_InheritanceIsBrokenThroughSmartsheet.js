/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_InheritanceIsBrokenThroughSmartsheet",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_InheritanceIsBrokenThroughSmartsheet",
  "description" : "PPIM-11366",
  "scope" : "Global",
  "validObjectTypes" : [ "DuplicateStyleGroup", "SimilarStyleGroup" ],
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_mergeDuplicateStyles",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_mergeDuplicateStyles",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "rt_styles",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_styles",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,rt_mergeDuplicateStyles,rt_styles) {
/*var ObjectType = node.getObjectType().getID();
var USReferences;
var CAReferences;
if (ObjectType == "DuplicateStyleGroup") {
    manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        USReferences = getReferences(currentContextNode, rt_mergeDuplicateStyles);
    });

    manager.executeInContext("EN_CA", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        CAReferences = getReferences(currentContextNode, rt_mergeDuplicateStyles);
    });

}
if (ObjectType == "SimilarStyleGroup") {
    manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        USReferences = getReferences(currentContextNode, rt_styles);
    });

    manager.executeInContext("EN_CA", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        CAReferences = getReferences(currentContextNode, rt_styles);
    });

}

if((USReferences.length > 0)&&(CAReferences.length == 0)){
	//Inheritance is Broken already so deleting the references in CA.
	manager.executeInContext("EN_CA", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        if (ObjectType == "DuplicateStyleGroup") {
        	
        }
        if (ObjectType == "SimilarStyleGroup") {
        	
        }
    });

    for(var i in CAReferences){
    	 CAReferences[i].delete();
    }	
}



function getReferences(node, RefType) {
    var References = node.getReferences(RefType).toArray();
    return References;
}*/
var BrokenInheritance = node.getValue("a_IsInheritanceBroken").getSimpleValue();
var ObjectType = node.getObjectType().getID();
var References;
if (BrokenInheritance == "Yes") {
    var context = ["EN_CA", "FR_CA"];
    for (var j in context) {
        manager.executeInContext(context[j], function(currentContextManager) {
            var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
            if (ObjectType == "DuplicateStyleGroup") {
                References = currentContextNode.getReferences(rt_mergeDuplicateStyles).toArray();
            }
            if (ObjectType == "SimilarStyleGroup") {
                References = currentContextNode.getReferences(rt_styles).toArray();
            }
            for (var i in References) {
                References[i].getTarget().getValue("a_Style_Group_Type").setSimpleValue("");
                References[i].delete();
            }
			node.getValue("a_SuperPDP_Market").setSimpleValue("US");
        });
    }
}
}