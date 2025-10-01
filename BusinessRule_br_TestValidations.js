/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TestValidations",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_TestValidations",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,webui) {


function (node,manager,isStyleHasReference)
{
var count = 0;
var rt_productGroups = manager.getProductHome().getProductByID("MultiVariant_Group_Reference");
var productGroupRef = node.queryReferencedBy(rt_productGroups).forEach(
	function (refernceInstance)
	{
		count+=1;
		return true;
	}
	);

if(count >=1)
{
	throw "Error: MultiVariant group already exists for this product";
}

}

//webui.showAlert("WARNING", "Primary Style provided is in Draft/Purged status in US market.");


var IsBothStyleUnderSameParent =  isBothStyleUnderSameParent("000141403","000908140",manager);
if(!IsBothStyleUnderSameParent)
{
	  throw "All selected Styles must be under same parent Class.";
}

function isBothStyleUnderSameParent(style1, style2,manager)
{
	var style1Obj = manager.getProductHome().getProductByID(style1);
	var style2Obj = manager.getProductHome().getProductByID(style2);
	var sytle1Parent = style1Obj.getParent().getID();
	var sytle2Parent = style2Obj.getParent().getID();
	if(sytle1Parent != sytle2Parent)
		{
		return false;
		}
	return true;
}


dateValidation("2025-01-01", "2024-01-10")

function dateValidation(startDate, endDate)
{
	 var Dateformatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	 var startDateformat = java.time.LocalDate.parse(startDate, Dateformatter);
      var endDateformat = java.time.LocalDate.parse(endDate, Dateformatter);
        if (startDateformat > endDateformat)
       {
       	 throw "Product Group End Date is later than Product Group Start Date.";
       	  
        }
                
}
var IsStyleinDraft =  isStyleinDraft("000141403");

function isStyleinDraft(primaryStyle)
{
	var primaryStyleObj = manager.getProductHome().getProductByID(primaryStyle);
	var primaryStyleStatus = primaryStyleObj.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
	
	if(primaryStyleStatus == "Draft")
	{
		return false;
	
	}
	return true;
}


}