/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ProductTagBU_Append",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Product Tag BU - Append",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
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
exports.operation0 = function (departmentTag,productTypeTag,categoryGroupTag,styleTag,boutiqueTag,activityTag,brandTag,collarTag,collectionTag,detailsFeaturesTag,fabricMaterialTag,fitTag,legShapeTag,lengthTag,necklineTag,occasionTag,panelTypeTag,performanceTag,pregnancyStageTag,riseTag,sleeveLengthTag,supportTypeTag,sustainabilityTag,warmthRatingTag,washTag,node,log,manager,categoryTag,webui,packageQuantityTag,jewelryMaterialTag,stretchTag,typeTag,destructionTag,coverageTag,sleeveTypeTag,popularSearchesTag,braTypeTag,inseamTag,compressionLevelTag,teamTag,closureTypeTag,printsTag,footEnclosureTag,valueID,qh,pocketsTag,linerTag,fabricTextureTag,derivedDepartmentTag,collaborationsTag,itemTypeTag) {
function updateMultiValueAttr(node, multiAttrID, valueToAdd) {
    var multiValues = node.getValue(multiAttrID).getValues();
    for (var i = 0; i < multiValues.size(); i++) {
        var multiValueValueID = multiValues.get(i).getID();
        if (multiValueValueID.equals(valueToAdd)) {
            return "false";
        }
    }

    if (multiAttrID == "a_Boutique_Tag_Inherit" || multiAttrID == "a_CategoryGroup_Tag_Inherit" || multiAttrID == "a_Category_Tag_Inherit" || multiAttrID == "a_Department_Tag_Inherit" || multiAttrID == "a_ProductType_Tag_Inherit" || multiAttrID == "a_Style_Tag_Inherit") {
        flag = true;
        return "true";
    }

    var brand = node.getValue("a_Brand_Number").getSimpleValue();
    var brandNodeID = "ProductTags_" + brand;
    var parent = manager.getClassificationHome().getClassificationByID(brandNodeID);

    if (brand != null && brand != "GPS") {
        var brandNodeID = "ProductTags_" + brand;
        var c = com.stibo.query.condition.Conditions;
        var isBelowCondition = c.hierarchy().simpleBelow(parent);

        var querySpecification = qh.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
            .and(c.valueOf(valueID).eq(valueToAdd))
            .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("Tag_Value")))
        );

        var res = querySpecification.execute();
        log.info(res.asList(500).size());

        if (res.asList(500).size() == 1) {
            flag = true;
            return "true";
        }
    } else {
        return "true";
    }
    return "filter";
}

var attribute,
    attributeID,
    lov,
    lovValue,
    addValueCheck;
var selectedNodes = webui.getSelection().iterator();
var logArray = new Array();
var flag = false;

while (selectedNodes.hasNext()) {
    var selectNode = selectedNodes.next();
    var selectNodeID = selectNode.getID();

    if (departmentTag != null) {
        var tagArray = [];

        if (!(departmentTag.indexOf("<multisep/>") < 0)) {
            departmentTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(departmentTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Department Tag.";
            attributeID = "a_Department_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();

            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true") {
                selectNode.getValue("a_Department_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (productTypeTag != null) {
        var tagArray = [];

        if (!(productTypeTag.indexOf("<multisep/>") < 0)) {
            productTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(productTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Product Type Tag.";
            attributeID = "a_ProductType_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_ProductType_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (categoryGroupTag != null) {
        var tagArray = [];

        if (!(categoryGroupTag.indexOf("<multisep/>") < 0)) {
            categoryGroupTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(categoryGroupTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Category Group Tag.";
            attributeID = "a_CategoryGroup_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_CategoryGroup_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (styleTag != null) {
        var tagArray = [];

        if (!(styleTag.indexOf("<multisep/>") < 0)) {
            styleTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(styleTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Style Tag.";
            attributeID = "a_Style_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Style_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (boutiqueTag != null) {
        var tagArray = [];

        if (!(boutiqueTag.indexOf("<multisep/>") < 0)) {
            boutiqueTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(boutiqueTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Boutique Tag.";
            attributeID = "a_Boutique_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Boutique_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (activityTag != null) {
        var tagArray = [];

        if (!(activityTag.indexOf("<multisep/>") < 0)) {
            activityTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(activityTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Activity Tag.";
            attributeID = "a_Activity_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Activity_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (brandTag != null) {
        var tagArray = [];

        if (!(brandTag.indexOf("<multisep/>") < 0)) {
            brandTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(brandTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Brand Tag.";
            attributeID = "a_Brand_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Brand_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (closureTypeTag != null) {
        var tagArray = [];

        if (!(closureTypeTag.indexOf("<multisep/>") < 0)) {
            closureTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(closureTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Closure Type Tag";
            attributeID = "a_ClosureType_Tag_Inherit";
            //      webui.showAlert("SUCCESS", attributeID);
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();

            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }
            //	 webui.showAlert("SUCCESS", tagValID);
            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_ClosureType_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (collarTag != null) {
        var tagArray = [];

        if (!(collarTag.indexOf("<multisep/>") < 0)) {
            collarTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(collarTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Collar Tag.";
            attributeID = "a_Collar_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Collar_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (collectionTag != null) {
        var tagArray = [];

        if (!(collectionTag.indexOf("<multisep/>") < 0)) {
            collectionTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(collectionTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Collection Tag.";
            attributeID = "a_Collection_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Collection_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (detailsFeaturesTag != null) {
        var tagArray = [];

        if (!(detailsFeaturesTag.indexOf("<multisep/>") < 0)) {
            detailsFeaturesTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(detailsFeaturesTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Details/Feature Tag.";
            attributeID = "a_Details_Features_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Details_Features_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (fabricMaterialTag != null) {
        var tagArray = [];

        if (!(fabricMaterialTag.indexOf("<multisep/>") < 0)) {
            fabricMaterialTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(fabricMaterialTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Fabric Material Tag.";
            attributeID = "a_Fabric_Material_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Fabric_Material_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (fitTag != null) {
        var tagArray = [];

        if (!(fitTag.indexOf("<multisep/>") < 0)) {
            fitTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(fitTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Fit Tag.";
            attributeID = "a_Fit_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Fit_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (footEnclosureTag != null) {
        var tagArray = [];

        if (!(footEnclosureTag.indexOf("<multisep/>") < 0)) {
            footEnclosureTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(footEnclosureTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Foot Enclosure Tag.";
            attributeID = "a_FootEnclosure_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();

            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_FootEnclosure_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (jewelryMaterialTag != null) {
        var tagArray = [];

        if (!(jewelryMaterialTag.indexOf("<multisep/>") < 0)) {
            jewelryMaterialTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(jewelryMaterialTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Jewelry Material Tag.";
            attributeID = "a_Jewelry_Material_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Jewelry_Material_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (legShapeTag != null) {
        var tagArray = [];

        if (!(legShapeTag.indexOf("<multisep/>") < 0)) {
            legShapeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(legShapeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Leg Shape Tag.";
            attributeID = "a_LegShape_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_LegShape_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (lengthTag != null) {
        var tagArray = [];

        if (!(lengthTag.indexOf("<multisep/>") < 0)) {
            lengthTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(lengthTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Length Tag.";
            attributeID = "a_Length_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Length_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (necklineTag != null) {
        var tagArray = [];

        if (!(necklineTag.indexOf("<multisep/>") < 0)) {
            necklineTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(necklineTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Neckline Tag.";
            attributeID = "a_Neckline_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Neckline_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (occasionTag != null) {
        var tagArray = [];

        if (!(occasionTag.indexOf("<multisep/>") < 0)) {
            occasionTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(occasionTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Occasion Tag.";
            attributeID = "a_Occasion_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Occasion_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (packageQuantityTag != null) {
        var tagArray = [];

        if (!(packageQuantityTag.indexOf("<multisep/>") < 0)) {
            packageQuantityTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(packageQuantityTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Package Quantity Tag.";
            attributeID = "a_Package_Quantity_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Package_Quantity_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (panelTypeTag != null) {
        var tagArray = [];

        if (!(panelTypeTag.indexOf("<multisep/>") < 0)) {
            panelTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(panelTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Panel Type Tag.";
            attributeID = "a_PanelType_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_PanelType_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (performanceTag != null) {
        var tagArray = [];

        if (!(performanceTag.indexOf("<multisep/>") < 0)) {
            performanceTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(performanceTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Performance Tag.";
            attributeID = "a_Performance_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Performance_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (pregnancyStageTag != null) {
        var tagArray = [];

        if (!(pregnancyStageTag.indexOf("<multisep/>") < 0)) {
            pregnancyStageTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(pregnancyStageTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Pregnancy Stage Tag.";
            attributeID = "a_PregnancyStage_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_PregnancyStage_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (printsTag != null) {
        var tagArray = [];

        if (!(printsTag.indexOf("<multisep/>") < 0)) {
            printsTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(printsTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Prints Tag.";
            attributeID = "a_Prints_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();

            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Prints_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (riseTag != null) {
        var tagArray = [];

        if (!(riseTag.indexOf("<multisep/>") < 0)) {
            riseTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(riseTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Rise Tag.";
            attributeID = "a_Rise_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Rise_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (sleeveLengthTag != null) {
        var tagArray = [];

        if (!(sleeveLengthTag.indexOf("<multisep/>") < 0)) {
            sleeveLengthTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(sleeveLengthTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Sleeve Length Tag.";
            attributeID = "a_SleeveLength_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_SleeveLength_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (supportTypeTag != null) {
        var tagArray = [];

        if (!(supportTypeTag.indexOf("<multisep/>") < 0)) {
            supportTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(supportTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Support Type Tag.";
            attributeID = "a_SupportType_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_SupportType_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (sustainabilityTag != null) {
        var tagArray = [];

        if (!(sustainabilityTag.indexOf("<multisep/>") < 0)) {
            sustainabilityTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(sustainabilityTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Sustainability Tag.";
            attributeID = "a_Sustainability_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Sustainability_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (warmthRatingTag != null) {
        var tagArray = [];

        if (!(warmthRatingTag.indexOf("<multisep/>") < 0)) {
            warmthRatingTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(warmthRatingTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Warmth Rating Tag.";
            attributeID = "a_WarmthRating_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_WarmthRating_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (washTag != null) {
        var tagArray = [];

        if (!(washTag.indexOf("<multisep/>") < 0)) {
            washTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(washTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Wash Tag.";
            attributeID = "a_Wash_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Wash_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (categoryTag != null) {
        var tagArray = [];

        if (!(categoryTag.indexOf("<multisep/>") < 0)) {
            categoryTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(categoryTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Category Tag.";
            attributeID = "a_Category_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Category_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (stretchTag != null) {
        var tagArray = [];

        if (!(stretchTag.indexOf("<multisep/>") < 0)) {
            stretchTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(stretchTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Stretch Tag.";
            attributeID = "a_Stretch_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Stretch_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (typeTag != null) {
        var tagArray = [];

        if (!(typeTag.indexOf("<multisep/>") < 0)) {
            typeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(typeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Type Tag.";
            attributeID = "a_Type_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Type_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (destructionTag != null) {
        var tagArray = [];

        if (!(destructionTag.indexOf("<multisep/>") < 0)) {
            destructionTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(destructionTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Destruction Tag.";
            attributeID = "a_Destruction_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Destruction_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (coverageTag != null) {
        var tagArray = [];

        if (!(coverageTag.indexOf("<multisep/>") < 0)) {
            coverageTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(coverageTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Coverage Tag.";
            attributeID = "a_Coverage_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Coverage_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (sleeveTypeTag != null) {
        var tagArray = [];

        if (!(sleeveTypeTag.indexOf("<multisep/>") < 0)) {
            sleeveTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(sleeveTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Sleeve Type Tag";
            attributeID = "a_SleeveType_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_SleeveType_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (popularSearchesTag != null) {
        var tagArray = [];

        if (!(popularSearchesTag.indexOf("<multisep/>") < 0)) {
            popularSearchesTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(popularSearchesTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Popular Searches Tag";
            attributeID = "a_PopularSearches_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_PopularSearches_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (compressionLevelTag != null) {
        var tagArray = [];

        if (!(compressionLevelTag.indexOf("<multisep/>") < 0)) {
            compressionLevelTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(compressionLevelTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Compression Level Tag";
            attributeID = "a_CompressionLevel_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_CompressionLevel_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (inseamTag != null) {
        var tagArray = [];

        if (!(inseamTag.indexOf("<multisep/>") < 0)) {
            inseamTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(inseamTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Inseam Tag";
            attributeID = "a_Inseam_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Inseam_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    if (braTypeTag != null) {
        var tagArray = [];

        if (!(braTypeTag.indexOf("<multisep/>") < 0)) {
            braTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(braTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Bra Type Tag";
            attributeID = "a_BraType_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_BraType_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }

    //PPIM-13868
    if (teamTag != null) {
        var tagArray = [];

        if (!(teamTag.indexOf("<multisep/>") < 0)) {
            teamTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(teamTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Team Tag";
            attributeID = "a_Team_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Team_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (pocketsTag != null) {
        var tagArray = [];

        if (!(pocketsTag.indexOf("<multisep/>") < 0)) {
            pocketsTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(pocketsTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Pockets Tag";
            attributeID = "a_Pockets_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Pockets_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (linerTag != null) {
        var tagArray = [];

        if (!(linerTag.indexOf("<multisep/>") < 0)) {
            linerTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(linerTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Liner Tag";
            attributeID = "a_Liner_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Liner_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
    if (fabricTextureTag != null) {
        var tagArray = [];

        if (!(fabricTextureTag.indexOf("<multisep/>") < 0)) {
            fabricTextureTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(fabricTextureTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Fabric Texture Tag";
            attributeID = "a_Fabric_Texture_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Fabric_Texture_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
        if (derivedDepartmentTag != null) {
        var tagArray = [];

        if (!(derivedDepartmentTag.indexOf("<multisep/>") < 0)) {
            derivedDepartmentTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(derivedDepartmentTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Derived Department Tag";
            attributeID = "a_Derived_Department_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Derived_Department_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
            if (collaborationsTag != null) {
        var tagArray = [];

        if (!(collaborationsTag.indexOf("<multisep/>") < 0)) {
            collaborationsTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(collaborationsTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "Collaborations Tag";
            attributeID = "a_Collaborations_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_Collaborations_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
                if (itemTypeTag != null) {
        var tagArray = [];

        if (!(itemTypeTag.indexOf("<multisep/>") < 0)) {
            itemTypeTag.split("<multisep/>").forEach(function (tagValID) {
                tagArray.push(tagValID);
            });
        } else {
            tagArray.push(itemTypeTag);
        }

        tagArray.forEach(function (tagValID) {
            attribute = "ItemType Tag";
            attributeID = "a_ItemType_Tag_Inherit";
            lov = manager.getAttributeHome().getAttributeByID(attributeID).getListOfValues();
            try {
                lovValue = lov.getListOfValuesValueByID(tagValID).getValue();
            } catch (e) {
                lovValue = null;
            }

            addValueCheck = updateMultiValueAttr(selectNode, attributeID, tagValID);

            if (addValueCheck == "true" && lovValue != null) {
                selectNode.getValue("a_ItemType_Tag_Inherit").addLOVValueByID(tagValID);
            } else if (addValueCheck == "filter") {
                if (!logArray.includes(attribute)) {
                    logArray.push(attribute);
                }
            }
        });
    }
}

if (flag && logArray.length > 0) {
    webui.showAlert("WARNING", "Applicable brand tags were successfully added. However, 1 or more tag values from another brand were selected. The following tags were not added and are not specific to your brand: ", logArray.toString());
} else if (logArray.length > 0) {
    webui.showAlert("WARNING", "Tag values from one brand cannot be added to another. The following tags do not have brand-specific values: ", logArray.toString());
}
//updated
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
      } else {
        usNode = node;
      }

      //Get US inclusion tags
      var inclusionTagUS = usNode.getValue("a_Category_Tag_Inherit");

      //Utilize lookup table to apply US inclusion tags in every context (added as apart of PPIM-7232)

      //If current node object type is Style, set MktDsg array with Style Market Designations
      if (node.getObjectType().getID() == "Style") {
        var MktDsg = node
          .getValue("a_Style_Market_Designation")
          .getValues()
          .toArray();
      }
      //If current node object type is CC, set MktDsg array with CC Market Designations
      if (node.getObjectType().getID() == "CustomerChoice") {
        var MktDsg = node
          .getValue("a_Market_Designation")
          .getValues()
          .toArray();
      }

      var Contexts = new Array();

      //Get Context ID for each market form lookup table
      MktDsg.forEach(function (Mkt) {
        Contexts.push(
          LKT.getLookupTableValue(
            "LKT_MarketDesignationToMarket",
            Mkt.getSimpleValue()
          )
        );
      });

      //For each context, apply value of "a_Category_Tag_Inherit"
      Contexts.forEach(function (Ctxt) {
        manager.executeInContext(Ctxt, function (tManager) {
          var tNode = tManager.getProductHome().getProductByID(node.getID());
          tNode
            .getValue("a_Category_Tag_Inherit")
            .setSimpleValue(inclusionTagUS.getSimpleValue());
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
	if(obj == "Style" || obj == "CustomerChoice" || obj == "SKU")
	{
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
