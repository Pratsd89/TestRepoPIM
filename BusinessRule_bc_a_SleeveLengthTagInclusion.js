/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_SleeveLengthTagInclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "bc_a_SleeveLengthTagInclusion",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">197865354</element>\n        <element LOVID=\"SleeveLength_Tag\">1930</element>\n        <element LOVID=\"SleeveLength_Tag\">1931</element>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">197865381</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n        <element LOVID=\"SleeveLength_Tag\">1927</element>\n        <element LOVID=\"SleeveLength_Tag\">197865528</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">197865354</element>\n        <element LOVID=\"SleeveLength_Tag\">1930</element>\n        <element LOVID=\"SleeveLength_Tag\">1931</element>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">197865381</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n        <element LOVID=\"SleeveLength_Tag\">1927</element>\n        <element LOVID=\"SleeveLength_Tag\">197865528</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n        <element LOVID=\"SleeveLength_Tag\">1927</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n        <element LOVID=\"SleeveLength_Tag\">1927</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">1930</element>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">1930</element>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n        <element LOVID=\"SleeveLength_Tag\">1927</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">197865381</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n        <element LOVID=\"SleeveLength_Tag\">1927</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveLength_Tag\">1928</element>\n        <element LOVID=\"SleeveLength_Tag\">1929</element>\n        <element LOVID=\"SleeveLength_Tag\">1927</element>\n        <element LOVID=\"SleeveLength_Tag\">197865528</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_SleeveLength_Tag"
  } ],
  "pluginType" : "Operation"
}
*/
