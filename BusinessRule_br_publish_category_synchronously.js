/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_publish_category_synchronously",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Publish Category Synchronously",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var currentDate = new java.util.Date();
var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var calendar = new java.util.Calendar.getInstance();
var categoryCreatedDateTime = node.getValue("a_Stibo_Creation_Date").getSimpleValue();


var objectType = node.getObjectType().getID();
var date = dateFormat.parse(categoryCreatedDateTime);
calendar.setTime(date);
var categoryTime = calendar.getTime();
var timeDifference = currentDate.getTime() - categoryTime.getTime();

if (timeDifference < 10 * 60 * 1000 && timeDifference >= 0) {
    sendAPICallToDGL();
}


function sendAPICallToDGL() {
    log.info("Executing the establish Connection Method");
    var currentContext = step.getCurrentContext().getID();
    var url = new java.net.URL("https://stage.api.gap.com/commerce/pim/data-governance/categories/change-notifications");
    var conn = url.openConnection();
    conn.setDoOutput(true);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/xml");
    conn.setRequestProperty("apikey", "oV4p8qh9G27BVfLZQFAKppA2ngRjnZQ4");
    conn.setRequestProperty("env", "stage");
    var input = new java.lang.String("<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
        "<STEP-ProductInformation ExportTime=" + "\"" + dateFormat.format(currentDate) + "\"" + " ExportContext= " + "\"" + currentContext + "\"" + " ContextID=" + "\"" + currentContext + "\"" + " WorkspaceID=\"Main\" UseContextLocale=\"false\">" +
        " <Classifications> " +
        " <Classification ID= " + "\"" + node.getID() + "\"" +
        " UserTypeID= " + "\"" + objectType + "\"" +
        " ParentID= " + "\"" + node.getParent().getID() + "\"" +
        "/>" + "</Classifications>" +
        "</STEP-ProductInformation>"
    );


    var os = conn.getOutputStream();
    os.write(input.getBytes());
    os.flush();
    os.close();
    if (conn.getResponseCode() != null) {
        log.info("Response : HTTP code : " + conn.getResponseCode());
        log.info("Response Message : " + conn.getResponseMessage());
    }

}
}