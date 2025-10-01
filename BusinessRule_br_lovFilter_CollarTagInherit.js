/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter_CollarTagInherit",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "Collar Tag Inherit Filter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">128411037</element>\n        <element LOVID=\"Collar_Tag\">1926</element>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n        <element LOVID=\"Collar_Tag\">128387059</element>\n        <element LOVID=\"Collar_Tag\">128387068</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">128411037</element>\n        <element LOVID=\"Collar_Tag\">1926</element>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n        <element LOVID=\"Collar_Tag\">128387059</element>\n        <element LOVID=\"Collar_Tag\">128387068</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">128411037</element>\n        <element LOVID=\"Collar_Tag\">1926</element>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n        <element LOVID=\"Collar_Tag\">128387059</element>\n        <element LOVID=\"Collar_Tag\">128387068</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">128411037</element>\n        <element LOVID=\"Collar_Tag\">1926</element>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n        <element LOVID=\"Collar_Tag\">128387059</element>\n        <element LOVID=\"Collar_Tag\">128387068</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">128411037</element>\n        <element LOVID=\"Collar_Tag\">1926</element>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n        <element LOVID=\"Collar_Tag\">128387059</element>\n        <element LOVID=\"Collar_Tag\">128387068</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">128411037</element>\n        <element LOVID=\"Collar_Tag\">1926</element>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n        <element LOVID=\"Collar_Tag\">128387059</element>\n        <element LOVID=\"Collar_Tag\">128387068</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Collar_Tag\">128411037</element>\n        <element LOVID=\"Collar_Tag\">1926</element>\n        <element LOVID=\"Collar_Tag\">1924</element>\n        <element LOVID=\"Collar_Tag\">1925</element>\n        <element LOVID=\"Collar_Tag\">128387059</element>\n        <element LOVID=\"Collar_Tag\">128387068</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Collar_Tag_Inherit"
  } ],
  "pluginType" : "Operation"
}
*/
