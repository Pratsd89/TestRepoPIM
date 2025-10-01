/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Calculate Shared Market LOV Value",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Calculate Shared Market LOV Value",
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
  "pluginId" : "LOVCrossValidationBusinessCondition",
  "parameters" : [ {
    "id" : "Config",
    "type" : "com.stibo.core.domain.parameter.LOVCrossValidationConfig",
    "value" : "<map>\n  <entry>\n    <key LOVID=\"lov_MarketDesigShotReq\">CA</key>\n    <value>\n      <set>\n        <element LOVID=\"Market\">4</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"lov_MarketDesigShotReq\">JP</key>\n    <value>\n      <set>\n        <element LOVID=\"Market\">6</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"lov_MarketDesigShotReq\">BOTH</key>\n    <value>\n      <set>\n        <element LOVID=\"Market\">6</element>\n        <element LOVID=\"Market\">1</element>\n        <element LOVID=\"Market\">4</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"lov_MarketDesigShotReq\">US</key>\n    <value>\n      <set>\n        <element LOVID=\"Market\">1</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Market_Designation_Shot_Request"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Shared_Markets"
  } ],
  "pluginType" : "Operation"
}
*/
