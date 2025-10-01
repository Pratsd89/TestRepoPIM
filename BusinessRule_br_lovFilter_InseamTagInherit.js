/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_lovFilter_InseamTagInherit",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "Inseam Tag Inherit Filter",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Inseam_Tag\">178282679</element>\n        <element LOVID=\"Inseam_Tag\">178282672</element>\n        <element LOVID=\"Inseam_Tag\">178282680</element>\n        <element LOVID=\"Inseam_Tag\">178282676</element>\n        <element LOVID=\"Inseam_Tag\">178282674</element>\n        <element LOVID=\"Inseam_Tag\">178282677</element>\n        <element LOVID=\"Inseam_Tag\">178282678</element>\n        <element LOVID=\"Inseam_Tag\">178282675</element>\n        <element LOVID=\"Inseam_Tag\">178282682</element>\n        <element LOVID=\"Inseam_Tag\">178282668</element>\n        <element LOVID=\"Inseam_Tag\">178282681</element>\n        <element LOVID=\"Inseam_Tag\">178282673</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Inseam_Tag_Inherit"
  } ],
  "pluginType" : "Operation"
}
*/
