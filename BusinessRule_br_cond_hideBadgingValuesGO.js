/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_cond_hideBadgingValuesGO",
  "type" : "BusinessCondition",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_cond_hideBadgingValuesGO",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"lov_badge_flag_type\">STATIC</key>\n    <value>\n      <set>\n        <element LOVID=\"lov_badge_GO\">107</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"lov_badge_flag_type\">DYNAMIC</key>\n    <value>\n      <set>\n        <element LOVID=\"lov_badge_GO\">106</element>\n        <element LOVID=\"lov_badge_GO\">105</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_badge_type"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_badge_GO"
  } ],
  "pluginType" : "Operation"
}
*/
