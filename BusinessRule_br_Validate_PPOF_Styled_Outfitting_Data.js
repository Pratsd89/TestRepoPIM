/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Validate_PPOF_Styled_Outfitting_Data",
  "type" : "BusinessAction",
  "setupGroups" : [ "Conditions" ],
  "name" : "Validate PPOF Styled Outfitting Data",
  "description" : "PPIM-10973",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "alias" : "ccAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,node,log,ccAttr) {
var ccNumber = node.getValue("a_CC_Number").getSimpleValue();
log.info("ccNumber"+ccNumber);
var matchBackCCs=node.getValue("a_MatchBack_Number").getSimpleValue();
var currentContext=manager.getCurrentContext().getID();
var matchbackWithParent = new java.util.ArrayList();  
var availableCCs = new java.util.ArrayList();  
log.info(currentContext);
if (ccNumber != null) {
     matchbackWithParent.add(ccNumber);
     if (matchBackCCs != null)
	{
		log.info(matchBackCCs);
		matchbackCCsList = matchBackCCs.split(",");
		matchbackCCsList.forEach(function(cc) {
     	matchbackWithParent.add(cc);
        });
	 	log.info("matchbackWithParent"+matchbackWithParent);
		if (matchbackCCsList.length > 4)
		{
			return "<b ccNumber='color:red;'> have more than 4 match backs provided. Update the file and re-upload or update in the UI.</b>";
		}

	}
	for (i = 0; i < matchbackWithParent.size(); i++) {
		log.info("reached");
		var ccRes = manager.executeInContext(currentContext, function (manager) {
 		log.info("matchbackWithParent"+matchbackWithParent);
  		var c = com.stibo.query.condition.Conditions;
          var qh = manager.getHome(com.stibo.query.home.QueryHome);
          var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
                c.valueOf(ccAttr).eq(matchbackWithParent.get(i))
                    .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
            );
            var res = querySpecification.execute();
            if (res.asList(1).size() > 0){
            	 availableCCs.add( res.asList(1));
		  }
            log.info("availableCCs"+availableCCs); 
    });
}
  	   log.info(matchbackWithParent.size());
        log.info(availableCCs.size());
     if((matchbackWithParent.size()) != (availableCCs.size()))
     {
     	log.info("failed return error");
     	return "<b ccNumber='color:red;'> CC Number/MatchBack CC Numbers are not valid.</b>";
     }
}

}