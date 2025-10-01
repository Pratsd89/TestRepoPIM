/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Product_Name_Report",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Product Name Report",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "ccObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "CustomerChoice",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "styleObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "Style",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Life_Cycle_Status",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,queryHome,ccObjectType,styleObjectType,mail,ccAttr) {
log.info("starttt")
var filePath = "/opt/stibo/Product_Name_Report.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
    file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("ID,Name,Name 2,Revision 3 Name,Revision4 Name,Object Type\n");
//count=0;
var c = com.stibo.query.condition.Conditions;
var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
    (c.objectType(ccObjectType))
    .and(c.valueOf(ccAttr).neq("Draft"))
.and(c.valueOf(ccAttr).neq("Purged"))
        .and(c.hierarchy().simpleBelow(node))
);
var result = querySpecification.execute();
//log.info(result.asList(100000).size())
result.forEach(function (node1) {
   // cc_lifecycle_status = node1.getValue("a_CC_Life_Cycle_Status").getSimpleValue();
    //if (cc_lifecycle_status != "Draft" && cc_lifecycle_status != "Purged") {
    //	count+=1;
        var revisions = node1.getRevisions();
        size = revisions.size();
        var name = "";
        for (var i = 0; i < size; i++) {
            if (i == 4) {
                break;
            }
            name += "\""+revisions.get(i).getNode().getName() + "\""+","
        }
       /* if (size < 4) {
            i = 4 - size;
            for (var j = 0; j < i; j++) {
                name += ",";
            }
        }*/
        fw.write(node1.getID() + "," + name  + "\n")
    //}
        return true;
    
    
});



fw.flush();
fw.close();

// Upload file to asset
var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("Product_Name_Report");
var uploaded = asset.upload(fileInputStream, filePath);
var mailMethod = mail.mail();
mailMethod.addTo("sai_preethi_mandipalli@gap.com");
//mailMethod.addTo("sai_preethi_mandipalli@gap.com;jagadish_beejapu@gap.com;Sri_Indu_Dekkapati@gap.com");
//mailMethod.addTo("sai_preethi_mandipalli@gap.com;jagadish_beejapu@gap.com;Uttamareddy_Manda@gap.com");
mailMethod.subject("Product Name Report - "+node.getName());
mailMethod.plainMessage("");

// Attach CSV
var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("ProductNameReport.csv");
attachment.attach();

// Send
var mailSentStatus = mailMethod.send();

log.info("enddd")
}