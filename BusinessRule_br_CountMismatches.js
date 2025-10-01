/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CountMismatches",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "br_CountMismatches",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Product_Group" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "createProductGroups",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
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
exports.operation0 = function (step,createProductGroups,mail) {
var filePath = "/opt/stibo/SEO-PIM-Report_For_Legacy_NLU.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
	file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
//w.write("Brand,Market,ObjectType,ID,CID,Name,ParentName,CategoryName,CategoryStartDate,CategoryEndDate,WebCategoryHide,EN_US_NLU,EN_US_LegayPreviewURL,EN_US_NLUPreviewURL\n");
fw.write("Brand,NodeID\n");



function count(node){
log.info(node);
var ENUS_Node = step.executeInContext(contextid, function (cmmanager) {
    return cmmanager.getObjectFromOtherManager(node);
});

var ENCA_Node = step.executeInContext(contextid, function (cmmanager) {
    return cmmanager.getObjectFromOtherManager(node);
});


var StyleCountUS = ENUS_Node.getReferences("rt_ProductGroups").toArray();
var StyleCountCAN = ENCA_Node.getReferences("rt_ProductGroups").toArray();


if(StyleCountUS.length != StyleCountCAN.length){

    var brandNumber = ENUS_Node.getValue("a_Brand_Number").getSimpleValue();
    var nodeId = ENUS_Node.getID();
    fw.write(brandNumber + ","  + nodeId +  "\n");
    //log.info(brandNumber + " " + nodeId);

}
}



function mainMethod(){
var productGroupRoot = step.getProductHome().getProductByID("ProductGroupingRoot");
var brandList = productGroupRoot.getChildren();
	var divisionList = new java.util.ArrayList();
    var groupList = new java.util.ArrayList();

    for (var i = 0; i < brandList.size(); i++) {
        var brandObj = brandList.get(i);
        log.info(brandObj);
		
        if(brandObj!=null){
            var brandObjectType = brandObj.getObjectType().getID();
            if(brandObjectType.equals("ProductGroupingsBrand")){  
                divisionList = brandObj.getChildren();
                for(var j =0; j<divisionList.size();j++){
                    var divObj = divisionList.get(j);
                    var divObjectType = divObj.getObjectType().getID();
                    if(divObj!= null){
                        if(divObjectType.equals("ProductGroupingsDivision")){
                            groupList = divObj.getChildren();

                            for(var k =0;k<groupList.size();k++){
                                var groupObject = groupList.get(k);
                                groupObjectType = groupObject.getObjectType().getID();
                                log.info(groupObjectType);
                                if(groupObjectType.equals("Product_Group")){
                                    count(groupObject);
                                }
                                
                            }
                        }

                    }

            
            } 
           }
    }



    }
}


mainMethod();

fw.flush();
fw.close();


var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("TF_128577669");
var uploaded = asset.upload(fileInputStream, filePath);
// set up Email 
var mailMethod = mail.mail();
//var emailIDTO= mailMethod.addTo("rambhupalreddy_Thatiparthy@gap.com;");
var emailIDTO = mailMethod.addTo("jagadish_beejapu@gap.com;sri_indu_dekkapati@gap.com;");
var emailSubject = mailMethod.subject("ProductGroup Mistmatch");
var emailBody = mailMethod.plainMessage("Please find mismatch product group count");
// set attachment 
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("PG_MISMATCH.csv");
attachment.attach();
//send email 
var mailSentStatus = mailMethod.send();
}