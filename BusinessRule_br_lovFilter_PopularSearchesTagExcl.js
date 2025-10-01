/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter_PopularSearchesTagExcl",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "Popular Searches Tag Exclusion Filter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"PopularSearches_Tag\">3121</element>\n        <element LOVID=\"PopularSearches_Tag\">3119</element>\n        <element LOVID=\"PopularSearches_Tag\">3120</element>\n        <element LOVID=\"PopularSearches_Tag\">3122</element>\n        <element LOVID=\"PopularSearches_Tag\">3118</element>\n        <element LOVID=\"PopularSearches_Tag\">3117</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_PopularSearches_Tag_Inherit"
  } ],
  "pluginType" : "Operation"
}
*/
