/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_lovFilter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">89126</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89124</element>\n        <element LOVID=\"Lov_POC_Variant_3\">132343</element>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">123</element>\n        <element LOVID=\"Lov_POC_Variant_3\">4534535</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89125</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_2</element>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_2</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89123</element>\n        <element LOVID=\"Lov_POC_Variant_3\">1234</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">89126</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89124</element>\n        <element LOVID=\"Lov_POC_Variant_3\">132343</element>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">123</element>\n        <element LOVID=\"Lov_POC_Variant_3\">4534535</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89125</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_2</element>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_2</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89123</element>\n        <element LOVID=\"Lov_POC_Variant_3\">1234</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">123</element>\n        <element LOVID=\"Lov_POC_Variant_3\">1234</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">132343</element>\n        <element LOVID=\"Lov_POC_Variant_3\">4534535</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_2</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">89126</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89124</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89125</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89123</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">89126</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89124</element>\n        <element LOVID=\"Lov_POC_Variant_3\">132343</element>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">123</element>\n        <element LOVID=\"Lov_POC_Variant_3\">4534535</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89125</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_2</element>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_2</element>\n        <element LOVID=\"Lov_POC_Variant_3\">89123</element>\n        <element LOVID=\"Lov_POC_Variant_3\">1234</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_1</element>\n        <element LOVID=\"Lov_POC_Variant_3\">AT_2</element>\n        <element LOVID=\"Lov_POC_Variant_3\">GPS_2</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_POC_Variant_Tag_3"
  } ],
  "pluginType" : "Operation"
}
*/
