/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WebCat_ReDirectURL_Condition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Web Category Re- Direct URL Condition",
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
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
//PPIM-6955 - Validation for Redirect URL to flag error for specific characters appearing twice in sequence.
//PPIM-10231 - Allow https:// in URL redirect links for all brands and markets
//Boolean function to check for "https://" prefix in the url
function checkValidHttpsUrl(arrUrl, result){
  var validUrl = "";
  for(var i = 0 ; i < 8 ; i++) {
    validUrl = validUrl + arrUrl[i];
  }
  return validUrl == "https://";
}

var result = true;
var url = node.getValue("a_Redirect_URL").getSimpleValue();
if(url != null){
    var arrUrl = url.split('');
    var isHttpsUrl = checkValidHttpsUrl(arrUrl, result);
    var startIndex = 0;
    
    if(isHttpsUrl){
        startIndex = 8;
    }
    
    for(i = startIndex ; i < arrUrl.length ; i++){
        if(i != 0){
            if((arrUrl[i-1] == arrUrl[i]) && (arrUrl[i] == "=" || arrUrl[i] == "/" || arrUrl[i] == "&" || arrUrl[i] == "?")){
            result = false;
              }
          }
      }
}
return result;
}