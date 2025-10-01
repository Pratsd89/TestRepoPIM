/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter_BrandTagInherit",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "Brand Tag Inherit Filter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">128411765</element>\n        <element LOVID=\"Brand_Tag\">128386924</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">128386931</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Tag_Inherit"
  } ],
  "pluginType" : "Operation"
}
*/
