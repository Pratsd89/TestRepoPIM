/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "VMDDIntegrator",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "(DEP) VMDD Integrator",
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
  "pluginId" : "JavaScriptBusinessFunctionWithBinds",
  "binds" : [ {
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
  "pluginType" : "Operation",
  "functionReturnType" : "java.lang.String",
  "functionParameterBinds" : [ {
    "contract" : "NodeBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : ""
  } ]
}
*/
exports.operation0 = function (step,log,node) {
function getWebBU(category) {
	//get category object type
	var type = category.getObjectType().getID();

	//get parent
	var parent = category.getParent();

	//get parent object type
	var parentType = parent.getObjectType().getID();

	//if category object type is WebCategory || WebSubCategory || WebDivision
	if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
		//then keep getting parent until type is WebBU
		while (parentType.indexOf("BU")==-1) {
			parent = parent.getParent();
			log.info(parent)
			parentType = parent.getObjectType().getID();
		}
	}
	else {
		return category;
	}

	return parent;
}

var webBUNode = getWebBU(node);


var cid = node.getValue('a_WebCategory_CID').getSimpleValue();
var webCategoryAssortmentType = node.getValue('a_WebCategory_Assortment_Type').getSimpleValue();
var brandNumber=webBUNode.getValue('a_Brand_Number').getSimpleValue();
var channelNumber=webBUNode.getValue('a_Channel_Number').getSimpleValue();
var inheritFromUS=node.getValue('a_WebCategory_Inherit_US').getSimpleValue();
var context = step.getCurrentContext().getID();
	if(context == "EN_US")
	{
       var marketNumber="US";
     }
     else if(context == "EN_CA" || context == "FR_CA" )
	{
       var marketNumber="CAN";
     }
     else if(context == "EN_JP" || context == "JA_JP" )
	{
       var marketNumber="JPN";
     }
if(webBUNode.getObjectType().getID()=="WebHierarchyArchiveBU")
	return "Archived categories doesn't show the VMDD products"
if(cid==null || brandNumber==null || channelNumber==null || marketNumber==null)
	 throw new Error("Please fill all the Mandatory values :: Category ID, Brand Number, Channel Number and Market Number to view the products.")
//Url = "https://" + setHostName + "/browse/category.do?cid=" + CID + "&locale=" + setCurrentCtxForUrl;
var Url="https://pim-ui-dev.apps.cfcommerce.dev.azeus.gaptech.com/product-cards/"+brandNumber+"-"+marketNumber+"-"+channelNumber+"/"+cid+"/"+webCategoryAssortmentType + "?inherit-us-category=" + inheritFromUS;

log.info("Url:" + Url);

return "<html><iframe id=\"approve\" width=\"1400\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"" + Url + "\"></iframe></html>"
}