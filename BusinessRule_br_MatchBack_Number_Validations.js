/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MatchBack_Number_Validations",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "MatchBack Number Validations",
  "description" : "Validate the matchback numbers",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "alias" : "brandNum",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Brand_Number",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,ccNum,brandNum,webUI) {
var currentContext = manager.getCurrentContext().getID();
var ccNumber = node.getValue("a_CC_Number").getSimpleValue();
var ccBrandNumber = node.getValue("a_Brand_Number").getSimpleValue();
var matchBackNumber = node.getValue("a_MatchBack_Number").getSimpleValue();
var oldMatchBackNumber  =node.getValue("a_Old_MatchBack_Number").getSimpleValue();
var matchBackCCs = new java.util.ArrayList();
var matchBackCCsList = new java.util.ArrayList();
var matchBackCCswithParent = new java.util.ArrayList();
var isParentIncluded = false;
matchBackCCswithParent.add(ccNumber);
var setOldMatchBackCCs = 0;
if (matchBackNumber != null) {
    matchbackCCs = matchBackNumber.split("\n");
    matchbackCCs.forEach(function(cc) {
	ccsFromSheet = cc.split(",");
     ccsFromSheet.forEach(function(ccFromSheet) {
          if (!matchBackCCsList.contains(ccFromSheet)) { 
                matchBackCCsList.add(ccFromSheet); 
            } 
     });
  });

    	 matchBackCCsList.forEach(function(cc) {
      if (ccNumber != cc) {
        matchBackCCswithParent.add(cc);
      } else {
        isParentIncluded = true;
      }
    	 });
    if (isParentIncluded == true) {
      //log.info("Please check the Matchback Number; it should not have the main CC Number in list");
      webUI.showAlert("ERROR", "Not a valid Studio Outfitting. Studio Outfitting Number entered has the main CC Number. <b>" + ccNumber + "</b>");
      node.getValue("a_MatchBack_Number").setSimpleValue(oldMatchBackNumber);
      setOldMatchBackCCs++;
    }
    if (matchBackCCsList.size() > 4) {
      //return "<b> " + ccNumber + " have more than 4 matchbacks provided. " + "Only 4 matchback CCs are allowed</b>";
      webUI.showAlert("ERROR", "Not a valid Studio Outfitting. Only 4 CCs are allowed in Studio Outfitting number" );
      node.getValue("a_MatchBack_Number").setSimpleValue(oldMatchBackNumber);
       setOldMatchBackCCs++;
    }
  }
  //log.info(matchBackCCswithParent);
  for (i = 0; i < matchBackCCswithParent.size(); i++) {
      var ccRes = manager.executeInContext(currentContext, function(manager) {
      var c = com.stibo.query.condition.Conditions;
      var qh = manager.getHome(com.stibo.query.home.QueryHome);
      var querySpecification =
          qh.queryFor(com.stibo.core.domain.Product).where(c.valueOf(ccNum).eq(matchBackCCswithParent.get(i))
                         .and(c.valueOf(brandNum).eq(ccBrandNumber))
                         .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice"), ), ), );
      var res = querySpecification.execute();
      if (res.asList(1).size() > 0) {
        return true;
      }
      else{
        //log.info("no such cc exist in stibo for the selected context"); //throw alert and reset
        webUI.showAlert("ERROR", "Please check Studio Outfitting Number entered; it's either invalid format or the CCs doesn't exist for the selected context: " + currentContext);
        node.getValue("a_MatchBack_Number").setSimpleValue(oldMatchBackNumber);
        setOldMatchBackCCs++;
      }
    });
  }
  if (setOldMatchBackCCs == 0){
 	 var matchBackCCToAdd = "";
 	 matchBackCCsList.forEach((value) => {
  	matchBackCCToAdd =  matchBackCCToAdd + value.toString() +","; 
 	 });
  	 node.getValue("a_MatchBack_Number").setSimpleValue(matchBackCCToAdd.substring(0, matchBackCCToAdd.length-1));
 	 node.getValue("a_Old_MatchBack_Number").setSimpleValue(matchBackCCToAdd.substring(0, matchBackCCToAdd.length-1));
  }

}