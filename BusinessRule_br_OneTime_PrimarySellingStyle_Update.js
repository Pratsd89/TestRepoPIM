/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_OneTime_PrimarySellingStyle_Update",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "br_OneTime_PrimarySellingStyle_Update",
  "description" : "Runs behind \"Save Duplicate Style Group\" button on the screen with ID “DuplicateStyleGroup_Details_Screen”",
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
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
    "alias" : "productGroupReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,productGroupReference) {

//CAN
 /*var context = step.getCurrentContext().getID();
var groupNode = step.executeInContext('EN_CA', function (cmmanager) {
               return cmmanager.getObjectFromOtherManager(node);
            });


  step.executeInContext("EN_CA", function (caContextManager) {
  	  
  	 
  	// var groupNode = caContextManager.getProductHome().getProductByID(node);
  	 log.info(groupNode);
  	 var referencedStyles = groupNode.getReferences(productGroupReference).toArray();
  	 for (var i = 0; i < referencedStyles.length; i++) {
  	 	 var primaryRefValue = referencedStyles[i].getValue("a_Primary_Selling_Style").getSimpleValue();
  	 	 if (primaryRefValue != null) {
  	 	 	  referencedStyles[i].getValue("zz_Primary_Selling_Style").setSimpleValue(primaryRefValue);
  	 	 }
  	 	 }
  	 	
  	 
  	});*/


//US
   /*var referencedStyles = node.getReferences(productGroupReference).toArray();
   

   for (var i = 0; i < referencedStyles.length; i++) {
      var currentStyle = referencedStyles[i].getTarget();
      var primaryRefValue = referencedStyles[i].getValue("a_Primary_Selling_Style").getSimpleValue();
    
     if (primaryRefValue != null) {
         referencedStyles[i].getValue("zz_Primary_Selling_Style").setSimpleValue(primaryRefValue);


          //  step.executeInContext("EN_CA", function (caContextManager) {
            //   var caNode = caContextManager.getProductHome().getProductByID(referencedStyles[i]);
             // caNode.getValue("a_Primary_Selling_Style").setSimpleValue("No");
           // });
        
      }
   }*/

/* var referencedStyles = node.getReferences(productGroupReference).toArray();
   

   for (var i = 0; i < referencedStyles.length; i++) {
      var currentStyle = referencedStyles[i].getTarget();
      var primaryRefValue = referencedStyles[i].getValue("zz_Primary_Selling_Style").getSimpleValue();
    
     if (primaryRefValue != null) {
         referencedStyles[i].getValue("zz_Primary_Selling_Style").setSimpleValue(null);


          //  step.executeInContext("EN_CA", function (caContextManager) {
            //   var caNode = caContextManager.getProductHome().getProductByID(referencedStyles[i]);
             // caNode.getValue("a_Primary_Selling_Style").setSimpleValue("No");
           // });
        
      }
   }*/

   
var groupNode = step.executeInContext('EN_CA', function (cmmanager) {
               return cmmanager.getObjectFromOtherManager(node);
            });


  step.executeInContext("EN_CA", function (caContextManager) {
  	  
  	 
  	// var groupNode = caContextManager.getProductHome().getProductByID(node);
  	 log.info(groupNode);
  	 var referencedStyles = groupNode.getReferences(productGroupReference).toArray();
  	 for (var i = 0; i < referencedStyles.length; i++) {
  	 	 var primaryRefValue = referencedStyles[i].getValue("zz_Primary_Selling_Style").getSimpleValue();
  	 	 if (primaryRefValue != null) {
  	 	 	  referencedStyles[i].getValue("zz_Primary_Selling_Style").setSimpleValue(null);
  	 	 }
  	 	 }
  	 	
  	 
  	});


   


}