/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CC_Shot_Request_Report",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "CC Shot Request Report",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "CC_ShotRequest_Input_Library",
    "libraryAlias" : "lib"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV1",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV1",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ShotreqRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV2",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV2",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV3",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV3",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV4",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV4",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV5",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV5",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV6",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV6",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV7",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV7",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV8",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV8",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV9",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV9",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV10",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV10",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "AV11",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "AV11",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "P01",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,AV1,ShotreqRef,mail,AV2,AV3,AV4,AV5,AV6,AV7,AV8,AV9,AV10,AV11,P01,lib) {

var filePath = "/opt/stibo/CC_Shot_Request_Report.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
  file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("CC ID,CC Number,Shot Request Number,Site Placement,Shot Type,Content ID,Markets\n");

function getNodeList() {
	var nodeList = new java.util.ArrayList();
	java.util.Collections.addAll(nodeList,"000472761002");
return nodeList;
}



//ccList = ["000919387000"]
ccList = getNodeList();
log.info(ccList.size())
//ccList = ["000919387000","000803819000","000227981000","000100031000","000237239000","000423493000","000233651001","000876539001","000332016000"]
ShotRequestDetails(ccList, "EN_US")
ShotRequestDetails(ccList, "EN_CA")
function ShotRequestDetails(ccList, context) {

  step.executeInContext(context, function (contextManager) {
    for (var i = 0; i < ccList.size(); i++) {
      var cc = contextManager.getProductHome().getProductByID(ccList.get(i));
      cc.queryReferences(ShotreqRef).forEach(function (referenceInstance) {
        var shotrequest = referenceInstance.getTarget();
        //log.info(shotrequest.getName())
        sitePlacement = shotrequest.getValue("a_Site_Placement").getSimpleValue();
        if (sitePlacement == "AV1") {
          compareDetails(cc, AV1, shotrequest, context)
        }
        else if (sitePlacement == "AV2") {
          compareDetails(cc, AV2, shotrequest, context)
        }
        else if (sitePlacement == "AV3") {
          compareDetails(cc, AV3, shotrequest, context)
        }
        else if (sitePlacement == "AV4") {
          compareDetails(cc, AV4, shotrequest, context)
        }
        else if (sitePlacement == "AV5") {
          compareDetails(cc, AV5, shotrequest, context)
        }
        else if (sitePlacement == "AV6") {
          compareDetails(cc, AV6, shotrequest, context)
        } else if (sitePlacement == "AV7") {
          compareDetails(cc, AV7, shotrequest, context)
        }
        else if (sitePlacement == "AV8") {
          compareDetails(cc, AV8, shotrequest, context)
        }
        else if (sitePlacement == "AV9") {
          compareDetails(cc, AV9, shotrequest, context)
        }
        else if (sitePlacement == "AV10") {
          compareDetails(cc, AV10, shotrequest, context)
        }
        else if (sitePlacement == "AV11") {
          compareDetails(cc, AV11, shotrequest, context)
        }
        else if (sitePlacement == "Main P1") {
          compareDetails(cc, P01, shotrequest, context)
        }
        return true;
      });
    }
  });

}
function compareDetails(node, refType, shotrequest, context) {
  var av1Name;
  var flag = true;
  srName = shotrequest.getName();
  if(!srName) {
  	srName = shotrequest.getID()
  }
  step.executeInContext(context, function (contextManager) {
    node.queryReferences(refType).forEach(function (referenceInstance) {
      var ref = referenceInstance.getTarget();
      av1Name = ref.getName();
      //log.info(shotrequest)
      markets = shotrequest.getValue("a_Shared_Markets").getSimpleValue().replace("<multisep/>", ";")
      if (context == "EN_CA" && markets.contains("US")) {
        flag = false;
      }
      if ((srName == av1Name) && flag) {
        fw.write(node.getID() + "," + node.getValue("a_CC_Number").getSimpleValue() + "," + shotrequest.getID() + "," + shotrequest.getValue("a_Site_Placement").getSimpleValue() + "," + shotrequest.getValue("a_Shot_Type").getSimpleValue() + "," + av1Name + "," + markets + "\n");
        return false;
      }


      return true;

    });
  });
}


fw.flush();
fw.close();

// Upload file to asset
var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("CC_Shot_Request_Report");
var uploaded = asset.upload(fileInputStream, filePath);
var mailMethod = mail.mail();
mailMethod.addTo("sai_preethi_mandipalli@gap.com");
//mailMethod.addTo("sai_preethi_mandipalli@gap.com;jagadish_beejapu@gap.com;Uttamareddy_Manda@gap.com");
mailMethod.subject("Shot Request Report");
mailMethod.plainMessage("");

// Attach CSV
var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("ShotRequestReport.csv");
attachment.attach();

// Send
var mailSentStatus = mailMethod.send();

}