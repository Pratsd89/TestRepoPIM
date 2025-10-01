/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ManualSizeCodeReferenceCreation",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_ManualSizeCodeReferenceCreation",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "node_Class",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "101471",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref_Style",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref_SKU",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,node_Class,ref_Style,ref_SKU,helper) {
	var styleNode=node;

	 var sizeModels = new java.util.ArrayList();
      sizeModels.addAll(styleNode.getClassificationProductLinks(ref_Style));
       if (sizeModels.size() == 1) {
          for (var p = 0; p < sizeModels.size(); p++) {
              var sizeModelNode = sizeModels.get(p).getClassification();
          }
         }       
	  var ccUndersStyles = new java.util.ArrayList();
       ccUndersStyles.addAll(styleNode.getChildren());

	for(var c=0;c < ccUndersStyles.size();c++)
	{
		var cc=ccUndersStyles.get(c);
		var skusUnderCC=new java.util.ArrayList();
		skusUnderCC.addAll(cc.getChildren());
		for(var s=0;s < skusUnderCC.size();s++)
		{
			var sku=skusUnderCC.get(s);
			var sizeCode=sku.getValue("a_Size_Code").getSimpleValue();
			if(sizeCode!=null)
			{
				//check whether size code exist under the size mode
				var refsmclasc = new java.util.ArrayList();
				refsmclasc.addAll(sizeModelNode.getChildren());
		                if (refsmclasc.size() != 0) {
		                    for (var n = 0; n < refsmclasc.size(); n++) {
		                        var currSizeCodeName = refsmclasc.get(n).getName();

		                        if (currSizeCodeName == sizeCode) {
		                            sizeCodeClassification = refsmclasc.get(n);
		                        }
		                    }
		                }
		                
				if(sizeCodeClassification!=null)
				{
		                //Delete if already linked size code is not same as the new one
		                var sizeCodeReferences=sku.getClassificationProductLinks(ref_SKU).iterator();
		                if(sizeCodeReferences.hasNext())
		                {
			                while(sizeCodeReferences.hasNext())
			                {
			                	var currentSizeCodeRef=sizeCodeReferences.next();
			                	var existingSizeCode=currentSizeCodeRef.getClassification();
			                	var existSizeCodeId=existingSizeCode.getID();
			               	var existSizeCodeName=existingSizeCode.getName(); 
			               	if(existSizeCodeName!=sizeCode)
			               		currentSizeCodeRef.delete();
			                }
		                }
		                else
		                {
		                	try {
                            			
                            			sku.createClassificationProductLink(sizeCodeClassification, ref_SKU);

                            			//to set name of the SKU
                            			function othercontext(node,contextID)
								{
									manager.executeInContext(contextID, function(otherManager) {
										// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
										// Set name directly from Size code
										var otherNode = otherManager.getObjectFromOtherManager(node);
										helper.setSKUNameFromSizeCode(otherNode, otherManager);
										}
										)
								}
								
								if(sku.getObjectType().getID() == "SKU") {
									if(sku.getName()==null)
									{
									//PPIM-7242 as part of JP introduction we made this block as context agnostic 
									var contextListItr = manager.getListOfValuesHome().getListOfValuesByID("All_Contexts_LoV").queryValidValues().asList(10).iterator();
										while(contextListItr.hasNext()){
											var contextID=contextListItr.next().getID();
											othercontext(sku,contextID);
										}
									}
									}

									//Publish to DGL
									var time1 = new java.util.Date();
									var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
									//logger.info(iso.format(time));
									sku.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1));
									//log.info(sku.getValue("a_main_last_modified_date").getSimpleValue());
                            
		                        } catch (e) {
		                            if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
		                                log.warning("Link between product and classification with already exists.");
		                            } else {
		                                throw e;
		                            }
		                        }
		                }
				}
				else
				{
					var new_class = sizeModelNode.createClassification("SC-"+sizeModelNode.getID()+"-"+sizeCode, "SizeCode");
                         new_class.setName(sizeCode);
                         
                         //Delete if already linked size code is not same as the new one
		                var sizeCodeReferences=sku.getClassificationProductLinks(ref_SKU).asList().iterator();
		                if(sizeCodeReferences.hasNext())
		                {
			                while(sizeCodeReferences.hasNext())
			                {
			                	var currentSizeCodeRef=sizeCodeReferences.next();
			                	var existingSizeCode=currentSizeCodeRef.getClassificatin();
			                	var existSizeCodeId=existingSizeCode.getID();
			               	var existSizeCodeName=existingSizeCode.getName();
			               	if(existSizeCodeName!=sizeCode)
			               		currentSizeCodeRef.delete();
			                }
		                }
		                else
		                {
		                	try {
                            			
                            			sku.createClassificationProductLink(new_class, ref_SKU);

                            			//to set name of the SKU
                            			function othercontext(node,contextID)
								{
									manager.executeInContext(contextID, function(otherManager) {
										// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
										// Set name directly from Size code
										var otherNode = otherManager.getObjectFromOtherManager(node);
										helper.setSKUNameFromSizeCode(otherNode, otherManager);
										}
										)
								}
								
								if(sku.getObjectType().getID() == "SKU") {
								
									//PPIM-7242 as part of JP introduction we made this block as context agnostic 
									var contextListItr = manager.getListOfValuesHome().getListOfValuesByID("All_Contexts_LoV").queryValidValues().asList(10).iterator();
										while(contextListItr.hasNext()){
											var contextID=contextListItr.next().getID();
											othercontext(sku,contextID);
										}
									}
									
									//Publish to DGL
									var time1 = new java.util.Date();
									var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
									//logger.info(iso.format(time));
									sku.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1));
									//log.info(sku.getValue("a_main_last_modified_date").getSimpleValue());
                            
		                        } catch (e) {
		                            if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
		                                log.warning("Link between product and classification with already exists.");
		                            } else {
		                                throw e;
		                            }
		                        }
		                }
				}
			}	
		}
	
	}
       
	
	
}