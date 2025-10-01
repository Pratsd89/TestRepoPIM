/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateNonMerchStyle",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CreateNonMerchStyle",
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
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "name",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">a_attr</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productMerchType",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_product_merch_type</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">b_attr</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,portal,name,productMerchType,sizeModelRef,lookupTable) {
var result = true;
var subClass = node.getID();
var styleID = 0;
var nmStyleID = null;
var first = "700";
var count = 0;
var sStyle = null;
var currentContext = step.getCurrentContext().getID();
if (name == null) {
    result = false;
    portal.showAlert("ERROR", "The Style was not created. Please enter Style Name during creation.");
} else if (productMerchType == null) {
    result = false;
    portal.showAlert("ERROR", "The Style was not created. Please enter Product Merch Type value during creation.");
} else {
    var brandObj = node.getParent().getParent().getParent().getParent();
    var brandNumber = brandObj.getValue("a_Brand_Number").getSimpleValue();
    var pattern = new RegExp("^" + brandNumber + "(?=(_StoredValueCards$|_Gifts_Subclass$|_Services_Subclass$))");
    if (pattern.test(subClass)) {
        var sClasses = new java.util.ArrayList();
        sClasses.addAll(node.getParent().getParent().getChildren());
        for (var i = 0; i < sClasses.size(); i++) {
            var sSubClass = new java.util.ArrayList();
            sSubClass.addAll(sClasses.get(i).getChildren());
            for (var j = 0; j < sSubClass.size(); j++) {
                var sStyle = new java.util.ArrayList();
                sStyle.addAll(sSubClass.get(j).getChildren());
                var child = sStyle.size();
                count = parseInt(count) + parseInt(child);
            }
        }
        first = parseInt(first) + parseInt(count) + 1;
        styleID = "000" + first;
        //change in logic to prefix "NM-" to style id
        nmStyleID = "NM-" + styleID;
        //Block to verify Merch Type
        var subClass = node.getID();
        if (productMerchType != null) {
            var patternstore = new RegExp("^" + brandNumber + "(?=(_StoredValueCards$))");
            if (patternstore.test(subClass)) {
                if (!(productMerchType == "STORED VALUE CARDS FIXED OPTIONS" || productMerchType == "STORED VALUE CARDS FIXED" || productMerchType == "STORED VALUE CARDS OPEN")) {
                    result = false;
                    portal.showAlert("ERROR", "The Style was not created. Attribute Product Merch Type value does not comply with SubClass ON_StoredValueCards.");
                }
            }
            var patterngifts = new RegExp("^" + brandNumber + "(?=(Gifts_Subclass$))");
            if (patterngifts.test(subClass)) {
                if (!(productMerchType == "GIFTS" || productMerchType == "PREMIUM GIFT BOXES" || productMerchType == "COMPLIMENTARY GIFT BOXES" || productMerchType == "PREMIUM GIFT BOXES SVC")) {
                    result = false;
                    portal.showAlert("ERROR", "The Style was not created. Attribute Product Merch Type value does not comply with SubClass ON_Gifts_Subclass.");
                }
            }
            var patternservices = new RegExp("^" + brandNumber + "(?=(Services_Subclass$))");
            if (patternservices.test(subClass)) {
                if (!(productMerchType == "MONOGRAM SERVICE")) {
                    result = false;
                    portal.showAlert("ERROR", "The Style was not created. Attribute Product Merch Type value does not comply with SubClass ON_Services_Subclass.");
                }
            }
        }
        else {
            result = false;
            portal.showAlert("ERROR", "The Style was not created. Please enter Product Merch Type value during creation.");
        }
        //			portal.navigate("GAPPhotoShotDetails", oNewShotRequest);

        //End of Merch Type Verification
        if (result == true) {
            var market = lookupTable.getLookupTableValue("LKT_Context_to_Market", currentContext);
            var contextWorkflowLookup = lookupTable.getLookupTableValue("LKT_Context_to_Style_Enrich_Workflows", currentContext);
            var styleProd = step.getProductHome().getProductByID(nmStyleID);
            if (!styleProd) {
                //Create Non-Merch Style
                try {
                    //change in logic to prefix "NM-" to style id
                    //node.createProduct(styleID, "Style");
                    node.createProduct(nmStyleID, "Style");
                    var newstyle = step.getProductHome().getProductByID(nmStyleID);

                    if (!(contextWorkflowLookup == null || contextWorkflowLookup == "" || contextWorkflowLookup == "undefined")) {
                        newstyle.startWorkflowByID(contextWorkflowLookup, "Style " + market + " Workflow Initiation");
                    }
                }
                catch (e) {
                    if (e.javaException instanceof com.stibo.core.domain.NodeIdUniqueConstraintException || e.javaException instanceof com.stibo.core.domain.ObjectTypeConstraintException) {
                        throw (e);
                    }
                }
            }
            else {
                var newFirst = parseInt(first) + 1;
                var counter = 1;
                var checkFlag = false;
                for (var m = newFirst; m < parseInt(newFirst) + parseInt(counter); m++) {
                    if (checkFlag == false) {
                        var precount = parseInt(newFirst) + parseInt(counter);
                        styleID = "000" + precount;
                        nmStyleID = "NM-" + styleID;
                        var styleProd1 = step.getProductHome().getProductByID(nmStyleID);
                        if (!styleProd1) {
                            node.createProduct(nmStyleID, "Style");
                            var newstyle = step.getProductHome().getProductByID(nmStyleID);
                            if (!(contextWorkflowLookup == null || contextWorkflowLookup == "" || contextWorkflowLookup == "undefined")) {
                                newstyle.startWorkflowByID(contextWorkflowLookup, "Style " + market + " Workflow Initiation");
                            }
                            checkFlag == true;
                        }
                        else {
                            counter = parseInt(counter) + 1;
                            //newFirst = parseInt(newFirst)+1;
                        }
                    }

                }
            }
            var styleList = new java.util.ArrayList();
            styleList.addAll(node.getChildren());
            for (var k = 0; k < styleList.size(); k++) {
                //change in logic to prefix "NM-" to style id
                //if(styleList.get(k).getID() == styleID){
                if (styleList.get(k).getID() == nmStyleID) {

                    sStyle = styleList.get(k);
                    sStyle.setName(name);
                    sStyle.getValue("a_Style_Number").setSimpleValue(styleID);
                    sStyle.getValue("a_product_merch_type").setSimpleValue(productMerchType);
                    sStyle.getValue("a_Style_Market_Designation").setSimpleValue(market)

                    //--------- PPIM-2931 -------------------------------------------------
                    //get column values from Brand - Style->Subclass->Class->Department->Division->Brand
                    var brandObj = sStyle.getParent().getParent().getParent().getParent().getParent();
                    var brandNum = brandObj.getValue("a_Brand_Number").getSimpleValue();
                    var channelNum = brandObj.getValue("a_Channel_Number").getSimpleValue();
                    sStyle.getValue("a_Brand_Number").setSimpleValue(brandNum);
                    sStyle.getValue("a_Channel_Number").setSimpleValue(channelNum);
                    //----------------------------------------------------------
                    var supplier = portal.getSelectedSetOfNodes().iterator().next();
                    sStyle.createClassificationProductLink(supplier, sizeModelRef);
                    //portal.navigate("GAPNonMerchStyleDetailsList", sStyle);
                    if (productMerchType == "STORED VALUE CARDS FIXED" || productMerchType == "STORED VALUE CARDS FIXED OPTIONS") {
                        portal.navigate("GAPNonMerchStyleDetailsListNonPrice", sStyle);
                    }
                    else {
                        portal.navigate("GAPNonMerchStyleDetailsList", sStyle);
                    }


                }
            }
        }
        //if(sStyle != null){
        //portal.navigate("GAPNonMerchStyleDetailsList", sStyle);
        //}
    }
}
}