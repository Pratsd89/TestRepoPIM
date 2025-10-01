/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_category_tag_examples",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Category Tag Examples",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Badge" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "ccObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "Style",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Tag_Inherit",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,node,ccObjectType,ccAttr,queryHome,mail) {
function valueIny(context,badge) {
	var value;
    step.executeInContext(context, function(manager) {
        var context_cc = manager.getObjectFromOtherManager(badge);
        value = context_cc.getValue("a_Category_Tag_Inherit").getSimpleValue();
        });
    return value;
  }



log.info("starttt")
var filePath = "/opt/stibo/Product_Name_Report.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
    file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("ID,EN US Value,EN CA Value,EN JP Value\n");
//count=0;
var c = com.stibo.query.condition.Conditions;
var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
    (c.objectType(ccObjectType))
    .and(c.valueOf(ccAttr).exists())
        .and(c.hierarchy().simpleBelow(node))
);
var result = querySpecification.execute();
//log.info(result.asList(100000).size())
count = 0;
result.forEach(function (node1) {
	//log.info(valueIny("EN_US",node1))
	var us_value = valueIny("EN_US",node1);
	var ca_value = valueIny("EN_CA",node1)
	var jp_value = valueIny("EN_JP",node1)
	if(us_value!=ca_value && !us_value.contains("multi") &&  !ca_value.contains("multi")) {
		//|| ca_value!=jp_value || us_value!=jp_value)&&(us_value!=null && ca_value!=null )){
	
		fw.write(node1.getID()+","+us_value+","+ca_value+","+jp_value+"\n");
		count ++;
	}
	if(count>100)
	return false;
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
//mailMethod.addTo("sai_preethi_mandipalli@gap.com;jagadish_beejapu@gap.com;Uttamareddy_Manda@gap.com");
mailMethod.subject("Product Name Report Prod - "+node.getName());
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