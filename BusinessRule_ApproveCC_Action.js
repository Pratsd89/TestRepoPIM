/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ApproveCC_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Approve CC",
  "description" : "Business Rule To Approve CC",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
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
exports.operation0 = function (portal,log,node,stepManager,LKT,compCheck) {
if(stepManager.getCurrentWorkspace().getID()== "Main")
{
//NonMerch Validation to ignore Search color
var nonMerchType = node.getParent().getValue("a_product_merch_type").getSimpleValue();
var nonMerch = true;
if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){
	nonMerch = false;
	}

var flag =0;
var flag_SKU =0;
var imageCheck  = compCheck.checkCCAssetCompleteness(node, stepManager);
var nameColorCheck = compCheck.checkCCNameAndColor(node, stepManager, LKT);
var skuCheck = compCheck.checkSKUDimensionForCC(node, stepManager);

if (imageCheck != true) {
	portal.showAlert("ERROR", "Business Condition ApproveCC failed", imageCheck); 
}
else if(nameColorCheck != true) {
	portal.showAlert("ERROR", "Business Condition ApproveCC failed", nameColorCheck); 

}
else if(skuCheck != true) {	
	portal.showAlert("ERROR", "Business Condition ApproveCC failed", skuCheck); 
}
else if (imageCheck == true && nameColorCheck ==true && skuCheck ==true)
{
	flag=1;
}
if (flag ==1)
{
		//reference approve
		 var shotRequestReferences = node.getReferences(stepManager.getReferenceTypeHome().getReferenceTypeByID("CCToPhotoShotRef")).toArray();
	if(shotRequestReferences.length != 0 ){
	    for(var i=0;i<shotRequestReferences.length; i++ ){
	        var shotRequest = shotRequestReferences[i].getTarget();
	        shotRequest.approve();
	        var externalAssetReferences = shotRequest.getReferences(stepManager.getReferenceTypeHome().getReferenceTypeByID("ShotRequestToExternalAsset")).toArray();        
	         if(externalAssetReferences.length != 0 ){
	                for(var n = 0 ; n<externalAssetReferences.length;n++){
	                   var externalasset=externalAssetReferences[n].getTarget();
	                   log.info(externalasset);
	                   externalasset.approve();
	                    }
	                    }
	                    
	        }
	        }
	    //child check
	/*var skuList = node.getChildren();
		if( skuList.size() == 0)
{
	return("No child SKU found");
}
for(var j=0;j<skuList.size();j++)
{
	var sku=skuList.get(j);
	if(sku.isInState("wf_NewSKUEnrichment","NewSKUEnrich2"))
	{
		sku.getTaskByID("wf_NewSKUEnrichment").triggerByID("Submit", "Approving SKU");
	}
}*/
if(node.isInWorkflow("wf_StyleMaintenanceWorkflow"))
	{
//workflow
	if(node.isInState("wf_StyleMaintenanceWorkflow","CCMaintenance")) 
	{
	    var wf = node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
	    log.info(wf);
	    wf.getTaskByID("CCMaintenance").triggerByID("ApproveCC", "Approving CCs from Style Final Validation");
	    ////NonMerch Validation to ignore Search color
	    if(!nonMerch) {
	    	   /*logic removed as a part of PPIM-3472
	    	   var searchColor = node.getValue("a_Search_Color").getSimpleValue(); */
			 var searchColor = node.getValue("a_Search_Color_Calc").getSimpleValue();
			//https://gapinc.atlassian.net/browse/PPIM-12807 
			var objBrand = node.getValue("a_Brand_Number").getSimpleValue();
		    if( (searchColor == null || searchColor == '' ) && objBrand !='GPS' )
		    {
		    	portal.showAlert("ERROR", "Business Condition ApproveCC failed " + node.getID(), skuCheck); 
		    		return "CC Search Color is missing, Please update it using CC Search Override Color (or) Color Palette Search Color";
		    }
	    }
	    
	    
		    node.approve();
		    return true;
		    return("Approved Successfully");

    //flag_SKU=1;

        //approve reference

  
	        //approval end
	// return true;
     // return("Approved Successfully");       
    	 }	 
  }
else
{
	portal.showAlert("ERROR", "", "The CC " + node.getID() + " is not in workflow, Please click on the Save button to put the CC in Maintenance Workflow "); 

}
}	

/*if(flag_SKU==1)
{
var skuList = node.getChildren();
if( skuList.size() == 0)
{
	return("No child SKU found");
}
for(var j=0;j<skuList.size();j++)
{
	var sku=skuList.get(j);
	if(sku.isInState("wf_NewSKUEnrichment","NewSKUEnrich2"))
	{
		sku.getTaskByID("wf_NewSKUEnrichment").triggerByID("Submit", "Approving SKU");
	}
}
}*/
}	
else if(stepManager.getCurrentWorkspace().getID()== "Approved")	
{
	portal.showAlert("ERROR", "", "Modifications not allowed in Approved workspace. Please switch to Main workspace."); 
	//return "Modifications not allowed in Approved workspace. Please switch to Main workspace.";			
}

}