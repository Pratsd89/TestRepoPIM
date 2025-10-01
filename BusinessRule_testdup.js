/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testdup",
  "type" : "BusinessFunction",
  "setupGroups" : [ "Functions" ],
  "name" : "Test HTML Function(2)",
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
//return  "<html>"
//	 + "<a href =	\"https://www.google.com\" target=\"_blank\">Click Here</a><br>"
//	 + "<b> Hurrah!! </b> <i> It Worked!! </i><br><br>"
//	 + "<body>"
//    + "<img src=\"https:\/\/bobcat.grahamdigital.com\/198d00d32e9b3639c7ce2e4ccff690987b9700c9\/fit-630x353-000.jpg\" alt=\"Testing\" width=\"600\" height=\"200\">"
//   	 + "</body>"
//	 + "</html>";

/*return "<html> <body><iframe src=\"\" name=\"myFrame\"></iframe>"
		+ "<p><a href=\"https:\/\/www.google.com\" target=\"myFrame\">Open</a></p>"
		+"</body></html>";*/

//return "<html><iframe src=\"https:\/\/www.google.com\/search?igu=1\" name=\"myFrame\" width=\"1200\" height=\"800\"></iframe></html>"
return "<html><iframe id=\"approve\" width=\"930\" height=\"800\" frameborder=\"0\" style=\"display: block;\" src=\"https://www.onol.wip.gidapps.com/browse/product.do?pid="+node.getID()+"&amp;date=10/23/2019&amp;locale=en_US\"></iframe></html>"
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