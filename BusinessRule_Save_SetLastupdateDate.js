/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Save_SetLastupdateDate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Save Size Model Classification",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Dim1", "Dim2", "SizeCode", "SizeModel" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
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
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,portal,helper) {
function saveObject(node) {

    //logger.info(iso.format(time));
    //a_main_last_modified_date is NOT dimension dependent so moving it out of this function so it gets executed only once.

    // node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    //log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
    var obj = node.getObjectType().getID();

    if (obj == "SizeModel") {
        var classStyle = node.getClassificationProductLinks();

        /*
         PPIM-3306 - publish as background job for performance reasons
         Save_SetLastupdateDate now also calls "ApproveSizeModel" which takes care of publishing impacted Style so commenting out below code.
            
        if(classStyle){
            var chIter11=classStyle.iterator();
            while(chIter11.hasNext()){
                var chprod11 = chIter11.next(); 
                var x = chprod11.getProduct();
                log.info("styles are "+x.getID());
                x.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                log.info(x.getValue("a_main_last_modified_date").getSimpleValue());
            }
        }
        */
		var childNodes = node.getChildren();
		var errorMessage = null;
		if(childNodes.size() != 0)
		{
			for(var i=0; i<childNodes.size(); i++)
			{
				var child = childNodes.get(i);
				var variantValue = child.getValue("a_SizeCodeVariant").getSimpleValue();
				if (variantValue == null || variantValue == "")
				{
					if(errorMessage == null)
					{
						errorMessage = child.getName() + " : Missing Size Variant";
					}
					else
					{
						errorMessage = child.getName() + " , " + errorMessage;
					}
				}
			}
			if(errorMessage != null)
			{
				portal.showAlert("Warning", errorMessage);
			}
		}
    } else if (obj == "SizeCode") {
        var variant = null;
        var sDim1 = null;
        var sDim2 = null;
        var skuDim2 = null;
        variant = node.getValue("a_SizeCodeVariant").getSimpleValue();
        var refDimObj = new java.util.ArrayList();
        refDimObj.addAll(node.getChildren());
        for (var i = 0; i < refDimObj.size(); i++) {
            if (refDimObj.get(i).getObjectType().getID() == "Dim1") {
                sDim1 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();
            }
            if (refDimObj.get(i).getObjectType().getID() == "Dim2") {
                sDim2 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();
            }
        }
        var skuDim1 = variant + " " + sDim1;
        if (sDim2 != null) {
            skuDim2 = variant + " " + sDim2;
        }
        //Set SKU Name as per the dim1,dim2,variant
        var refSKU = new java.util.ArrayList();
        refSKU.addAll(node.getClassificationProductLinks());
        log.info(refSKU)
        for (var i = 0; i < refSKU.size(); i++){
        	sku = refSKU.get(i).getProduct()
        	log.info(sku)
        	helper.setSKUNameFromSizeCode(sku,stepManager);
        	log.info(sku.getName())
        }
        // 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
        /*
        for(var j=0;j<refSKU.size();j++){
            refSKU.get(j).getProduct().getValue("a_Size_Dim1_Description").setSimpleValue(skuDim1);
            if(sDim2 != null){
            refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").setSimpleValue(skuDim2);
            }
            else if(refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").getSimpleValue() != null){
                refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").deleteCurrent();
                }
            }
          */
        var variantValue = node.getValue("a_SizeCodeVariant").getSimpleValue();
        if (variantValue == null || variantValue == "") {
            portal.showAlert("Warning", node.getName() + " : Missing Size Variant");
        }
    } else if (obj == "Dim1" || obj == "Dim2") {
        var sDim1 = null;
        var sDim2 = null;
        var skuDim2 = null;

		var contextListItr = stepManager.getListOfValuesHome().getListOfValuesByID("All_Contexts_LoV").queryValidValues().asList(10).iterator();
		while(contextListItr.hasNext()){
			var contextID=contextListItr.next().getID();
			stepManager.executeInContext(contextID, function (step) {
            var usObject = step.getClassificationHome().getClassificationByID(node.getID());
            var dimensionValue = usObject.getValue("a_Advanced_Dimension_Value").getSimpleValue();
            usObject.setName(dimensionValue);
            setNameSkuDimChange(usObject)
        });
		}
       
        //PPIM-7222 requirements ends here
        var variant = node.getParent().getValue("a_SizeCodeVariant").getSimpleValue();
        var refDimObj = new java.util.ArrayList();
        refDimObj.addAll(node.getParent().getChildren());
        for (var i = 0; i < refDimObj.size(); i++) {
            if (refDimObj.get(i).getObjectType().getID() == "Dim1") {
                sDim1 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();
            }
            if (refDimObj.get(i).getObjectType().getID() == "Dim2") {
                sDim2 = refDimObj.get(i).getValue("a_Advanced_Dimension_Value").getSimpleValue();
            }
        }
        var skuDim1 = variant + " " + sDim1;
        if (sDim2 != null) {
            skuDim2 = variant + " " + sDim2;
        }
        // 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
        /*
        for(var j=0;j<refSKU.size();j++){
            refSKU.get(j).getProduct().getValue("a_Size_Dim1_Description").setSimpleValue(skuDim1);
            if(sDim2 != null){
            refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").setSimpleValue(skuDim2);
            }
            else if(refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").getSimpleValue() != null){
                refSKU.get(j).getProduct().getValue("a_Size_Dim2_Description").deleteCurrent();
                }
        }
        */
    }
}

/*var obj = node.getObjectType().getID();
if(obj == "SizeModel" || obj == "SizeCode")
{
	var variantValue = node.getValue("a_SizeCodeVariant").getSimpleValue();
	if(variantValue == null || variantValue == "")
	{
		portal.showAlert("Warning",null, node.getName()+" : Missing Size Variant");
	}
}*/

function setNameSkuDimChange(dim) {

	refs = new java.util.ArrayList();
	refs.addAll(node.getParent().getClassificationProductLinks());
	
     log.info(refs)
	   for(var i=0;i<refs.size();i++){
	   	sku = refs.get(i).getProduct()
	   	
	   	helper.setSKUNameFromSizeCode(sku,stepManager);
        	
	   }
}

if (stepManager.getCurrentWorkspace().getID() == "Main") {
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

	var contextListItr = stepManager.getListOfValuesHome().getListOfValuesByID("All_Contexts_LoV").queryValidValues().asList(10).iterator();
	while(contextListItr.hasNext()){
			var contextID=contextListItr.next().getID();
			 stepManager.executeInContext(contextID, function (step) {
            var usObject = step.getClassificationHome().getClassificationByID(node.getID());
            saveObject(usObject);
        });
		}
	
   
    
    //PPIM-7222 requirements ends here

}
else if (stepManager.getCurrentWorkspace().getID() == "Approved")
{
	portal.showAlert("Warning", "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "ApproveSizeModel"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "ApproveSizeCode"
  } ],
  "pluginType" : "Operation"
}
*/
