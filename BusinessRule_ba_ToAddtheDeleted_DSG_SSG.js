/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ba_ToAddtheDeleted_DSG_SSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ba_ToAddtheDeleted_DSG_SSG",
  "description" : null,
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
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,rt_mergeDuplicateStyles,rt_styles,manager) {
var ObjectType = node.getObjectType().getID();
var References;
var USName;
if (ObjectType == "DuplicateStyleGroup") {
    manager.executeInContext("EN_US", function(currentContextManager) {    	   
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        USName = currentContextNode.getName();
        References = getReferences(currentContextNode, rt_mergeDuplicateStyles);
        if (References.length > 0) {
        	      currentContextNode.getValue("a_SuperPDP_Market").deleteCurrent();
        	      currentContextNode.getValue("a_SuperPDP_Market").addValue("US");
                currentContextNode.getValue("a_SuperPDP_Market").addValue("CAN");
            /*var superPDPMarkets = currentContextNode.getValue("a_SuperPDP_Market").getSimpleValue();
            if (superPDPMarkets != null && !superPDPMarkets.contains("US")) {
               // node.getvalue("a_SuperPDP_Market").addValue("US");
                currentContextNode.getValue("a_SuperPDP_Market").addValue("US");
                currentContextNode.getValue("a_SuperPDP_Market").addValue("CAN");
            }*/
        }
    });
    
    manager.executeInContext("EN_CA", function(currentContextManager) {
    		var CANode = currentContextManager.getProductHome().getProductByID(node.getID());
    		 CANode.setName(USName);
    		removeReferences(CANode, rt_mergeDuplicateStyles);
    		 CANode.getValue("a_SuperPDP_Market").deleteCurrent();
        	      CANode.getValue("a_SuperPDP_Market").addValue("US");
                CANode.getValue("a_SuperPDP_Market").addValue("CAN");
   		 });
    
    //log.info("References=" + References);
    var context = ["EN_CA", "FR_CA"];
    for (var j in context) {    	   
        addReferences(node, context[j], rt_mergeDuplicateStyles, References);
    }
    for (var i in References) {
        var Ref = References[i].getTarget();
        var Attributes = ["a_Primary_Selling_Style_ID", "a_Primary_Selling_Style", "a_SuperPDP_Program_ID", "a_Supporting_Styles"];
        for (var k in Attributes) {
            CopyAttributeValues(Ref, Attributes[k]);
        }
    }
    var DSGAttributes = ["a_Primary_Selling_Style_ID", "a_SuperPDP_Program_ID"];
    for (var m in DSGAttributes) {
        CopyAttributeValues(node, DSGAttributes[m]);
    }
  //  node.getValue("a_IsInheritanceBroken").setSimpleValue(null);
}

if (ObjectType == "SimilarStyleGroup") {
    manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        USName = currentContextNode.getName();
        References = getReferences(currentContextNode, rt_styles);
        if (References.length > 0) {
        	 currentContextNode.getValue("a_SuperPDP_Market").deleteCurrent();
        	      currentContextNode.getValue("a_SuperPDP_Market").addValue("US");
                currentContextNode.getValue("a_SuperPDP_Market").addValue("CAN");
            /*var superPDPMarkets = node.getValue("a_SuperPDP_Market").getSimpleValue();
            if (superPDPMarkets != null && !superPDPMarkets.contains("US")) {
                //node.getvalue("a_SuperPDP_Market").addValue("US");
                currentContextNode.getValue("a_SuperPDP_Market").addValue("US");
                currentContextNode.getValue("a_SuperPDP_Market").addValue("CAN");
            }*/
        }
    });

    manager.executeInContext("EN_CA", function(currentContextManager) {
    		var CANode = currentContextManager.getProductHome().getProductByID(node.getID());
    		CANode.setName(USName);
    		removeReferences(CANode, rt_styles);
    		 CANode.getValue("a_SuperPDP_Market").deleteCurrent();
        	      CANode.getValue("a_SuperPDP_Market").addValue("US");
                CANode.getValue("a_SuperPDP_Market").addValue("CAN");
   		 });

   		 
    //log.info("References=" + References);
    var context = ["EN_CA", "FR_CA"];
    for (var j in context) {
        addReferences(node, context[j], rt_styles, References);
    }
    for (var i in References) {
        var Ref = References[i].getTarget();
        var Attributes = ["a_Primary_Selling_Style_ID", "a_Primary_Selling_Style", "a_SuperPDP_Program_ID", "a_Supporting_Styles"];
        for (var k in Attributes) {
            CopyAttributeValues(Ref, Attributes[k]);
        }
    }
    var SSGAttributes = ["a_Primary_Selling_Style_ID", "a_SuperPDP_Program_ID"];
    for (var m in SSGAttributes) {
        CopyAttributeValues(node, SSGAttributes[m]);
    }
    //node.getValue("a_IsInheritanceBroken").setSimpleValue(null);
}



function getReferences(node, RefType) {
    var References = node.getReferences(RefType).toArray();
    return References;
}

function removeReferences(node, RefType) {
var References = node.getReferences(RefType).toArray();
	for (var i in References) {
    	 var refToDelete = References[i];
        refToDelete.delete();
       }
     }
     
function addReferences(node, context, RefType, References) {
    manager.executeInContext(context, function(currentContextManager) {
        //log.info("context=" + context);
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        for (var i in References) {
            var metadata = References[i].getValue("a_Primary_Selling_Style").getSimpleValue();
            var Ref = References[i].getTarget();
            //log.info("Ref=" + Ref);
            var StyleMKTDesg = Ref.getValue("a_Style_Market_Designation").getSimpleValue();
            if(StyleMKTDesg.contains("CAN")){
            try {
                var newRef = currentContextNode.createReference(Ref, RefType);
                if (metadata != null) {
                    newRef.getValue("a_Primary_Selling_Style").setSimpleValue(metadata);
                }
                var superPDPMarkets = currentContextNode.getvalue("a_SuperPDP_Market").getSimpleValue();
                if (superPDPMarkets != null && !superPDPMarkets.contains("CAN")) {
                    currentContextNode.getvalue("a_SuperPDP_Market").addValue("CAN");
                }
            } catch (e) {
                if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                    logger.info("Link already Exists");
                }
            }
            }
        }
    });
}

function CopyAttributeValues(node, attributeID) {
    //log.info("attributeID="+attributeID);
    var AttributeValue;
    manager.executeInContext("EN_US", function(currentContextManager) {
        var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
        //log.info("ID="+node.getID());
        AttributeValue = currentContextNode.getValue(attributeID).getSimpleValue();
        //log.info("AttributeValue="+AttributeValue);
        if (AttributeValue != null) {
            var context = ["EN_CA", "FR_CA"];
            for (var j in context) {
                manager.executeInContext(context[j], function(currentContextManager) {
                    //log.info("context="+context[j]);
                    var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
                    currentContextNode.getValue(attributeID).setSimpleValue(AttributeValue);
                });
            }
        }
    });
}
}