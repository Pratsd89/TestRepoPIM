/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "lib_AutoPop",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Autopop Library",
  "description" : null,
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
function validateTagsAndAssociate (classification,product,stepManager){
    
    //classification attributes
    webDepartmentTagList=classification.getValue('a_Department_Tag').getValues();
    webProductTagList=classification.getValue('a_ProductType_Tag').getValues();
    webCategoryTagList=classification.getValue('a_Category_Tag').getValues();
    webGroupTagList=classification.getValue('a_CategoryGroup_Tag').getValues();
    webStyleTagList=classification.getValue('a_Style_Tag').getValues();
    webBoutiqueTagList=classification.getValue('a_Boutique_Tag').getValues();

    //classification exclusion attributes
    webDepartmentExclusionsTagList=classification.getValue('a_Department_Tag_Exclusions').getValues();
    webProductExclusionsTagList=classification.getValue('a_ProductType_Tag_Exclusions').getValues();
    webCategoryExclusionsTagList=classification.getValue('a_Category_Tag_Exclusions').getValues();
    webGroupExclusionsTagList=classification.getValue('a_CategoryGroup_Tag_Exclusions').getValues();
    webStyleExclusionsTagList=classification.getValue('a_Style_Tag_Exclusions').getValues();
    webBoutiqueExclusionsTagList=classification.getValue('a_Boutique_Tag_Exclusions').getValues();

    //product attributes
    productDepartmentTagList=product.getValue('a_Department_Tag_Inherit').getValues();
    productProductTagList=product.getValue('a_ProductType_Tag_Inherit').getValues();
    productCategoryTagList=product.getValue('a_Category_Tag_Inherit').getValues();
    productGroupTagList=product.getValue('a_CategoryGroup_Tag_Inherit').getValues();
    productStyleTagList=product.getValue('a_Style_Tag_Inherit').getValues();
    productBoutiqueTagList=product.getValue('a_Boutique_Tag_Inherit').getValues();

    //checking exclusion value exist or not
    var departmentTagExclusionResult=checkExclusionCriteria(webDepartmentExclusionsTagList,productDepartmentTagList);
    var productTagExclusionResult=checkExclusionCriteria(webProductExclusionsTagList,productProductTagList);
    var categoryTagExclusionResult=checkExclusionCriteria(webCategoryExclusionsTagList,productCategoryTagList);
    var groupTagExclusionResult=checkExclusionCriteria(webGroupExclusionsTagList,productGroupTagList);
    var styleTagExclusionResult=checkExclusionCriteria(webStyleExclusionsTagList,productStyleTagList);
    var boutiqueTagExclusionResult=checkExclusionCriteria(webBoutiqueExclusionsTagList,productBoutiqueTagList);

    //if there is no exlusion flag matching , then checking the inclusion flags
    if(departmentTagExclusionResult==false && productTagExclusionResult==false && categoryTagExclusionResult==false && groupTagExclusionResult==false && styleTagExclusionResult==false && boutiqueTagExclusionResult==false){
        //checking if all the tags on category or on style are empty , then do not link
        if((webDepartmentTagList.size()==0 && webProductTagList.size()==0 && webCategoryTagList.size()==0 && webGroupTagList.size()==0 && webStyleTagList.size()==0 && webBoutiqueTagList.size()==0) || 
        (productDepartmentTagList.size()==0 && productProductTagList.size()==0 && productCategoryTagList.size()==0 && productGroupTagList.size()==0 && productStyleTagList.size()==0 && productBoutiqueTagList.size()==0))
        {
            var referenceExist = checkClassificationProductLinkExist(classification,product);
            if(referenceExist==true){
                deleteReference(classification,product);
            }
        }
        else{
            //checking all the inclusion values exist in product or not
            var departmentTagInclusionResult=checkInclusionCriteria(webDepartmentTagList,productDepartmentTagList);
            var productTagInclusionResult=checkInclusionCriteria(webProductTagList,productProductTagList);
            var categoryTagInclusionResult=checkInclusionCriteria(webCategoryTagList,productCategoryTagList);
            var groupTagInclusionResult=checkInclusionCriteria(webGroupTagList,productGroupTagList);
            var styleTagInclusionResult=checkInclusionCriteria(webStyleTagList,productStyleTagList);
            var boutiqueTagInclusionResult=checkInclusionCriteria(webBoutiqueTagList,productBoutiqueTagList);
            
            //if all the inclusion values exist then linking the product with the classification
            if(departmentTagInclusionResult==true && productTagInclusionResult==true && categoryTagInclusionResult==true && groupTagInclusionResult==true && styleTagInclusionResult==true && boutiqueTagInclusionResult==true){
                //create reference if it does not already exist
                var referenceExist = checkClassificationProductLinkExist(classification,product);
                if(referenceExist==false){
                    var classificationProductLinkType = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome).getLinkTypeByID('StyleToWebSubCategoryRef');
                    classification.createClassificationProductLink(product,classificationProductLinkType)
                }
                
            }
            //if all the inclusion values does not exist then delete the reference if exist
            else{
                var referenceExist = checkClassificationProductLinkExist(classification,product);
                if(referenceExist==true){
                    deleteReference(classification,product);
                } 
            }
        }
        
        
    }
    // if exlusion values exist then delete the reference if exist
    else{
        var referenceExist = checkClassificationProductLinkExist(classification,product);
        if(referenceExist==true){
            deleteReference(classification,product);
        }
    }

}


function checkExclusionCriteria(classificationArray,productArray){
    for(var i =0;i<productArray.size();i++){
        var productValue = productArray.get(i).getSimpleValue();
        for(var j=0;j<classificationArray.size();j++){
            var classificationValue = classificationArray.get(j).getSimpleValue();
            if(productValue==classificationValue){
                return true;
            }
        }
    }
    return false;
}


function checkInclusionCriteria(classificationArray,productArray){
    if(classificationArray.size()==0){
    	 return true;
    }
    for(var i =0 ;i<classificationArray.size();i++){
        var classificationValue= classificationArray.get(i).getSimpleValue();
        for(var j=0;j<productArray.size();j++){
            var productValue = productArray.get(j).getSimpleValue();
            if(productValue==classificationValue){
                return true;
            }
        }
    }
    return false;
    
}


function checkClassificationProductLinkExist(classification,product){
    var productsList = classification.getClassificationProductLinks().toArray();
    for(var k=0;k<productsList.length;k++){
        var productID = productsList[k].getProduct().getID();
        if(productID == product.getID()){
           return true;
        }
    }
    return false;
}


function deleteReference(classification,product){
    var productsList = classification.getClassificationProductLinks().toArray();
    for(var k=0;k<productsList.length;k++){
        var productID = productsList[k].getProduct().getID();
        if(productID == product.getID()){
            productsList[k].delete();
        }
    }
}
/*===== business library exports - this part will not be imported to STEP =====*/
exports.validateTagsAndAssociate = validateTagsAndAssociate
exports.checkExclusionCriteria = checkExclusionCriteria
exports.checkInclusionCriteria = checkInclusionCriteria
exports.checkClassificationProductLinkExist = checkClassificationProductLinkExist
exports.deleteReference = deleteReference