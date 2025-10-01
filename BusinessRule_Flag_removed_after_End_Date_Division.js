/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Flag_removed_after_End_Date_Division",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Marketing_Flag_removed_after_End_Date_Division",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory" ],
  "allObjectTypesValid" : true,
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
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,queryHome) {
/*
 * This rule works as follows:
 * -Generate function for triggering updates for Styles or CCs
 * -For Styles and for CCs, collect marketing flags for each context and run the uodate trigger function
 */

//Function to trigger updates for Styles or CCs
function triggerUpdatesForObjectType(pphNode, triggerObjectType) {
  var c = com.stibo.query.condition.Conditions;
  var querySpecification = queryHome
    .queryFor(com.stibo.core.domain.Product)
    .where(
      c
        .objectType(
          manager.getObjectTypeHome().getObjectTypeByID(triggerObjectType)
        )
        .and(c.hierarchy().simpleBelow(pphNode))
    );
  var res = querySpecification.execute();

  //For each node in results
  res.forEach(function (resNode) {
    //logger.info("resNode: " + resNode.getID());
    //logger.info("resNode Object Type: " + resNode.getObjectType().getID());

    //If result node is a Style
    if (resNode.getObjectType().getID() == "Style") {
      //If result node is in one of the following WFs
      if (
        resNode.isInWorkflow("wf_NewStyleEnrichment") ||
        resNode.isInWorkflow("wf_NewStyleEnrichmentCanada") ||
        resNode.isInWorkflow("wf_NewStyleEnrichmentJapan") ||
        resNode.isInWorkflow("wf_StyleMaintenanceWorkflow")
      ) {
        //log.info(iso_product.format(time_product));
        resNode
          .getValue("a_main_last_modified_date")
          .setSimpleValue(iso_product.format(time_product));
        //log.info("Style workflow block: " + resNode.getID() + ", " + resNode.getValue("a_main_last_modified_date").getSimpleValue());
      } else {
        //log.info("Style resNode approved block reached");
        resNode.approve();
      }

      //Else if result node is a CC
    } else if (resNode.getObjectType().getID() == "CustomerChoice") {
      //If res node is in one of the following WFs
      if (
        resNode.isInWorkflow("wf_CCEnrichment") ||
        resNode.isInWorkflow("wf_CCEnrichmentCanada") ||
        resNode.isInWorkflow("wf_CCEnrichmentJapan") ||
        resNode.isInWorkflow("wf_StyleMaintenanceWorkflow")
      ) {
        //log.info(iso_product.format(time_product));
        resNode
          .getValue("a_main_last_modified_date")
          .setSimpleValue(iso_product.format(time_product));
        //log.info("CC workflow block: " + resNode.getID() + ", " + resNode.getValue("a_main_last_modified_date").getSimpleValue());
      } else {
        //log.info("CC resNode approved block reached");
        resNode.approve();
      }
    }
    return true;
  });
}

var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var flag = 0;

/*
 * Style Marketing Flags
 */

//US
var marketingFlagDataContainer1 = node.getDataContainerByTypeID(
  "StyleMarketingFlag1"
);
var marketingFlagDataContainer2 = node.getDataContainerByTypeID(
  "StyleMarketingFlag2"
);
var marketingFlagDataContainer3 = node.getDataContainerByTypeID(
  "StyleMarketingFlag3"
);
var marketingFlagDataContainer4 = node.getDataContainerByTypeID(
  "StyleMarketingFlag4"
);
var marketingFlagDataContainer5 = node.getDataContainerByTypeID(
  "StyleMarketingFlag5"
);
var marketingFlagDataContainer6 = node.getDataContainerByTypeID(
  "StyleMarketingFlag6"
);
var marketingFlagDataContainer7 = node.getDataContainerByTypeID(
  "StyleMarketingFlag7"
);
var marketingFlagDataContainer8 = node.getDataContainerByTypeID(
  "StyleMarketingFlag8"
);
var marketingFlagDataContainer9 = node.getDataContainerByTypeID(
  "StyleMarketingFlag9"
);
var marketingFlagDataContainer10 = node.getDataContainerByTypeID(
  "StyleMarketingFlag10"
);

//CAN
var marketingFlagDataContainerCA1 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA1"
);
var marketingFlagDataContainerCA2 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA2"
);
var marketingFlagDataContainerCA3 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA3"
);
var marketingFlagDataContainerCA4 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA4"
);
var marketingFlagDataContainerCA5 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA5"
);
var marketingFlagDataContainerCA6 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA6"
);
var marketingFlagDataContainerCA7 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA7"
);
var marketingFlagDataContainerCA8 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA8"
);
var marketingFlagDataContainerCA9 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA9"
);
var marketingFlagDataContainerCA10 = node.getDataContainerByTypeID(
  "StyleMarketingFlagCA10"
);

//JPN
var marketingFlagDataContainerJP1 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP1"
);
var marketingFlagDataContainerJP2 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP2"
);
var marketingFlagDataContainerJP3 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP3"
);
var marketingFlagDataContainerJP4 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP4"
);
var marketingFlagDataContainerJP5 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP5"
);
var marketingFlagDataContainerJP6 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP6"
);
var marketingFlagDataContainerJP7 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP7"
);
var marketingFlagDataContainerJP8 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP8"
);
var marketingFlagDataContainerJP9 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP9"
);
var marketingFlagDataContainerJP10 = node.getDataContainerByTypeID(
  "StyleMarketingFlagJP10"
);

var dataContainerArray = [
  marketingFlagDataContainer1,
  marketingFlagDataContainer2,
  marketingFlagDataContainer3,
  marketingFlagDataContainer4,
  marketingFlagDataContainer5,
  marketingFlagDataContainer6,
  marketingFlagDataContainer7,
  marketingFlagDataContainer8,
  marketingFlagDataContainer9,
  marketingFlagDataContainer10,
  marketingFlagDataContainerCA1,
  marketingFlagDataContainerCA2,
  marketingFlagDataContainerCA3,
  marketingFlagDataContainerCA4,
  marketingFlagDataContainerCA5,
  marketingFlagDataContainerCA6,
  marketingFlagDataContainerCA7,
  marketingFlagDataContainerCA8,
  marketingFlagDataContainerCA9,
  marketingFlagDataContainerCA10,
  marketingFlagDataContainerJP1,
  marketingFlagDataContainerJP2,
  marketingFlagDataContainerJP3,
  marketingFlagDataContainerJP4,
  marketingFlagDataContainerJP5,
  marketingFlagDataContainerJP6,
  marketingFlagDataContainerJP7,
  marketingFlagDataContainerJP8,
  marketingFlagDataContainerJP9,
  marketingFlagDataContainerJP10,
];

//For each data container
for (var i = 0; i < dataContainerArray.length; i++) {
  var dataContainerObject = dataContainerArray[i].getDataContainerObject();

  //If data container is NOT NULL
  if (dataContainerObject != null) {
    var end_date = dataContainerObject
      .getValue("a_marketing_flag_end_date")
      .getSimpleValue();
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var date = iso.format(time);

    //If date is greater than end date
    if (date > end_date) {
      dataContainerArray[i].deleteLocal();
      flag = flag + 1;
    }
  }
}

//If flag is greater than 0
if (flag > 0) {
  triggerUpdatesForObjectType(node, "Style");
}
flag = 0;

/*
 * CC Marketing Flags
 */

//US
var marketingFlagDataContainer1 =
  node.getDataContainerByTypeID("CCMarketingFlag1");
var marketingFlagDataContainer2 =
  node.getDataContainerByTypeID("CCMarketingFlag2");
var marketingFlagDataContainer3 =
  node.getDataContainerByTypeID("CCMarketingFlag3");
var marketingFlagDataContainer4 =
  node.getDataContainerByTypeID("CCMarketingFlag4");
var marketingFlagDataContainer5 =
  node.getDataContainerByTypeID("CCMarketingFlag5");
var marketingFlagDataContainer6 =
  node.getDataContainerByTypeID("CCMarketingFlag6");
var marketingFlagDataContainer7 =
  node.getDataContainerByTypeID("CCMarketingFlag7");
var marketingFlagDataContainer8 =
  node.getDataContainerByTypeID("CCMarketingFlag8");
var marketingFlagDataContainer9 =
  node.getDataContainerByTypeID("CCMarketingFlag9");
var marketingFlagDataContainer10 =
  node.getDataContainerByTypeID("CCMarketingFlag10");

//CAN
var marketingFlagDataContainerCA1 =
  node.getDataContainerByTypeID("CCMarketingFlagCA1");
var marketingFlagDataContainerCA2 =
  node.getDataContainerByTypeID("CCMarketingFlagCA2");
var marketingFlagDataContainerCA3 =
  node.getDataContainerByTypeID("CCMarketingFlagCA3");
var marketingFlagDataContainerCA4 =
  node.getDataContainerByTypeID("CCMarketingFlagCA4");
var marketingFlagDataContainerCA5 =
  node.getDataContainerByTypeID("CCMarketingFlagCA5");
var marketingFlagDataContainerCA6 =
  node.getDataContainerByTypeID("CCMarketingFlagCA6");
var marketingFlagDataContainerCA7 =
  node.getDataContainerByTypeID("CCMarketingFlagCA7");
var marketingFlagDataContainerCA8 =
  node.getDataContainerByTypeID("CCMarketingFlagCA8");
var marketingFlagDataContainerCA9 =
  node.getDataContainerByTypeID("CCMarketingFlagCA9");
var marketingFlagDataContainerCA10 = node.getDataContainerByTypeID(
  "CCMarketingFlagCA10"
);

//JPN
var marketingFlagDataContainerJP1 =
  node.getDataContainerByTypeID("CCMarketingFlagJP1");
var marketingFlagDataContainerJP2 =
  node.getDataContainerByTypeID("CCMarketingFlagJP2");
var marketingFlagDataContainerJP3 =
  node.getDataContainerByTypeID("CCMarketingFlagJP3");
var marketingFlagDataContainerJP4 =
  node.getDataContainerByTypeID("CCMarketingFlagJP4");
var marketingFlagDataContainerJP5 =
  node.getDataContainerByTypeID("CCMarketingFlagJP5");
var marketingFlagDataContainerJP6 =
  node.getDataContainerByTypeID("CCMarketingFlagJP6");
var marketingFlagDataContainerJP7 =
  node.getDataContainerByTypeID("CCMarketingFlagJP7");
var marketingFlagDataContainerJP8 =
  node.getDataContainerByTypeID("CCMarketingFlagJP8");
var marketingFlagDataContainerJP9 =
  node.getDataContainerByTypeID("CCMarketingFlagJP9");
var marketingFlagDataContainerJP10 = node.getDataContainerByTypeID(
  "CCMarketingFlagJP10"
);

var dataContainerArray = [
  marketingFlagDataContainer1,
  marketingFlagDataContainer2,
  marketingFlagDataContainer3,
  marketingFlagDataContainer4,
  marketingFlagDataContainer5,
  marketingFlagDataContainer6,
  marketingFlagDataContainer7,
  marketingFlagDataContainer8,
  marketingFlagDataContainer9,
  marketingFlagDataContainer10,
  marketingFlagDataContainerCA1,
  marketingFlagDataContainerCA2,
  marketingFlagDataContainerCA3,
  marketingFlagDataContainerCA4,
  marketingFlagDataContainerCA5,
  marketingFlagDataContainerCA6,
  marketingFlagDataContainerCA7,
  marketingFlagDataContainerCA8,
  marketingFlagDataContainerCA9,
  marketingFlagDataContainerCA10,
  marketingFlagDataContainerJP1,
  marketingFlagDataContainerJP2,
  marketingFlagDataContainerJP3,
  marketingFlagDataContainerJP4,
  marketingFlagDataContainerJP5,
  marketingFlagDataContainerJP6,
  marketingFlagDataContainerJP7,
  marketingFlagDataContainerJP8,
  marketingFlagDataContainerJP9,
  marketingFlagDataContainerJP10,
];

//For each data container
for (var i = 0; i < dataContainerArray.length; i++) {
  var dataContainerObject = dataContainerArray[i].getDataContainerObject();

  //If data container is NOT NULL
  if (dataContainerObject != null) {
    var end_date = dataContainerObject
      .getValue("a_marketing_flag_end_date")
      .getSimpleValue();
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var date = iso.format(time);

    //If date is greater than end date
    if (date > end_date) {
      dataContainerArray[i].deleteLocal();
      flag = flag + 1;
    }
  }
}

//If flag is greater than 0
if (flag > 0) {
  triggerUpdatesForObjectType(node, "CustomerChoice");
}
flag = 0;

}