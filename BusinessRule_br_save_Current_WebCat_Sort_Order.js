/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_save_Current_WebCat_Sort_Order",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Current Web Category Sort Order",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
exports.operation0 = function (step,node,LKT,log) {
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

//Get todays date
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
var today = java.time.ZonedDateTime.now();
//Determine if Sort Order should Inherit from US
var inheritSort = node.getValue('a_WebCategory_SortOrder_Inherit_US').getSimpleValue();

if (inheritSort == 'Yes') {
     //Get the US Sort order value for the Category
     var usSortOrder = null

     step.executeInContext('EN_US', function (manager) {
          //fetch context specific selected category from executing manager
          var cntxtCat = manager.getClassificationHome().getClassificationByID(node.getID());
          usSortOrder = cntxtCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();
     });
     //Copy sort to other markets
     var brandNumber = getBrandNumber(node);
     var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);

     if (markets.contains(";")) {
          //split on ";"
          markets = markets.split(";");

          //for each market
          markets.forEach(function (mkt) {

               if (mkt != 'EN_US') {
                    step.executeInContext(mkt, function (manager) {
                         //fetch context specific selected category from executing manager
                         var cntxtCat = manager.getClassificationHome().getClassificationByID(node.getID());
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
}