/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Calculated_Values_CC_Delta",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Calculated Values CC Delta Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "shotReqRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,shotReqRef) {
function updateMarketDesigShotReq(product,contextID){
	manager.executeInContext(contextID,function(contextManager){
		var currentProduct = contextManager.getProductHome().getProductByID(product.getID());
		var marketDesignation = currentProduct.getValue("a_Market_Designation").getSimpleValue();
		if(marketDesignation != null){
			var desigValue = null;
			if(marketDesignation.contains("US") && marketDesignation.contains("CAN")){
				desigValue = "BOTH";
				}
			if(marketDesignation == "US"){
				desigValue = "US";		
			}
			if(marketDesignation == "CAN"){
				desigValue = "CAN";		
			}
		var shotReq = null;
		var refsc = new java.util.ArrayList();
		refsc.addAll(currentProduct.getReferences(shotReqRef));
		for (var k=0;k<refsc.size();k++){
			shotReq = refsc.get(k).getTarget();
			shotReq.getValue("a_Market_Designation_Shot_Request").setSimpleValue(desigValue);
			}
		}
		});

}
/////////////////////////Set Market Designation from ACL////////////////////////////
var usAclMarketdesig = null;
var caACLMarketDesig = null;
manager.executeInContext("EN_US",function(usstep) {
    var usProduct = usstep.getProductHome().getProductByID(node.getID());
    if(usProduct.getValue("a_ACL_Market_Designation").getSimpleValue() != null){
if(usProduct.getValue("a_ACL_Market_Designation").isInherited() == false){
usACLMarketDesig = usProduct.getValue('a_ACL_Market_Designation').getSimpleValue();
}
}
    
});

manager.executeInContext("EN_CA",function(castep) {
    var caProduct = castep.getProductHome().getProductByID(node.getID());
    if(caProduct.getValue("a_ACL_Market_Designation").getSimpleValue() != null){
if(caProduct.getValue("a_ACL_Market_Designation").isInherited() == false){
caACLMarketDesig = caProduct.getValue('a_ACL_Market_Designation').getSimpleValue();
}
}
    
});

if(caACLMarketDesig != null || usAclMarketdesig != null){
    if(caACLMarketDesig == null){
        node.getValue("a_Market_Designation").setSimpleValue(usAclMarketdesig);
    }
    else if(usAclMarketdesig == null){
        node.getValue("a_Market_Designation").setSimpleValue(caACLMarketDesig);
    }
    else{
        marketdesig=caACLMarketDesig+'<multisep/>'+usAclMarketdesig;
        node.getValue("a_Market_Designation").setSimpleValue(marketdesig);
    }
}

/////////////////////////
	
	var CC_ID = node.getID();
	var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	var now = java.time.ZonedDateTime.now().minusDays(30);
	var final_date = now.format(formatter);
		//log.info(final_date);
	var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
	
						//////// US Context //////////
	if(marketDesignation != null){
	if(marketDesignation.contains("US")){
	manager.executeInContext('EN_US',function(enContextManager) 
	      {
		var enCurrentProduct = enContextManager.getProductHome().getProductByID(CC_ID);
	/////New Color:
	var CC_Start_Date=enCurrentProduct.getValue("a_CC_Start_Date").getSimpleValue();
	//log.info(CC_Start_Date);
	if(CC_Start_Date != null)
	{
	
	     if(CC_Start_Date > final_date || CC_Start_Date == final_date)
	     {
	     	enCurrentProduct.getValue("a_New_Color").setSimpleValue("Yes");
		//log.info(enCurrentProduct.getValue("a_New_Color").getSimpleValue());
	     	
	     }
	     	
		else
			{
		enCurrentProduct.getValue("a_New_Color").setSimpleValue("No");
		//log.info(enCurrentProduct.getValue("a_New_Color").getSimpleValue());
			}
	}
	///CC Planned in DC Date
	var CC_Source_Date = enCurrentProduct.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
	var CC_Planned_Date = enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue();
	//log.info("plan" +CC_Planned_Date);
	//log.info("source" +CC_Source_Date);
	if(CC_Planned_Date == null && CC_Source_Date != null)
	{
		enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
		//log.info(enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue())
	}
	else if( CC_Source_Date != null && CC_Planned_Date != null)
	{
	
		if( CC_Source_Date < CC_Planned_Date)
			{
		enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
		//log.info("a_CC_Source_in_DC_Date " +enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue());
			}
	}
	///Style IN DC Date
	var parent_style = enCurrentProduct.getParent().getID();
	//log.info(parent_style);
	var enCurrentParentProduct = enContextManager.getProductHome().getProductByID(parent_style);
	var style_DC_Date = enCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue();
	//log.info("date" +  style_DC_Date);
	if(style_DC_Date == null && CC_Source_Date != null)
	{
		enCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
	}
	else if( CC_Source_Date != null && style_DC_Date != null)
		{
			if(CC_Source_Date < style_DC_Date)
				{
		enCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
		//log.info("Style overlap" +enCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue());
				}
		}
	/////a_Override_CC_Name
	var Override_CC_Name = enCurrentProduct.getValue("a_Override_CC_Name").getSimpleValue();
	if(Override_CC_Name == null)
	{
		enCurrentProduct.getValue("a_Override_CC_Name").setSimpleValue("No");
		//log.info("a_Override_CC_Name  " + enCurrentProduct.getValue("a_Override_CC_Name").getSimpleValue());
	}
	})
	}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
									////CA Context///
	if(marketDesignation != null){
	if(marketDesignation.contains("CAN")){
	manager.executeInContext('EN_CA',function(caContextManager) 
	      {
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(CC_ID);
	/////New Color:
	var CC_Start_Date=caCurrentProduct.getValue("a_CC_Start_Date").getSimpleValue();
	//log.info(CC_Start_Date);
	
	//log.info(CC_Start_Month);
	if(CC_Start_Date != null)
	{
		
	     if(CC_Start_Date > final_date || CC_Start_Date == final_date)
	     {
	     	caCurrentProduct.getValue("a_New_Color").setSimpleValue("Yes");
		//log.info(caCurrentProduct.getValue("a_New_Color").getSimpleValue());
	     	
	     }
	     	
		else
			{
		       caCurrentProduct.getValue("a_New_Color").setSimpleValue("No");
		//log.info(caCurrentProduct.getValue("a_New_Color").getSimpleValue());
			}
	}
	///CC Planned in DC Date
	var CC_Source_Date = caCurrentProduct.getValue("a_CC_Source_in_DC_Date").getSimpleValue();
	var CC_Planned_Date = caCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue();
	if(CC_Planned_Date == null && CC_Source_Date != null)
	{
		caCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
	}
	else if( CC_Source_Date != null && CC_Planned_Date != null)
	{
		if( CC_Source_Date < CC_Planned_Date)
			{
		caCurrentProduct.getValue("a_CC_Planned_in_DC_Date").setSimpleValue(CC_Source_Date);
		//log.info("a_CC_Source_in_DC_Date " +enCurrentProduct.getValue("a_CC_Planned_in_DC_Date").getSimpleValue());
			}
	}
	///Style IN DC Date
	var parent_style = caCurrentProduct.getParent().getID();
	//log.info(parent_style);
	var caCurrentParentProduct = caContextManager.getProductHome().getProductByID(parent_style);
	var style_DC_Date = caCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue();
	//log.info("date" +  style_DC_Date);
	if(style_DC_Date == null && CC_Source_Date != null)
	{
		caCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
	}
	else if( CC_Source_Date != null && style_DC_Date != null)
		{
			if(CC_Source_Date < style_DC_Date)
			{
		caCurrentParentProduct.getValue("a_Style_IN_DC_Date").setSimpleValue(CC_Source_Date);
		//log.info("Style overlap" +caCurrentParentProduct.getValue("a_Style_IN_DC_Date").getSimpleValue());
			}
	}
	/////a_Override_CC_Name
	var Override_CC_Name = caCurrentProduct.getValue("a_Override_CC_Name").getSimpleValue();
	if(Override_CC_Name == null)
	{
		caCurrentProduct.getValue("a_Override_CC_Name").setSimpleValue("No");
		//log.info("a_Override_CC_Name  " + node.getValue("a_Override_CC_Name").getSimpleValue());
	}
	})
	}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Style Imported
	var style = node.getParent().getID();
	var CC_Country_Origin = node.getValue("a_CC_Country_of_Origin").getSimpleValue();
	if(CC_Country_Origin != null)
	{
		if( CC_Country_Origin == "US")
		{
			if(marketDesignation != null){
			if(marketDesignation.contains("US")){
			manager.executeInContext('EN_US',function(enContextManager) 
	      {	
			var enCurrentProduct = enContextManager.getProductHome().getProductByID(style);
	  		enCurrentProduct.getValue("a_Style_Imported").setSimpleValue("No");
	  	})
	  	}
	  	}
	  	if(marketDesignation != null){
	  	if(marketDesignation.contains("CAN")){
	  	manager.executeInContext('EN_CA',function(caContextManager)
	      {	
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(style);
		caCurrentProduct.getValue("a_Style_Imported").setSimpleValue("No");
	  	})
	  	}
	  	}
	 	}
	 	else
	 	{
	 		if(marketDesignation != null){
	 		if(marketDesignation.contains("US")){
	 		manager.executeInContext('EN_US',function(enContextManager) 
	      {	
			var enCurrentProduct = enContextManager.getProductHome().getProductByID(style);
	  		enCurrentProduct.getValue("a_Style_Imported").setSimpleValue("Yes");
	  	})
	  	}
	  	}
	  	if(marketDesignation != null){
	  	if(marketDesignation.contains("CAN")){
	  	manager.executeInContext('EN_CA',function(caContextManager) 
	      {	
		var caCurrentProduct = caContextManager.getProductHome().getProductByID(style);
		caCurrentProduct.getValue("a_Style_Imported").setSimpleValue("Yes");
	  	})
	  	}
	  	}
	 	}
	 }
	 /////////////////////////////////////////
	 //Populating a_Market_Designation_Shot_request for linked shot requests
	var objType = node.getObjectType().getID();
	if(objType == "CustomerChoice"){
	var marketDesignation = node.getValue("a_Market_Designation").getSimpleValue();
	if(marketDesignation != null){
	if(marketDesignation.contains("US")){
		updateMarketDesigShotReq(node,"EN_US");
		}
	if(marketDesignation.contains("CAN")){
		updateMarketDesigShotReq(node,"EN_CA");
		}
		}
	}

}