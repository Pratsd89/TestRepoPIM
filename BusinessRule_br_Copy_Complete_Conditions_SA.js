/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Copy_Complete_Conditions_SA",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Copy Complete Conditions SA",
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
var bomStyleCopyCompleted = false;

if (marketCode == null) {

    errorStr = "Style is not valid for any market. Please work with Product Foundation to ensure CC are created in Stibo for this Style";
}
else {
    if (inheritCopyOption != null) {
       if(inheritCopyOption.contains(currentMarket) == true && overviewBullet != null){
        	log.info("i am going to else if");
        	 bomStyleCopyCompleted =checkBOMStyleReferenceExists(node);
        	return bomStyleCopyCompleted;
        }   
        else if (inheritCopyOption.contains(currentMarket) == true) {
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

function checkBOMStyleReferenceExists(node){
var styleRefs = node.getReferences().asList();
	for (var i = 0; i < styleRefs.size(); i++) {
		if (styleRefs.get(i).getReferenceType().getID() == "rt_BOM_Style") {
			var bomStyle = styleRefs.get(i).getTarget();
			log.info(bomStyle);
			step.executeInContext("EN_US", function(enContextManager) {
				var enProduct = enContextManager.getProductHome().getProductByID(bomStyle.getID());
				var usCopyCompleteStatus = enProduct.getValue('a_Copy_Complete_Status').getSimpleValue();
				log.info(usCopyCompleteStatus);
				if (usCopyCompleteStatus == 'Complete' && enProduct.getValue('a_Overview_Bullet1').getSimpleValue()!=null) {
					bomStyleCopyCompleted=true;
					
				}

			});
			return bomStyleCopyCompleted;
		}
	}
	return false;
}


}