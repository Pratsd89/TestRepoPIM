/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MVGCreationfromMVGTempObj",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_MVGCreationfromMVGTempObj",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "MVGTempObject" ],
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
var creationDate = node.getValue("a_Stibo_Creation_Date").getSimpleValue();
//log.info("CreationDate="+creationDate);
var serverURL;
var bgpList = [];
var executionReport = [];
var fileList = new java.util.HashSet();
var PassedBGP = null;
var ProductsCreated = null;
var MVGGroupingObj = null;

var util = com.stibo.systemconfig.ConfigUtil;
var systemName = util.getProperty("System.Name");
//logger.info("systemName: " + systemName);

if (systemName == "gapinc-pim-dev") serverURL = "https://gapinc-pim-dev.mdm.stibosystems.com/";
else if (systemName == "gapinc-pim-stage") serverURL = "https://gapinc-pim-dev.mdm.stibosystems.com/";
else if (systemName == "gapinc-pim-prod") serverURL = "https://gapinc-pim-dev.mdm.stibosystems.com/";

var accountName = "REST";
var accountPassword = "REST";
var accNameAndPassword = new java.lang.String(accountName + ":" + accountPassword);
const secretKey = "Basic " + javax.xml.bind.DatatypeConverter.printBase64Binary(accNameAndPassword.getBytes());

var getInboundBGP = serverURL + "restapiv2/inbound-integration-endpoints/IIEP_MVGCreation/worker-processes?context=EN_US&workspace=Main";
restData = callStepRESTAPIstatus(getInboundBGP, secretKey, logger);
var bgpList = JSON.parse(restData);

for (var i in bgpList) {
    //log.info(bgpList[i]);
    var getBGPDetails = serverURL + "restapiv2/background-processes/" + bgpList[i].toString() + "?context=Context1&workspace=Main";
    var restDataBG = callStepRESTAPIstatus(getBGPDetails, secretKey, logger);
    var jsonTextBG = JSON.parse(restDataBG);
    var bgprocessStarted = jsonTextBG.started;
    //log.info("Started="+bgprocessStarted);
    var bgprocessEnded = jsonTextBG.ended;
    // log.info("Ended="+bgprocessEnded);
    var result = isCreationWithinBGPTiming(creationDate, bgprocessStarted, bgprocessEnded);
    //log.info(result);
    if (result) {
        node.getValue("a_BGP_ID").setSimpleValue(bgpList[i]);
        PassedBGP = bgpList[i];

        var BGPExecutionReport = serverURL + "restapiv2/background-processes/" + bgpList[i].toString() + "/execution-report?context=EN_US&workspace=Main";
        var ExecutionReport = callStepRESTAPIstatus(BGPExecutionReport, secretKey, logger);
        var ExecutionReportdata = JSON.parse(ExecutionReport);

        for (var p in ExecutionReportdata) {
            var logger = ExecutionReportdata[p].entryText.toString();

            var match = logger.match(/Imported\s+(\d+)\s+new products/);

            if (match && match[1]) {
                ProductsCreated = parseInt(match[1]);
                //log.info("New products found: " + ProductsCreated);
            }
        }
        break;
    }

}
if(PassedBGP!= null){
var styleID = node.getValue("a_MVGTemp_Style_ID").getSimpleValue();
if(styleID !=null){
var styleNumber = styleID.toString().padStart(9, '0');
//log.info(styleNumber);
}
var styleObj = manager.getProductHome().getProductByID(styleNumber);
if (styleObj != null) {
    var brand = styleObj.getValue("a_Brand_Number").getSimpleValue();
    var MVG_GroupID = brand + "_" + PassedBGP;
    MVGGroupingObj = manager.getProductHome().getProductByID(MVG_GroupID);
    if(MVGGroupingObj!= null){
    MVGGroupingObj.getValue("a_ProductsCreatedInBGP").setSimpleValue(ProductsCreated);
    }
    if (MVGGroupingObj != null) {
        node.setParent(MVGGroupingObj);
    } else {
        var MVGWorkareaBrand = manager.getProductHome().getProductByID("MVGTempBrand_" + brand);
        MVGGroupingObj = MVGWorkareaBrand.createProduct(MVG_GroupID, "MVGTempGrouping");
        MVGGroupingObj.getValue("a_ProductsCreatedInBGP").setSimpleValue(ProductsCreated);
        node.setParent(MVGGroupingObj);
    }
    var result = searchByAttributeValue(manager, "a_BGP_ID", PassedBGP);
    if (result == ProductsCreated) {
        //log.info(result);
        MVGGroupingObj.getValue("a_MVGTempGroupingStatus").setSimpleValue("Completed");
    } else {
        MVGGroupingObj.getValue("a_MVGTempGroupingStatus").setSimpleValue("Not Completed");
    }
} else {
    node.getValue("a_error_reason").setSimpleValue("Style Not Found");
}
}else {
	node.getValue("a_error_reason").setSimpleValue("BGP Not Found");
}



function callStepRESTAPIstatus(restURL, secretKey, logger) {
    try {
        var url = new java.net.URL(restURL);
        var connection = url.openConnection();
        connection.setRequestProperty("Authorization", secretKey);

        var bufferReader = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream()));
        var inputLine = "";
        var response = [];
        var result;

        while ((inputLine = bufferReader.readLine()) != null) {
            //logger.info(inputLine);
            result = inputLine;
            //var response = JSON.parse(inputLine);
        }

        //bufferReader.close();
        //logger.info(result);
        return result;

    } catch (ex) {
        if (ex.javaException instanceof java.io.IOException) {
            logger.warning(ex);
        } else {
            throw (ex);
        }
    }
}


function isCreationWithinBGPTiming(creationDate, bgprocessStarted, bgprocessEnded) {
    // Ensure CreationDate is ISO compliant before parsing
    var newCreationDate = new Date(creationDate.replace(' ', 'T') + "-07:00");
    var newStartDate = new Date(bgprocessStarted);
    var newEndDate = new Date(bgprocessEnded);

    // Log parsed Date objects
    //log.info("Parsed CreationDate = " + newCreationDate.toString());
    //log.info("Parsed StartDate    = " + newStartDate.toString());
    //log.info("Parsed EndDate      = " + newEndDate.toString());

    // Perform range check
    if (newCreationDate.getTime() >= newStartDate.getTime() &&
        newCreationDate.getTime() <= newEndDate.getTime()) {
        return true;
    } else {
        return false;
    }
}

function searchByAttributeValue(manager, attributeID, attributeValue) {
    var attribute = manager.getAttributeHome().getAttributeByID(attributeID);
    searchHome = manager.getHome(com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome);
    searchArg = new com.stibo.core.domain.singleattributequery.SingleAttributeQueryHome.SingleAttributeQuerySpecification(com.stibo.core.domain.Product, attribute, attributeValue);
    var searchResult = "";
    if ((searchArg != null) && (attributeValue != null) && (attributeValue != "")) {
        searchResult = searchHome.querySingleAttribute(searchArg).asList(200).toArray();
    }
    //log.info(searchResult.length);
    return searchResult.length;
}
}