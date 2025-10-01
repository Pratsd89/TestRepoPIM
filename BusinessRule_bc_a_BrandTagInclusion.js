/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_BrandTagInclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "bc_a_BrandTagInclusion",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2042</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2043</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">2041</element>\n        <element LOVID=\"Brand_Tag\">2040</element>\n        <element LOVID=\"Brand_Tag\">2045</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">2042</element>\n        <element LOVID=\"Brand_Tag\">2567</element>\n        <element LOVID=\"Brand_Tag\">2043</element>\n        <element LOVID=\"Brand_Tag\">2566</element>\n        <element LOVID=\"Brand_Tag\">2568</element>\n        <element LOVID=\"Brand_Tag\">2044</element>\n        <element LOVID=\"Brand_Tag\">2041</element>\n        <element LOVID=\"Brand_Tag\">2040</element>\n        <element LOVID=\"Brand_Tag\">2045</element>\n        <element LOVID=\"Brand_Tag\">2046</element>\n        <element LOVID=\"Brand_Tag\">2565</element>\n        <element LOVID=\"Brand_Tag\">2569</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">384415316</element>\n        <element LOVID=\"Brand_Tag\">384415311</element>\n        <element LOVID=\"Brand_Tag\">384415319</element>\n        <element LOVID=\"Brand_Tag\">384415318</element>\n        <element LOVID=\"Brand_Tag\">384415351</element>\n        <element LOVID=\"Brand_Tag\">384415361</element>\n        <element LOVID=\"Brand_Tag\">384415317</element>\n        <element LOVID=\"Brand_Tag\">384415315</element>\n        <element LOVID=\"Brand_Tag\">384415358</element>\n        <element LOVID=\"Brand_Tag\">384415343</element>\n        <element LOVID=\"Brand_Tag\">384415321</element>\n        <element LOVID=\"Brand_Tag\">384415314</element>\n        <element LOVID=\"Brand_Tag\">384415342</element>\n        <element LOVID=\"Brand_Tag\">384415360</element>\n        <element LOVID=\"Brand_Tag\">384415359</element>\n        <element LOVID=\"Brand_Tag\">384415320</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Brand_Tag\">384301257</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Tag"
  } ],
  "pluginType" : "Operation"
}
*/
