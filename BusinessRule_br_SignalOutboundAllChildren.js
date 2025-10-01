/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SignalOutboundAllChildren",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Signal Outbound All Children",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "styleNode",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepMan",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (styleNode,logger,stepMan) {
if(styleNode.getObjectType().getID() == "Style"){
	var myCCs = styleNode.getChildren();
	for(var x=0; x < myCCs.size(); x++) {
		setUpdateCC(myCCs.get(x));
		var mySkus = myCCs.get(x).getChildren();
		for(var t=0; t < mySkus.size(); t++){
			setUpdateSku(mySkus.get(t));
		}
	}
} else if(styleNode.getObjectType().getID() == "CustomerChoice") {
	setUpdateCC(styleNode);
	var mySkus = styleNode.getChildren();
	for(var t=0; t < mySkus.size(); t++){
		setUpdateSku(mySkus.get(t));
	}
}

function setUpdateCC(childObj) {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	childObj.getValue('a_CC_MF_Maintainance_Last_Update_Date').setSimpleValue(iso.format(time));
	//logger.info("Set CC Update: " + childObj.getID());
}

function setUpdateSku(childObj) {
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	childObj.getValue('a_main_last_modified_date').setSimpleValue(iso.format(time));
	//logger.info("Set Sku Update: " + childObj.getID());
}
}