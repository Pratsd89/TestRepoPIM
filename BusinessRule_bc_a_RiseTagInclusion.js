/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_RiseTagInclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "bc_a_RiseTagInclusion",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Rise_Tag\">1733</element>\n        <element LOVID=\"Rise_Tag\">1734</element>\n        <element LOVID=\"Rise_Tag\">1735</element>\n        <element LOVID=\"Rise_Tag\">2224</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Rise_Tag\">1733</element>\n        <element LOVID=\"Rise_Tag\">1734</element>\n        <element LOVID=\"Rise_Tag\">1735</element>\n        <element LOVID=\"Rise_Tag\">1732</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Rise_Tag\">1733</element>\n        <element LOVID=\"Rise_Tag\">1734</element>\n        <element LOVID=\"Rise_Tag\">1735</element>\n        <element LOVID=\"Rise_Tag\">1730</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Rise_Tag\">1733</element>\n        <element LOVID=\"Rise_Tag\">1734</element>\n        <element LOVID=\"Rise_Tag\">1735</element>\n        <element LOVID=\"Rise_Tag\">1730</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Rise_Tag\">1733</element>\n        <element LOVID=\"Rise_Tag\">1734</element>\n        <element LOVID=\"Rise_Tag\">1735</element>\n        <element LOVID=\"Rise_Tag\">2224</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Rise_Tag\">1733</element>\n        <element LOVID=\"Rise_Tag\">2357</element>\n        <element LOVID=\"Rise_Tag\">1734</element>\n        <element LOVID=\"Rise_Tag\">1735</element>\n        <element LOVID=\"Rise_Tag\">2224</element>\n        <element LOVID=\"Rise_Tag\">1730</element>\n        <element LOVID=\"Rise_Tag\">1732</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Rise_Tag\">1733</element>\n        <element LOVID=\"Rise_Tag\">2357</element>\n        <element LOVID=\"Rise_Tag\">1734</element>\n        <element LOVID=\"Rise_Tag\">1735</element>\n        <element LOVID=\"Rise_Tag\">2224</element>\n        <element LOVID=\"Rise_Tag\">1730</element>\n        <element LOVID=\"Rise_Tag\">1732</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Rise_Tag"
  } ],
  "pluginType" : "Operation"
}
*/
