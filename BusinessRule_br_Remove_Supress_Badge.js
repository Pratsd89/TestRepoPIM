/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Remove_Supress_Badge",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Remove Supress Badge(s)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Badge" ],
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
    "contract" : "WebUiContextBind",
    "alias" : "webUi",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ref",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "WebCategoryToBadgeRef",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
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
    "contract" : "BusinessActionBindContract",
    "alias" : "setMaintLastUpdateDate",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_setMaintLastUpdateDate",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (webUi,ref,step,node,setMaintLastUpdateDate) {
function removeLink(context,badge) {
    step.executeInContext(context, function(manager) {
        var context_badge = manager.getObjectFromOtherManager(badge);
        categoryList = context_badge.queryReferencedBy(ref).asList(10);
        log.info("categoryList " + categoryList.size())
        if (categoryList.size() > 0) {
        	var cat = categoryList.get(0).getSource();
            categoryList.get(0).delete();
            setMaintLastUpdateDate.execute(cat);
        }

    });
  }

function checkIfLinkExists(context,badge) {
	exists=false;
    step.executeInContext(context, function(manager) {
        var context_badge = manager.getObjectFromOtherManager(badge);
        
        categoryList = context_badge.queryReferencedBy(ref).asList(10);
        log.info("size "+categoryList.size() +", ")
        log.info(categoryList.size()>0)
        if(categoryList.size()>0) exists=true;;
        });
        //log.info("heree")
        return exists;
  }

var selectedIter = webUi.getSelection().iterator();
var logArray = new Array();
var badges = new java.util.HashSet();
while (selectedIter.hasNext()) {
    var badge = selectedIter.next();
    var currentContext = step.getCurrentContext().getID();
    var CANInheritAttr = node.getValue("a_CAN_Inherit_Option");
    var CANInherit = CANInheritAttr ? CANInheritAttr.getSimpleValue() : null;

    if (currentContext == "EN_CA" && CANInherit != null && CANInherit != "") {
	   logArray.push(badge.getID());
        continue;
    }
    
    if(currentContext == "EN_US" && CANInherit !=null && CANInherit != "" ) {
    	removeLink("EN_US",badge)
    	removeLink("EN_CA",badge)   
    	badge.delete();
    }
    else if(currentContext == "EN_US" && (CANInherit ==null || CANInherit == "" )){
    	removeLink("EN_US",badge)
    	if(!checkIfLinkExists( "EN_CA",badge)) {  
    		badge.delete();    		
    	}         
    }
    else if (currentContext == "EN_CA"){    	
    	removeLink("EN_CA",badge)
    	if(!checkIfLinkExists( "EN_US",badge)) {  
    		badge.delete();    		
    	}  
    }
}
if (logArray.length > 0) {
    webUi.showAlert("WARNING", "The following Badges are inherited from US. Please switch to EN_US and delete them.", logArray.toString());
}
}