/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_matchAndLinkBOMCCStyle_JPN_SA",
  "type" : "BusinessAction",
  "setupGroups" : [ "SA Issue Fix BRs" ],
  "name" : "MatchAndLinkBOMCCStyle JP SA",
  "description" : "PPIM-12253",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
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
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,qh,bomCC,createWPTLink) {
// PPIM-10741
//if (node.getValue("a_Market_Designation").getSimpleValue() == "SA") {
    /*var parentStyle = node.getParent();
    var saOption = parentStyle.getValue("a_Inherit_US_Copy_Option").getSimpleValue();*/
    /*if (saOption==null || !saOption.contains("SA")) {
        parentStyle.getValue("a_Inherit_US_Copy_Option").addValue("SA");
    }*/


    //setting the default Web Product Type and Size Chart Values
    //var brandNum = node.getValue('a_Brand_Number').getSimpleValue();
    /*if (brandNum != null) {
        var brand_wpt = "a_" + brandNum + "_WebProductType";
        var brand_sizeChart = "a_Size_Chart_" + brandNum
        parentStyle.getValue("a_Web_Product_Type").setSimpleValue("needs wpt");
        parentStyle.getValue(brand_wpt).setSimpleValue("needs wpt");
        createWPTLink.execute(parentStyle);
        parentStyle.getValue(brand_sizeChart).setSimpleValue("No Size Chart");
    }*/

   /* var styleMarketDesignation = parentStyle.getValue("a_Style_Market_Designation").getSimpleValue();
    try {
        var marketcontains = styleMarketDesignation.contains("US");

    } catch (err) {
        //logger.info("logging");
    }*/
    var parentStyle = node.getParent();
    var bomCCNumber = node.getValue("a_BOM_CC_Number").getSimpleValue();
    if (bomCCNumber != null) {
        createCCAndStyleBOMReferences(bomCCNumber);
    }

function createCCAndStyleBOMReferences(bomCCNumber) {
    var c = com.stibo.query.condition.Conditions;

    var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
        c.valueOf(bomCC).eq(bomCCNumber)
        .and(c.objectType(manager.getObjectTypeHome().getObjectTypeByID("CustomerChoice")))
    );
    var res = querySpecification.execute();

	if(res){
    res.forEach(function(resNode) {
        var currentMarketDesignation = resNode.getValue("a_Market_Designation").getSimpleValue();
      //  if (resNode.getID() != node.getID() && currentMarketDesignation.contains("US")) {
       if (resNode.getID() != node.getID() && (currentMarketDesignation!=null && currentMarketDesignation.contains("US") ) ) {
            //deleteReferencesIfExists();
            //var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
            //var ccRefCreated = node.createReference(resNode, refType);
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
    BOMCCRefList.forEach(function(ref) {
        ref.delete();
    });
    var refTypeStyle = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_Style");
    var StyleBOMCCRefList = parentStyle.getReferences(refTypeStyle).toArray();
    StyleBOMCCRefList.forEach(function(ref) {
        ref.delete();
    });
}
}