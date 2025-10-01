/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PPIM-14753Test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Create Restriction CC Style Ref",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
  "allObjectTypesValid" : true,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Restriction_Product_Ref",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "list",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_CC_List</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">Product List</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccNum",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "styleNum",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Style_Number",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType,logger,list,webui,ccNum,styleNum) {
if (list == null) {
   webui.showAlert("Error", "Please provide atleast one CC Number and try again.");
} else {
   var listArray = [];
   listArray = list.split(",");
   listArray.forEach(function (li) {
      var actualList = li.split("\n")
      actualList.forEach(function (ac) {
         var ccORStyle = ac

         if ((ccORStyle.length == 9) || (ccORStyle == 10)) {

            var c = com.stibo.query.condition.Conditions;
            var qh = step.getHome(com.stibo.query.home.QueryHome);
            var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
               c.valueOf(ccNum).eq(ccORStyle)
               .and(c.objectType(step.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
            );
            var res = querySpecification.execute();
            // if search returns something, just get the first CC. a_CC_Number is a unique value so should only get one record in result.
            var cc = null;
            res.forEach(function (object) {
               cc = object;

               productReff(cc);

               return true;
            });

         } else {
            var c = com.stibo.query.condition.Conditions;
            var qh = step.getHome(com.stibo.query.home.QueryHome);
            var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
               c.valueOf(styleNum).eq(ccORStyle)
               .and(c.objectType(step.getObjectTypeHome().getObjectTypeByID("Style")))
            );
            var res = querySpecification.execute();
            // if search returns something, just get the first CC. a_CC_Number is a unique value so should only get one record in result.
            var style = null;
            res.forEach(function (object) {
               style = object;
               productReff(style);

               return true;
            });
         }


      });

   });
}

function productReff(obj) {
   var objID = obj.getID();
   var ccNode = step.getProductHome().getProductByID(objID);
   webui.showAlert("Error", "node:::::." + node + "::::::::obj::" + ccNode + "))))))))))refType))))))))))" + refType + ")))))))" + objID);
   // webui.showAlert("WARNING", "ccAtZeroIndex "+ccAtZeroIndex+" , "+cc1);
   if (ccNode) {
      try {
         // webui.showAlert("Error", "node:::::."+node+"::::::::CCNODE::"+ccNode+"))))))))))refType))))))))))"+refType);
         ccNode.createReference(node, refType);
      } catch (e) {
         if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
            //log.info("Asset Link already exist for " + node.getID());
         }
      }
   }
}
}