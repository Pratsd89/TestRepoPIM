/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Category_Autopop_Validation_Rule",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "(DEP) Category Autopop Validation Rule",
  "description" : "Deprecated",
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,autopopLibrary) {
var categoryAssortmentType = node.getValue('a_WebCategory_Assortment_Type').getSimpleValue();
if(categoryAssortmentType == 'Autopop')
{
    //getting the heirarchy of the web category / subcategory to decide which context to run the rule on
    var context;
    var objectType = node.getObjectType().getID();
    if(objectType == 'WebCategory'){
        var webBU = node.getParent().getParent();
    }
    else{
        var webBU = node.getParent().getParent().getParent();
    }

    var webHeirarchyUSID=stepManager.getProductHome().getProductByID('WebHierarchyUS').getValue('Property_Value').getSimpleValue();
    var webHeirarchyCAID = stepManager.getProductHome().getProductByID('WebHierarchyCA').getValue('Property_Value').getSimpleValue();
    if(webBU.getID()==webHeirarchyUSID){
        context = "EN_US";
    }
    else if(webBU.getID()==webHeirarchyCAID){
        context = "EN_CA";
    }
    //end of the code

    stepManager.executeInContext(context,function(step) {
        var brand = step.getProductHome().getProductByID('f9aa303b-b3e1-4542-8acb-4ea6426c3002');
        var divisionList = brand.getChildren();
        var time_product = new java.util.Date();
	   var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	   logger.info('Time before entry of loop in Category Autopop event processor  ' + iso_product.format(time_product));
        for(var i=0;i<divisionList.size();i++){
            var division = divisionList.get(i);
            var departmentList= division.getChildren();
            for(var j=0;j<departmentList.size();j++){
                var department = departmentList.get(j);
                var classList = department.getChildren();
                for(var k=0;k<classList.size();k++){
                    var productClass = classList.get(k);
                    var subClassList = productClass.getChildren();
                    for(var m=0;m<subClassList.size();m++){
                        var subClass= subClassList.get(m);
                        var styleList = subClass.getChildren();
                        for(var n=0;n<styleList.size();n++){
                            var style= styleList.get(n);
                            var webCategoryProductType = node.getValue('a_WebCategory_Product_Type').getSimpleValue();
                            if(webCategoryProductType=='Style'){
                                var styleLifeCycleStatus = style.getValue('a_Style_Life_Cycle_Status').getSimpleValue();
                                if(styleLifeCycleStatus != null){
                                    if(style.getValue('a_Style_Life_Cycle_Status').getLOVValue().getID()!='DRAFT'){
                                        autopopLibrary.validateTagsAndAssociate(node,style,step);
                                    }
                                }
                            }
                            else{
                                var ccList = style.getChildren();
                                for(var o=0;o<ccList.size();o++){
                                    var cc= ccList.get(o);
                                    var ccLifeCycleStatus = cc.getValue('a_CC_Life_Cycle_Status').getSimpleValue();
                                    if(ccLifeCycleStatus != null){
                                        if(cc.getValue('a_CC_Life_Cycle_Status').getLOVValue().getID()!='DRAFT'){
                                            autopopLibrary.validateTagsAndAssociate(node,cc,step);
                                        }
                                    }
                                }
                            }                     
                        }
                    }
                }
            }
        }
        var time_product = new java.util.Date();
	   var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	   logger.info('Time on exit of loop in Category Autopop event processor  ' + iso_product.format(time_product));   
    });
}
}