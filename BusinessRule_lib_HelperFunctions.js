/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_HelperFunctions",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Helper Functions Library",
  "description" : "This library contains generic helper functions that can be used across the system",
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
//function to set Translation Due Date on Style
/*function setTranslationDueDate(style) {
    var translationUrgency = style.getValue('a_Translation_Urgency').getSimpleValue();
	var zonedNow = java.time.ZonedDateTime.now();
	var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
	var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");

    if (translationUrgency == '3. Urgent') {
	    var plusDays=1;
    	if( zonedNow.toLocalTime().compareTo(java.time.LocalTime.parse("20:30")) > 0 )
            plusDays+= 1;
        var dueDate = zonedNow.plusDays(plusDays);
        var formattedDueDate = dueDate.format(formatter);

        //PPIM-6845
        var finalDay = java.text.SimpleDateFormat("EEEE").format(simpleDateFormat.parse(formattedDueDate));
         
        if( finalDay == "Saturday" || (plusDays == 2 && finalDay == "Sunday")) {
            dueDate = dueDate.plusDays(2);
        }
        else if (finalDay == "Sunday")
            dueDate = dueDate.plusDays(1);
           
        style.getValue('a_Translation_Due_Date').setSimpleValue(dueDate.format(formatter));
        
    } else if (translationUrgency == '1. Standard') {
        var extraDays = 0;
        var plusDays=5;
        
        //PPIM-6845
        if( zonedNow.toLocalTime().compareTo(java.time.LocalTime.parse("20:30")) > 0 ) 
            plusDays+= 1;
         
        for (var i = 1; i <= plusDays ; i++) {
            var dueDate = zonedNow.plusDays(i);
            var formattedDueDate = dueDate.format(formatter);
            formattedDueDate = simpleDateFormat.parse(formattedDueDate);
            var format2 = java.text.SimpleDateFormat("EEEE");
            //getting the day of the current date
            var finalDay = format2.format(formattedDueDate);
            //if we get saturday and sunday, then we'll add one more day
            if (finalDay == "Saturday" || finalDay == "Sunday") {
                extraDays = extraDays + 1;
            }
            //if the current day is saturday, then we have to skip sunday as well
            if (i == plusDays && finalDay == "Saturday") {
                extraDays = extraDays + 1;
            }
        }
        var dueDate = zonedNow.plusDays(plusDays + extraDays);
        var formattedDueDate = dueDate.format(formatter);

        //PPIM-6845
        var finalDay = java.text.SimpleDateFormat("EEEE").format(simpleDateFormat.parse(formattedDueDate));
        if( finalDay == "Saturday")
            dueDate = dueDate.plusDays(2);
        else if (finalDay == "Sunday")
            dueDate = dueDate.plusDays(1);
               
        style.getValue('a_Translation_Due_Date').setSimpleValue(dueDate.format(formatter));
    }
	else if (translationUrgency == '2. Medium') {
        var extraDays = 0;
        var plusDays=2;
        
        //PPIM-6845
        if( zonedNow.toLocalTime().compareTo(java.time.LocalTime.parse("20:30")) > 0 )
            plusDays+= 1;
        
        for (var i = 1; i <= plusDays; i++) {
            var dueDate = zonedNow.plusDays(i);
            var formattedDueDate = dueDate.format(formatter);
            formattedDueDate = simpleDateFormat.parse(formattedDueDate);
            var format2 = java.text.SimpleDateFormat("EEEE");
            //getting the day of the current date
            var finalDay = format2.format(formattedDueDate);
            //if we get saturday and sunday, then we'll add one more day
            if (finalDay == "Saturday" || finalDay == "Sunday") {
                extraDays = extraDays + 1;
            }
            //if the current day is saturday, then we have to skip sunday as well
            if (i == plusDays && finalDay == "Saturday") {
                extraDays = extraDays + 1;
            }
        }
        var dueDate = zonedNow.plusDays(plusDays + extraDays);
        var formattedDueDate = dueDate.format(formatter);

        //PPIM-6845
        var finalDay = java.text.SimpleDateFormat("EEEE").format(simpleDateFormat.parse(formattedDueDate));
        if( finalDay == "Saturday")
            dueDate = dueDate.plusDays(2);
       
        else if (finalDay == "Sunday")
            dueDate = dueDate.plusDays(1);

        style.getValue('a_Translation_Due_Date').setSimpleValue(dueDate.format(formatter));
    }
}*/

//function to copy all attributes in an attribute group from one context to another

function copyAttributesFromOneContextToAnother(node, step, attrGroup, fromContext, toContext) {
    step.executeInContext(fromContext, function (frContextManager) {
        var frNode = frContextManager.getProductHome().getProductByID(node.getID());

        var attributeGroup = frContextManager.getAttributeGroupHome().getAttributeGroupByID(attrGroup);
        var attributeList = attributeGroup.getAttributes().toArray();
        
		//PPIM-8134 - Below are the attributes to be ignored from Attribute Group : ag_Style_Copy_Attributes
		var attributesToIgnore = ["a_Translation_Status_ID","a_Replicate_US_English_Copy", "a_Style_Copy_Smartsheet_Identifier",
	 					"a_Translation_Due_Date","translation_sent_to_publish","a_Translation_Status","a_Translation_Urgency"];
	 					
        for (var i = 0; i < attributeList.length; i++) {
            var frAttributeValue = frNode.getValue(attributeList[i].getID()).getSimpleValue();
            //PPIM-8111 - Joshna Marpureddy - This condition has been added to ignore Translation Urgency from ENUS if the value is null
            //Note* : As per the latest modifications with Translation in ENUS, which is blank when US Enrichment Workflow initiated - PPIM-7908
           // if(!(fromContext == 'EN_US' && attributeList[i].getID() == 'a_Translation_Urgency' && null== frAttributeValue)) {
            	//PPIM-8134 - Added the list of attributes to be ignored while copying from US
            	//Don't copy if fromContext is EN_US and if copying attrbute is to be ignored
			if(!(fromContext == 'EN_US' && attributesToIgnore.indexOf(String(attributeList[i].getID())) < 0)) {
	            	step.executeInContext(toContext, function (toContextManager) {
		          	var toNode = toContextManager.getProductHome().getProductByID(frNode.getID());
		               toNode.getValue(attributeList[i].getID()).setSimpleValue(frAttributeValue);
		          });
		       }
	       //}
        }
    });
}

//set CC name from Color Pallette
function setCCNameFromColorPallette(cc, step, contextID) {
    step.executeInContext(contextID, function (otherContextManager) {
        var otherCC = otherContextManager.getProductHome().getProductByID(cc.getID());
        var brand = otherCC.getValue("a_Color_Palette_Brand").getSimpleValue();
        var seasonCode = otherCC.getValue("a_Source_Color_Palette_Season_Code").getSimpleValue();
        var seasonYear = otherCC.getValue("a_Source_Color_Palette_Season_Year").getSimpleValue();
        var colorPaletteCode = otherCC.getValue("a_Source_Color_Palette_Code").getSimpleValue();
        var colorPalletteID = brand + "_" + colorPaletteCode + "_" + seasonCode + "_" + seasonYear;
        var colorPallette = null;
        if (colorPalletteID){
        //var colorPallette = step.getClassificationHome().getClassificationByID(colorPalletteID);
        colorPallette = step.getClassificationHome().getClassificationByID(colorPalletteID);
        }
        if (colorPallette) {
            //var colorPalletteName = otherContextManager.getClassificationHome().getClassificationByID(colorPallette).getName();
            var colorPalletteName = otherContextManager.getClassificationHome().getClassificationByID(colorPalletteID).getName();
            if(colorPalletteName!=null)
            	otherCC.setName(colorPalletteName);
        }
    });
}

// get CC Name from specific context
function getCCNameFromContext(cc, step, contextID) {
    return step.executeInContext(contextID, function (otherContextManager) {
        var otherCC = otherContextManager.getProductHome().getProductByID(cc.getID());
        return otherCC.getName();
    });
}

//get CC from Shot Request in a list
function getCCsFromShot(shot) {
    var ccList = new java.util.ArrayList();
    var refByList = shot.getReferencedByProducts();
    if (refByList != null) {
        var refByListIterator = refByList.iterator();
        while (refByListIterator.hasNext()) {
            var ref = refByListIterator.next();
            if (ref.getReferenceTypeString() == "CCToPhotoShotRef")
                ccList.add(ref.getSource());
        }
    }
    return ccList;
}

function setLastModifiedDate(node) {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    //logger.info(iso.format(time));
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}

function setSKUNameFromSizeCode(sku, step) {
    var refsc = new java.util.ArrayList();
    refsc.addAll(sku.getClassificationProductLinks(step.getLinkTypeHome().getClassificationProductLinkTypeByID("SKUToSizeCode")));
    if (refsc.size() > 0) {
        var dimVal1 = "";
        var dimVal2 = "";

        var sizeCode = refsc.get(0).getClassification();
        var scChild = new java.util.ArrayList();
        scChild.addAll(sizeCode.getChildren());
        for (var j = 0; j < scChild.size(); j++) {
            if (scChild.get(j).getObjectType().getID() == "Dim1") {
                dimVal1 = scChild.get(j).getValue("a_Advanced_Dimension_Value").getSimpleValue();
            }
            if (scChild.get(j).getObjectType().getID() == "Dim2") {
                dimVal2 = scChild.get(j).getValue("a_Advanced_Dimension_Value").getSimpleValue();
            }
        }
        // set the SKU Name
        var namecontext = dimVal1 + "-" + dimVal2 + "-" + sku.getValue("a_SKU_Variant").getSimpleValue();
        //namecontext = checkName(namecontext);
        namecontext = checkName(namecontext,sku);
        var nametrim = namecontext.trim();
        if (sku.getName() != nametrim) {
            if (nametrim.length > 100) {
                nametrim = name.substring(0, 100);
            }
            sku.setName(nametrim);
        }
    }
}

//function checkName(valstr) {
    function checkName(valstr,sku) {
    var tokens = valstr.split("-");
    var filterName = "";

    for (i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (token != "null") {
            filterName += token;
            if (i < tokens.length - 1)
                filterName += "-";
        }

    }
    if (filterName == "")
        filterName = "(" + sku.getID().toString() + ")";
    //log.info(filterName)
    return filterName;
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.copyAttributesFromOneContextToAnother = copyAttributesFromOneContextToAnother
exports.setCCNameFromColorPallette = setCCNameFromColorPallette
exports.getCCNameFromContext = getCCNameFromContext
exports.getCCsFromShot = getCCsFromShot
exports.setLastModifiedDate = setLastModifiedDate
exports.setSKUNameFromSizeCode = setSKUNameFromSizeCode
exports.checkName = checkName