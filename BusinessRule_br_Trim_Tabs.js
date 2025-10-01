/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Trim_Tabs",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "Trim Spaces and Tabs",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node) {
function cleanString(val) {     
    if (val != null) {
        // Force convert to a primitive string (whether object or primitive)
        val = String(val);        
        if (typeof val === 'string') {  // Check if it's now a primitive string
           
            // Replace all newlines and tab characters with a single space
            val = val.replace(/\s+/g, " ");
           
            return val.trim(); // Trim leading/trailing spaces
        }
    }
    
    return val; // Return original value if it's not a string
}



var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var value = node.getValue("a_Category_Description").getSimpleValue();
//log.info(value);
var CleanValue = cleanString(value);
//log.info(CleanValue);

if(value != CleanValue){
	node.getValue("a_Category_Description").setSimpleValue(CleanValue);
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}

var Name = node.getName();
//log.info(Name);
var cleanName = cleanString(Name);
//log.info(cleanName);


if(Name != cleanName){
	node.setName(cleanName);
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}

}