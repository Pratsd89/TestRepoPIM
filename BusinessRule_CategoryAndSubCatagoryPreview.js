/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CategoryAndSubCatagoryPreview",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "CategoryAndSubCatagoryPreview",
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
function getBrandNumber(category) {
	//get category object type
	var type = category.getObjectType().getID();

	//get parent
	var parent = category.getParent();

	//get parent object type
	var parentType = parent.getObjectType().getID();

	//if category object type is WebCategory || WebSubCategory || WebDivision
	if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
		//then keep getting parent until type is WebBU
		while (parentType != "WebBU") {
			parent = parent.getParent();

			parentType = parent.getObjectType().getID();
		}

		//get a_Brand_Number
		var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
	}

	//else get Brand Number
	else {
		var brandNum = category.getValue("a_Brand_Number").getSimpleValue();
	}

	return brandNum;
}

var currentCtx = step.getCurrentContext().getID();
var setCurrentCtxForUrl;
var setHostName;
var CID;
var Url;
var jpHost;

//PPIM-9136

var brandNum = getBrandNumber(node);
var objectType= node.getObjectType().getID();
var HostName = LKT.getLookupTableValue("LKT_Brand_Number_to_Host_Name", brandNum);
var DomainName = LKT.getLookupTableValue("LKT_Context_to_Domain_Name", currentCtx);
var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Context", brandNum);
//PPIM-10108

if (currentCtx == "EN_JP" || currentCtx == "JA_JP") {
  showPreview = true;
  if (brandNum == "GAP")
  {
  	jpHost = "staging-sfcc.gap.co";
  }
  else if(brandNum == "BR")
  {
  	jpHost = "staging-sfcc.bananarepublic.gap.co";
  }
  setHostName = jpHost + DomainName;
  setCurrentCtxForUrl = currentCtx.toString();
  setCurrentCtxForUrl = setCurrentCtxForUrl.replace(setCurrentCtxForUrl.substring(0, 2),setCurrentCtxForUrl.substring(0, 2).toLowerCase());
} 
else if (contexts.contains(currentCtx)) {
	showPreview = true
	setHostName = HostName + DomainName;
	setCurrentCtxForUrl = currentCtx.toString();
	setCurrentCtxForUrl = setCurrentCtxForUrl.replace(setCurrentCtxForUrl.substring(0, 2), setCurrentCtxForUrl.substring(0, 2).toLowerCase());
}
else {
	showPreview = false
}

log.info("Locale:" + setCurrentCtxForUrl);


CID = node.getValue('a_WebCategory_CID').getSimpleValue();
if(objectType!='WebSubCategory'){
Url = "https://" + setHostName + "/browse/category.do?cid=" + CID + "&locale=" + setCurrentCtxForUrl;
}
else if (objectType=='WebSubCategory'){
	var parent = node.getParent();
	parentCID=parent.getValue('a_WebCategory_CID').getSimpleValue();
	Url = "https://" + setHostName + "/browse/category.do?cid=" + parentCID+ "&style="+CID+ "&locale=" + setCurrentCtxForUrl;
	}
log.info("Url:" + Url);
if (showPreview) {
	//return "<html><iframe id=\"approve\" width=\"930\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"https://"+setHostName+"/browse/category.do?cid="+CID+"&locale="+setCurrentCtxForUrl+"\"></iframe></html>"

	return "<html><iframe id=\"approve\" width=\"1400\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"" + Url + "\"></iframe></html>"
}
else {
	return "Brand is not applicable for the current context";
}

}