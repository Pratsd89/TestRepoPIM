/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MVG_Styles_Coverage_Report",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : null,
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
    "alias" : "mvgObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "MultiVariantGroup",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "smgRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "mvgRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,queryHome,mvgObjectType,mail,smgRef,mvgRef) {
//log.info("starttt")
var filePath = "/opt/stibo/Product_Name_Report.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
  file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("MVG ID,Name,Start Date,End Date,Style Not Covered,SMG ID,Common Style Id\n");

var c = com.stibo.query.condition.Conditions;
var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
  (c.objectType(mvgObjectType))
);
var result = querySpecification.execute();
//log.info(result.asList(100000).size())
var report_covered_styles = new java.util.HashSet();
result.forEach(function (mvg) {
  var styles = new java.util.HashSet();
  mvg.queryReferences(mvgRef).forEach(function (referenceInstance) {
    var style = referenceInstance.getTarget();
    styles.add(style);
    return true;
  });  
  report_covered_styles = new java.util.HashSet();
  styles.forEach(function (style) {
    checkCoverage(style, styles, mvg)
    return true;
  });
  return true;
});

function checkCoverage(style, styles, mvg) {
  startdate = mvg.getValue("a_Product_Grouping_Start_date").getSimpleValue();
  enddate = mvg.getValue("a_Product_Grouping_End_Date").getSimpleValue();
  result1 = style.queryReferencedBy(smgRef).asList(100);
  if (result1.size() == 0) {
    return true;
  }
  result1.forEach(function (smg) {
    smg = smg.getSource()
    smg.queryReferences(smgRef).forEach(function (referenceInstance) {
      localstyle = referenceInstance.getTarget();
      if (styles.contains(localstyle)) {
        //log.info("covereddd")
      } else {
        if(!report_covered_styles.contains(localstyle) ){
        	report_covered_styles.add(localstyle)
        	fw.write(mvg.getID() + "," + mvg.getName() + "," + startdate + "," + enddate + "," + localstyle.getID() + "," + smg.getID() + "," + style.getID() + "\n");
        }
        //log.info("not coveredd "+style.getID()+" , "+smg.getID()+" , " +mvg.getID()+" , "+localstyle.getID())
      }
      return true;


    });
    return true;
  });

}



fw.flush();
fw.close();

// Upload file to asset
var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("MVG_Style_Coverage_Report");
var uploaded = asset.upload(fileInputStream, filePath);
var mailMethod = mail.mail();
mailMethod.addTo("sai_preethi_mandipalli@gap.com");
//mailMethod.addTo("sai_preethi_mandipalli@gap.com;jagadish_beejapu@gap.com;aswathi_naranath@gap.com");
//mailMethod.addTo("sai_preethi_mandipalli@gap.com;jagadish_beejapu@gap.com;Sri_Indu_Dekkapati@gap.com");
//mailMethod.addTo("sai_preethi_mandipalli@gap.com;jagadish_beejapu@gap.com;Uttamareddy_Manda@gap.com");
mailMethod.subject("Style MVG Coverage Report in Prod");
mailMethod.plainMessage("");

// Attach CSV
var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("MVG_Style_Coverage_Report.csv");
attachment.attach();

// Send
var mailSentStatus = mailMethod.send();
log.info("enddd")
}