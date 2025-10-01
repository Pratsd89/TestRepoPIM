/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter2",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_lovFilter2",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017558</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017559</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017557</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017558</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017559</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017557</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017559</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017558</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017559</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017557</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017557</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017559</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017557</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017558</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017559</element>\n        <element LOVID=\"Lov_POC_Variant_2\">129017557</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Lov_POC_Variant_2\">129017558</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_POC_Variant_Tag_2"
  } ],
  "pluginType" : "Operation"
}
*/
