/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_PackageQuantityTagInclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "bc_a_PackageQuantityTagInclusion",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Package_Quantity_Tag\">384368487</element>\n        <element LOVID=\"Package_Quantity_Tag\">2299</element>\n        <element LOVID=\"Package_Quantity_Tag\">384368488</element>\n        <element LOVID=\"Package_Quantity_Tag\">2302</element>\n        <element LOVID=\"Package_Quantity_Tag\">2300</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Package_Quantity_Tag\">2656</element>\n        <element LOVID=\"Package_Quantity_Tag\">2299</element>\n        <element LOVID=\"Package_Quantity_Tag\">2655</element>\n        <element LOVID=\"Package_Quantity_Tag\">2301</element>\n        <element LOVID=\"Package_Quantity_Tag\">197865562</element>\n        <element LOVID=\"Package_Quantity_Tag\">2302</element>\n        <element LOVID=\"Package_Quantity_Tag\">2300</element>\n        <element LOVID=\"Package_Quantity_Tag\">2297</element>\n        <element LOVID=\"Package_Quantity_Tag\">197865563</element>\n        <element LOVID=\"Package_Quantity_Tag\">2465</element>\n        <element LOVID=\"Package_Quantity_Tag\">2657</element>\n        <element LOVID=\"Package_Quantity_Tag\">2303</element>\n        <element LOVID=\"Package_Quantity_Tag\">2311</element>\n        <element LOVID=\"Package_Quantity_Tag\">2298</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Package_Quantity_Tag\">384368487</element>\n        <element LOVID=\"Package_Quantity_Tag\">384368489</element>\n        <element LOVID=\"Package_Quantity_Tag\">384368488</element>\n        <element LOVID=\"Package_Quantity_Tag\">197865562</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Package_Quantity_Tag\">2656</element>\n        <element LOVID=\"Package_Quantity_Tag\">2299</element>\n        <element LOVID=\"Package_Quantity_Tag\">2655</element>\n        <element LOVID=\"Package_Quantity_Tag\">2301</element>\n        <element LOVID=\"Package_Quantity_Tag\">197865562</element>\n        <element LOVID=\"Package_Quantity_Tag\">2302</element>\n        <element LOVID=\"Package_Quantity_Tag\">2300</element>\n        <element LOVID=\"Package_Quantity_Tag\">2297</element>\n        <element LOVID=\"Package_Quantity_Tag\">197865563</element>\n        <element LOVID=\"Package_Quantity_Tag\">2465</element>\n        <element LOVID=\"Package_Quantity_Tag\">2303</element>\n        <element LOVID=\"Package_Quantity_Tag\">2311</element>\n        <element LOVID=\"Package_Quantity_Tag\">2298</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Package_Quantity_Tag\">2656</element>\n        <element LOVID=\"Package_Quantity_Tag\">2299</element>\n        <element LOVID=\"Package_Quantity_Tag\">2655</element>\n        <element LOVID=\"Package_Quantity_Tag\">2301</element>\n        <element LOVID=\"Package_Quantity_Tag\">197865562</element>\n        <element LOVID=\"Package_Quantity_Tag\">2302</element>\n        <element LOVID=\"Package_Quantity_Tag\">2300</element>\n        <element LOVID=\"Package_Quantity_Tag\">2297</element>\n        <element LOVID=\"Package_Quantity_Tag\">197865563</element>\n        <element LOVID=\"Package_Quantity_Tag\">2465</element>\n        <element LOVID=\"Package_Quantity_Tag\">2303</element>\n        <element LOVID=\"Package_Quantity_Tag\">2311</element>\n        <element LOVID=\"Package_Quantity_Tag\">2298</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Package_Quantity_Tag"
  } ],
  "pluginType" : "Operation"
}
*/
