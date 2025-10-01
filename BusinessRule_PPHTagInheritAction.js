/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PPHTagInheritAction",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "PPHTagInheritAction",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "Department", "Division", "Style", "SubClass" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "global"
  }, {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "NODE",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "MANAGER",
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
exports.operation0 = function (NODE,MANAGER,LKT,global,helper) {
/**
 * PPIM- 6751
* This rule works as follow: 
* 	1.- Check if inherit us tags == yes
*	2.- Value of "a_Category_Tag_Inherit" should apply to all contexts
*		 It should apply no matter what context user is in
*/
if (MANAGER.getCurrentWorkspace().getID() == "Main"){
	
     var inheritUSTag = NODE.getValue("a_Inherit_US_Tags").getSimpleValue();
     var objectType = NODE.getObjectType().getID();

     // Check Inherit
     if(inheritUSTag != null && inheritUSTag.equalsIgnoreCase("Yes")){
	     var inclusionTagUS;	
	     var USNode;
	     var currentContext = MANAGER.getCurrentContext().getID();
	     if(!currentContext.equalsIgnoreCase("EN_US")){	
		     MANAGER.executeInContext("EN_US", function(oManager){
		        USNode = oManager.getProductHome().getProductByID(NODE.getID());  
		     });
	     }else{
		     USNode = NODE;
	     }
	     
	     // Get US inclusion tags
	     inclusionTagUS = USNode.getValue("a_Category_Tag_Inherit");

	     //Modified as part of PPIM-10462
	     if(objectType == "Style"){
	          var markets = NODE.getValue("a_Style_Market_Designation").getSimpleValue();	          
	          var marketsArray = [];
	          marketsArray = markets.split("<multisep/>");
	          for(var i=0; i< marketsArray.length;i++){
		          if(marketsArray[i]!= "US" && markets.contains("US")){
			          var ctx = LKT.getLookupTableValue("LKT_MarketDesignationToMarket", marketsArray[i]);			          
			          MANAGER.executeInContext(ctx,function(tManager){
		                  var tNode = tManager.getProductHome().getProductByID(NODE.getID());		                  
		                  tNode.getValue("a_Category_Tag_Inherit").setSimpleValue(inclusionTagUS.getSimpleValue());		                  
	                    });	
		          }
               }
          }
          else{
		     var brandNumber = NODE.getValue("a_Brand_Number").getSimpleValue();		     		    
		     var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);
			var contextsArray = [];
	          contextsArray = contexts.split(";");
	          for(var i=0; i< contextsArray.length;i++){
		          if(contextsArray[i]!= "EN_US"){
			          var ctx = contextsArray[i];			          	          
			          MANAGER.executeInContext(ctx,function(tManager){
		                  var tNode = tManager.getProductHome().getProductByID(NODE.getID());		                  
		                  tNode.getValue("a_Category_Tag_Inherit").setSimpleValue(inclusionTagUS.getSimpleValue());		
	                    });
		          }
               }
          }
     }
}



}