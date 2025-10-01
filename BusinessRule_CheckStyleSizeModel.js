/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CheckStyleSizeModel",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Check Style Size Model",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
//BR to check if size model will be triggered from US context
var result = true;
//PPIM-2940/1802 - Not required as US and CAN have seperate workflows.
/*var noAccesstoUS = false;
var userGroups = new java.util.ArrayList();
userGroups.addAll(step.getCurrentUser().getGroups());
for(var n=0;n<userGroups.size();n++){
	if(userGroups.get(n).getID() == "CA-PIM-MC-Security-Group"){
		noAccesstoUS = true;
		}
	}*/
//if (noAccesstoUS != true){
var currContext = step.getCurrentContext().getID();
if (currContext == "EN_US") {
    result = true;
} else {
    result = false;
}
if (result == true) {
    step.executeInContext('EN_US', function(usContextManager) {
        var usCurrentProduct = usContextManager.getProductHome().getProductByID(node.getID());
        var legCorpNum = usCurrentProduct.getValue("a_Legacy_Corp_Number").getSimpleValue();
        if (legCorpNum == null) {
        	 //Changes are done as a part of PPIM-10158
           var brandNum = node.getValue('a_Brand_Number').getSimpleValue();
           var webProductType = "";
           if (brandNum != null) {
            var brand_wpt= "a_" + brandNum + "_WebProductType";
            //PPIM-8575 - Product Type check added for Dropship Products
            webProductType = usCurrentProduct.getValue(brand_wpt).getSimpleValue();
           }
          
            if (webProductType == "Dropship") {
                result = true;
            } else {
                result = false;
            }
        }
        var sizeModel = usCurrentProduct.getValue("a_Source_Size_Model").getSimpleValue();
        if (sizeModel == null) {
            result = false;
        }
    });
    //}
}
if (result == true) {
    var lastModifiedUser = node.getRevision().getUserID();
    if (lastModifiedUser.toUpperCase() != "STIBOACLUSER") {
        result = false;
    }
}
return result;
}