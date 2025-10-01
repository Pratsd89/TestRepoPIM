/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CustomerServiceCategory_Approval",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CustomerServiceCategory_Approval",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerServiceCategory", "CustomerServiceHome" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,LKT) {
//PPIM-6322 Correcting the logic from PPIM-2527, If The attribute "Inherit Category Attributes from US" is set to Yes, copy all attribute information set up in US market context into CA context's both EN_CA and FR_CA
var inheritValue = node.getValue("a_WebCategory_Inherit_US").getSimpleValue();

if (inheritValue == "Yes") {

  //Only copy attributes if the attribute "inherit attribute" is set to "Yes"
  stepManager.executeInContext("EN_US", function (cntxManager) {
    var cntxNode = cntxManager.getClassificationHome().getClassificationByID(node.getID());
    var type = cntxNode.getObjectType().getID();
    //get parent
    var parent = cntxNode.getParent();

    //get parent object type
    var parentType = parent.getObjectType().getID();

    if (type == "CustomerServiceCategory" || type == "CustomerServiceHome") {
      //then keep getting parent until type is CustomerServiceBusinessUnit
      while (parentType != "CustomerServiceBusinessUnit") {
        parent = parent.getParent();

        parentType = parent.getObjectType().getID();
      }

      //get a_Brand_Number
      var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
    } else {
      //else get Brand Number
      var brandNum = cntxNode.getValue("a_Brand_Number").getSimpleValue();
    }

    var attributeGroup = cntxManager.getAttributeGroupHome().getAttributeGroupByID("ag_CS_Market_Attributes");
    var attributes = attributeGroup.getAttributes().toArray();

    for (var i = 0; i < attributes.length; i++) {
      var attributeId = attributes[i].getID();




      var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);


      if (contexts.contains(";")) {

        //split on ";"
        contexts = contexts.split(";");

        //for each context

        contexts.forEach(function (ctx) {
          if (ctx != "EN_US") {
            var attributeValue = cntxNode.getValue(attributeId).getSimpleValue();
            log.info(ctx);
            stepManager.executeInContext(ctx, function (cntxManager) {
              var ctxNode = cntxManager.getClassificationHome().getClassificationByID(node.getID());

              ctxNode.getValue(attributeId).setSimpleValue(attributeValue);
            });
          }
        });
      }


    }

    var attributeGroup = cntxManager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Language_Dependent_ATTs");
    var attributes = attributeGroup.getAttributes().toArray();

    for (var i = 0; i < attributes.length; i++) {
      var attributeId = attributes[i].getID();

      var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Context", brandNum);


      if (contexts.contains(";")) {

        //split on ";"
        contexts = contexts.split(";");

        //for each context

        contexts.forEach(function (ctx) {
          if (ctx != "EN_US") {
            var attributeValue = cntxNode.getValue(attributeId).getSimpleValue();
            stepManager.executeInContext(ctx, function (cntxManager) {
              var ctxNode = cntxManager.getClassificationHome().getClassificationByID(node.getID());

              ctxNode.getValue(attributeId).setSimpleValue(attributeValue);
            });
          }
        });
      }


    }
  });
}
}