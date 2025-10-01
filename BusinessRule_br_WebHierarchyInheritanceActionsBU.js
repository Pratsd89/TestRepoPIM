/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_WebHierarchyInheritanceActionsBU",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Hierarchy Inheritance Actions BU",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
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
    "contract" : "BusinessActionBindContract",
    "alias" : "setNewSortOrders",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Web_Hierarchy_Sort_Order_Buffer",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "publishChildCats",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Publish_Child_Cats_to_DGL",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,webUI,LKT,setNewSortOrders,publishChildCats) {
function checkAttributeObjectValidity(node, attribute) {
  var validityFlag = false;
  var validObjectTypes = attribute.getValidForObjectTypes().toArray();

  for (var j = 0; j < validObjectTypes.length; j++) {
      if (validObjectTypes[j].getID() == node.getObjectType().getID()) {
          validityFlag = true;
          break;
      }
  }
  return validityFlag;
}

function inheritAttributes(node, engContext, langContext, manager) {
  var engMarket = LKT.getLookupTableValue("LKT_Context_to_Market", engContext);
  var inheritAtt = "a_" + engMarket + "_Inherit_Option";
  var parentInheritOption = null;
  var mktATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Dependent_ATTs");
  var mktLangATG = manager.getAttributeGroupHome().getAttributeGroupByID("ag_WebCat_Market_Language_Dependent_ATTs");
  var mktAttributes = [];
  var langAttributes = [];

  // get inherit option
  if (objectType != "WebDivision") {
      parentInheritOption = node.getParent().getValue(inheritAtt).getSimpleValue();
  }

  mktATG.getAttributes().toArray().forEach(function (attr) {
      mktAttributes.push(attr);
  });

  mktLangATG.getAttributes().toArray().forEach(function (attr) {
      mktAttributes.push(attr);
      langAttributes.push(attr);
  });

  manager.executeInContext("EN_US", function (usManager) {
      // populate attribute values from EN_US to engContext for attributes in ag_WebCat_Market_Dependent_ATTs & ag_WebCat_Market_Language_Dependent_ATTs
      var usNode = usManager.getClassificationHome().getClassificationByID(node.getID());

      for (var i = 0; i < mktAttributes.length; i++) {
          var validityFlag = checkAttributeObjectValidity(usNode, mktAttributes[i]);

          if (validityFlag == true) {
              var attributeId = mktAttributes[i].getID();
              var attributeValue = usNode.getValue(attributeId).getSimpleValue();
              var sortOrder = usNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();
              //determine if category is active in US market
              var activeCat = true;
              var today = java.time.ZonedDateTime.now();
              var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
              var usCatStart = usNode.getValue("a_WebCategory_Start_Date").getSimpleValue();
              var usCatEnd = usNode.getValue("a_WebCategory_End_Date").getSimpleValue();

              today = today.format(formatter);
              
              if (usCatStart == null || usCatEnd < today) {

                  activeCat = false;

                  // throw error if user is trying to inherit attributes from an inactive US cat
                  if (currentMarket != "US") {

                      usNode.getValue(inheritAtt).setValue(null);
                      webUI.showAlert("ERROR", "<b>Inherit Option Removed:</b>", "<b>This category is not active in the US Market.</b>");
                      return;
                  }
              }
              // set ended US category sort order
              if (objectType != "WebDivision") {
                  if (activeCat == false) {

                      if (sortOrder != "999999") {

                          usNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
                          fixSortOrders = true;
                      }
                  }
                  else {
                      var usParentStart = usNode.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                      var usParentEnd = usNode.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();
                      if (usParentStart == null || usParentEnd < today) {

                          usNode.getValue(inheritAtt).setValue(null);
                          webUI.showAlert("ERROR", "<b>Inherit Option Removed:</b>", "<b>The parent " + usNode.getParent().getObjectType().getName() + " is not Active in the US market. Please adjust start/end date of parent before activating this category.</b>");
                          return;
                      }
                      if (sortOrder == "999999") {

                          usNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");

                          if (setSortToTopMkts == null) {

                              setSortToTopMkts = "US"
                              fixSortOrders = true;
                          }
                      }
                  }

                  sortOrder = usNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();
              }
              // determine if missing sort order in US market when sort order is not inherited at the parent
              if (sortOrder == null && missingSortMkts == null && objectType == "WebDivision" && activeCat == true) {

                  missingSortMkts = "US";
              }
              else if (sortOrder == null && missingSortMkts == null && parentInheritOption != "Attributes & Sort Order") {

                  missingSortMkts = "US";
              }

              usManager.executeInContext(engContext, function (otherManager) {
                  var cntxtMarket = LKT.getLookupTableValue("LKT_Context_to_Market", engContext);
                  var cntxtNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
                  var cntxtValue = cntxtNode.getValue(attributeId).getSimpleValue();
                  var cntxtSortOrder = cntxtNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();
                  var cntxtParentStart = cntxtNode.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                  var cntxtParentEnd = cntxtNode.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();
                  // copy attribute values from US to engContext
                  if (cntxtValue != attributeValue) {
                      if (currentContext == engContext) {

                          webUI.showAlert("WARNING", "<b>Modification in context " + currentContext + " will not apply, as this category is inheriting values from the US market. Please switch to EN_US to modify this category.</b>");
                      }

                      cntxtNode.getValue(attributeId).setSimpleValue(attributeValue);
                  }

                  // establish new sort order values based on inheritance option & if cat is active in US
                  if (objectType != "WebDivision") {
                      // do not allow inheritance if parent is inactive in this market
                      if (cntxtParentStart == null || cntxtParentEnd < today) {

                          cntxtNode.getValue(inheritAtt).setValue(null);
                          webUI.showAlert("ERROR", "Error", "<b>Inherit Option was removed, as the parent " + cntxtNode.getParent().getObjectType().getName() + " is not Active in the " + cntxtMarket + " market. Please adjust start/end date of parent before activating this category.</b>\n");
                          return;
                      }
                      if (parentInheritOption == "Attributes & Sort Order") {
                          if (cntxtSortOrder != sortOrder) {

                              cntxtNode.getValue("a_WebCategory_Sort_Order").setSimpleValue(sortOrder);
                              cntxtNode.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue(null);
                          }

                          if (sortOrder == null) {

                              webUI.showAlert("WARNING", "<b>This " + objectType + "is missing a Sort order value in the US Market. Please navigate to the parent " + parentObjType + " and update the sort order in the US market.</b>");
                          }
                          else if (sortOrder == "1") {
                              if (setSortToTopMkts == null) {

                                  setSortToTopMkts = engMarket;
                                  fixSortOrders = true;
                              }
                              else if (setSortToTopMkts.indexOf(engMarket) == -1) {

                                  setSortToTopMkts = setSortToTopMkts + ";" + engMarket;
                                  fixSortOrders = true;
                              }
                          }
                      }
                      else {
                          if (cntxtSortOrder == "999999" && activeCat == true) {

                              cntxtNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");

                              if (setSortToTopMkts == null) {

                                  setSortToTopMkts = engMarket;
                                  fixSortOrders = true;
                              }
                              else if (setSortToTopMkts.indexOf(engMarket) == -1) {

                                  setSortToTopMkts = setSortToTopMkts + ";" + engMarket;
                                  fixSortOrders = true;
                              }
                          }
                          else if (cntxtSortOrder == null && activeCat == true) {
                              if (missingSortMkts == null) {

                                  missingSortMkts = engMarket;
                              }
                              else if (missingSortMkts.indexOf(engMarket) == -1) {

                                  missingSortMkts = missingSortMkts + ";" + engMarket;
                              }
                          }
                          else if (cntxtSortOrder != "999999" && activeCat == false) {

                              cntxtNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
                              fixSortOrders = true;
                          }
                      }
                  }
                  else {
                      if (cntxtSortOrder == null && activeCat == true) {
                          if (missingSortMkts == null) {

                              missingSortMkts = engMarket;
                          }
                          else if (missingSortMkts.indexOf(engMarket) == -1) {

                              missingSortMkts = missingSortMkts + ";" + engMarket;
                          }
                      }
                  }
              });
          }
      }
      // populate attribute values from EN_US to langContext & otherContext for attributes in ag_WebCat_Market_Language_Dependent_ATTs
      for (var i = 0; i < langAttributes.length; i++) {
          var validityFlag = checkAttributeObjectValidity(usNode, langAttributes[i]);

          if (validityFlag == true) {
              var attributeId = langAttributes[i].getID();
              var attributeValue = usNode.getValue(attributeId).getSimpleValue();

              usManager.executeInContext(langContext, function (otherManager) {
                  var cntxtNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
                  var cntxtValue = cntxtNode.getValue(attributeId).getSimpleValue();

                  if (cntxtValue == null) {

                      cntxtNode.getValue(attributeId).setSimpleValue(attributeValue);
                  }
              });
          }
      }
  });
}

function inheritSortOrder(node, context, manager) {
  // copy EN_US sort order values to "context" for all child WebCategories (node = Division) OR WebSubCategories (node = WebCategory), if "a_WebCategory_SortOrder_Inherit_US != No" for the child cat
  manager.executeInContext('EN_US', function (usManager) {
      //fetch context specific selected category from executing manager
      var cntxtCat = usManager.getClassificationHome().getClassificationByID(node.getID());
      var cntxtCatChildren = cntxtCat.getChildren().iterator();

      while (cntxtCatChildren.hasNext()) {
          var childCat = cntxtCatChildren.next();
          var childCatObjectType = childCat.getObjectType().getID();
          var childCatExclValue = childCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();;

          if (childCatExclValue != null) {
              //force users to set exclusions in desired market
              webUI.showAlert("WARNING", "Cannot set exclusion in EN_US. Please switch context to the Market where you are trying to exclude sort order inheritance.");
              childCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue(null);
          }
          if (childCatObjectType == "WebCategory" || childCatObjectType == "WebSubCategory") {
              var usCatStart = childCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
              var usCatEnd = childCat.getValue('a_WebCategory_End_Date').getSimpleValue();
              var today = java.time.ZonedDateTime.now();
              var usSortOrder = childCat.getValue('a_WebCategory_Sort_Order').getSimpleValue();

              if (usCatStart != null && usCatEnd > today || usCatStart != null && usCatEnd == null) {

                  usManager.executeInContext(context, function (otherManager) {
                      //fetch context specific selected category from executing manager
                      var cntxtChildCat = otherManager.getClassificationHome().getClassificationByID(childCat.getID());
                      var cntxtCatStart = cntxtChildCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                      var cntxtCatEnd = cntxtChildCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                      var excludeUSSortInherit = cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();
                      var today = java.time.ZonedDateTime.now();

                      //Set sort order in other markets if category is active
                      if (excludeUSSortInherit != "Yes") {
                          if (cntxtCatStart != null && cntxtCatEnd > today || cntxtCatStart != null && cntxtCatEnd == null) {

                              cntxtChildCat.getValue('a_WebCategory_Sort_Order').setSimpleValue(usSortOrder);
                          }
                      }
                  });
              }
              else if (usCatStart == null || usCatEnd < today) {
                  usManager.executeInContext(context, function (otherManager) {
                      //fetch context specific selected category from executing manager
                      var cntxtChildCat = otherManager.getClassificationHome().getClassificationByID(childCat.getID());
                      var cntxtCatStart = cntxtChildCat.getValue('a_WebCategory_Start_Date').getSimpleValue();
                      var cntxtCatEnd = cntxtChildCat.getValue('a_WebCategory_End_Date').getSimpleValue();
                      var excludeUSSortInherit = cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').getSimpleValue();
                      var today = java.time.ZonedDateTime.now();

                      //Set sort order in other markets if category is active
                      if (excludeUSSortInherit != "Yes") {
                          if (cntxtCatStart != null && cntxtCatEnd > today || cntxtCatStart != null && cntxtCatEnd == null) {

                              cntxtChildCat.getValue('a_Exclude_from_US_Sort_Inherit').setSimpleValue('Yes');
                          }
                      }
                  });
              }
          }
      }
  });
}

function setSortOrderInCurrentMarket(node, manager) {
  var today = java.time.ZonedDateTime.now();
  var catStart = node.getValue("a_WebCategory_Start_Date").getSimpleValue();
  var catEnd = node.getValue("a_WebCategory_End_Date").getSimpleValue();
  var catSortOrder = node.getValue("a_WebCategory_Sort_Order").getSimpleValue();
  var parentStart = node.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
  var parentEnd = node.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();
  // when no inheritance, ensure Sort Order values are populated for Web Categories and Web Sub Categories
  if (objectType != "WebDivision") {

      if (catStart == null || catEnd < today) {
          if (catSortOrder != "999999") {

              node.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
              fixSortOrders = true;
          }
      }
      else {
          if (parentStart == null || parentEnd < today) {

              webUI.showAlert("ERROR", "Error:", "<b>The parent " + node.getParent().getObjectType().getName() + " is not Active in the " + currentMarket + " market. Please adjust start/end date of parent before activating this category.</b>\n");
              return;
          }
          if (catSortOrder == "999999") {

              node.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");
              setSortToTopMkts = currentMarket;
              fixSortOrders = true;

              if (currentMarket != "US") {
                  var inheritOptionATT = "a_" + currentMarket + "_Inherit_Option";
                  var catParentInheritOption = node.getParent().getValue(inheritOptionATT).getSimpleValue();

                  if (catParentInheritOption == "Attributes & Sort Order") {
                      var usCatActive = true;

                      manager.executeInContext('EN_US', function (usManager) {
                          var usNode = usManager.getClassificationHome().getClassificationByID(node.getID());
                          var usCatStart = usNode.getValue("a_WebCategory_Start_Date").getSimpleValue();
                          var usCatEnd = usNode.getValue("a_WebCategory_End_Date").getSimpleValue();
                          var usSortOrder = usNode.getValue("a_WebCategory_Sort_Order").getSimpleValue();

                          if (usCatStart == null || usCatEnd < today) {

                              usCatActive = false;
                          }
                          else {

                              node.getValue("a_WebCategory_Sort_Order").setSimpleValue(usSortOrder);
                              setSortToTopMkts = null;

                              if (usSortOrder == null) {

                                  webUI.showAlert("WARNING", "<b>This " + objectType + "is missing a Sort order value in the US Market. Please navigate to the parent " + parentObjType + " and update the sort order in the US market.</b>");
                              }
                          }
                      });

                      if (usCatActive == false) {

                          node.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue("Yes");
                      }
                  }
              }
              else {
                  manager.executeInContext('EN_CA', function (canManager) {
                      var canNode = canManager.getClassificationHome().getClassificationByID(node.getID());
                      var parentCANInheritOption = canNode.getParent().getValue("a_CAN_Inherit_Option").getSimpleValue();

                      if (parentCANInheritOption == "Attributes & Sort Order") {
                          canNode.getValue("a_Exclude_from_US_Sort_Inherit").setValue(null);
                      }
                  });

                  manager.executeInContext('EN_JP', function (jpnManager) {
                      var jpnNode = jpnManager.getClassificationHome().getClassificationByID(node.getID());
                      var parentJPNInheritOption = jpnNode.getParent().getValue("a_JPN_Inherit_Option").getSimpleValue();

                      if (parentJPNInheritOption == "Attributes & Sort Order") {
                          jpnNode.getValue("a_Exclude_from_US_Sort_Inherit").setValue(null);
                      }
                  });
              }
          }
      }
  }
  if (catStart != null && catEnd > today || catStart != null && catEnd == null) {
      if (catSortOrder == null) {

          webUI.showAlert("WARNING", "<b>This " + objectType + "is missing a Sort order value in the " + currentMarket + " Market. Please navigate to the parent " + parentObjType + " and update the sort order for this market.</b>");
      }
  }
}

var currentContext = step.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
// start inheritance logic
var inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
var inheritJPN = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
// variables to validate if Sort Order inheritance should apply
var objectType = node.getObjectType().getID();
var parentObjType = node.getParent().getObjectType().getName();
var missingSortMkts = null;
var setSortToTopMkts = null;
var fixSortOrders = false;

// determine if Sort Order inheritance should apply
var hasChildCategories = false;

if (objectType == "WebDivision" || objectType == "WebCategory") {
  var childCats = node.getChildren().iterator();

  while (childCats.hasNext()) {
      var childCat = childCats.next();
      var childCatObjectType = childCat.getObjectType().getID();

      if (childCatObjectType == "WebCategory" || childCatObjectType == "WebSubCategory") {

          hasChildCategories = true;
          break;
      }
  }
}
else if (objectType == "WebSubCategory") {
  // remove sort order inheritance from Web Sub Categories, as they will never have child categories
  if (inheritCAN == "Attributes & Sort Order") {
      // correct the inherit option value
      node.getValue("a_CAN_Inherit_Option").setValue("Attributes");
      // re-fetch value after correction
      inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
      webUI.showAlert("WARNING", "Sort order inheritance removed, as this is a Web Sub Category and will never have child categories");
  }
  if (inheritJPN == "Attributes & Sort Order") {
      // correct the inherit option value
      node.getValue("a_JPN_Inherit_Option").setValue("Attributes");
      // re-fetch value after correction
      inheritJPN = node.getValue("a_JPN_Inherit_Option").getSimpleValue();
      webUI.showAlert("WARNING", "Sort order inheritance removed, as this is a Web Sub Category and will never have child categories");
  }
}

// run inheritance functions depending on attribute value selection(s)
if (currentMarket != "JPN") {
  if (inheritCAN == "Attributes") {
      inheritAttributes(node, "EN_CA", "FR_CA", step);
  }
  else if (inheritCAN == "Attributes & Sort Order") {
      inheritAttributes(node, "EN_CA", "FR_CA", step);
      inheritCAN = node.getValue("a_CAN_Inherit_Option").getSimpleValue();
      
      if (hasChildCategories == true && inheritCAN != null) {
          inheritSortOrder(node, "EN_CA", step);
      }
  }
  else {

      setSortOrderInCurrentMarket(node, step);
  }
}
if (currentMarket != "CAN") {
  if (inheritJPN == "Attributes") {

      inheritAttributes(node, "EN_JP", "JA_JP", step);
  }
  else if (inheritJPN == "Attributes & Sort Order") {

      inheritAttributes(node, "EN_JP", "JA_JP", step);
      inheritJPN = node.getValue("a_JPN_Inherit_Option").getSimpleValue();

      if (hasChildCategories == true && inheritJPN != null) {
          
          inheritSortOrder(node, "EN_JP", step);
      }
  }
  else {

      setSortOrderInCurrentMarket(node, step);
  }
}


if (fixSortOrders == true) {

  setNewSortOrders.execute(node.getParent());
  publishChildCats.execute(node.getParent());
}
if (setSortToTopMkts != null) {

  webUI.showAlert("WARNING", "<b>This category was sorted to top of list for parent " + parentObjType + " in Markets " + setSortToTopMkts + ". Please navigate to the parent " + parentObjType + " and adjust sort orders, if needed.</b>");
}
else if (missingSortMkts != null) {

  webUI.showAlert("WARNING", "<b>This " + objectType + " does not have a Sort Order value in " + missingSortMkts + ". Please navigate to the parent " + parentObjType + " and adjust sort order accordingly, for each market.</b>");
}
}