/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test Popup",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "test Popup",
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
  "binds" : [ ],
  "messages" : [ {
    "variable" : "msg",
    "message" : "Very nice",
    "translations" : [ {
      "language" : "hi",
      "message" : "Bahut ache"
    } ]
  } ],
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
exports.operation0 = function (node,msg) {
return  "<html>"
	 + "<body>"
	 +"<h2>Please confirm below </h2><br>"
	 +"<button onclick=\"Approve it\">OK</button><br><br>"
    + "<br><button onclick=\"Dont Approve it\">Cancel</button><br><br>"
  	 + "</body>"
	 + "</html>";

/*return "<html> <body><iframe src=\"\" name=\"myFrame\"></iframe>"
		+ "<p><a href=\"https:\/\/www.google.com\" target=\"myFrame\">Open</a></p>"
		+"</body></html>";*/

//return "<html><body><h2>JavaScript Confirm Box</h2><button onclick=\"myFunction()\">Try it</button><script>function myFunction(){alert(\"Success\");}</script></body></html>"
//return "<html><body><button onclick='myFunction()'>Try it</button><p id='demo'></p><script>function myFunction() {  var txt;  if (confirm('Press a button!')) {    txt = 'You pressed OK!';  } else {   txt = 'You pressed Cancel!';  }  document.getElementById('demo').innerHTML = txt;}</script></body></html>"
/*return "<html>" +
    "<head>" +
        "<script type=\"text/javascript\">" +
            "$(document).ready(function(){" +
                "$(\"#content\").attr(\"src\",\"https://google.com\");" +
            "})" +
        "</script>" +
    "</head>" +
    "<body>" +
        "<div id=\"content\"></div>" +
    "</body>" +
"</html>";*/
}