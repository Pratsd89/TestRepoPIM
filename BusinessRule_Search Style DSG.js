/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Search Style DSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "Search Style DSG",
  "description" : "Create Product Group button in Search Style screen &  Create Product Groups from a list of selected Styles.",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "productGroupReference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "primaryProductNumber",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Style_Number</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productGroupStartDate",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Product_Grouping_Start_date</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "productGroupEndDate",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Product_Grouping_End_Date</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,webui,LKT,productGroupReference,primaryProductNumber,productGroupStartDate,productGroupEndDate) {
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var primaryProductEstablished = false;
var selection = webui.getSelection();
var selectionCount = selection.size();
var isAllAreStyles = true;
var styleParent = [];

var supportingStyle = [];
var primaryStylePresent = false;
var primaryStyleDivisionID = "";
var primaryStyleID = "";
var primaryStyleName = "";
var primaryStyleNumber = "";
var primaryStyleBrandNumber = "";
var primaryStyleDeptDesc = "";
var primaryStyleClassDesc = "";
var primaryStyleSubClasDesc = "";
var primaryStyleMKTDesg = "";
var primaryProductNumberProvided = true;


var context = manager.getCurrentContext().getID();
var alreadyReferenced = false;
var alreadyReferencedCAN = false;
var productGroupingDivisionID = null;
var time = new java.util.Date();
var pgDateForamtter = new java.text.SimpleDateFormat("yyyy-MM-dd");
var brandNumber = null;
var market = LKT.getLookupTableValue("LKT_Context_to_Market", context);
manager.executeInContext("EN_CA", function (contextManager) {
   canadaManager = contextManager;
});

if (primaryProductNumber == null || primaryProductNumber == '') {
   primaryProductNumberProvided = false;

}

if (selectionCount >= 1) {

   for (var i = 0; i < selectionCount; i++) {
      var selectedNode = selection.get(i);

      if (selectedNode.getObjectType().getID() != "Style") {
         isAllAreStyles = false;
         break;
      } else if (selectedNode.getObjectType().getID() == "Style") {
         var classObj = selectedNode.getParent().getParent();
         styleParent.push(classObj.getID());
         if (productGroupingDivisionID == null) {
            productGroupingDivisionID = classObj.getParent().getParent().getID();
         }
         if (brandNumber == null) {
            brandNumber = classObj.getValue("a_Brand_Number").getSimpleValue();
         }
         if (checkReferencedBy(selectedNode) == true) {
            alreadyReferenced = true;
            break;
         }
         //check for CAN references for US Styles
         var selectedCANNode = canadaManager.getObjectFromOtherManager(selectedNode);
         if (context == "EN_US" && checkReferencedBy(selectedCANNode) == true) {
            alreadyReferencedCAN = true;
         }
      }
   }
   if (isAllAreStyles) {

      var underSameClass = new java.util.HashSet(styleParent);
      if (underSameClass.size() == 1) {

         if (alreadyReferenced == false && alreadyReferencedCAN == false) {

            var productGroupingDivisionObj = manager.getNodeHome().getObjectByKey("PG_Division_Key", productGroupingDivisionID);

            if (productGroupingDivisionObj != null) {
               var brandNumber = productGroupingDivisionObj.getValue("a_Brand_Number").getSimpleValue();
               var newProductGroupID = brandNumber + '-' + 'PG' + '-' + generateSequenceNumber();
               var newProductGroup = productGroupingDivisionObj.createProduct(newProductGroupID, "Product_Group");
               newProductGroup.setName(newProductGroupID);
               newProductGroup.getValue("a_Brand_Number").setSimpleValue(brandNumber);

               var newProductGroupCAN = canadaManager.getObjectFromOtherManager(newProductGroup);


               if (context == "EN_US") {

                  for (var j = 0; j < selectionCount; j++) {

                     var selStyle = selection.get(j);
                     var styleNumber = selStyle.getValue("a_Style_Number").getSimpleValue();

                     var styleMarkets = selStyle.getValue("a_Style_Market_Designation").getSimpleValue();

                     var ref = null;
                     var refCAN = null;


                     if ((!primaryProductEstablished && styleMarkets.contains("US") && styleMarkets.contains("CAN") && styleNumber == primaryProductNumber) ||
                        (!primaryProductEstablished && styleMarkets.contains("US") && styleMarkets.contains("CAN") && !primaryProductNumberProvided)) {
                        log.info("test");

                        ref = newProductGroup.createReference(selStyle, "rt_ProductGroups");
                        ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                        newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                        newProductGroup.getValue("a_SuperPDP_Market").addValue("CAN");
                        selStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(styleNumber);
                        setGroupData(newProductGroup, selStyle);
                        var selStyleCAN = canadaManager.getObjectFromOtherManager(selStyle);
                        primaryProductEstablished = true;
                        var selStyleCAN = canadaManager.getObjectFromOtherManager(selStyle);
                        selStyleCAN.getValue("a_SuperPDP_Program_ID").setSimpleValue(styleNumber);
                        refCAN = newProductGroupCAN.createReference(selStyleCAN, "rt_ProductGroups");
                        refCAN.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("US");
                        newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");

                        newProductGroupCAN.getValue("a_Primary_Selling_Style_ID").setSimpleValue(selStyleCAN.getID());
                        newProductGroupCAN.setName(selStyleCAN.getName());
                        newProductGroupCAN.getValue("a_Product_Group_Name").setSimpleValue(selStyleCAN.getName());
                        setGroupData(newProductGroupCAN, selStyleCAN);
                       // setProductGroupStartEndDate(newProductGroupCAN);

                     } else {
                       
                        if (styleMarkets.contains("US")) {
                           if ((!primaryProductEstablished && styleNumber == primaryProductNumber) || (!primaryProductEstablished && !primaryProductNumberProvided)) {
                              ref = newProductGroup.createReference(selStyle, "rt_ProductGroups");
                              ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                              selStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(styleNumber);
                              newProductGroup.getValue("a_SuperPDP_Market").addValue("US");
                              setGroupData(newProductGroup, selStyle);
                              primaryProductEstablished = true;
                           } else {
                              ref = newProductGroup.createReference(selStyle, "rt_ProductGroups");
                              
                              ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                              setStyleDatesFromGroupDate(newProductGroup);

                              /*ref = newProductGroup.createReference(selStyle, "rt_ProductGroups");
                              
                              ref.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                              if (selectionCount == j + 1 && !primaryProductEstablished) {
                                  ref.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                                  setGroupData(newProductGroup, selStyle);
                              }*/

                           }
                           if (selectionCount == j + 1) {


                              if (newProductGroupCAN.getValue("a_Primary_Selling_Style_ID").getSimpleValue() == null) {


                                 clearReferences(newProductGroupCAN, "EN_CA");
                              }
                              if (newProductGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue() == null) {


                                 clearReferences(newProductGroup, "EN_US");
                              }
                           }


                        }

                        if (styleMarkets.contains("CAN")) {
                           var selStyleCAN = canadaManager.getObjectFromOtherManager(selStyle);
                           if ((!primaryProductEstablished && styleNumber == primaryProductNumber) || (!primaryProductEstablished && !primaryProductNumberProvided)) {
                              refCAN = newProductGroupCAN.createReference(selStyleCAN, "rt_ProductGroups");
                              refCAN.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                               selStyleCAN.getValue("a_SuperPDP_Program_ID").setSimpleValue(styleNumber);
                              newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                              setGroupData(newProductGroupCAN, selStyleCAN);
                              primaryProductEstablished = true;
                           } else {
                            
                              refCAN = newProductGroupCAN.createReference(selStyleCAN, "rt_ProductGroups");
                              refCAN.getValue("a_Primary_Selling_Style").setSimpleValue("No");
                               setStyleDatesFromGroupDate(newProductGroupCAN);


                           }
                           if (selectionCount == j + 1) {


                              if (newProductGroupCAN.getValue("a_Primary_Selling_Style_ID").getSimpleValue() == null) {


                                 clearReferences(newProductGroupCAN, "EN_CA");
                              }
                              if (newProductGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue() == null) {


                                 clearReferences(newProductGroup, "EN_US");
                              }

                           }
                        }
                     }


                  }

               } else if (context == "EN_CA") {
               	var flag= true;

                  if (primaryProductNumberProvided) {

                     var primaryStyleID = null;
                     if (primaryProductNumber.length == 6) {
                        primaryStyleID = "000" + primaryProductNumber;
                     } else if (primaryProductNumber.length == 7) {
                        primaryStyleID = "00" + primaryProductNumber;
                     }
                     if (primaryStyleID.length > 9) {
                        primaryStyleID = primaryStyleID.slice(-9);
                     }
                     var primaryStyle = manager.getProductHome().getProductByID(primaryStyleID);

                     var primaryStyleMarket = primaryStyle.getValue("a_Style_Market_Designation").getSimpleValue();
                     if (!primaryStyleMarket.contains("CAN")) {
                        webui.showAlert("ERROR", "Primary Product provided is not available in CANADA Market");
                       flag =false;

                     }
                  }

                  
                  if(flag){

                     for (var j = 0; j < selectionCount; j++) {

                        var selStyle = selection.get(j);
                        var styleNumber = selStyle.getValue("a_Style_Number").getSimpleValue();

                        var styleMarkets = selStyle.getValue("a_Style_Market_Designation").getSimpleValue();

                        var ref = null;
                        var refCAN = null;


                        if (styleMarkets.contains("CAN")) {
                           var selStyleCAN = canadaManager.getObjectFromOtherManager(selStyle);
                           if ((!primaryProductEstablished && styleNumber == primaryProductNumber) || (!primaryProductEstablished && !primaryProductNumberProvided)) {
                              refCAN = newProductGroupCAN.createReference(selStyleCAN, "rt_ProductGroups");
                              refCAN.getValue("a_Primary_Selling_Style").setSimpleValue("Yes");
                              selStyleCAN.getValue("a_SuperPDP_Program_ID").setSimpleValue(styleNumber);
                              newProductGroupCAN.getValue("a_SuperPDP_Market").addValue("CAN");
                              setGroupData(newProductGroupCAN, selStyleCAN);
                              primaryProductEstablished = true;
                           } else {
                              log.info(selectionCount + " " + "selection count number " + j);
                              refCAN = newProductGroupCAN.createReference(selStyleCAN, "rt_ProductGroups");
                               
                              refCAN.getValue("a_Primary_Selling_Style").setSimpleValue("No");
 						setStyleDatesFromGroupDate(newProductGroupCAN);

                           }
                           if (selectionCount == j + 1) {


                              if (newProductGroupCAN.getValue("a_Primary_Selling_Style_ID").getSimpleValue() == null) {


                                 clearReferences(newProductGroupCAN, "EN_CA");
                              }
                              if (newProductGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue() == null) {


                                 clearReferences(newProductGroup, "EN_US");
                              }

                           }
                        }


                     }

                  }
               }


               publishStyles(newProductGroup);
                publishStyles(newProductGroupCAN);
            } else {
               webui.showAlert("ERROR", "Unable to locate the Division Object " + productGroupingDivisionID);
            }
         } else {
            webui.showAlert("ERROR", "One or more selected styles already have a reference to a Product Group");
         }
      } else {
         webui.showAlert("ERROR", "All selected Styles must be under same parent Class.");
      }
   } else {
      webui.showAlert("ERROR", "All selected objects must be Style.");
   }
} else {
   webui.showAlert("ERROR", "Please select at least two styles.");
}


function setStyleDatesFromGroupDate(dateNode) {
    var dsgUpdateRefs = dateNode.getReferences(productGroupReference).toArray();
    for (var i in dsgUpdateRefs) {
        var currentStyle = dsgUpdateRefs[i].getTarget();
        currentStyle.getValue("a_Product_Grouping_Start_date").setSimpleValue(dateNode.getValue("a_Product_Grouping_Start_date").getSimpleValue());
        currentStyle.getValue("a_Product_Grouping_End_Date").setSimpleValue(dateNode.getValue("a_Product_Grouping_End_Date").getSimpleValue());
    }
}

function setProductGroupStartEndDate(varGroup) {
   if (productGroupStartDate == null || productGroupStartDate == '') {
      varGroup.getValue("a_Product_Grouping_Start_date").setSimpleValue(pgDateForamtter.format(time));
   } else {
      varGroup.getValue("a_Product_Grouping_Start_date").setSimpleValue(productGroupStartDate);
   }

   if (productGroupEndDate == null || productGroupEndDate == '') {
      varGroup.getValue("a_Product_Grouping_End_Date").setSimpleValue("2400-01-01");
   } else {
      varGroup.getValue("a_Product_Grouping_End_Date").setSimpleValue(productGroupEndDate);
   }

     setStyleDatesFromGroupDate(varGroup);
}


function setGroupData(newGroup, selStyle) {
   newGroup.getValue("a_Primary_Selling_Style_ID").setSimpleValue(selStyle.getID());
   newGroup.getValue("a_Product_Group_Name").setSimpleValue(selStyle.getName());
   newGroup.setName(selStyle.getName());
   newGroup.getValue("a_Department_Description").setSimpleValue(selStyle.getParent().getParent().getParent().getName());
   newGroup.getValue("a_Class_Description").setSimpleValue(selStyle.getParent().getParent().getName());
   newGroup.getValue("a_SubClass_Description").setSimpleValue(selStyle.getParent().getName());
   setProductGroupStartEndDate(newGroup,selStyle);
}


function checkReferencedBy(node) {
   var refBy = node.getReferencedBy().toArray();
   for (var i = 0; i < refBy.length; i++) {
      if (refBy[i].getReferenceType().getID() == "rt_ProductGroups") {
         return true;
      }
   }
   return false;
}

function generateSequenceNumber() {
   const timestamp = new Date().getTime();
   const sequenceNumber = timestamp.toString().slice(-7);
   return sequenceNumber;
}

function publishStyles(productGroup) {
   var publishStyles = productGroup.getReferences(productGroupReference).toArray();
   var primaryStyleNumber='';
   var groupPrimaryStyleID= productGroup.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
  var groupPrimaryStyleObject=  manager.getProductHome().getProductByID(groupPrimaryStyleID);
   if(groupPrimaryStyleObject!=null){
   	primaryStyleNumber = groupPrimaryStyleObject.getValue("a_Style_Number").getSimpleValue();  	
   	}
   for (var i = 0; i < publishStyles.length; i++) {
      var currentStyle = publishStyles[i].getTarget();
      currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(primaryStyleNumber);
      currentStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
      
   }
}

function getDuplicateStyleGroup(style, refType) {
   var duplicateStyleGroup = null;
   var refByDSG = style.getReferencedBy().toArray();
   for (var i = 0; i < refByDSG.length; i++) {
      if (refByDSG[i].getReferenceType().getID() == "rt_ProductGroups") {
         duplicateStyleGroup = refByDSG[i].getSource();
      }
   }
   return duplicateStyleGroup;
}

function clearReferences(node, context) {
   log.info("Clear References Method implementation ");
   manager.executeInContext(context, function (currentContextManager) {
      var currentContextNode = currentContextManager.getProductHome().getProductByID(node.getID());
      //var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_ProductGroups");
      //var duplicateStyleGroup = getDuplicateStyleGroup(currentContextNode, refType);
      //log.info(duplicateStyleGroup + " duplicateStyleGroup");

      if (currentContextNode != null) {
         var dsgRefs = currentContextNode.getReferences(productGroupReference).toArray();
         for (var i in dsgRefs) {
            var currentStyle = dsgRefs[i].getTarget();
            log.info("Current Style is " + currentStyle);
            currentStyle.getValue("a_SuperPDP_Program_ID").setSimpleValue(null);
            dsgRefs[i].delete();
         }
      }
   });
}
}