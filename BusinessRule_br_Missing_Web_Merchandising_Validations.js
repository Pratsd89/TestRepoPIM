/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Missing_Web_Merchandising_Validations",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Missing Web Merchandising Validations",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_completenessChecks",
    "libraryAlias" : "compCheck"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,compCheck) {

//Check to Ignore web related validations for Non Merch Style
var nonMerchType = node.getValue("a_product_merch_type").getSimpleValue();
if (!(nonMerchType == "COMPLIMENTARY GIFT BOXES" || nonMerchType == "GIFTS" || nonMerchType == "MONOGRAM SERVICE" || nonMerchType == "PREMIUM GIFT BOXES" || nonMerchType == "PREMIUM GIFT BOXES SVC" || nonMerchType == "STORED VALUE CARDS FIXED" || nonMerchType == "STORED VALUE CARDS FIXED OPTIONS" || nonMerchType == "STORED VALUE CARDS OPEN")){

var attributeCheck = compCheck.attributeCompletenessCheck(node, stepManager, "ag_Style_Validation");

if(attributeCheck != true){
	node.getValue('a_error_message').setSimpleValue('Following attributes are mandatory and needs to be filled to proceed: \n'+attributeCheck);
	return 'Following attributes are mandatory and needs to be filled to proceed: \n'+attributeCheck; 
}


var classificationTypeHome = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
var classificationType = classificationTypeHome.getLinkTypeByID('StyleToWebSubCategoryRef');

// for web category check, comment from Emily on 052220 - If style is not in a web category but any one of its CC is, then we can let that Style pass
var children = node.getChildren();
if (children) {
   var childIter = children.iterator();
    while (childIter.hasNext()) {
        var child = childIter.next();
        var references = child.getClassificationProductLinks(classificationType).toArray();
        if(references.length > 0)
        		return true; // CC has Web Category link so this Style can pass.
    }
}

// at this point, none of CCs under the Style has Web Category so check for the same on Style

var classificationLinkList = node.getClassificationProductLinks(classificationType).toArray();
if(classificationLinkList.length ==0){
	node.getValue('a_error_message').setSimpleValue('Style not in web categorization');
	return 'Style not in web categorization';
}
else{
	var primaryCategoryTrueFlag = false;
	var pCatStyle = node.getValue("a_Primary_Category").getSimpleValue();
	if(pCatStyle != null){
		primaryCategoryTrueFlag = true;
	}
	/*for(var i =0;i<classificationLinkList.length;i++){
		var primaryCategory = classificationLinkList[i].getValue('a_Primary_Category').getSimpleValue();
		if(primaryCategory == 'Y'){
			primaryCategoryTrueFlag= true;
			break
		}
	}*/
	 //https://gapinc.atlassian.net/browse/PPIM-12807
    var brand = node.getValue("a_Brand_Number").getSimpleValue();
	if(primaryCategoryTrueFlag == false && brand!='GPS'){
		//return 'There should be atleast one Web Categorization with Primary Category as "Y"';
		node.getValue('a_error_message').setSimpleValue('There should be atleast one Primary Category associated with Style');
		return 'There should be atleast one Primary Category associated with Style';
	}
}
}
return true;

}