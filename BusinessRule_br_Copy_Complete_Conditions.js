/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Copy_Complete_Conditions",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Copy Complete Conditions",
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
exports.operation0 = function (node,step,LKT) {
var marketCode = node.getValue('a_Style_Market_Designation').getSimpleValue();
var inheritCopyOption = node.getValue('a_Inherit_US_Copy_Option').getSimpleValue();
var overviewBullet = node.getValue('a_Overview_Bullet1').getSimpleValue();
var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
var errorStr = null;

if (marketCode == null) {
    errorStr = "Style is not valid for any market. Please work with Product Foundation to ensure CC are created in Stibo for this Style";
}
else {
    if (inheritCopyOption != null) {
        if (currentMarket == 'SA' && inheritCopyOption.contains('SA') == true) {
            var bomStyleUS = getBOMStyleTarget();
            if (bomStyleUS != false) {
                step.executeInContext("EN_US", function (usManager) {
                    var BOMUS_Node = usManager.getProductHome().getProductByID(bomStyleUS.getID());
                    var BOMUS_OverviewBullet = BOMUS_Node.getValue('a_Overview_Bullet1').getSimpleValue();

                    if (BOMUS_OverviewBullet == null) {
                        errorStr = "Copy is set to inherit from BOM referenced US Style. Please provide an Overview Bullet 1 value in EN_US for BOM referenced US Style to proceed.";
                    }
                });
            }
            else if (marketCode.contains('US') == true) {
                step.executeInContext("EN_US", function (usManager) {
                    var usNode = usManager.getProductHome().getProductByID(node.getID());
                    var usOverviewBullet = usNode.getValue('a_Overview_Bullet1').getSimpleValue();
                    
                    if (usOverviewBullet == null) {
                        errorStr = "Copy is set to inherit from US Market. Please provide an Overview Bullet 1 value in EN_US to proceed.";
                    }
                });
            }
            else if (marketCode.contains('JPN') == true) {
                step.executeInContext("EN_JP", function (usManager) {
                    var jpnNode = usManager.getProductHome().getProductByID(node.getID());
                    var jpnOverviewBullet = jpnNode.getValue('a_Overview_Bullet1').getSimpleValue();

                    if (jpnOverviewBullet == null) {
                        errorStr = "Copy is set to inherit from JPN Market. Please provide an Overview Bullet 1 value in EN_JP to proceed.";
                    }
                });
            }
        }
        else if (inheritCopyOption.contains(currentMarket) == true && marketCode.contains('US') == true) {

            step.executeInContext("EN_US", function (usManager) {
                var usNode = usManager.getProductHome().getProductByID(node.getID());
                var usOverviewBullet = usNode.getValue('a_Overview_Bullet1').getSimpleValue();

                if (usOverviewBullet == null) {

                    errorStr = "Copy is set to inherit from US Market. Please provide an Overview Bullet 1 value in EN_US to proceed.";
                }
            });
        }
        else if (overviewBullet == null) {

            errorStr = "Please provide an Overview Bullet 1 value in " + currentContext + " to proceed.";
        }
    }
    else if (overviewBullet == null) {

        errorStr = "Please provide an Overview Bullet 1 value in " + currentContext + " to proceed.";
    }
}

if (errorStr != null) {

    errorStr = "New Style Enrichment Workflow - " + currentMarket + ": " + errorStr;

    node.getValue('a_error_message').setSimpleValue(errorStr);
    return errorStr;
}
else {

    return true;
}



function getBOMStyleTarget() {
    var styleRefs = node.getReferences().asList();
    for (var i = 0; i < styleRefs.size(); i++) {
        if (styleRefs.get(i).getReferenceType().getID() == "rt_BOM_Style") {
            var bomStyle = styleRefs.get(i).getTarget();
            return bomStyle;
        }
    }
    return false;
}
}