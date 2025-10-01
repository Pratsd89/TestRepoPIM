/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_save_Selected_WebCat_Sort_Orders",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Selected Web Category Sort Orders",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebBU", "WebCategory", "WebDivision" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
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
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,web,LKT,log) {
function getBrandNumber(category) {
     //get category object type
     var type = category.getObjectType().getID();
     displayLog.push("\n - Category Object Type is: " + type);

     //get parent
     var parent = category.getParent();

     //get parent object type
     var parentType = parent.getObjectType().getID();
     displayLog.push("\n - First Parent Object Type is: " + parentType);

     //if category object type is WebCategory || WebSubCategory || WebDivision
     if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
          //then keep getting parent until type is WebBU
          while (parentType != "WebBU") {
               parent = parent.getParent();

               parentType = parent.getObjectType().getID();
          }
          displayLog.push("\n - Final Parent Found. Object Type is: " + parentType + ".\n<-- Getting Brand Number...");

          //get a_Brand_Number
          var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
     }
     //else get Brand Number
     else {
          displayLog.push("\n<-- Getting Brand Number...");
          var brandNum = category.getValue("a_Brand_Number").getSimpleValue();
     }

     displayLog.push("\n - Brand Number is: " + brandNum);
     return brandNum;
}

//array for webUI log message
var displayLog = new Array();

//get selected categories
var selected = web.getSelection().iterator();

//Get todays date
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
var today = java.time.ZonedDateTime.now();


while (selected.hasNext()) {
     //current selected category
     var cat = selected.next();
     displayLog.push("\n<-> Current Cat is: <b>" + cat.getID() + "</b>");

     //get a_Brand_Number of parent of selected category
     var brandNumber = getBrandNumber(cat);
     var inheritSort = cat.getValue('a_WebCategory_SortOrder_Inherit_US').getSimpleValue();
     displayLog.push("\n<-> Sort order inherit from US is: <b>" + inheritSort + "</b>");

     var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);

     if (inheritSort == 'Yes') {

          var usSortOrder = null

          step.executeInContext('EN_US', function (manager) {
               //fetch context specific selected category from executing manager
               var cntxtCat = manager.getClassificationHome().getClassificationByID(cat.getID());
               usSortOrder = cntxtCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();
          });

          if (markets.contains(";")) {
               //split on ";"
               markets = markets.split(";");

               //for each market
               markets.forEach(function (mkt) {

                    if (mkt != 'EN_US') {
                         displayLog.push("\n<-> Setting Sort order in other markets from US: <b>" + mkt + "</b>");
                         step.executeInContext(mkt, function (manager) {
                              //fetch context specific selected category from executing manager
                              var cntxtCat = manager.getClassificationHome().getClassificationByID(cat.getID());
                              var cntxtCatStart = cntxtCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                              var cntxtCatEnd = cntxtCat.getValue('a_WebCategory_End_Date').getSimpleValue();

                              //Set sort order in other markets if category is active
                              if (cntxtCatStart != null && cntxtCatEnd > today || cntxtCatStart != null && cntxtCatEnd == null) {
                                   cntxtCat.getValue('a_WebCategory_Sort_Order').setValue(usSortOrder);
                              }
                         });
                    }
               });
          }
     }

     //Set date variables for Maintenance Last Update Date
     var time = new java.util.Date();
     var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

     //Publish selected category
     cat.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
     displayLog.push("\n<-> Main Last Update Date is: <b>" + cat.getValue("a_main_last_modified_date").getSimpleValue() + "</b>");
}
//final display message. comment out line when not in development
//web.showAlert("Warning", "Selected Nodes:", displayLog);
}