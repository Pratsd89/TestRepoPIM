/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Setting_Default_Values_Web_Heirarchy",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Setting Default Values Web Heirarchy",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
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
    "alias" : "stepManager",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,LKT,setNewSortOrders) {
/*
 * This rule works as follows:
 * -Create function for setting WebCat default values and updating sort order
 * -Create function for obtaining brand number from parent BU
 * -Obtain brand number
 * -Use LKT to grab all markets based on brand number
 * -For each market, use update default values function
 * -Move the WebCat into workflow endstate
 */

//Function for obtaining brand number from parent Business Unit (works recursively) (pulled from BR: Copying_WebCategory_To_Division)
function getBrandNumber(node) {
  //get category object type
  var type = node.getObjectType().getID();

  //get parent
  var parent = node.getParent();

  //get parent object type
  var parentType = parent.getObjectType().getID();

  //if category object type is WebCategory || WebSubCategory || WebDivision
  if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
    //then keep getting parent until type is WebBU
    while (parentType != "WebBU") {
      parent = parent.getParent();

      parentType = parent.getObjectType().getID();
    }

    //get a_Brand_Number
    var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
  }

  return brandNum;
}


//Function for setting default WebCat values and updating sort order
function updateDefaultValues(node) {
  var inheritOptionCAN = null;

  if (brand == "ON"){
      node.getValue("a_WebCategory_Start_Date").setSimpleValue(today.format(formatter));
  }

  // set default values
  node.getValue("a_WebCategory_End_Date").setSimpleValue(parentEndDate);
  node.getValue("a_WebCategory_Product_Type").setSimpleValue("CC");
  node.getValue("a_WebCategory_Markdown_to_End").setSimpleValue("Yes");
  node.getValue("a_WebCategory_Hide_Category").setSimpleValue("No");
  node.getValue("a_WebCategory_Assortment_Type").setSimpleValue("Manual");
  node.getValue("a_Category_Display_Type").setSimpleValue("Standard: Core");
  node.getValue("a_WebCategory_Sort_Order").setSimpleValue("1");
  node.getValue("a_Brand_Number").setSimpleValue(brand);

  // set default CAN - Inherit Option by Brand using LKTs
  if (currentContext == "EN_US" && mktContexts.contains("EN_CA") == true) {
    if (objectType == "WebCategory") {

      inheritOptionCAN = LKT.getLookupTableValue("LKT_WebCat_Brand_Inheritance_CAN", brand);
    }
    if (objectType == "WebSubCategory") {

      inheritOptionCAN = LKT.getLookupTableValue("LKT_WebSubCat_Brand_Inheritance_CAN", brand);
    }
    if (inheritOptionCAN != null) {

      node.getValue("a_CAN_Inherit_Option").setSimpleValue(inheritOptionCAN);
    }
  }
  else if (currentContext != "EN_US" && currentContext != "EN_SA") {
    var inheritAtt = "a_" + currentMarket + "_Inherit_Option";
    var parentInheritOption = node.getParent().getValue(inheritAtt).getSimpleValue();

    if (parentInheritOption == "Attributes & Sort Order") {

      node.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue("Yes");
    }
  }

  //set inactive sort order in all other applicable markets by brand
  mktContextsArray.forEach(function (mktCntxt) {
    stepManager.executeInContext(mktCntxt, function (otherManager) {
      var otherNode = otherManager.getClassificationHome().getClassificationByID(node.getID());

      if (currentContext != mktCntxt) {
        otherNode.getValue("a_WebCategory_Sort_Order").setSimpleValue("999999");
        otherNode.approve();
      }
    });
  });

  // approve in context
  node.approve();
}

var objectType = node.getObjectType().getID();
var parentObjectType = node.getParent().getObjectType().getID();
var brand = getBrandNumber(node);
var parentStartDate = node.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
var parentEndDate = node.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

//get context and applicable market info
var currentContext = stepManager.getCurrentContext().getID();
var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", currentContext);
var mktContexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brand);
var mktContextsArray = [];

var today = java.time.ZonedDateTime.now();
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

if (mktContexts.contains(";")) {
  //split on ";"
  mktContexts.split(";").forEach(function (currMktContext) {
    mktContextsArray.push(currMktContext);
  });
}
else {
  mktContextsArray.push(mktContexts);
}

if (objectType == "WebCategory" || objectType == "WebSubCategory") {
  if (parentStartDate == null || parentEndDate < today) {

    //remove from workflow
    if (!((node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow")) == null)) {
      node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow").delete("");
    }
    //delete node
    node.delete();
    throw ("\n<b>Parent " + parentObjectType + " is ended in current market. Please adjust start/end date of the " + parentObjectType + " before making this " + objectType + "<b/>\n");
  }
  else {
    //set default values in currentContext
    updateDefaultValues(node);
    setNewSortOrders.execute(node.getParent());
  }
}
else {
  //Updating sort order for Division
  node.getValue("a_Brand_Number").setSimpleValue(brand);
  if (brand == "ON"){
      node.getValue("a_WebCategory_Start_Date").setSimpleValue(today.format(formatter));
  }
  
  mktContextsArray.forEach(function (mktCntxt) {
    stepManager.executeInContext(mktCntxt, function (otherManager) {
      var otherNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
      var sortOrder = 0;
      var webBU = otherNode.getParent();
      var divisionList = webBU.getChildren().toArray();

      //For each child in array
      for (var j = 0; j < divisionList.length; j++) {
        var existingSortOrder = divisionList[j].getValue("a_WebCategory_Sort_Order").getSimpleValue();
        existingSortOrder = parseInt(existingSortOrder);

        //If existing sort order is greater than sort order
        if (existingSortOrder > sortOrder) {
          sortOrder = existingSortOrder;
        }
      }
      var newSortOrder = parseInt(sortOrder) + 2;
      otherNode.getValue("a_WebCategory_Sort_Order").setSimpleValue(newSortOrder);
      otherNode.approve();
    });
  });
}

//Moving the node to the end state
if (node.isInState("WebCategoryDefaultValueWorkflow", "Draft")) {
  var wf = node.getWorkflowInstanceByID("WebCategoryDefaultValueWorkflow");

  wf.getTaskByID("Draft").triggerByID("Submit", "");
}
}