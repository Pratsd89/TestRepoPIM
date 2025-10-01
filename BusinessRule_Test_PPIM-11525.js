/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_PPIM-11525",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Test_PPIM-11525",
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
var referencedBy = node.getReferencedByProducts().toArray();

for(var i=0; i< referencedBy.length; i++){
    var referenceTypeID = referencedBy[i].getReferenceType().getID();

    if(referenceTypeID == "rt_mergeDuplicateStyles"){
    	log.info("Test")
        var currentReference = referencedBy[i];
        log.info(currentReference.getValue("a_Primary_Selling_Style").getSimpleValue())
        if(currentReference.getValue("a_Primary_Selling_Style").getSimpleValue() == "Yes"){
            var endDate = node.getValue("a_Style_End_Date").getSimpleValue();
            if(endDate != null) {
                node.getValue("a_Style_End_Date").setSimpleValue(null);
                node.getValue("a_Style_Deactivation_Reason").setSimpleValue(null);
                log.info("This Style is the Primary Style on a DuplicateStyleGroup and cannot be ended. You will need to delete the DuplicateStyleGroup in order to end this Style");
                return "This Style is the Primary Style on a DuplicateStyleGroup and cannot be ended. You will need to delete the DuplicateStyleGroup in order to end this Style";

            }
        }
    }
    else if(referenceTypeID == "rt_styles") {
    	log.info("Test")
        var currentReference = referencedBy[i];
        log.info(currentReference.getValue("a_Primary_Selling_Style").getSimpleValue())
        if(currentReference.getValue("a_Primary_Selling_Style").getSimpleValue() == "Yes"){
            var endDate = node.getValue("a_Style_End_Date").getSimpleValue();
            if(endDate != null) {
                node.getValue("a_Style_End_Date").setSimpleValue(null);
                node.getValue("a_Style_Deactivation_Reason").setSimpleValue(null);
                log.info("This Style is the Primary Style on a SimilarStyleGroup and cannot be ended. You will need to delete the SimilarStyleGroup in order to end this Style");
                return "This Style is the Primary Style on a SimilarStyleGroup and cannot be ended. You will need to delete the SimilarStyleGroup in order to end this Style";
    	
         }
      }
   }
   else{
   	return true;
   }
}
}