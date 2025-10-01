/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_Validate_PPOF_Styled_Outfitting_Data",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Validate PPOF Styled Outfitting Data",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "utilLib"
  } ]
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "brandNum",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Brand_Number",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,ccAttr,log,brandNum,utilLib) {
var ccNumber = node.getValue("a_CC_Number").getSimpleValue();
var matchBackCCs = node.getValue("a_MatchBack_Number").getSimpleValue();
var ccBrandNumber = node.getValue("a_Brand_Number").getSimpleValue();
var currentContext = manager.getCurrentContext().getID();
var matchbackWithParent = new java.util.ArrayList();
var matchbackCCsList = new java.util.ArrayList();
var availableCCs = new java.util.ArrayList();
var isParentIncluded = false;
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var oldMatchBackCCs = node.getValue("a_Old_MatchBack_Number").getSimpleValue();
//If not delete 
if (ccNumber != null && matchBackCCs != null && !matchBackCCs.equalsIgnoreCase('DELETE')) {
  //split the ccs from matchback list and remove duplicate and store inside an arraylist
  matchbackWithParent.add(ccNumber);
  if (matchBackCCs != null) {
    matchbackCCsArr = matchBackCCs.split("\n");
    matchbackCCsArr.forEach(function(cc) {
     ccsFromSheet = cc.split(",");
     ccsFromSheet.forEach(function(ccFromSheet) {
          if (!matchbackCCsList.contains(ccFromSheet)) { 
                matchbackCCsList.add(ccFromSheet); 
            } 
     });

    });
    //if previous matchback list is not empty split the ccs from old matchback list and remove duplicates and store all ccs inside an arraylist
    if (oldMatchBackCCs != null ){
    	 	oldMatchBackCCsList = oldMatchBackCCs.split(","); 
    	 	var uniqueListOfCCs = new java.util.ArrayList();
   oldMatchBackCCsList.forEach(function(i) {
          if (!uniqueListOfCCs.contains(i)) { 
                uniqueListOfCCs.add(i); 
            } 
     });
     matchbackCCsList.forEach(function(j) {
          if (!uniqueListOfCCs.contains(j)) { 
                uniqueListOfCCs.add(j); 
            } 
     });
       //Check match back whole list is exceeded 4
    if (uniqueListOfCCs.size() > 4 ){
    	 return "<b> "+ccNumber+" have more than 4 Studio Outfittings provided. "
             + "Update the file and re-upload or update in the UI.</b>";
    	}
    }
    //Check CC number included in matchback list
    matchbackCCsList.forEach(function(cc) {
      if (ccNumber != cc) {
        matchbackWithParent.add(cc);
      } else {
        isParentIncluded = true;
      }
    });
    
    if (isParentIncluded == true) {
       return ("<b> "+ccNumber+" is included in Studio Outfitting CC number.</b>");
    }
     //Check match back  list is exceeded 4(only new ,no old data)
    if (matchbackCCsList.length > 4) {
      return "<b> "+ccNumber+" have more than 4 Studio Outfittings provided. "
             + "Update the file and re-upload or update in the UI.</b>";
    }
    //Check ccs are available in stibo
  for (i = 0; i < matchbackWithParent.size(); i++) {
      var ccRes = manager.executeInContext(currentContext, function(manager) {
      var c = com.stibo.query.condition.Conditions;
      var qh = manager.getHome(com.stibo.query.home.QueryHome);
      var querySpecification =
          qh.queryFor(com.stibo.core.domain.Product)
              .where(c.valueOf(ccAttr)
                         .eq(matchbackWithParent.get(i))
                         .and(c.valueOf(brandNum)
                         .eq(ccBrandNumber))
                         .and(c.objectType(
                                  manager.getObjectTypeHome().getObjectTypeByID(
                                      "CustomerChoice"), ), ), );
      var res = querySpecification.execute();
     res.forEach(function(node) {
	availableCCs.add(node);
	return false;
   });
      
 /*     if (res.asList(1).size() > 0) {
        availableCCs.add(res.asList(1));
      }*/
    });
  }
  //Return error if CCs are not available
  if (matchbackWithParent.size() != availableCCs.size()) {
     return ("<b> CC Number/Studio Outfitting CC Numbers are not "
            + "valid for '"
        + ccNumber + "'</b>");
  } else {
    return true;
  }
} else {
  return "<b> "+ ccNumber+" Does not exist for the context.</b>";
}
}

else if (ccNumber != null &&( matchBackCCs == null || matchBackCCs.equalsIgnoreCase('DELETE') ) ){
	node.getValue("a_MatchBack_Number").setSimpleValue("");
	node.getValue("a_Old_MatchBack_Number").setSimpleValue("");
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	return true;
}
else if(ccNumber == null && matchBackCCs != null) {
	return ("<b Please enter CC NUMBER.</b>");
}
else{
	// No action
	return true;
	//return "<b "+ ccNumber+" No Studio Outfitting present.</b>";
}

}