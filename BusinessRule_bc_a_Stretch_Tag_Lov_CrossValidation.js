/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "bc_a_Stretch_Tag_Lov_CrossValidation",
  "type" : "BusinessCondition",
  "setupGroups" : [ "LovCrossValidation" ],
  "name" : "bc_a_Stretch_Tag_Lov_CrossValidation",
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
    "value" : "<map>\n  <entry>\n    <key LOVID=\"Brand\">1</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">7</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">2</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">4</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">12</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">3</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">5</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n  <entry>\n    <key LOVID=\"Brand\">11</key>\n    <value>\n      <set>\n        <element LOVID=\"Stretch_Tag\">2543</element>\n        <element LOVID=\"Stretch_Tag\">128407377</element>\n        <element LOVID=\"Stretch_Tag\">2541</element>\n        <element LOVID=\"Stretch_Tag\">2618</element>\n        <element LOVID=\"Stretch_Tag\">2604</element>\n        <element LOVID=\"Stretch_Tag\">2540</element>\n        <element LOVID=\"Stretch_Tag\">2615</element>\n        <element LOVID=\"Stretch_Tag\">2605</element>\n        <element LOVID=\"Stretch_Tag\">128407225</element>\n        <element LOVID=\"Stretch_Tag\">2542</element>\n        <element LOVID=\"Stretch_Tag\">2606</element>\n        <element LOVID=\"Stretch_Tag\">2616</element>\n        <element LOVID=\"Stretch_Tag\">2617</element>\n      </set>\n    </value>\n  </entry>\n</map>"
  }, {
    "id" : "DefiningAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Brand_Number"
  }, {
    "id" : "DependentAttribute",
    "type" : "com.stibo.core.domain.Attribute",
    "value" : "a_Stretch_Tag"
  } ],
  "pluginType" : "Operation"
}
*/
