/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Import_PPOF_Styled_Outfitting_Data",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Import PPOF Styled Outfitting Data",
  "description" : "PPIM-13552",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "manager",
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
exports.operation0 = function (manager,node,log) {
var matchBackCCs = node.getValue("a_MatchBack_Number").getSimpleValue();
var oldMatchBackCCs = node.getValue("a_Old_MatchBack_Number").getSimpleValue();
var matchBackCCsList = new java.util.ArrayList();
var oldMatchBackCCsList = new java.util.ArrayList();
var uniqueList = new java.util.ArrayList();
const uniqueCCsArray = [];
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
if (matchBackCCs != null && oldMatchBackCCs != null ){
 matchBackCCsArr = matchBackCCs.split("\n");
 //Split and store new list and remove duplicates
    matchBackCCsArr.forEach(function(cc) {
     ccsFromSheet = cc.split(",");
     ccsFromSheet.forEach(function(ccFromSheet) {
          if (!matchBackCCsList.contains(ccFromSheet)) { 
                matchBackCCsList.add(ccFromSheet); 
                } 
     });
    });
 //Split and store old list and remove duplicates
oldMatchBackCCsArr = oldMatchBackCCs.split(",");
oldMatchBackCCsArr.forEach(function(oldcc) { 
  oldMatchBackCCsList.add(oldcc);
});
 matchBackCCsList.addAll(oldMatchBackCCsList);
 matchBackCCsList.forEach((value) => {
 		if(!uniqueList.contains(value))
       uniqueList.add(value);
    });
 var matchBackCCToAdd = "";
  //add new line and store it in stibo
uniqueList.forEach((value) => {
 matchBackCCToAdd =  matchBackCCToAdd + value.toString() +","; 
   });
node.getValue("a_MatchBack_Number").setSimpleValue(matchBackCCToAdd.substring(0, matchBackCCToAdd.length-1));
node.getValue("a_Old_MatchBack_Number").setSimpleValue(matchBackCCToAdd.substring(0, matchBackCCToAdd.length-1));
node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}
else if (matchBackCCs != null && oldMatchBackCCs == null){
matchBackCCsArr = matchBackCCs.split("\n");
 matchBackCCsArr.forEach(function(cc) {
     ccsFromSheet = cc.split(",");
     ccsFromSheet.forEach(function(ccFromSheet) {
          if (!matchBackCCsList.contains(ccFromSheet)) { 
                matchBackCCsList.add(ccFromSheet); 
                } 
     });
    });
    var matchBackCCToAdd = "";
  matchBackCCsList.forEach((value) => {
  matchBackCCToAdd =  matchBackCCToAdd + value.toString() +","; 
   });
node.getValue("a_MatchBack_Number").setSimpleValue(matchBackCCToAdd.substring(0, matchBackCCToAdd.length-1));
node.getValue("a_Old_MatchBack_Number").setSimpleValue(matchBackCCToAdd.substring(0, matchBackCCToAdd.length-1));
node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}
else{
	log.info("Handled in validation");
}

}