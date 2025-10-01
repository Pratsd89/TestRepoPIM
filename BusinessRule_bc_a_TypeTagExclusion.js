/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_TypeTagExclusion",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Varinat Attribution" ],
  "name" : "bc_a_TypeTagExclusion",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">2838</element>\n        <element LOVID=\"Type_Tag\">2486</element>\n        <element LOVID=\"Type_Tag\">2477</element>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">2836</element>\n        <element LOVID=\"Type_Tag\">2842</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n        <element LOVID=\"Type_Tag\">2481</element>\n        <element LOVID=\"Type_Tag\">2841</element>\n        <element LOVID=\"Type_Tag\">2839</element>\n        <element LOVID=\"Type_Tag\">2840</element>\n        <element LOVID=\"Type_Tag\">2835</element>\n        <element LOVID=\"Type_Tag\">2837</element>\n        <element LOVID=\"Type_Tag\">2482</element>\n        <element LOVID=\"Type_Tag\">2877</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">2838</element>\n        <element LOVID=\"Type_Tag\">2486</element>\n        <element LOVID=\"Type_Tag\">2484</element>\n        <element LOVID=\"Type_Tag\">2483</element>\n        <element LOVID=\"Type_Tag\">2749</element>\n        <element LOVID=\"Type_Tag\">2477</element>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">2836</element>\n        <element LOVID=\"Type_Tag\">2480</element>\n        <element LOVID=\"Type_Tag\">2842</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n        <element LOVID=\"Type_Tag\">2481</element>\n        <element LOVID=\"Type_Tag\">2841</element>\n        <element LOVID=\"Type_Tag\">2839</element>\n        <element LOVID=\"Type_Tag\">2479</element>\n        <element LOVID=\"Type_Tag\">2840</element>\n        <element LOVID=\"Type_Tag\">2835</element>\n        <element LOVID=\"Type_Tag\">2478</element>\n        <element LOVID=\"Type_Tag\">2837</element>\n        <element LOVID=\"Type_Tag\">2482</element>\n        <element LOVID=\"Type_Tag\">2877</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Type_Tag\">2838</element>\n        <element LOVID=\"Type_Tag\">2486</element>\n        <element LOVID=\"Type_Tag\">2484</element>\n        <element LOVID=\"Type_Tag\">2483</element>\n        <element LOVID=\"Type_Tag\">2749</element>\n        <element LOVID=\"Type_Tag\">2477</element>\n        <element LOVID=\"Type_Tag\">197865661</element>\n        <element LOVID=\"Type_Tag\">2836</element>\n        <element LOVID=\"Type_Tag\">2480</element>\n        <element LOVID=\"Type_Tag\">2842</element>\n        <element LOVID=\"Type_Tag\">197865662</element>\n        <element LOVID=\"Type_Tag\">2481</element>\n        <element LOVID=\"Type_Tag\">2841</element>\n        <element LOVID=\"Type_Tag\">2839</element>\n        <element LOVID=\"Type_Tag\">2479</element>\n        <element LOVID=\"Type_Tag\">2840</element>\n        <element LOVID=\"Type_Tag\">2835</element>\n        <element LOVID=\"Type_Tag\">2478</element>\n        <element LOVID=\"Type_Tag\">2837</element>\n        <element LOVID=\"Type_Tag\">2482</element>\n        <element LOVID=\"Type_Tag\">2877</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Type_Tag_Exclusions"
  } ],
  "pluginType" : "Operation"
}
*/
