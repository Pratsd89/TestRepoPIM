/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Temp_DataLoad_Fix_WPT",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Temp_DataLoad_Code_Fix_WPT",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "StyleToWebProductTypeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebProductTypeRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,StyleToWebProductTypeRef) {
//PPIM 10547 Link Style to Web Product Type 
var brandNum = node.getValue("a_Brand_Number").getSimpleValue();
var attrID = "a_" + brandNum + "_WebProductType";
/*var checkId = manager.getAttributeHome().getAttributeByID(attrID);
if(checkId){
	var webProdType = node.getValue(attrID).getID();
	var classId = manager.getClassificationHome().getClassificationByID(webProdType);
	var wptDesc = classId.getValue("a_WPT_Description").getSimpleValue();
	var WptLabel = classId.getValue('a_WPT_CC_Selector_Label').getSimpleValue();
	var WptDim1Lbl1 = classId.getValue('a_WPT_Dimension1Label1').getSimpleValue();
	var WptDim2Lbl1 = classId.getValue('a_WPT_Dimension2Label1').getSimpleValue();
	var WptDim2Lbl2 = classId.getValue('a_WPT_Dimension2Label2').getSimpleValue();*/
	

	var prodLinks = node.getClassificationProductLinks().asList();
	if (prodLinks){
		var prodLinksIter = prodLinks.iterator();
		while (prodLinksIter.hasNext()){
			var eachLink = prodLinksIter.next();
			if(eachLink.getLinkType().getID() == "StyleToWebProductTypeRef"){
				var existingWPT = eachLink.getClassification();
				log.info(existingWPT.getValue("a_WPT_Description").getSimpleValue());
				var wptDesc = existingWPT.getValue("a_WPT_Description").getSimpleValue();
				node.getValue("a_Web_Product_Type").setSimpleValue(wptDesc);
				node.getValue(attrID).setSimpleValue(wptDesc);
				
			}
		}
	}
	/*try{
		node.createClassificationProductLink(classId, StyleToWebProductTypeRef);
		node.getValue("a_Web_Product_Type").setSimpleValue(wptDesc);
		node.getValue('a_WPT_CCLabel').setValue(WptLabel);
		node.getValue('a_WPT_Dim1Label1').setValue(WptDim1Lbl1);
		node.getValue('a_WPT_Dim2Label1').setValue(WptDim2Lbl1);
		node.getValue('a_WPT_Dim2Label2').setValue(WptDim2Lbl2);
		
	}
	catch (e) {
        if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
            log.info ("Reference from Style "+node.getID()+ " to "+webProdType +" already exists.");
        }
	}
}*/
}