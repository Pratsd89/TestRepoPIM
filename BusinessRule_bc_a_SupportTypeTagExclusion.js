/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_SupportTypeTagExclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "bc_a_SupportTypeTagExclusion",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"SupportType_Tag\">2004</element>\n        <element LOVID=\"SupportType_Tag\">2007</element>\n        <element LOVID=\"SupportType_Tag\">2139</element>\n        <element LOVID=\"SupportType_Tag\">2003</element>\n        <element LOVID=\"SupportType_Tag\">2008</element>\n        <element LOVID=\"SupportType_Tag\">2751</element>\n        <element LOVID=\"SupportType_Tag\">2006</element>\n        <element LOVID=\"SupportType_Tag\">2005</element>\n        <element LOVID=\"SupportType_Tag\">2094</element>\n        <element LOVID=\"SupportType_Tag\">2002</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"SupportType_Tag\">2004</element>\n        <element LOVID=\"SupportType_Tag\">2007</element>\n        <element LOVID=\"SupportType_Tag\">2139</element>\n        <element LOVID=\"SupportType_Tag\">2003</element>\n        <element LOVID=\"SupportType_Tag\">2008</element>\n        <element LOVID=\"SupportType_Tag\">2751</element>\n        <element LOVID=\"SupportType_Tag\">2006</element>\n        <element LOVID=\"SupportType_Tag\">2005</element>\n        <element LOVID=\"SupportType_Tag\">2094</element>\n        <element LOVID=\"SupportType_Tag\">2002</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"SupportType_Tag\">2139</element>\n        <element LOVID=\"SupportType_Tag\">2008</element>\n        <element LOVID=\"SupportType_Tag\">2006</element>\n        <element LOVID=\"SupportType_Tag\">2094</element>\n        <element LOVID=\"SupportType_Tag\">2002</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"SupportType_Tag\">2007</element>\n        <element LOVID=\"SupportType_Tag\">2003</element>\n        <element LOVID=\"SupportType_Tag\">2139</element>\n        <element LOVID=\"SupportType_Tag\">2008</element>\n        <element LOVID=\"SupportType_Tag\">2006</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_SupportType_Tag_Exclusions"
  } ],
  "pluginType" : "Operation"
}
*/
