/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ProductListIntegrator",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "ProductList Integrator",
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
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
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
exports.operation0 = function (step,log,LKT,node) {
function getWebBU(category) {
	//get category object type
	var type = category.getObjectType().getID();
	//get parent
	var parent = category.getParent();
	//get parent object type
	var parentType = parent.getObjectType().getID();

	//if category object type is WebCategory || WebSubCategory
	if (type == "WebCategory" || type == "WebSubCategory") {
		//then keep getting parent until type is WebBU
		while (parentType.indexOf("BU") == -1) {
			parent = parent.getParent();
			//log.info(parent)
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
var brandNumber = webBUNode.getValue('a_Brand_Number').getSimpleValue();
var channelNumber = webBUNode.getValue('a_Channel_Number').getSimpleValue();
var webCategoryProductType = node.getValue('a_WebCategory_Product_Type').getSimpleValue();
var inherit_CAN_option = node.getValue('a_CAN_Inherit_Option').getSimpleValue();
var inheritToCA = 'No';

if (inherit_CAN_option != null) {
	inheritToCA = 'Yes';
}
var inherit_JPN_option = node.getValue('a_JPN_Inherit_Option').getSimpleValue();
var inheritToJP = 'No';

if (inherit_JPN_option != null) {
	inheritToJP = 'Yes';
}
var context = step.getCurrentContext().getID();
var market = LKT.getLookupTableValue("LKT_Context_to_Market", context);
// Start to Fetch user privileges for generating the read-only parameter 
//PPIM-12829
	var readyOnly = false;
	var currentUser = step.getCurrentUser();
	//array list to add the user groups to which user is assigned 
	var userGroups = new java.util.ArrayList();
    userGroups.addAll(currentUser.getGroups());
    for (var usrGrpIndex = 0; usrGrpIndex < userGroups.size(); usrGrpIndex++) {
        var group = userGroups.get(usrGrpIndex); 
        if (group.getID() == "Stibo-PIM-Read-Only-Security-Group") {
            readyOnly = true;
            break;
        }
    }
	//log.info("User access is read only or not "+readyOnly);
// End for generating the read-only parameter 
if (webBUNode.getObjectType().getID() == "WebHierarchyArchiveBU") {
	return "Archived categories doesn't show the VMDD products"
}
if (cid == null || brandNumber == null || channelNumber == null || market == null) {
	throw new Error("Please fill all the Mandatory values :: Category ID, Brand Number, Channel Number and Market to view the products.")
}
//commented as part of PPIM-12829
//Url = "https://" + setHostName + "/browse/category.do?cid=" + CID + "&locale=" + setCurrentCtxForUrl;
//var Url = "https://pim-ui-stage.apps.cfcommerce.dev.azeus.gaptech.com/product-table/" + brandNumber + "-" + market + "-" + channelNumber + "/" + cid + "/" + webCategoryAssortmentType + "/" + webCategoryProductType + "?inherit-to-ca=" + inheritToCA + "&inherit-to-jp=" + inheritToJP;
//log.info ("Url Value for with out read only parameter    "+Url);
//Url = "https://" + setHostName + "/browse/category.do?cid=" + CID + "&locale=" + setCurrentCtxForUrl;
// added readyOnlyUser= parameter as per the story PPIM-12829
var Url = "https://pim-ui.aks.stage.azeus.gaptech.com/product-table/" + brandNumber + "-" + market + "-" + channelNumber + "/" + cid + "/" + webCategoryAssortmentType + "/" + webCategoryProductType + "?inherit-to-ca=" + inheritToCA + "&inherit-to-jp=" + inheritToJP+"&readOnlyUser="+readyOnly;
//log.info ("Url Value for with read only parameter    "+Url1);

//log.info("Url:" + Url);

return "<html><iframe id=\"approve\" width=\"1400\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"" + Url + "\"></iframe></html>"
}