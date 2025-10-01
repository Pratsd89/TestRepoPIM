/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_BadgingValues",
  "type" : "BusinessCondition",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_BadgingValues",
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
  "pluginId" : "LOVCrossValidationBusinessCondition",
  "parameters" : [ {
    "id" : "Config",
    "type" : "com.stibo.core.domain.parameter.LOVCrossValidationConfig",
    "value" : "<map>\n  <entry>\n    <key LOVID=\"LOV_BADGING_FLAG_TYPE\">DYNAMIC</key>\n    <value>\n      <set>\n        <element LOVID=\"LOV_BADGING_FLAGS_AT\">128349110</element>\n        <element LOVID=\"LOV_BADGING_FLAGS_AT\">128349111</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"LOV_BADGING_FLAG_TYPE\">STATIC</key>\n    <value>\n      <set>\n        <element LOVID=\"LOV_BADGING_FLAGS_AT\">128291978</element>\n        <element LOVID=\"LOV_BADGING_FLAGS_AT\">128349082</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "ATD_BADGING_FLAG_TYPE"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "ATD_BADGING_FLAG_AT"
  } ],
  "pluginType" : "Operation"
}
*/
