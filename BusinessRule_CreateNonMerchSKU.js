/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "CreateNonMerchSKU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CreateNonMerchSKU",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "linkType",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "name",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">Name</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">A_attr</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refclass",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
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
exports.operation0 = function (node,step,log,portal,linkType,name,refclass,LKT) {
//Create Non Merch SKU - PPIM 1406
if (step.getCurrentWorkspace().getID() == "Main") {
    var result = true;

    if (name == null) {
        result = false;
        portal.showAlert("ERROR", "The SKU was not created. Please enter SKU Name during creation.");
    }

    // PPIM-2719 - Remove price from create non-merch SKU prompt. 

    // PPIM-2719 - Check if target selected for SKU to Size Code link is a valid SizeCode
    var supplier = portal.getSelectedSetOfNodes().iterator().next();
    var sizeCodeId = supplier.getID();
    if (supplier.getObjectType().getID() != "SizeCode") {
        result = false;
        portal.showAlert("ERROR", "The SKU was not created. Please select a valid Size Code object.");

    }

    //PPIM-3580 Non-Merch Products - Additional Requirements **START**
    //PPIM-3580 ensures that the new SKU may only have a size code that resides under the Style Size Model, additionally a new SKU cannot be created with a size code that is already assigned to a child of the CC. 

    var refs = new java.util.ArrayList();
    var styleObj = node.getParent();
    refs.addAll(styleObj.getClassificationProductLinks(refclass));
    var styleObjLink = refs.get(0).getClassification().getID()
    if (refs.size() > 0) {
        var skuObjects = new java.util.ArrayList();
        skuObjects.addAll(node.getChildren());
        if (skuObjects.size() != 0) {
            for (var i = 0; i < skuObjects.size(); i++) {
                var skuID = skuObjects.get(i).getID();
                if (skuID != null) {
                    // sizeCodeRef is the array holding the classification links 
                    var sizeCodeRef = new java.util.ArrayList();
                    var SKUCheck = step.getProductHome().getProductByID(skuID);
                    log.info("SKUs: " + SKUCheck);
                    sizeCodeRef.addAll(skuObjects.get(i).getClassificationProductLinks(linkType));
                    log.info(sizeCodeRef.size() + "  is the number of sizeCodeRef ");
                    log.info(sizeCodeRef + " is the sizeCodeRef");
                    //log.info( sizeCodeRef.get(0).getClassificationProductLinks(linkType) + " is the sizeCodeRef ID ");
                    if (sizeCodeRef.size() != 0) {
                        for (var j = 0; j < sizeCodeRef.size(); j++) {
                            // sizeCodeObjID grabs the ID of the Size code on the CC's child(j) is linked to
                            //sizeModelObjID grabs the ID of the Size Model that the CC's child(j) links to
                            var sizeCodeObjID = sizeCodeRef.get(j).getClassification().getID();
                            var sizeModelObjID = sizeCodeRef.get(j).getClassification().getParent().getID();
                            // this test will compare the size model of the selected Size Code vs the current 
                            log.info("sizeModelObjID is  " + sizeModelObjID);
                            log.info("node parent styleObjLink is  " + styleObjLink);
                            log.info("sizeCodeObjID is  " + sizeCodeObjID);

                            if (styleObjLink != supplier.getParent().getID()) {
                                result = false;
                                portal.showAlert("ERROR", "The SKU was not created. Please select a Size Code under the valid Size Model of : " + styleObjLink + ".    The selected Size Code is under the Size Model " + supplier.getParent().getID());
                            }
                            if (sizeCodeObjID == supplier.getID()) {
                                result = false;
                                portal.showAlert("ERROR", "The SKU was not created. The Size Code " + sizeCodeRef.get(j).getClassification().getName() + "  already exists under the CC: " + node.getName());
                            }

                        }
                    }
                }
            }
        }
    }
    //PPIM-3580   **END**

    var currentContext = step.getCurrentContext().getID();
    var market = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext)

    if (result == true) {
        //Including size code name
        var sizeCode = supplier.getName();
        var ccID = node.getID();
        var skuID = ccID + sizeCode;

        try {
            var sSKU = node.createProduct(skuID, "SKU");
            var workflow = LKT.getLookupTableValue("LKT_Context_to_SKU_Enrich_Workflows", currentContext)
            sSKU.startWorkflowByID(workflow, "SKU" + " " + market + " " + "Workflow Initiation");
        }
        catch (e) {
            if (e.javaException instanceof com.stibo.core.domain.NodeIdUniqueConstraintException || e.javaException instanceof com.stibo.core.domain.ObjectTypeConstraintException) {
                // throw (e);
                throw ("Non-Merch SKU with selected Size Code and CC already exists.");
            }
        }

        sSKU.setName(name);

        //PPIM-2719 default Size Code Name as  Non Merch Price    
        if (!isNaN(sizeCode)) {
            sSKU.getValue("a_NonMerch_Price").setSimpleValue(Number(sizeCode));
        }

        sSKU.getValue("a_Market_Designation").setSimpleValue(market);
        sSKU.createClassificationProductLink(supplier, linkType);

        //--------- PPIM-2931 -------------------------------------------------
        //get column values from Brand - CC->Style->Sub-class->Class->Department->Division->Brand
        var brandObj = node.getParent().getParent().getParent().getParent().getParent().getParent();
        var brandNum = brandObj.getValue("a_Brand_Number").getSimpleValue();
        var channelNum = brandObj.getValue("a_Channel_Number").getSimpleValue();
        log.info("CreateNonMerchSKU: Root Object type= " + brandObj.getObjectType().getID() +
            " | brandNum= " + brandNum + " | channelNum= " + channelNum);

        var ccNum = node.getValue("a_CC_Number").getSimpleValue();
        var sizeCdVar = supplier.getValue("a_SizeCodeVariant").getSimpleValue();
        if (sizeCdVar == null) {
            sizeCdVar = "";
        }
        var dim1Desc = "";
        var dim2Desc = "";
        log.info("Current context= " + currentContext + " | ccNum= " + ccNum + " | sizeCode= " + sizeCode);

        if (supplier.getChildren() != null) {
            for (var i = 0; i < supplier.getChildren().size(); i++) {
                var dimObj = supplier.getChildren().get(i);
                //log.info("Object Type - dimObj= " + dimObj.getObjectType().getID() + " | ID= " + dimObj.getID() + " | Dimension= " + dimObj.getName());
                if (dimObj.getObjectType().getID() == "Dim1") {
                    dim1Desc = sizeCdVar + " " + dimObj.getValue("a_Advanced_Dimension_Value").getSimpleValue();
                }
                else if (dimObj.getObjectType().getID() == "Dim2") {
                    dim2Desc = sizeCdVar + " " + dimObj.getValue("a_Advanced_Dimension_Value").getSimpleValue();
                }
            }
        }
        log.info("current context= " + currentContext + " | dim1Desc= " + dim1Desc + " | dim2Desc= " + dim2Desc);

        //set Brand Number and Channel Number - only needed for current context
        sSKU.getValue("a_Brand_Number").setSimpleValue(brandNum);
        sSKU.getValue("a_Channel_Number").setSimpleValue(channelNum);

        //set SKU Number, and Dim1 & Dim2 Desciption in current context
        if (ccNum != null && sizeCode != null) {
            sSKU.getValue("a_SKU_Number").setSimpleValue(ccNum + sizeCode);
        }
        else if (ccNum != null) {
            sSKU.getValue("a_SKU_Number").setSimpleValue(ccNum);
        }
        else if (sizeCode != null) {
            sSKU.getValue("a_SKU_Number").setSimpleValue(sizeCode);
        }

        //set main last modified date
        var time = new java.util.Date();
        var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sSKU.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

        portal.navigate("GAPNonMerchSKUDetailsList", sSKU);
    }
}
else if (step.getCurrentWorkspace().getID() == "Approved") {
    portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}
}