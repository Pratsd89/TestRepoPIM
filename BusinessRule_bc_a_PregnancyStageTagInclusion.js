/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_PregnancyStageTagInclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "bc_a_PregnancyStageTagInclusion",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"PregnancyStage_Tag\">2050</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865505</element>\n        <element LOVID=\"PregnancyStage_Tag\">2047</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865510</element>\n        <element LOVID=\"PregnancyStage_Tag\">2049</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865506</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865507</element>\n        <element LOVID=\"PregnancyStage_Tag\">2048</element>\n        <element LOVID=\"PregnancyStage_Tag\">2051</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"PregnancyStage_Tag\">2050</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865505</element>\n        <element LOVID=\"PregnancyStage_Tag\">2047</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865510</element>\n        <element LOVID=\"PregnancyStage_Tag\">2049</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865506</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865507</element>\n        <element LOVID=\"PregnancyStage_Tag\">2048</element>\n        <element LOVID=\"PregnancyStage_Tag\">2051</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"PregnancyStage_Tag\">197865505</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865510</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865506</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865507</element>\n        <element LOVID=\"PregnancyStage_Tag\">2051</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"PregnancyStage_Tag\">197865505</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865510</element>\n        <element LOVID=\"PregnancyStage_Tag\">2049</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865506</element>\n        <element LOVID=\"PregnancyStage_Tag\">197865507</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set/>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_PregnancyStage_Tag"
  } ],
  "pluginType" : "Operation"
}
*/
