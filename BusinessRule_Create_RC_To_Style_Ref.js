/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Create_RC_To_Style_Ref",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "Create_RC_To_Style_Ref",
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "ccNumber",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_CC_List</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">CC List</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType,logger,ccNumber,webui) {
if (ccNumber == null) {
    webUI.showAlert("Error", "Please provide atleast one CC Number and try again.");
}
else {
    var ccList = [];
    ccList = ccNumber.split(",");
    ccList.forEach(function (ccs) {
        ccs = ccs.split("\n")
        ccs.forEach(function (cc) {
            cc1 = cc
            if (cc.length == 9) {
                cc1 = "000" + cc;
            } else if (cc.length == 10) {
                cc1 = "00" + cc;
            }
            var ccNode = step.getProductHome().getProductByID(cc1);
            // webui.showAlert("WARNING", "ccAtZeroIndex "+ccAtZeroIndex+" , "+cc1);
            if (ccNode) {
                try {
                    ccNode.createReference(node, refType);
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.reference.TargetAlreadyReferencedException) {
                        //log.info("Asset Link already exist for " + node.getID());
                    }
                }
            }

        });

    });
}
}