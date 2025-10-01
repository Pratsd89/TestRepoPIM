/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Style_CC_Autopop_Validation_Rule",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Style and CC Autopop Validation Rule",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_AutoPop",
    "libraryAlias" : "autopopLibrary"
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
    "contract" : "AttributeBindContract",
    "alias" : "webAssortmentType",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_WebCategory_Assortment_Type",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "webCategoryObject",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "WebCategory",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "webSubCategoryObject",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "WebSubCategory",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,webAssortmentType,webCategoryObject,webSubCategoryObject,autopopLibrary) {
var webHeirarchyUSID=stepManager.getProductHome().getProductByID('WebHierarchyUS').getValue('Property_Value').getSimpleValue();
var webHeirarchyCAID=stepManager.getProductHome().getProductByID('WebHierarchyCA').getValue('Property_Value').getSimpleValue();

//going through all the category
var c = com.stibo.query.condition.Conditions;
var h = stepManager.getHome(com.stibo.query.home.QueryHome);
var querySpecificationCategory = h.queryFor(com.stibo.core.domain.Classification).where(
     c.valueOf(webAssortmentType).eq("Autopop")
     .and(c.objectType(webCategoryObject))
);
var categoryResult = querySpecificationCategory.execute();
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
logger.info('Time before entry of loop for category in Style and CC Autopop event processor  ' + iso_product.format(time_product));
categoryResult.forEach(function(category) {
	
    //handle category here
    webBU = category.getParent().getParent();
    //getting the context based on the heirarchy
    var context = null;
    if(webBU.getID() == webHeirarchyUSID){
        var context = 'EN_US';
    }
    else if(webBU.getID()== webHeirarchyCAID){
        var context = 'EN_CA';
    }

    //executing in the corresponding context
    if(context != null){
        stepManager.executeInContext(context,function(step) {
            var webCategory = step.getClassificationHome().getClassificationByID(category.getID());
            var product= step.getProductHome().getProductByID(node.getID());
            var webCategoryProductType = webCategory.getValue('a_WebCategory_Product_Type').getSimpleValue();

            if(webCategoryProductType=='Style'){
                var styleLifeCycleStatus = product.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
                if(styleLifeCycleStatus != null){
                    if(product.getValue('a_Style_Life_Cycle_Status').getLOVValue().getID()!='DRAFT'){
                        autopopLibrary.validateTagsAndAssociate(webCategory,product,step);
                    }
                }
            }
            else{
                var ccList = product.getChildren();
                for(var o=0;o<ccList.size();o++){
                    var cc= ccList.get(o);
                    var ccLifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
                    if(ccLifeCycleStatus != null){
                        if(cc.getValue('a_CC_Life_Cycle_Status').getLOVValue().getID()!='DRAFT'){
                            autopopLibrary.validateTagsAndAssociate(webCategory,cc,step);
                        }
                    }
                }
            }
        
        
        
        });
    }
    return true;
});
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
logger.info('Time on exit of loop for category in Style and CC Autopop event processor  ' + iso_product.format(time_product));
//end of the check for the category


// going through all the subcategory
var querySpecificationSubCategory = h.queryFor(com.stibo.core.domain.Classification).where(
     c.valueOf(webAssortmentType).eq("Autopop")
     .and(c.objectType(webSubCategoryObject))
);
var subcategoryResult = querySpecificationSubCategory.execute();
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
logger.info('Time before entry of loop for sub-category in Style and CC Autopop event processor  ' + iso_product.format(time_product));
subcategoryResult.forEach(function(subCategory) {
    //handle subcategory here
	webBU = subCategory.getParent().getParent().getParent();
    //getting the context based on the heirarchy
    var context = null;
    if(webBU.getID() == webHeirarchyUSID){
        var context = 'EN_US';
    }
    else if(webBU.getID()== webHeirarchyCAID){
        var context = 'EN_CA';
    }

    //executing in the corresponding context
    if(context != null){
        stepManager.executeInContext(context,function(step) {
            var webSubCategory = step.getClassificationHome().getClassificationByID(subCategory.getID());
            var product= step.getProductHome().getProductByID(node.getID());
            var webCategoryProductType = webSubCategory.getValue('a_WebCategory_Product_Type').getSimpleValue();

            if(webCategoryProductType=='Style'){
                var styleLifeCycleStatus = product.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
                if(styleLifeCycleStatus != null){
                    if(product.getValue('a_Style_Life_Cycle_Status').getLOVValue().getID()!='DRAFT'){
                        autopopLibrary.validateTagsAndAssociate(webSubCategory,product,step);
                    }
                }
            }
            else{
                var ccList = product.getChildren();
                for(var o=0;o<ccList.size();o++){
                    var cc= ccList.get(o);
                    var ccLifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
                    if(ccLifeCycleStatus != null){
                        if(cc.getValue('a_CC_Life_Cycle_Status').getLOVValue().getID()!='DRAFT'){
                            autopopLibrary.validateTagsAndAssociate(webSubCategory,cc,step);
                        }
                    }
                }
            }
        
        
        
        });
    }
    return true;
});
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
logger.info('Time on exit of loop for sub-category in Style and CC Autopop event processor  ' + iso_product.format(time_product));
//end of the check for the category
}