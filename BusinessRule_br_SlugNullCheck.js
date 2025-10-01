/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SlugNullCheck",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "br_SlugNullCheck",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIB_BRFS",
    "libraryAlias" : "LIB_BRFS"
  } ]
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
exports.operation0 = function (node,stepManager,mail,LIB_BRFS) {
var filePath = "/opt/stibo/SEO-PIM-Report_For_Legacy_NLU.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
    file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("ID,ParentID,GrandParent,BrandNumber\n");



/*function mainMethod(context) {
    var catsList = LIB_BRFS.getNodeList();
    for (var i = 0; i < catsList.size(); i++) {
        var catObj = stepManager.getClassificationHome().getClassificationByID(catsList.get(i));
        if (catObj != null) {
            var rootBrand = catObj.getValue("a_Brand_Number").getSimpleValue();
            var objectType = catObj.getObjectType().getID();
            if (rootBrand != 'GPS') {
                if (objectType == "WebDivision") {
                    var isActiveDiv = isCategoryActiveOrFuture(catObj);
                    if (isActiveDiv == true) {
                        fw.write(catObj.getID() + "," + "DivParent" + "\n");
                    }
                }
                else if (objectType == "WebCategory") {
                    var isActiveCat = isCategoryActiveOrFuture(catObj);
                    if (isActiveCat == true) {
                        var parentDiv = catObj.getParent();
                        var isActiveDiv = isCategoryActiveOrFuture(parentDiv);
                        if (isActiveDiv == true) {
                            fw.write(catObj.getID() + "," + parentDiv.getID() + "," + "DivParent" + "\n");
                        }
                    }
                }
                else if (objectType == "WebSubCategory") {
                    var isActiveSubCat = isCategoryActiveOrFuture(catObj);
                    if (isActiveSubCat == true) {
                        var parentCat = catObj.getParent();
                        var isActiveCat = isCategoryActiveOrFuture(parentCat);
                        if (isActiveCat == true) {
                            var parentDiv = catObj.getParent().getParent();
                            var isActiveDiv = isCategoryActiveOrFuture(parentDiv);
                            if (isActiveDiv == true) {
                                fw.write(catObj.getID() + "," + parentCat.getID() + "," + parentDiv.getID() + "\n");
                            }
                        }
                    }
                }
            }
        }
    }
}*/


function mainMethod(context, contextID) {
    var webHierarchy = stepManager.getClassificationHome().getClassificationByID("101130");
    var allBrands = webHierarchy.getChildren();
    for (var i = 0; i < allBrands.size(); i++) {
        var eachBrand = allBrands.get(i);
        var brandNum = eachBrand.getValue("a_Brand_Number").getSimpleValue();
        if (brandNum != "GPS") {
            var eachBrandDivisionList = new java.util.ArrayList();
            eachBrandDivisionList = eachBrand.getChildren();
            var eachBrandCatsList = new java.util.ArrayList();
            var eachBrandSubCatsList = new java.util.ArrayList();

            for (var j = 0; j < eachBrandDivisionList.size(); j++) {
                var divObj = eachBrandDivisionList.get(j);
                if (divObj != null) {
                    var objectType = divObj.getObjectType().getID();
                    if (objectType.equals("WebDivision") && divObj.getValue('a_Division_Display_Type').getValue() != null && !divObj.getValue('a_Division_Display_Type').getValue().equalsIgnoreCase("Division: Sister Site")) {
                        eachBrandCatsList.addAll(divObj.getChildren());
                        var isActiveDiv = isCategoryActiveOrFuture(divObj);
                        if (divObj.getValue("a_Natural_Language_URL").getSimpleValue()==null && isActiveDiv == true) {
                            fw.write(divObj.getID() + "," + "DivParent" + brandNum +"\n");
                        }
                    }
                }
            }

            for (var k = 0; k < eachBrandCatsList.size(); k++) {
                var catObj = eachBrandCatsList.get(k);
                if (catObj != null) {
                    var objectType = catObj.getObjectType().getID();
                    if (objectType == "WebCategory") {
                        eachBrandSubCatsList.addAll(catObj.getChildren());
                        var isActiveCat = isCategoryActiveOrFuture(catObj);
                        if (catObj.getValue("a_Natural_Language_URL").getSimpleValue()==null  && isActiveCat == true) {
                            var parentDiv = catObj.getParent();
                            var isActiveDiv = isCategoryActiveOrFuture(parentDiv);
                            if (isActiveDiv == true) {
                                fw.write(catObj.getID() + "," + parentDiv.getID() + "," + "DivParent" + brandNum +"\n");
                            }
                        }
                    }
                }
            }

            for (var l = 0; l < eachBrandSubCatsList.size(); l++) {
                var subCatObj = eachBrandSubCatsList.get(l);
                if (subCatObj != null) {
                    var objectType = subCatObj.getObjectType().getID();
                    if (objectType == "WebSubCategory") {
                        var isActiveSubCat = isCategoryActiveOrFuture(subCatObj);
                        if (subCatObj.getValue("a_Natural_Language_URL").getSimpleValue()==null && isActiveSubCat == true) {
                            var parentCat = subCatObj.getParent();
                            var isActiveCat = isCategoryActiveOrFuture(parentCat);
                            if (isActiveCat == true) {
                                var parentDiv = subCatObj.getParent().getParent();
                                var isActiveDiv = isCategoryActiveOrFuture(parentDiv);
                                if (isActiveDiv == true) {
                                    fw.write(subCatObj.getID() + "," + parentCat.getID() + "," + parentDiv.getID() + brandNum +"\n");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}



function isCategoryActiveOrFuture(categoryOBj) {
    if (categoryOBj != "undefined") {
        var description = categoryOBj.getValue("a_Category_Description").getSimpleValue();
        if (description != null) {
            var today = new Date();
            var startDate = categoryOBj.getValue("a_WebCategory_Start_Date").getSimpleValue();
            var endDate = categoryOBj.getValue("a_WebCategory_End_Date").getSimpleValue();
            if (endDate != null) {
                var formattedEndDate = new Date(endDate);
                formattedEndDate.setHours(23);
                formattedEndDate.setMinutes(59);
                formattedEndDate.setSeconds(59);
            }
            if (startDate != null) {
                var formattedStartDate = new Date(startDate);
                formattedStartDate.setHours(23);
                formattedStartDate.setMinutes(59);
                formattedStartDate.setSeconds(59);
            }

            if (endDate == null && (formattedStartDate >= today || formattedStartDate <= today)) {
                // if there is no end date means it will never expire and currently active or future active based on the start date
                return true;
            } else if (formattedEndDate >= today && (formattedStartDate >= today || formattedStartDate <= today)) {
                // End date is greater than today then It is not expired irrespective of start date
                return true;
            } else if (endDate == null && startDate == null) {
                return false;
            } else {
                return false;
            }
        }
    }
}


mainMethod("EN_US");

fw.flush();
fw.close();


var fileInputStream = new java.io.FileInputStream(file);
var asset = stepManager.getAssetHome().getAssetByID("TF_128577680");
var uploaded = asset.upload(fileInputStream, filePath);
// set up Email 
var mailMethod = mail.mail();
var emailIDTO = mailMethod.addTo("sri_indu_dekkapati@gap.com;jagadish_beejapu@gap.com;venugopal_nandimandalam@gap.com;aravindan_sakthivel@gap.com;rohith_kasula@gap.com;aswathi_naranath@gap.com;priyadarshini_sahoo@gap.com;aditya_raj_singh@gap.com");
var emailSubject = mailMethod.subject("SlugNameCheck_US");
var emailBody = mailMethod.plainMessage("Slug Name Check US");
// set attachment 
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("SlugNameCheck_US.csv");
attachment.attach();
//send email 
var mailSentStatus = mailMethod.send();

}