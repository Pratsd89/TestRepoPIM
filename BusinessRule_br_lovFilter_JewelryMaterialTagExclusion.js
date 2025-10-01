/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter_JewelryMaterialTagExclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "Jewelry Material Tag Exclusion Filter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"JewelryMaterial_Tag\">2377</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2376</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2378</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2379</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2374</element>\n        <element LOVID=\"JewelryMaterial_Tag\">2375</element>\n        <element LOVID=\"JewelryMaterial_Tag\">109678360</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Jewelry_Material_Tag_Exclusions"
  } ],
  "pluginType" : "Operation"
}
*/
