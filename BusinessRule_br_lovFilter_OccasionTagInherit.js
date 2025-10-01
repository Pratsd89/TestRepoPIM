/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter_OccasionTagInherit",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "Occasion Tag Inherit Filter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Occasion_Tag\">2038</element>\n        <element LOVID=\"Occasion_Tag\">2037</element>\n        <element LOVID=\"Occasion_Tag\">2039</element>\n        <element LOVID=\"Occasion_Tag\">2466</element>\n        <element LOVID=\"Occasion_Tag\">3015</element>\n        <element LOVID=\"Occasion_Tag\">2525</element>\n        <element LOVID=\"Occasion_Tag\">2538</element>\n        <element LOVID=\"Occasion_Tag\">2036</element>\n        <element LOVID=\"Occasion_Tag\">109692709</element>\n        <element LOVID=\"Occasion_Tag\">2035</element>\n        <element LOVID=\"Occasion_Tag\">2904</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Occasion_Tag_Inherit"
  } ],
  "pluginType" : "Operation"
}
*/
