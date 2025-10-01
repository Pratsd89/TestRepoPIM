/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DimSizeCodeApproval",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "DimSizeCodeApproval",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log) {
if(step.getCurrentWorkspace().getID()== "Main")
{
var result = true;
var refs = new java.util.ArrayList();
var refsmc = new java.util.ArrayList();
var objType = node.getObjectType().getID();
if(objType == "SizeCode"){
	if(node.getParent().getApprovalStatus() == "Not in Approved workspace"){
		result = "Size Code can't be approved as parent Size Model is unapproved.";
		}
		else{
			node.approve();
			refsmc.addAll(node.getChildren());
			for(var m=0;m<refsmc.size();m++){
			refsmc.get(m).approve();
			}
			refs.addAll(node.getClassificationProductLinks());
			for(var i=0;i<refs.size();i++){
				//log.info(refs.get(i).getProduct().getID());
				if(refs.get(i).getProduct().getParent().getApprovalStatus() != "Not in Approved workspace"){
					refs.get(i).getProduct().approve();
					}
				}
			}
	}
	else if(objType == "Dim1" || objType == "Dim2"){
		if(node.getParent().getApprovalStatus() == "Not in Approved workspace"){
		result = objType+" can't be approved as parent Size Code is unapproved.";
		}
		else{
			//node.approve();
			node.getParent().approve();
			refsmc.addAll(node.getParent().getChildren());
			for(var m=0;m<refsmc.size();m++){
			refsmc.get(m).approve();
			}
			refs.addAll(node.getParent().getClassificationProductLinks());
			for(var i=0;i<refs.size();i++){
				//log.info(refs.get(i).getProduct().getID());
				if(refs.get(i).getProduct().getParent().getApprovalStatus() != "Not in Approved workspace"){
					refs.get(i).getProduct().approve();
					}
				}
			
			}
		
		}


return result;
}
}