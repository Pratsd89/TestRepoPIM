/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_smg_test_en_ca_data",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_GOF_SMG_Data_Fix_Canada_Context",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
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
// =======================================
// Context & Initialization; node here is "Product Group" Object
// =======================================
var context = step.getCurrentContext().getID();
logger.info ("Current Context ID is: " + context);

var updateMarker = false;
var canadaManager = null;
var found = false

var groupName = node.getValue("a_Product_Group_Name").getSimpleValue();
var groupStartDate = node.getValue("a_Product_Grouping_Start_date").getSimpleValue();
var groupEndDate = node.getValue("a_Product_Grouping_End_Date").getSimpleValue();
var createdMethod = node.getValue("a_Created_Method").getSimpleValue();

var targetContextID = "EN_CA";
 step.executeInContext(targetContextID, function (contextManager) {
 canadaManager = contextManager;
 });

// ===============================
// Node Values; "smg" stands for Style Merge Group
// ===============================

var smgID = node.getID();
//logger.info ("smg ID is: " + smgID);
var smgPrimaryStyle = node.getValue("a_Primary_Product").getSimpleValue();
//logger.info ("smg's Primary Product ID is: " + smgPrimaryStyle);
var smgMarket = node.getValue("a_SuperPDP_Market").getSimpleValue();
//logger.info ("SMG Market Value is: " + smgMarket);

// =====================================================================
// References; utilizing "Product Groups Reference"  ref type to analyze associated Styles refered  to the node
// ======================================================================
var refType = step.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
var smgRefs = node.getReferences(refType);
logger.info ("SMG Ref Size is: " + smgRefs.size()); 

// ======================
// Helper Functions
// ======================

/**
 * Updates product group attributes in the Canada context.
 */
function updateCanadaProductGroup(PG_CAN, styleMarket, styleID) {
  PG_CAN.getValue("a_Product_Group_Name").setSimpleValue(groupName);
  PG_CAN.getValue("a_Product_Grouping_Start_date").setSimpleValue(groupStartDate);
  PG_CAN.getValue("a_Product_Grouping_End_Date").setSimpleValue(groupEndDate);
  PG_CAN.getValue("a_Created_Method").setSimpleValue(createdMethod);
  PG_CAN.getValue("a_SuperPDP_Market").setSimpleValue(styleMarket);
  PG_CAN.getValue("a_Primary_Selling_Style_ID").setSimpleValue(styleID);
}

for (var i = 0; i < smgRefs.size(); i++) {
	
var style = smgRefs.get(i).getTarget();
var styleID = style.getID();
var style_ca_cxt = canadaManager.getObjectFromOtherManager(style);
var styleLifeCycle = style.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
var styleLifeCycle_ca = style_ca_cxt.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
logger.info ("Style LifeCycle in CA Context is: " + styleLifeCycle_ca+" where Style is : "+styleID);
				
if (style.getObjectType().getID() != "Style") continue;
                
var legacyStyleNumber = style.getValue("a_Style_Number").getSimpleValue();
//logger.info ("Style Legacy Number is: " +legacyStyleNumber);
var styleMarket = style.getValue("a_Style_Market_Designation").getSimpleValue();
//logger.info ("Style Market is: " +styleMarket);

// ==========================Main Loop==========================================
/**
 * Checking existing Primary Style is having both US & CANADA as Market Designation
 */
 
 if(smgPrimaryStyle == legacyStyleNumber && styleLifeCycle == "Approved" && styleLifeCycle_ca == "Approved" )  {
				node.getValue("a_SuperPDP_Market").setSimpleValue(styleMarket);
				//node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(styleID);
                 var PG_CAN = canadaManager.getObjectFromOtherManager(node);
				 var referencedStyles = node.getReferences(productGroupReference).toArray();		
			for(var j = 0; j < referencedStyles.length; j++) {
/**
 * Updates product group references to set the correct primary style.
 */
				 var currentStyle = referencedStyles[j].getTarget();
				 var referenceCAN = PG_CAN.createReference(currentStyle, productGroupReference);
				 var currentStyleID = currentStyle.getID();
                 var primaryRefValue = referencedStyles[j].getValue("a_Primary_Selling_Style").getSimpleValue();
				if(styleID != currentStyleID) {
					referencedStyles[j].getValue("a_Primary_Selling_Style").setSimpleValue("No");
					referenceCAN.getValue("a_Primary_Selling_Style").setSimpleValue("No");
				} else {
					referencedStyles[j].getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
					referenceCAN.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
				}
		}
/**
 * Updates product group attributes in the Canada context.
 */				
     updateCanadaProductGroup(PG_CAN, styleMarket, styleID);
	 found = "True";
	 updateMarker = "True";
	logger.info ("Update Happened in 1st Block");
   }
}
/**
 * If Primary Style not having both US & CANADA as market designation & Lifecycle Status is not Approved in both Context, Searching for "Best Style" as Primary Style in Current node/SMG/Product Group
 */

if(!found) {
			for (var n = 0; n < smgRefs.size(); n++) {
				
var style = smgRefs.get(n).getTarget();
var styleID = style.getID();
var style_ca_cxt = canadaManager.getObjectFromOtherManager(style);
var styleLifeCycle = style.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
var styleLifeCycle_ca = style_ca_cxt.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
logger.info ("Style LifeCycle in CA Context is: " + styleLifeCycle_ca+" where Style is : "+styleID);	

var styleMarket = style.getValue("a_Style_Market_Designation").getSimpleValue();
var legacyStyleNumber = style.getValue("a_Style_Number").getSimpleValue();

if(styleLifeCycle == "Approved" && styleLifeCycle_ca == "Approved" )  {
				   node.getValue("a_SuperPDP_Market").setSimpleValue(styleMarket);
					node.getValue("a_Primary_Selling_Style_ID").setSimpleValue(styleID);
					var PG_CAN = canadaManager.getObjectFromOtherManager(node);
					var referencedStyles = node.getReferences(productGroupReference).toArray();
					
					 for(var j = 0; j < referencedStyles.length; j++) {
						   var currentStyle = referencedStyles[j].getTarget();
						   var referenceCAN = PG_CAN.createReference(currentStyle, productGroupReference);
						   var currentStyleID = currentStyle.getID();
                           var primaryRefValue = referencedStyles[j].getValue("a_Primary_Selling_Style").getSimpleValue();
						   if(styleID != currentStyleID) {
							   referencedStyles[j].getValue("a_Primary_Selling_Style").setSimpleValue("No");
							   referenceCAN.getValue("a_Primary_Selling_Style").setSimpleValue("No");
						   } else {
							   referencedStyles[j].getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
							   referenceCAN.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
						   }
					 }
					 /**
 * Updates product group attributes in the Canada context.
 */
		updateCanadaProductGroup(PG_CAN, styleMarket, styleID);
		updateMarker = "True";
		logger.info ("Update Happened in 2nd Block");
          }
      if (updateMarker) break;
      }	
 }

// ======================
// Final Logging
// ======================
if (!updateMarker) {
     logger.info (smgID+" : This Style-Merge-Group from GOF has no Style associated which is having Market Designation available for both US & CANADA");
}
}