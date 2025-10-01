/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Export_PhotoShot_And_CC_Details",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Export_PhotoShot_And_CC_Details",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
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
exports.operation0 = function (stepManager,node,mail) {

// Global variables
const filePath = "/opt/stibo/PIM_PhotoShot_CC_Report.csv";
const file = new java.io.File(filePath);
if(!file.exists())
{
    file.createNewFile();
}
var fw= new java.io.FileWriter(file,false);

fw.write("Shot Request ID,Shot Request Name,Shared Markets,Shot Brand Number,Shot Channel Number,Shot Code,Site Placement,Shot Type,Shot Request Lifecycle Status,Source Shot Request Lifecycle Status,Shot Request Method,Shot Style Number,Shot Instructions,Shot Universal CC Number,Shot Universal Style Number,Stibo Creation Date,Stibo Last Modified Date,Shot Customer Choice Number,Shot Market Number,CC ID ,CC Name,Division Description,Department Description,Class Description,SubClass Description,Source Color Palette Name,Source Color Palette Season Code,CC Source in DC Date,CC Publication Date,CC Photo Status,CC Life Cycle Status,CC Deactivation Reason,Source CC Description,Translation Status \n");

function containsDoubleQuotes(text) {
    return text.includes('"');
}
//################################################################
//**********to get CC details for the SHOT **********
//################################################################
function getReferencedByForEntity(photoShot) {
    var referencedByList = [];
    var referencedByArray = photoShot.getReferencedBy().toArray();
    for (var i = 0; i < referencedByArray.length; i++) {
        if (referencedByArray[i].getReferenceType().getID() == "CCToPhotoShotRef") {
			referencedByList.push(referencedByArray[i].getSource());
        }
    }
    return referencedByList;
}

//################################################################
//**********get attribute value of a attribute and Skip if there are any special characters such as " and , **********
//################################################################
function getAttributeValue(currentNode,attribute){

    var attributeValue ="";
    attributeValue = currentNode.getValue(attribute).getSimpleValue();
    if(attributeValue == null){
        attributeValue = ""; // to replace null with ""
    }else if (containsDoubleQuotes(attributeValue) === true ){
        attributeValue = `"${attributeValue}""`;
    }else if(attributeValue.contains(",")){
        // SKIP " and warp text that contains ","
        attributeValue = "\""+attributeValue+"\"";
    }else{attributeValue ; }
    return attributeValue.trim();
}
//################################################################
//**********TO GET LIST OF VALUES AS A STRING SEPARATED BY : **********
//################################################################
function listOfValuesAsString(currentObject, attribute){
var listOfValueAsString = "";
var listOfValues = currentObject.getValue(attribute).getValues();
for(var i = 0 ;i<listOfValues.size();i++){
    if(listOfValueAsString != ""){
        listOfValueAsString = listOfValueAsString +":"+listOfValues.get(i).getValue();
    }else{
        listOfValueAsString = listOfValues.get(i).getValue();
    }

}
return listOfValueAsString;
}

//################################################################
//**********TO GET LIST OF VALUES AS A STRING SEPARATED BY : **********
//################################################################
function getShotAndCCInfo(entity)
{
		//log.info(" yes the shot is eligible for the Extract  ");
        var srId = entity.getID();
	    //log.info(" yes the shot is eligible for the Extract "+srId);
		var srName = entity.getName();
		if(srName == null ){
			var srName = "";
		}
        var sharedMarkets =   listOfValuesAsString(entity,"a_Shared_Markets");
        var shortBrandNo =   getAttributeValue(entity,"a_Shot_Brand_Number");
		if(shortBrandNo == ":"){
		 shortBrandNo = "";
		}
        var shortChannelNo =  getAttributeValue(entity,"a_Shot_Channel_Number");
		if(shortChannelNo == ":"){
		 shortChannelNo = "";
		}
        var shotCode =getAttributeValue(entity,"a_Shot_Code");
        var shotPlacement =getAttributeValue(entity,"a_Site_Placement");
        var shotType =getAttributeValue(entity,"a_Shot_Type");
        var shotReqLCS =getAttributeValue(entity,"a_Shot_Request_Lifecycle_Status");
        var sourceShotReqLCS =getAttributeValue(entity,"a_Source_Shot_Request_Lifecycle_Status");
        var shotReqMethod =getAttributeValue(entity,"a_Shot_Request_Method");
        var shotStyleNo =getAttributeValue(entity,"a_Shot_Style_Number");
        var shotInstructions =getAttributeValue(entity,"a_Shot_Instructions");
        var shortUniversalCCNo =getAttributeValue(entity,"a_Shot_Universal_CC_Number");
        var shortUniversalStyleNo =getAttributeValue(entity,"a_Shot_Universal_Style_Number");
        var stiboCreationDate =getAttributeValue(entity,"a_Stibo_Creation_Date");
        var stiboLastModifiedDate =getAttributeValue(entity,"a_Last_Modified_Date");
        var shotCCNo =getAttributeValue(entity,"a_Shot_CC_Number");
        var shortMktNo =getAttributeValue(entity,"a_Shot_Market_Number");
        var ccObjectList =[];
		ccObjectList = getReferencedByForEntity(entity);
	
        if(ccObjectList.length > 0 ){
		
			for(refIndx= 0 ;refIndx <ccObjectList.length;refIndx ++) {
			var ccObject = ccObjectList[refIndx];
			var cCId= ccObject.getID();
			var ccName = ccObject.getName();
            var divisionDesc = getAttributeValue(ccObject,"a_Division_Description");
            var deptDesc = getAttributeValue(ccObject,"a_Department_Description");
            var  classDesc = getAttributeValue(ccObject,"a_Class_Description");
            var  subClassDesc = getAttributeValue(ccObject,"a_SubClass_Description");
            var  srcColorPaletteName = getAttributeValue(ccObject,"a_Source_Color_Palette_Name");
            var  srcColorPaletteScCode =  getAttributeValue(ccObject,"a_Source_Color_Palette_Season_Code");
            var ccSrcInDcDate =  getAttributeValue(ccObject,"a_CC_Source_in_DC_Date");
            var  ccPublicationDate = getAttributeValue(ccObject,"a_CC_Start_Date");
            var  ccPhotoStatus = getAttributeValue(ccObject,"a_CC_Photo_Status");
            var  ccLCStatus = getAttributeValue(ccObject,"a_CC_Life_Cycle_Status");
            var  ccDeActivationReason = getAttributeValue(ccObject,"a_CC_Deactivation_Reason");
			var  srcCCDescription =  getAttributeValue(ccObject,"a_Source_CC_Description");
            var  translationStatus =  getAttributeValue(ccObject.getParent(),"a_Translation_Status");
			fw.write(srId+","+srName+","+sharedMarkets+","+shortBrandNo+","+shortChannelNo+","+shotCode+","+shotPlacement+","+shotType+","+shotReqLCS+","+sourceShotReqLCS+","+shotReqMethod+","+shotStyleNo+","+shotInstructions+","+shortUniversalCCNo+","+shortUniversalStyleNo+","+stiboCreationDate+","+stiboLastModifiedDate+","+shotCCNo+","+shortMktNo+","+cCId+","+ccName+","+divisionDesc+","+deptDesc+","+classDesc+","+subClassDesc+","+srcColorPaletteName+","+srcColorPaletteScCode+","+ccSrcInDcDate+","+ccPublicationDate+","+ccPhotoStatus+","+ccLCStatus+","+ccDeActivationReason+","+srcCCDescription+","+translationStatus+"\n");
			}
        }else{
			
			fw.write(srId+","+srName+","+sharedMarkets+","+shortBrandNo+","+shortChannelNo+","+shotCode+","+shotPlacement+","+shotType+","+shotReqLCS+","+sourceShotReqLCS+","+shotReqMethod+","+shotStyleNo+","+shotInstructions+","+shortUniversalCCNo+","+shortUniversalStyleNo+","+stiboCreationDate+","+stiboLastModifiedDate+","+shotCCNo+","+shortMktNo+"\n");
		}
       
}



//################################################################
//********** Main block is started  ***********
//################################################################
var todayDate = new Date();
//Past date object initiated
var pastDate = new Date();
// to check if the shot request modified in past 7 days
pastDate.setDate(todayDate.getDate() - 7);

var oShotReqRoot = stepManager.getEntityHome().getEntityByID("126402");
var childrenQuery = oShotReqRoot.queryChildren();
//var entityList = [];
childrenQuery.forEach(function(entity) {

	var shotModifiedDate = entity.getValue("a_Shot_Modified_Date_Time").getSimpleValue();
	var formattedShotModifiedDate =  new Date(shotModifiedDate)  ;
	if(formattedShotModifiedDate >= pastDate )
    {
		getShotAndCCInfo(entity);
	}

	return true;
});

fw.flush();
fw.close();
//################################################################
//********** Send Email notification Started  ************
//################################################################
// adding to the Asset
const fileInputStream = new java.io.FileInputStream(file);
const asset = stepManager.getAssetHome().getAssetByID("TF_128425975");
asset.upload(fileInputStream,filePath);
// set up Email
const mailMethod  = mail.mail();
//mailMethod.addTo("rambhupalreddy_Thatiparthy@gap.com;");
mailMethod.addTo("venkatesh_bhimavaram@gap.com;lakshmi_thammineni@gap.com;aravindan_sakthivel@gap.com;rambhupalreddy_Thatiparthy@gap.com;venugopal_nandimandalam@gap.com;jagadish_beejapu@gap.com;onmarketingtools@gap.com;");
//mailMethod.addTo("venkatesh_bhimavaram@gap.com;lakshmi_thammineni@gap.com;aravindan_sakthivel@gap.com;rambhupalreddy_Thatiparthy@gap.com;venugopal_nandimandalam@gap.com;jagadish_beejapu@gap.com;");
mailMethod.subject("PIM Photo Shot and CC report");
mailMethod.plainMessage("Please find PIM Photo Shot and CC report, Please open and incident support ticket if there is an issue with the report");
// set attachment
const attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("PIM_PhotoShot_CC_Report.csv");
attachment.attach();
//send email
mailMethod.send() ;
//################################################################
//**********  send Email notification Done!  ************
//########################################################

}