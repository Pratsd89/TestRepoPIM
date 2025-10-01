/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "AutoApproval_and_Publishing",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) AutoApproval_and_Publishing",
  "description" : "Deprecated",
  "scope" : "Global",
  "validObjectTypes" : [ "Brand", "CPBrand", "Class", "ColorPalette", "CustomerChoice", "CustomerServiceBusinessUnit", "CustomerServiceCategory", "CustomerServiceHome", "Department", "Dim1", "Dim2", "Division", "ExternalStoredDAMAsset", "NonProductBusinessUnit", "NonProductCategory", "ProductShotRequest", "SKU", "SeasonCode", "SeasonYear", "SizeCode", "SizeFacetCategory", "SizeFacetValue", "SizeModel", "Style", "SubClass", "WebBU", "WebCategory", "WebDivision", "WebSubCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var objectType = node.getObjectType().getID();
if(objectType == "SizeModel")
{
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
}
else if(objectType == "SizeCode")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "Dim1")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "Dim2")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "SizeFacetCategory")
{
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
}
else if(objectType == "SizeFacetValue")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "CPBrand")
{
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
}
else if(objectType == "SeasonYear")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "SeasonCode")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "ColorPalette")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "CustomerServiceBusinessUnit")
{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);
        	});
}
else if(objectType == "CustomerServiceHome")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);
        	});
	}
}
else if(objectType == "CustomerServiceCategory")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);
        	});
	}
}
else if(objectType == "NonProductBusinessUnit")
{
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
}
else if(objectType == "NonProductCategory")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);			
        	});
	}
}
else if(objectType == "WebBU")
{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);
        	});
}
else if(objectType == "WebDivision")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);
        	});
	}
}
else if(objectType == "WebCategory")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);
        	});
	}
}
else if(objectType == "WebSubCategory")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL.republish(frProduct);
        	});
	}
}
else if(objectType == "Brand")
{
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
}
else if(objectType == "Division")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "Department")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "Class")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "SubClass")
{
	if(node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
	}
}
else if(objectType == "CustomerChoice")
{	
	if(node.getValue("a_CC_Life_Cycle_Status").getSimpleValue() == "Approved" && node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL_CC.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL_CC.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL_CC.republish(frProduct);
        	});
	}
	if(node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow"))
	{
		if(node.isInState("wf_StyleMaintenanceWorkflow","CCMaintenance")) 
		{
			var nWF = node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
			var CCMaint = nWF.getTaskByID("CCMaintenance");
			CCMaint.triggerByID("ApproveCC","moved to Exit"); 
		}
	}	
}
else if(objectType == "SKU")
{	
	if(node.getValue("a_SKU_Life_Cycle_Status").getSimpleValue() == "Approved" && node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL_SKU.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL_SKU.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL_SKU.republish(frProduct);
        	});
	}
	if(node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow"))
	{
		if(node.isInState("wf_StyleMaintenanceWorkflow","SKUMaintenance")) 
		{
			var nWF = node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
			var SKUMaint = nWF.getTaskByID("SKUMaintenance");
			SKUMaint.triggerByID("ApproveSKU","moved to Exit");
		}
	}	
}
else if(objectType == "Style")
{	
	if(node.getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "Approved" && node.getParent().getApprovalStatus()!="Not in Approved workspace")
	{
		/*var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		node.getValue("a_main_last_modified_date").getSimpleValue();*/
		
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
			//enUS.republish(usProduct);
			//Removal of approved DGL Outbound
			//enUS_DGL_Style.republish(usProduct);
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
			//enCA.republish(caProduct);
			//Removal of approved DGL Outbound
			//enCA_DGL_Style.republish(caProduct);
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
			//frCA.republish(frProduct);
			//Removal of approved DGL Outbound
			//frCA_DGL_Style.republish(frProduct);
        	});
	}
	if(node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow"))
	{
		if(node.isInState("wf_StyleMaintenanceWorkflow","StyleMaintenance")) 
		{
			var nWF = node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow");
			var StyleMaint = nWF.getTaskByID("StyleMaintenance");
			StyleMaint.triggerByID("ApproveStyle","moved to Exit"); 
		}
	}	
}
else if(objectType == "ProductShotRequest")
{
	if(node.getValue("a_Shot_Request_Lifecycle_Status").getSimpleValue() == "Complete")
	{
		manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});   		
	}
}
else if(objectType == "ExternalStoredDAMAsset")
{
	manager.executeInContext('EN_US',function(enContextManager) {
            	var usProduct = enContextManager.getObjectFromOtherManager(node);
			usProduct.approve();
        	});
        manager.executeInContext('EN_CA',function(caContextManager) {
            	var caProduct = caContextManager.getObjectFromOtherManager(node);
			caProduct.approve();
        	});
        manager.executeInContext('FR_CA',function(frContextManager) {
           	var frProduct = frContextManager.getObjectFromOtherManager(node);
			frProduct.approve();
        	});
}
}