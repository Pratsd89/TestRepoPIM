/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CMSGroupIntegrator",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "CMSGroup Integrator",
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
var cid = node.getValue('a_WebCategory_CID').getSimpleValue();
var webCategoryAssortmentType = node.getValue('a_WebCategory_Assortment_Type').getSimpleValue();
var brandNumber = node.getValue('a_Brand_Number').getSimpleValue();
var channelNumber = node.getValue('a_Channel_Number').getSimpleValue();
var webCategoryProductType = node.getValue('a_WebCategory_Product_Type').getSimpleValue();
var inherit_CAN_option = node.getValue('a_Content_Group_Can_InheritOption').getSimpleValue();
var inheritToCA = 'No';
var isContentGroup = false;
var objectType = node.getObjectType().getName().toString().replace(" ", "");
if(objectType =="ContentGroup"){
	isContentGroup =true;
}

if (inherit_CAN_option != null) {
	inheritToCA = 'Yes';
}

var inheritToJP = 'No';

var context = step.getCurrentContext().getID();
var market = LKT.getLookupTableValue("LKT_Context_to_Market", context);
// Start to Fetch user privileges for generating the read-only parameter 
	var readyOnly = false;
	var currentUser = step.getCurrentUser();
	var userGroups = new java.util.ArrayList();
    userGroups.addAll(currentUser.getGroups());
    for (var usrGrpIndex = 0; usrGrpIndex < userGroups.size(); usrGrpIndex++) {
        var group = userGroups.get(usrGrpIndex); 
        if (group.getID() == "Stibo-PIM-Read-Only-Security-Group") {
            readyOnly = true;
            break;
        }
    }
// End for generating the read-only parameter 

if (cid == null || brandNumber == null || channelNumber == null || market == null) {
	//throw new Error("Please fill all the Mandatory values :: Category ID, Brand Number, Channel Number and Market to view the products.")
}

var Url = "https://pim-ui.aks.stage.azeus.gaptech.com/product-table/" + brandNumber + "-" + market + "-" + channelNumber + "/" + cid + "/" + webCategoryAssortmentType + "/" + webCategoryProductType + "?is-content-group="+isContentGroup+"&inherit-to-ca=" + inheritToCA + "&inherit-to-jp=" + inheritToJP+"&readOnlyUser="+readyOnly;

return "<html><iframe id=\"approve\" width=\"1400\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"" + Url + "\"></iframe></html>"
}