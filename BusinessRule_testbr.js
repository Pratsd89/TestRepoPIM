/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "testbr",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBRs_Indu" ],
  "name" : "TestBR",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  }, {
    "libraryId" : "Test_Library",
    "libraryAlias" : "test"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "bomCC",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_BOM_CC_Number",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "createWPTLink",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "styleLinkToWebProductType",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "brand",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Brand_Number",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,bomCC,createWPTLink,brand,qh,compCheck,test) {
// PPIM-10741
var BOMCClookup = new java.util.HashMap();
BOMCClookup.put("GAP", "GO");
BOMCClookup.put("BR", "BRFS");
var markets = node.getValue("a_Market_Designation").getSimpleValue();

if (markets != null && markets.contains("SA")) {
    var parentStyle = node.getParent();
    var saOption = parentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();
    if (saOption == null || !saOption.contains("SA")) {
        parentStyle.getValue("a_Inherit_US_Copy_Option").addValue("SA");
    }
    var brandNum = node.getValue('a_Brand_Number').getSimpleValue();
    var BOMMCCBrand = BOMCClookup.get(brandNum);

    //setting the default Web Product Type and Size Chart Values
    if (markets == "SA") {
        if (brandNum != null) {
            var brand_wpt = "a_" + brandNum + "_WebProductType";
            var brand_sizeChart = "a_Size_Chart_" + brandNum
            parentStyle.getValue("a_Web_Product_Type").setSimpleValue("needs wpt");
            parentStyle.getValue(brand_wpt).setSimpleValue("needs wpt");
            createWPTLink.execute(parentStyle);
            parentStyle.getValue(brand_sizeChart).setSimpleValue("No Size Chart");
        }
    }
    
    var bomCCNumber = node.getValue("a_BOM_CC_Number").getSimpleValue();
    if (bomCCNumber != null) {
        createCCAndStyleBOMReferences(bomCCNumber, BOMMCCBrand);
    }
}

function createCCAndStyleBOMReferences(bomCCNumber, BOMMCCBrand) {
    var c = com.stibo.query.condition.Conditions;

    var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
        c.valueOf(bomCC).eq(bomCCNumber)
            .and(c.valueOf(brand).eq(BOMMCCBrand))
            .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
    );
    var res = querySpecification.execute();

    if (res) {
        res.forEach(function (resNode) {
            var currentMarketDesignation = resNode.getValue("a_Market_Designation").getSimpleValue();
            
            if (resNode.getID() != node.getID() && (currentMarketDesignation != null && currentMarketDesignation.contains("US"))) {
                deleteReferencesIfExists();
                var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
                var ccRefCreated = node.createReference(resNode, refType);
                var targetBOMStyle = resNode.getParent();
                var refTypeStyle = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_Style");
                var parentStyle = node.getParent();
                var styleRefCreated = parentStyle.createReference(targetBOMStyle, refTypeStyle);
            }
            return true;
        });
    }
}

function deleteReferencesIfExists() {
    var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
    var BOMCCRefList = node.getReferences(refType).toArray();
    BOMCCRefList.forEach(function (ref) {
        ref.delete();
    });
    var refTypeStyle = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_Style");
    var StyleBOMCCRefList = parentStyle.getReferences(refTypeStyle).toArray();
    StyleBOMCCRefList.forEach(function (ref) {
        ref.delete();
    });
}
}