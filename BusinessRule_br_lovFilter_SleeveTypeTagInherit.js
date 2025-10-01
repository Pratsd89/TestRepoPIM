/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter_SleeveTypeTagInherit",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "SleeveType Tag Inherit Filter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"SleeveType_Tag\">3149</element>\n        <element LOVID=\"SleeveType_Tag\">3148</element>\n        <element LOVID=\"SleeveType_Tag\">3150</element>\n        <element LOVID=\"SleeveType_Tag\">3147</element>\n        <element LOVID=\"SleeveType_Tag\">3146</element>\n        <element LOVID=\"SleeveType_Tag\">3151</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_SleeveType_Tag_Inherit"
  } ],
  "pluginType" : "Operation"
}
*/
