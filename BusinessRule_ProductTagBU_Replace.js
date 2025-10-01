/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ProductTagBU_Replace",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Product Tag BU - Replace",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "Style" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "departmentTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Department_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">departmentTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productTypeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_ProductType_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">productTypeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "categoryGroupTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_CategoryGroup_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">categoryGroupTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "styleTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Style_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">styleTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "boutiqueTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Boutique_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">boutiqueTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "activityTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Activity_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">activityTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "brandTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Brand_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">brandTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "collarTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Collar_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">collarTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "collectionTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Collection_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">collectionTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "detailsFeaturesTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Details_Features_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">detailsFeaturesTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "fabricMaterialTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Fabric_Material_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">fabricMaterialTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "fitTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Fit_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">fitTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "legShapeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_LegShape_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">legShapeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "lengthTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Length_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">lengthTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "necklineTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Neckline_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">necklineTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "occasionTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Occasion_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">occasionTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "panelTypeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_PanelType_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">panelTypeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "performanceTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Performance_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">performanceTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "pregnancyStageTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_PregnancyStage_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">pregnancyStageTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "riseTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Rise_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">riseTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "sleeveLengthTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_SleeveLength_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">sleeveLengthTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "supportTypeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_SupportType_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">supportTypeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "sustainabilityTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Sustainability_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">sustainabilityTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "warmthRatingTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_WarmthRating_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">warmthRatingTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "washTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Wash_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">washTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "categoryTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Category_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">categoryTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "packageQuantityTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Package_Quantity_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">packageQuantityTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "jewelryMaterialTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Jewelry_Material_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">jewelryMaterialTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "stretchTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Stretch_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">stretchTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "typeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Type_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">typeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "destructionTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Destruction_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">destructionTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "coverageTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Coverage_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">coverageTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "sleeveTypeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_SleeveType_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">sleeveTypeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "popularSearchesTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_PopularSearches_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">popularSearchesTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "braTypeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_BraType_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">braTypeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "inseamTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Inseam_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">inseamTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "compressionLevelTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_CompressionLevel_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">compressionLevelTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "teamTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Team_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">teamTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "closureTypeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_ClosureType_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">closureTypeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "printsTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Prints_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">printsTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "footEnclosureTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_FootEnclosure_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">footEnclosureTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "valueID",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "ValueID",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "pocketsTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Pockets_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">pocketsTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "linerTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Liner_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">linerTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "fabricTextureTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Fabric_Texture_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">fabricTextureTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "derivedDepartmentTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Derived_Department_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">derivedDepartmentTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "collaborationsTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Collaborations_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">collaborationsTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "itemTypeTag",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_ItemType_Tag_Inherit</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">itemTypeTagVal</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (departmentTag,productTypeTag,categoryGroupTag,styleTag,boutiqueTag,activityTag,brandTag,collarTag,collectionTag,detailsFeaturesTag,fabricMaterialTag,fitTag,legShapeTag,lengthTag,necklineTag,occasionTag,panelTypeTag,performanceTag,pregnancyStageTag,riseTag,sleeveLengthTag,supportTypeTag,sustainabilityTag,warmthRatingTag,washTag,node,log,categoryTag,packageQuantityTag,jewelryMaterialTag,stretchTag,typeTag,destructionTag,web,step,coverageTag,sleeveTypeTag,popularSearchesTag,braTypeTag,inseamTag,compressionLevelTag,teamTag,closureTypeTag,printsTag,footEnclosureTag,valueID,qh,pocketsTag,linerTag,fabricTextureTag,derivedDepartmentTag,collaborationsTag,itemTypeTag) {
function checkValidValue(node, valueToAdd) {
    var brand = node.getValue("a_Brand_Number").getSimpleValue();
    var brandNodeID = "ProductTags_" + brand;
    var parent = step.getClassificationHome().getClassificationByID(brandNodeID);

    if (brand != null && brand != "GPS") {
        var brandNodeID = "ProductTags_" + brand;
        var c = com.stibo.query.condition.Conditions;
        var isBelowCondition = c.hierarchy().simpleBelow(parent);

        var querySpecification = qh.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
            .and(c.valueOf(valueID).eq(valueToAdd))
            .and(c.objectType(step.getObjectTypeHome().getObjectTypeByID("Tag_Value")))
        );

        var res = querySpecification.execute();
        if (res.asList(500).size() == 1) {
            flag = true;
            return true;
        }
    } else {
        return true;
    }
    return false;
}


var selectedNodes = web.getSelection().iterator();
var logArray = new Array();
var flag = false;

while (selectedNodes.hasNext()) {
    var selectNode = selectedNodes.next();

    if (departmentTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(departmentTag.indexOf("<multisep/>") < 0)) {
            departmentTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(departmentTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Department_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();
            flag = true;

            if (setValue == true) {
                setValue = false;
                selectNode.getValue("a_Department_Tag_Inherit").setSimpleValue(valueToSet);
            } else {
                selectNode.getValue("a_Department_Tag_Inherit").addLOVValueByID(tagValID);
            }
        });
    }
    if (productTypeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(productTypeTag.indexOf("<multisep/>") < 0)) {
            productTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(productTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_ProductType_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();
            flag = true;

            if (setValue == true) {
                setValue = false;
                selectNode.getValue("a_ProductType_Tag_Inherit").setSimpleValue(valueToSet);
            } else {
                selectNode.getValue("a_ProductType_Tag_Inherit").addLOVValueByID(tagValID);
            }
        });
    }
    if (categoryGroupTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(categoryGroupTag.indexOf("<multisep/>") < 0)) {
            categoryGroupTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(categoryGroupTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_CategoryGroup_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();
            flag = true;

            if (setValue == true) {
                setValue = false;
                selectNode.getValue("a_CategoryGroup_Tag_Inherit").setSimpleValue(valueToSet);
            } else {
                selectNode.getValue("a_CategoryGroup_Tag_Inherit").addLOVValueByID(tagValID);
            }
        });
    }
    if (styleTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(styleTag.indexOf("<multisep/>") < 0)) {
            styleTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(styleTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Style_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();
            flag = true;

            if (setValue == true) {
                setValue = false;
                selectNode.getValue("a_Style_Tag_Inherit").setSimpleValue(valueToSet);
            } else {
                selectNode.getValue("a_Style_Tag_Inherit").addLOVValueByID(tagValID);
            }
        });
    }
    if (boutiqueTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(boutiqueTag.indexOf("<multisep/>") < 0)) {
            boutiqueTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(boutiqueTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Boutique_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();
            flag = true;

            if (setValue == true) {
                setValue = false;
                selectNode.getValue("a_Boutique_Tag_Inherit").setSimpleValue(valueToSet);
            } else {
                selectNode.getValue("a_Boutique_Tag_Inherit").addLOVValueByID(tagValID);
            }
        });
    }
    if (activityTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(activityTag.indexOf("<multisep/>") < 0)) {
            activityTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(activityTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Activity_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Activity_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Activity_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Activity Tag")) {
                    logArray.push("Activity Tag");
                }
            }
        });
    }
    if (brandTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(brandTag.indexOf("<multisep/>") < 0)) {
            brandTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(brandTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Brand_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Brand_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Brand_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Brand Tag")) {
                    logArray.push("Brand Tag");
                }
            }
        });
    }

    if (closureTypeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(closureTypeTag.indexOf("<multisep/>") < 0)) {
            closureTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(closureTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_ClosureType_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_ClosureType_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_ClosureType_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Closure Type Tag")) {
                    logArray.push("Closure Type Tag");
                }
            }
        });
    }

    if (collarTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(collarTag.indexOf("<multisep/>") < 0)) {
            collarTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(collarTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Collar_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Collar_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Collar_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Collar Tag")) {
                    logArray.push("Collar Tag");
                }
            }
        });
    }
    if (collectionTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(collectionTag.indexOf("<multisep/>") < 0)) {
            collectionTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(collectionTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Collection_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Collection_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Collection_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Collection Tag")) {
                    logArray.push("Collection Tag");
                }
            }
        });
    }
    if (detailsFeaturesTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(detailsFeaturesTag.indexOf("<multisep/>") < 0)) {
            detailsFeaturesTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(detailsFeaturesTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Details_Features_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Details_Features_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Details_Features_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Details Features Tag")) {
                    logArray.push("Details Features Tag");
                }
            }
        });
    }
    if (fabricMaterialTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(fabricMaterialTag.indexOf("<multisep/>") < 0)) {
            fabricMaterialTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(fabricMaterialTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Fabric_Material_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Fabric_Material_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Fabric_Material_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Fabric Material Tag")) {
                    logArray.push("Fabric Material Tag");
                }
            }
        });
    }
    if (fitTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(fitTag.indexOf("<multisep/>") < 0)) {
            fitTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(fitTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Fit_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Fit_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Fit_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Fit Tag")) {
                    logArray.push("Fit Tag");
                }
            }
        });
    }

    if (footEnclosureTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(footEnclosureTag.indexOf("<multisep/>") < 0)) {
            footEnclosureTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(footEnclosureTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_FootEnclosure_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_FootEnclosure_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_FootEnclosure_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Foot Enclosure Tag")) {
                    logArray.push("Foot Enclosure Tag");
                }
            }
        });
    }

    if (jewelryMaterialTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(jewelryMaterialTag.indexOf("<multisep/>") < 0)) {
            jewelryMaterialTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(jewelryMaterialTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Jewelry_Material_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Jewelry_Material_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Jewelry_Material_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Jewelry Material Tag")) {
                    logArray.push("Jewelry Material Tag");
                }
            }
        });
    }
    if (legShapeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(legShapeTag.indexOf("<multisep/>") < 0)) {
            legShapeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(legShapeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_LegShape_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_LegShape_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_LegShape_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("LegShape Tag")) {
                    logArray.push("LegShape Tag");
                }
            }
        });
    }
    if (lengthTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(lengthTag.indexOf("<multisep/>") < 0)) {
            lengthTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(lengthTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Length_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Length_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Length_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Length Tag")) {
                    logArray.push("Length Tag");
                }
            }
        });
    }
    if (necklineTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(necklineTag.indexOf("<multisep/>") < 0)) {
            necklineTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(necklineTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Neckline_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Neckline_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Neckline_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Neckline Tag")) {
                    logArray.push("Neckline Tag");
                }
            }
        });
    }
    if (occasionTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(occasionTag.indexOf("<multisep/>") < 0)) {
            occasionTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(occasionTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Occasion_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Occasion_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Occasion_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Occasion Tag")) {
                    logArray.push("Occasion Tag");
                }
            }
        });
    }
    if (packageQuantityTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(packageQuantityTag.indexOf("<multisep/>") < 0)) {
            packageQuantityTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(packageQuantityTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Package_Quantity_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Package_Quantity_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Package_Quantity_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Package Quantity Tag")) {
                    logArray.push("Package Quantity Tag");
                }
            }
        });
    }
    if (panelTypeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(panelTypeTag.indexOf("<multisep/>") < 0)) {
            panelTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(panelTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_PanelType_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_PanelType_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_PanelType_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Panel Type Tag")) {
                    logArray.push("Panel Type Tag");
                }
            }
        });
    }
    if (performanceTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(performanceTag.indexOf("<multisep/>") < 0)) {
            performanceTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(performanceTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Performance_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Performance_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Performance_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Performance Tag")) {
                    logArray.push("Performance Tag");
                }
            }
        });
    }
    if (pregnancyStageTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(pregnancyStageTag.indexOf("<multisep/>") < 0)) {
            pregnancyStageTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(pregnancyStageTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_PregnancyStage_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_PregnancyStage_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_PregnancyStage_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Pregnancy Stage Tag")) {
                    logArray.push("Pregnancy Stage Tag");
                }
            }
        });
    }

    if (printsTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(printsTag.indexOf("<multisep/>") < 0)) {
            printsTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(printsTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Prints_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Prints_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Prints_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Prints Tag")) {
                    logArray.push("Prints Tag");
                }
            }
        });
    }

    if (riseTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(riseTag.indexOf("<multisep/>") < 0)) {
            riseTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(riseTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Rise_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Rise_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Rise_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Rise Tag")) {
                    logArray.push("Rise Tag");
                }
            }
        });
    }
    if (sleeveLengthTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(sleeveLengthTag.indexOf("<multisep/>") < 0)) {
            sleeveLengthTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(sleeveLengthTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_SleeveLength_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_SleeveLength_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_SleeveLength_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Sleeve Length Tag")) {
                    logArray.push("Sleeve Length Tag");
                }
            }
        });
    }
    if (supportTypeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(supportTypeTag.indexOf("<multisep/>") < 0)) {
            supportTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(supportTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_SupportType_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_SupportType_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_SupportType_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Support Type Tag")) {
                    logArray.push("Support Type Tag");
                }
            }
        });
    }
    if (sustainabilityTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(sustainabilityTag.indexOf("<multisep/>") < 0)) {
            sustainabilityTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(sustainabilityTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Sustainability_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Sustainability_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Sustainability_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Sustainability Tag")) {
                    logArray.push("Sustainability Tag");
                }
            }
        });
    }
    if (warmthRatingTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(warmthRatingTag.indexOf("<multisep/>") < 0)) {
            warmthRatingTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(warmthRatingTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_WarmthRating_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_WarmthRating_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_WarmthRating_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Warmth Rating Tag")) {
                    logArray.push("Warmth Rating Tag");
                }
            }
        });
    }
    if (washTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(washTag.indexOf("<multisep/>") < 0)) {
            washTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(washTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Wash_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Wash_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Wash_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Wash Tag")) {
                    logArray.push("Wash Tag");
                }
            }
        });
    }
    if (categoryTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(categoryTag.indexOf("<multisep/>") < 0)) {
            categoryTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(categoryTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Category_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();
            flag = true;

            if (setValue == true) {
                setValue = false;
                selectNode.getValue("a_Category_Tag_Inherit").setSimpleValue(valueToSet);
            } else {
                selectNode.getValue("a_Category_Tag_Inherit").addLOVValueByID(tagValID);
            }
        });
    }
    if (stretchTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(stretchTag.indexOf("<multisep/>") < 0)) {
            stretchTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(stretchTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Stretch_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Stretch_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Stretch_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Stretch Tag")) {
                    logArray.push("Stretch Tag");
                }
            }
        });
    }
    if (typeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(typeTag.indexOf("<multisep/>") < 0)) {
            typeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(typeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Type_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Type_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Type_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Type Tag")) {
                    logArray.push("Type Tag");
                }
            }
        });
    }
    if (destructionTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(destructionTag.indexOf("<multisep/>") < 0)) {
            destructionTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(destructionTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Destruction_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Destruction_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Destruction_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Destruction Tag")) {
                    logArray.push("Destruction Tag");
                }
            }
        });
    }
    if (coverageTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(coverageTag.indexOf("<multisep/>") < 0)) {
            coverageTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(coverageTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Coverage_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Coverage_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Coverage_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Coverage Tag")) {
                    logArray.push("Coverage Tag");
                }
            }
        });
    }
    if (sleeveTypeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(sleeveTypeTag.indexOf("<multisep/>") < 0)) {
            sleeveTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(sleeveTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_SleeveType_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_SleeveType_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_SleeveType_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Sleeve Type Tag")) {
                    logArray.push("Sleeve Type Tag");
                }
            }
        });
    }
    if (popularSearchesTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(popularSearchesTag.indexOf("<multisep/>") < 0)) {
            popularSearchesTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(popularSearchesTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_PopularSearches_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_PopularSearches_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_PopularSearches_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Popular Searches Tag")) {
                    logArray.push("Popular Searches Tag");
                }
            }
        });
    }
    if (compressionLevelTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(compressionLevelTag.indexOf("<multisep/>") < 0)) {
            compressionLevelTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(compressionLevelTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_CompressionLevel_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_CompressionLevel_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_CompressionLevel_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Compression Level Tag")) {
                    logArray.push("Compression Level Tag");
                }
            }
        });
    }

    if (inseamTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(inseamTag.indexOf("<multisep/>") < 0)) {
            inseamTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(inseamTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Inseam_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Inseam_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Inseam_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Inseam Tag")) {
                    logArray.push("Inseam Tag");
                }
            }
        });
    }

    if (braTypeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(braTypeTag.indexOf("<multisep/>") < 0)) {
            braTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(braTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_BraType_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_BraType_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_BraType_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Bra Type Tag")) {
                    logArray.push("Bra Type Tag");
                }
            }
        });
    }

    if (teamTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(teamTag.indexOf("<multisep/>") < 0)) {
            teamTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(teamTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Team_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Team_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Team_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Team Tag")) {
                    logArray.push("Team Tag");
                }
            }
        });
    }
    if (pocketsTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(pocketsTag.indexOf("<multisep/>") < 0)) {
            pocketsTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(pocketsTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Pockets_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Pockets_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Pockets_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Pockets Tag")) {
                    logArray.push("Pockets Tag");
                }
            }
        });
    }
    if (linerTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(linerTag.indexOf("<multisep/>") < 0)) {
            linerTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(linerTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Liner_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Liner_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Liner_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Liner Tag")) {
                    logArray.push("Liner Tag");
                }
            }
        });
    }
    if (fabricTextureTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(fabricTextureTag.indexOf("<multisep/>") < 0)) {
            fabricTextureTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(fabricTextureTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Fabric_Texture_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Fabric_Texture_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Fabric_Texture_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Fabric Texture Tag")) {
                    logArray.push("Fabric Texture Tag");
                }
            }
        });
    }
        if (derivedDepartmentTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(derivedDepartmentTag.indexOf("<multisep/>") < 0)) {
            derivedDepartmentTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(derivedDepartmentTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Derived_Department_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Derived_Department_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Derived_Department_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Derived Department Tag")) {
                    logArray.push("Derived Department Tag");
                }
            }
        });
    }
            if (collaborationsTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(collaborationsTag.indexOf("<multisep/>") < 0)) {
            collaborationsTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(collaborationsTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Collaborations_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Collaborations_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Collaborations_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Collaborations Tag")) {
                    logArray.push("Collaborations Tag");
                }
            }
        });
    }
                if (collaborationsTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(collaborationsTag.indexOf("<multisep/>") < 0)) {
            collaborationsTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(collaborationsTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_Collaborations_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_Collaborations_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_Collaborations_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("Collaborations Tag")) {
                    logArray.push("Collaborations Tag");
                }
            }
        });
    }
    if (itemTypeTag != null) {
        var setValue = true;
        var tagArray = [];

        if (!(itemTypeTag.indexOf("<multisep/>") < 0)) {
            itemTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(itemTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            lov = step.getAttributeHome().getAttributeByID("a_ItemType_Tag_Inherit").getListOfValues();
            valueToSet = lov.getListOfValuesValueByID(tagValID).getValue();

            if (checkValidValue(selectNode, tagValID)) {
                if (setValue == true) {
                    setValue = false;
                    selectNode.getValue("a_ItemType_Tag_Inherit").setSimpleValue(valueToSet);
                } else {
                    selectNode.getValue("a_ItemType_Tag_Inherit").addLOVValueByID(tagValID);
                }
            } else {
                if (!logArray.includes("ItemType Tag")) {
                    logArray.push("ItemType Tag");
                }
            }
        });
    }
}

if (flag && logArray.length > 0) {
    web.showAlert("WARNING", "Applicable brand tags were successfully updated. However, 1 or more tag values from another brand were selected. The following tags were not updated and are not specific to your brand: ", logArray.toString());
}
else if (logArray.length > 0) {
    web.showAlert("WARNING", "Tag values from one brand cannot be updated for another. The following tags do not have brand-specific values:  ", logArray.toString());
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation1 = function (web,manager,LKT) {
/*
This rule works as follow: 
1.- Check if inherit us tags == yes
2.- Value of "a_Category_Tag_Inherit" should apply to all contexts
	It should apply no matter what context user is in
*/

//Get selected nodes from search page
selectedNodes = web.getSelection().iterator();

//While there are selected nodes to loop through
while (selectedNodes.hasNext()) {
  //Current node
  var node = selectedNodes.next();

  if (manager.getCurrentWorkspace().getID() == "Main") {
    var inheritUSTag = node.getValue("a_Inherit_US_Tags").getSimpleValue();

    //Check inherit US tag
    if (inheritUSTag != null && inheritUSTag.equalsIgnoreCase("Yes")) {
      var usNode;
      var currentContext = manager.getCurrentContext().getID();

      //Get US node
      if (!currentContext.equalsIgnoreCase("EN_US")) {
        manager.executeInContext("EN_US", function (oManager) {
          usNode = oManager.getProductHome().getProductByID(node.getID());
        });
      } 
      else {
        usNode = node;
      }

      //Get US inclusion tags
      var inclusionTagUS = usNode.getValue("a_Category_Tag_Inherit");

      //Utilize lookup table to apply US inclusion tags in every context (added as apart of PPIM-7232)

      //If current node object type is Style, set MktDsg array with Style Market Designations
      if (node.getObjectType().getID() == "Style") {
        var MktDsg = node.getValue("a_Style_Market_Designation").getValues().toArray();
      }
      //If current node object type is CC, set MktDsg array with CC Market Designations
      if (node.getObjectType().getID() == "CustomerChoice") {
        var MktDsg = node.getValue("a_Market_Designation").getValues().toArray();
      }

      var Contexts = new Array();

      //Get Context ID for each market form lookup table
      MktDsg.forEach(function (Mkt) {
        Contexts.push(LKT.getLookupTableValue("LKT_MarketDesignationToMarket", Mkt.getSimpleValue()));
      });

      //For each context, apply value of "a_Category_Tag_Inherit"
      Contexts.forEach(function (Ctxt) {
        manager.executeInContext(Ctxt, function (tManager) {
          var tNode = tManager.getProductHome().getProductByID(node.getID());
          tNode.getValue("a_Category_Tag_Inherit").setSimpleValue(inclusionTagUS.getSimpleValue());
        });
      });
    }
  }
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation2 = function (webui) {
var selectedNodes = webui.getSelection().iterator();
while (selectedNodes.hasNext()) {
  	var selectNode = selectedNodes.next();
	var obj = selectNode.getObjectType().getID(); 
	if(obj == "Style" || obj == "CustomerChoice" || obj == "SKU") {
		var time = new java.util.Date();
		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		//logger.info(iso.format(time));
		selectNode.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	}
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "br_Check_Style_Tags_Changed_in_Search"
  } ],
  "pluginType" : "Operation"
}
*/
