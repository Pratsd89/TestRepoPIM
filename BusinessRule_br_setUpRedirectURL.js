/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setUpRedirectURL",
  "type" : "BusinessAction",
  "setupGroups" : [ "SEO" ],
  "name" : "Set Up Redirect URL",
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "CID",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_WebCategory_CID",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ {
    "variable" : "Asset",
    "message" : "Assets > MSDS Sheets > SEORedirect URL",
    "translations" : [ ]
  } ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,mail,CID,queryHome,Asset) {
log.info("Start");
var filePath = "/opt/stibo/setSEORedirectURL_test_ars1.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
        file.createNewFile();
}
var failureType = "";

var ConditionsNotSatisfied=0;
var ArchivedObjectFailure=0;
var ContainsInfoOrHttpsFailure=0;
var NoRedirectUrlFoundFailure=0;
var NoCidFoundFailure=0;
var TargetNodeArchivedFailure=0;
var MultipleTargetObjectsFoundFailure=0;

var fw = new java.io.FileWriter(file, false);

fw.write("Original Node, Original CID, Original Object Type, Target Node Universal ID, Target Node CID, Target Object Type, Target Node Parent, Original Redirect URL, Modified Redirect URL, Current Context, Brand, Failure \n");


// Check if RedirectURL has "/info" or "https: in it
function containsInfoOrHttps(RedirectUrl) {
    var regex = /(\/info|https:)/;
    return regex.test(RedirectUrl);
}


// Extract CID from Redirect URL
function extractCID(RedirectUrl) {
    var extractedCID = null;

    var findMatch = RedirectUrl.match(/cid=(\d+)/);
    if (findMatch) {
        extractedCID = findMatch[1];
    }
    return extractedCID;
}


// Find Brand using Brand Number attribute
function brandName(brandNumber) {
    var brand = null;

    if (brandNumber == "GAP") {
        brand = "GAP";
    } else if (brandNumber == "BR") {
        brand = "Banana Republic";
    } else if (brandNumber == "ON") {
        brand = "Old Navy";
    } else if (brandNumber == "GO") {
        brand = "Gap Outlet";
    } else if (brandNumber == "BRFS") {
        brand = "Banana Republic Factory Store";
    } else if (brandNumber == "NRC") {
        brand = "New Release Cycle";
    } else if (brandNumber == "AT") {
        brand = "Athleta";
    } else if (brandNumber == "GPS") {
        brand = "Global Product Synchronization";
    }

    return brand;
}


// Search Universal ID from CID in Web Hierarchy
function searchUniversalID(cid, Attribute, webBU) {

    var resultID = null;
    var condition = com.stibo.query.condition.Conditions;
    var isBelowCondition = condition.hierarchy().simpleBelow(webBU);
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Classification).where(isBelowCondition
            .and(condition.valueOf(Attribute).eq(cid))
    );
    var result = querySpecification.execute();
  
    if (result.asList(500).size()==1){

        result.forEach(function(resNode){
            resultID = resNode.getID();
            return true;
        });
    }
    else {
    	failureType = "Multiple Target Objects found.";
    	MultipleTargetObjectsFoundFailure=MultipleTargetObjectsFoundFailure+1;
//    	fw.write(nodeID + ",,,,,,,,,,," + failureType + "\n");
    	return;
    }
    return resultID;
}


// Make sure cat end date is in future or null
function verifyCategoryEndDate(CategoryEndDate) {
	
	if (CategoryEndDate==null) return true;
	
     var catEndDate = new Date(CategoryEndDate);

     var today = new Date();
     today.setHours(0, 0, 0, 0);
    
     return catEndDate > today;
}


// generate modified URL
function generateNLU(initialRedirectURL, NLU) {
    var doIndex = initialRedirectURL.indexOf(".do");
    var slashIndex = initialRedirectURL.lastIndexOf("/", doIndex);
    var modifiedRedirectUrl = initialRedirectURL.slice(0, slashIndex) + NLU + initialRedirectURL.slice(doIndex + 3);
    return modifiedRedirectUrl;
}


// main
function mainMain(node){

	
    // current object
    var nodeID = node.getID();
    log.info(nodeID);

    // Initial Redirect URL
    var initialRedirectURL = node.getValue("a_Redirect_URL").getSimpleValue();

    // If 'info' is not present and folder isn't in archive
    if(containsInfoOrHttps(initialRedirectURL)==false) {
        var CategoryEndDate = node.getValue("a_WebCategory_End_Date").getSimpleValue();
        if(verifyCategoryEndDate(CategoryEndDate)){
            var originalCID = node.getValue("a_WebCategory_CID").getSimpleValue();
        } 
        else {
            failureType="Archived Object";
            ArchivedObjectFailure=ArchivedObjectFailure+1;
//		  fw.write(nodeID + ",,,,,,,,,,," + failureType + "\n");
            return;
        }
    } 
    else {
        failureType="Contains /info or https:";
        ContainsInfoOrHttpsFailure=ContainsInfoOrHttpsFailure+1;
//	   fw.write(nodeID + ",,,,,,,,,,," + failureType + "\n");
        return;
    }

    if(initialRedirectURL===null){
        failureType="No Redirect URL found";
        NoRedirectUrlFoundFailure=NoRedirectUrlFoundFailure+1;
//	   fw.write(nodeID + ",,,,,,,,,,," + failureType + "\n");
        return;
    }


    // Target Node's CID
    var TargetCID = extractCID(initialRedirectURL);
    
    if(TargetCID===null){
        failureType="No CID found";
        NoCidFoundFailure=NoCidFoundFailure+1;
//        fw.write(nodeID + ",,,,,,,,,,," + failureType + "\n");
        return;
    }



    // Target Node's Universal ID
    var webBU = step.getClassificationHome().getClassificationByID("101130");
    var webHierarchyArchive = step.getClassificationHome().getClassificationByID("WebHierarchyArchive");
    var TargetUID = searchUniversalID(TargetCID, CID, webBU);



    if(failureType != ""){
        return;
    }

    if (TargetUID == null){
        TargetUID = searchUniversalID(TargetCID, CID, webHierarchyArchive);
        if(TargetUID != null) {
            failureType="Target Node Archived";
            TargetNodeArchivedFailure=TargetNodeArchivedFailure+1;
//	   fw.write(nodeID + ",,,,,,,,,,," + failureType + "\n");
            return;
        }
    }


    // Target Node
    var TargetNode = step.getClassificationHome().getClassificationByID(TargetUID);

    var TargetNodeParent = "Web Hierarchy";
    var TargetObjectType = TargetNode.getObjectType().getID();

    // Modified Redirect 
    var NLU = TargetNode.getValue("a_Natural_Language_URL").getSimpleValue();
    var modifiedRedirectURL = generateNLU(initialRedirectURL, NLU);


    // Current Context
    var currentContext = step.getCurrentContext().getID();

    // Brand Name
    var BrandNumber = node.getValue("a_Brand_Number").getSimpleValue();
    var BrandName = brandName(BrandNumber);

    // Object Type
    var originalObjectType = node.getObjectType().getID();


//    log.info(nodeID);
//    log.info(originalCID);
//    log.info(TargetUID);
//    log.info(TargetCID);
//    log.info(initialRedirectURL);
//    log.info(modifiedRedirectURL);
//    log.info(currentContext);
//    log.info(BrandName);

fw.write(nodeID + "," + originalCID + "," + originalObjectType + "," + TargetUID + "," + TargetCID + "," + TargetObjectType + "," + TargetNodeParent + "," + "\"" + initialRedirectURL.replace("\"", "\"\"") + "\"," + "\"" + modifiedRedirectURL.replace("\"", "\"\"") + "\"," + currentContext + "," + BrandName + "," + failureType + "\n");

}


function PerformChecks(node){
	if (node.getValue("a_Category_Description").getSimpleValue() != null) {
		if (node.getValue("a_WebCategory_Start_Date").getSimpleValue() != null) {
			if (node.getValue("a_Redirect_URL").getSimpleValue() != null) {
//				fw.write(node + ",,,,,,,,,,," + failureType + "\n");
				ConditionsNotSatisfied=ConditionsNotSatisfied+1;
				return true;
			}
		}
	}
	
}


var webHierarchy = step.getClassificationHome().getClassificationByID("101130");
log.info(webHierarchy);
var BrandList = webHierarchy.getChildren();
var divisionList = new java.util.ArrayList();
var catsList = new java.util.ArrayList();
var subCatsList = new java.util.ArrayList();

for (var a = 0; a < BrandList.size(); a++) {
		var Brand = BrandList.get(a);
	         log.info(Brand.getID());
		
     
		if (Brand != null && Brand.getID() == "WBU-5151") {
			 divisionList = Brand.getChildren();
			 for (var i = 0; i < divisionList.size(); i++) {
				var divObj = divisionList.get(i);
				if (divObj != null) {
					log.info(divObj);
					var objectType = divObj.getObjectType().getID();
					if (objectType.equals("WebDivision") && divObj.getValue('a_Division_Display_Type').getValue() != null && !divObj.getValue('a_Division_Display_Type').getValue().equalsIgnoreCase("Division: Sister Site")){
						catsList.addAll(divObj.getChildren());
						var isActiveDiv = PerformChecks(divObj);
							if (isActiveDiv == true) {
								failureType = "";
								try {
									mainMain(divObj);
								}
								catch (error) {
									log.info(" Error at " + divObj + "\n" + error);
								}

//								break;
							}
					}
				}
			}
			for (var i = 0; i < catsList.size(); i++) {
				var catObj = catsList.get(i);
				if (catObj != null) {
					var objectType = catObj.getObjectType().getID();
					if (objectType == "WebCategory") {
						subCatsList.addAll(catObj.getChildren());
						var isActiveCat = PerformChecks(catObj);
						if (isActiveCat == true) {
							failureType = "";
							try {
									mainMain(catObj);
								}
								catch (error) {
									log.info(" Error at " + catObj + "\n" + error);
								}

						}
 
					}
				}
			}
 
			for (var i = 0; i < subCatsList.size(); i++) {
				var subCatObj = subCatsList.get(i);
				if (subCatObj != null) {
					var objectType = subCatObj.getObjectType().getID();
					if (objectType == "WebSubCategory") {
						var isActiveSubCat = PerformChecks(subCatObj);
						if (isActiveSubCat == true) {
							failureType = "";
							try {
									mainMain(subCatObj);
								}
								catch (error) {
									log.info(" Error at " + subCatObj + "\n" + error);
								}

						}
					}
				}
			}
		}
//break;

}
		



failureType = " ConditionsNotSatisfied: " + ConditionsNotSatisfied + 
         " ArchivedObjectFailure: " + ArchivedObjectFailure + 
         " ContainsInfoOrHttpsFailure: " + ContainsInfoOrHttpsFailure + 
         " NoRedirectUrlFoundFailure: " + NoRedirectUrlFoundFailure + 
         " NoCidFoundFailure: " + NoCidFoundFailure + 
         " TargetNodeArchivedFailure: " + TargetNodeArchivedFailure + 
         " MultipleTargetObjectsFoundFailure: " + MultipleTargetObjectsFoundFailure;


//fw.write(",,,,,,,,,,,," + failureType + "\n");

fw.flush();
fw.close();

var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("TF_128695521");
var uploaded = asset.upload(fileInputStream, filePath);
var mailMethod = mail.mail();
var emailIDTO = mailMethod.addTo("jagadish_beejapu@gap.com");
var emailSubject = mailMethod.subject("setSEORedirectURL_ENUS");
var emailBody = mailMethod.plainMessage("PPFA ");
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("setSEORedirectURL_test_ars.csv");
    attachment.attach();
var mailSentStatus = mailMethod.send();
}