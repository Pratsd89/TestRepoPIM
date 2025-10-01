/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_cond_hideBadgingValuesON",
  "type" : "BusinessCondition",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_cond_hideBadgingValuesON",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"lov_badge_flag_type\">DYNAMIC</key>\n    <value>\n      <set>\n        <element LOVID=\"lov_badge_ON\">105</element>\n        <element LOVID=\"lov_badge_ON\">106</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"lov_badge_flag_type\">STATIC</key>\n    <value>\n      <set>\n        <element LOVID=\"lov_badge_ON\">103</element>\n        <element LOVID=\"lov_badge_ON\">104</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_badge_type"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_badge_ON"
  } ],
  "pluginType" : "Operation"
}
*/
