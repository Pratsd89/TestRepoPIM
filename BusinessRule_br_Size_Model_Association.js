/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Size_Model_Association",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Size_Model_Association",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SKU", "Style" ],
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
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
  }, {
    "contract" : "ClassificationBindContract",
    "alias" : "node_Class",
    "parameterClass" : "com.stibo.core.domain.impl.FrontClassificationImpl",
    "value" : "101471",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,ref_Style,ref_SKU,node_Class) {
try {
    var sClassID = null;
    var newlinkCreated = false;
    
    var id = node.getID();
    var obj = node.getObjectType().getID();
    var updateSizeModel= false;
    if (obj == "Style") {
        var id_classification_STYLE = node.getValue("a_Source_Size_Model").getSimpleValue();
        
        ///relate Style to Classification

        if (id_classification_STYLE != null) {

            var classification_STYLE = manager.getClassificationHome().getClassificationByID(id_classification_STYLE);

            var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SizeModelRef");
            
            if (classification_STYLE != null) {
                var catProd = node.getClassificationProductLinks().asList();
                
                if (catProd) {
                    var chIter = catProd.iterator();
                    while (chIter.hasNext()) {
                        var chprod = chIter.next();
                        
                        var link = chprod.getLinkType().getID();
                        
                        if (link == "SizeModelRef") {
                            sClassID = chprod.getClassification().getID();
                        }

                    }
                }
			
  			var styleLifeCycleststatus= node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if ((sClassID != null) && (styleLifeCycleststatus != "Approved") && (id_classification_STYLE != sClassID)){
                	updateSizeModel = true;
                
                }

                if ((chIter.hasNext() == false) || (sClassID == null)) {
                    try {
                    	if (updateSizeModel){
                        	var sizeModelReference=node.getClassificationProductLinks(ref_Style).iterator();		                
			                while(sizeModelReference.hasNext()){
			                	var currentSizeModelRef=sizeModelReference.next();
			                	log.info("currentSizeModelRef"+currentSizeModelRef);
			               		currentSizeModelRef.delete();
			                }
		                
                    	}
                			classification_STYLE.createClassificationProductLink(node, linkType);
                    } catch (e) {
                        if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                            log.warning("Link between product and classification with already exists.");
                        } else {
                            throw e;
                        }
                    }
                    log.info("linked_STYLE"); ///style linking done
                }

                //End of block for style to size model linking if classification was present before
            } 
			else if (classification_STYLE == null) {
                
                var catSk = node.getClassificationProductLinks().asList();
                var sm = null;
                if (catSk) {
                    var catItersk = catSk.iterator();
                    while (catItersk.hasNext()) {
                        var chSk = catItersk.next();
                        var linkStyle = chSk.getLinkType().getID();
                        var chSk_ID = chSk.getClassification().getID();
                        if (linkStyle == "SizeModelRef") {
                            sm = chSk_ID;
                        }
                    }
                }   
             var styleLifeCycleststatus= node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
 			if ( styleLifeCycleststatus != "Approved" ){
                	updateSizeModel = true;               
                }

                if ((catItersk.hasNext() == false) || (sm == null)) {
                	   try {
                    	if (updateSizeModel){
                        	var sizeModelReference=node.getClassificationProductLinks(ref_Style).iterator();
                        	while(sizeModelReference.hasNext())  {
			                	var currentSizeModelRef=sizeModelReference.next();
			                	log.info("currentSizeModelRef"+currentSizeModelRef);
			               		currentSizeModelRef.delete();
			                }            
                    	}
                        //log.info("creating style to size model classification");
                         var new_class = node_Class.createClassification(id_classification_STYLE, "SizeModel");
                         new_class.setName(id_classification_STYLE);
                         node.createClassificationProductLink(new_class, ref_Style);
                         newlinkCreated = true;
                    } catch (e) {
                         if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                              log.warning("Link between product and classification already exists.");
                         } else {
                              throw e;
                           }
                      }
                }
            }

            //set classification_STYLE for usage in SKU classification
            var newSizeModel = node.getValue("a_Web_Size_Model").getSimpleValue();
            classification_STYLE = manager.getClassificationHome().getClassificationByID(newSizeModel);
            
            var refs = new java.util.ArrayList();
            refs.addAll(node.getChildren());

            for (var i = 0; i < refs.size(); i++) {
                var CC_ID = refs.get(i).getID();
                
                if (CC_ID != null) {
                    
                    var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
                    
                    var refs1 = new java.util.ArrayList();
                    refs1.addAll(SKUCheck.getChildren());
                    
                    for (var j = 0; j < refs1.size(); j++) {
                        var classifications_SKUs = null;
                        var new_class1 = 0;
                        
                        var SKU_ID = refs1.get(j);
                        
                        var id_classification_SKU = SKU_ID.getValue("a_Size_Code").getSimpleValue();
                        
                        /*var refsmcla = new java.util.ArrayList();
                        refsmcla.addAll(classification_STYLE.getChildren());
                        for (var n = 0; n < refsmcla.size(); n++) {
                            var newSCName = refsmcla.get(n).getName();
                            
                            if (newSCName == id_classification_SKU) {
                                classifications_SKUs = refsmcla.get(n);
                                
                            }
                        }*/
                       
                        if (id_classification_SKU != null) {
                           
                            var sub_class = null;
                            var skuSizeCodeLinkCreated = false;
                            var refs1_class = new java.util.ArrayList();
                            refs1_class.addAll(classification_STYLE.getChildren());
                            for (var k = 0; k < refs1_class.size(); k++) {
                                
                                sub_class = refs1_class.get(k).getName();
                               
                                if (sub_class == id_classification_SKU) {
                                	classifications_SKUs = refs1_class.get(k);
                                    //var linkType1 = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SKUToSizeCode");
                                    var catProdsk = SKU_ID.getClassificationProductLinks().asList();
                                    var chprodsk_ID = null;
                                    var parentIDsk = null;
                                    
                                    if (catProdsk) {
                                        var chItersk = catProdsk.iterator();
                                        while (chItersk.hasNext()) {
                                            var chprodsk = chItersk.next();
                                            var linksk = chprodsk.getLinkType().getID();
                                            if(linksk == "SKUToSizeCode"){
                                            	  chprodsk_ID = chprodsk.getClassification().getName();
                                            	  parentIDsk = chprodsk.getClassification().getParent().getID();
                                            }
                                        }
                                    }

                                    if ((chItersk.hasNext() == false) || (chprodsk_ID != id_classification_SKU) || (parentIDsk != newSizeModel)) {
                                        try {
                                            classifications_SKUs.createClassificationProductLink(SKU_ID, ref_SKU);
                                            skuSizeCodeLinkCreated = true;
                                        } catch (e) {
                                            if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                                                log.warning("Link between product and classification with already exists.");
                                            } else {
                                                throw e;
                                            }
                                        }
                                    }
                                }

                                    log.info("linked_SKU");
                                }
                            }

                            if (skuSizeCodeLinkCreated == false) {

                                if (classifications_SKUs == null) {
                                    var refsc = new java.util.ArrayList();
                                    var sc = null;
                                    refsc.addAll(refs1.get(j).getClassificationProductLinks(ref_SKU));
                                    if (refsc.size() == 1) {
                                        for (var l = 0; l < refsc.size(); l++) {
                                        	refsc.get(l).delete();
                                        }
                                    }
                                    new_class1 = classification_STYLE.createClassification("SC-"+newSizeModel+"-"+id_classification_SKU, "SizeCode");
                                    new_class1.setName(id_classification_SKU);
                                    refs1.get(j).createClassificationProductLink(new_class1, ref_SKU);
                                    var id_description_SKU1 = refs1.get(j).getValue("a_Source_Size_Description").getSimpleValue();

                                    if(id_description_SKU1 != null)
                                    {
                                        new_class1.getValue("a_Source_Size_Description").setSimpleValue(id_description_SKU1);
                                    }
                                    //initiation in workflow
                                    if (classification_STYLE.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow")) {
                                        //log.info("inside workflow");
                                        
                                        classification_STYLE.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow").delete("delete");
                                        
                                        classification_STYLE.startWorkflowByID("SizeModelEnrichmentWorkflow", "Size Code Based Initiation");

                                    } else {
                                         //log.info("workflow does not exist, going to create one");
                                        
                                         classification_STYLE.startWorkflowByID("SizeModelEnrichmentWorkflow", "Size Code Based Initiation");
                                      }
                                }
                                else if (updateSizeModel){
                                  if (classifications_SKUs != null) {
                                    var refsc = new java.util.ArrayList();
                                    var sc = null;
                                    refsc.addAll(refs1.get(j).getClassificationProductLinks(ref_SKU));
                                    if (refsc.size() == 1) {
                                        for (var l = 0; l < refsc.size(); l++) {
                                        	refsc.get(l).delete();
                                        }
                                    }
                                    log.info ("new_class1"+new_class1);
                                    classifications_SKUs.createClassificationProductLink(SKU_ID, ref_SKU);                       

                            	}
                        }
                      }

                           
                    }
                }
            }
            
            //code block for adding new classification creation and new link.

            if ((newSizeModel != sClassID) || (newlinkCreated == true)) {
                
                
                var nodeStatus = node.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
                if (nodeStatus == "Approved") {
                    if (node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow")) {
                        
                        node.getWorkflowInstanceByID("wf_StyleMaintenanceWorkflow").delete("delete");
                        node.startWorkflowByID("wf_StyleMaintenanceWorkflow", "Size Model Change Based Initiation - Reset to Maintenance");
                    } else {
                        
                        node.startWorkflowByID("wf_StyleMaintenanceWorkflow", "Size Model Change Based Initiation - Initial Maintenance invocation");
                    }
                }
            }

        }


    } 
	else if (obj == "SKU") {
        var SKU_ID = node.getID();
        var CC_ID = node.getParent().getID();
        var styleNode = node.getParent().getParent();
        var id_classification_SKU = node.getValue("a_Size_Code").getSimpleValue();
        

        if (id_classification_SKU != null) {
            var classification_SKU = null;
            //code to get size model node
            var refscsm = new java.util.ArrayList();
            refscsm.addAll(styleNode.getClassificationProductLinks(ref_Style));
            if (refscsm.size() == 1) {
                for (var p = 0; p < refscsm.size(); p++) {
                    var sizeModelNode = refscsm.get(p).getClassification();
                }

                //code block to get size code name and its size code id
                var refsmclasc = new java.util.ArrayList();
                refsmclasc.addAll(sizeModelNode.getChildren());
                if (refsmclasc.size() != 0) {
                    for (var n = 0; n < refsmclasc.size(); n++) {
                        var newSCName = refsmclasc.get(n).getName();
                        //log.info("newSCName "+newSCName);
                        if (newSCName == id_classification_SKU) {
                            classification_SKU = refsmclasc.get(n);
                        }
                    }
                }
            }

            var linkType1 = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SKUToSizeCode");
            
            if (classification_SKU != null) {
                var ID_CC = manager.getProductHome().getProductByID(CC_ID);
                var Style_id = ID_CC.getParent().getID();
                var ID_Style = manager.getProductHome().getProductByID(Style_id);
                
                var catProd1 = ID_Style.getClassificationProductLinks().asList();
                if (catProd1) {
                    var chIter1 = catProd1.iterator();
                    while (chIter1.hasNext()) {
                        var chprod1 = chIter1.next();
                        var link1 = chprod1.getLinkType().getID();
                        if (link1 == "SizeModelRef") {
                            var Style_attr = chprod1.getClassification().getID();

                        }

                    }
                }
                
                
                var parent_ID = classification_SKU.getParent().getID();
                
                if (Style_attr == parent_ID) {
                    var catSk = node.getClassificationProductLinks().asList();
                    if (catSk) {
                        var catItersk = catSk.iterator();
                        while (catItersk.hasNext()) {
                            var chSk = catItersk.next();
                            var linksku = chSk.getLinkType().getID();
                            var chSk_ID = chSk.getClassification().getID();
                            var chSk_Name = chSk.getClassification().getName();
                            
                            if (linksku == "SKUToSizeCode" && id_classification_SKU != chSk_Name) {
                                chSk.delete();
                                
                            }
                        }
                    }
                    if ((catItersk.hasNext() == false) || (linksku == "SKUToSizeCode" && id_classification_SKU != chSk_Name)) {
                        try {
                            log.info("creating link");
                            node.createClassificationProductLink(classification_SKU, ref_SKU);
                            
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
			else {
                //creating new size code classification
                var ID_CC = manager.getProductHome().getProductByID(CC_ID);
                var Style_id = ID_CC.getParent().getID();
                var ID_Style = manager.getProductHome().getProductByID(Style_id);
                var catProd1 = ID_Style.getClassificationProductLinks().asList();
                if (catProd1) {
                    var chIter1 = catProd1.iterator();
                    while (chIter1.hasNext()) {
                        var chprod1 = chIter1.next();
                        var link1 = chprod1.getLinkType().getID();
                        if (link1 == "SizeModelRef") {
                            var Style_attr = chprod1.getClassification();
                            //creating new node beneath size model
                            
                            var new_class = Style_attr.createClassification("SC-"+Style_attr.getID()+"-"+id_classification_SKU, "SizeCode");

                            var id_description_SKU = node.getValue("a_Source_Size_Description").getSimpleValue();

                            if(id_description_SKU != null)
                            {
                                new_class.getValue("a_Source_Size_Description").setSimpleValue(id_description_SKU);
                            }
                            
                            new_class.setName(id_classification_SKU);
                            //1.Updating logic to remove existing size code relationship and add new reference based on ACL update
                            var catSk = node.getClassificationProductLinks().asList();
                            if (catSk) {
                                var catItersk = catSk.iterator();
                                while (catItersk.hasNext()) {
                                    var chSk = catItersk.next();
                                    var linksku = chSk.getLinkType().getID();
                                    var chSk_ID = chSk.getClassification().getID();
                                    if (linksku == "SKUToSizeCode") {
                                        chSk.delete();
                                    }
                                }
                            }

                            try {
                                node.createClassificationProductLink(new_class, ref_SKU);
                            } catch (e) {
                                if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
                                    log.warning("Link between product and classification with already exists.");
                                } else {
                                    throw e;
                                }
                            }
                            //end1.
                            
                            //invoke workflow

                            if (Style_attr.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow")) {
                                //log.info("inside workflow");
                                
                                Style_attr.getWorkflowInstanceByID("SizeModelEnrichmentWorkflow").delete("delete");
                                
                                Style_attr.startWorkflowByID("SizeModelEnrichmentWorkflow", "Size Code Based Initiation");

                            } else {
                                //log.info("workflow does not exist, going to create one");
                                
                                Style_attr.startWorkflowByID("SizeModelEnrichmentWorkflow", "Size Code Based Initiation");
                            }

                            //initiate Parent Style Maintenance workflow
                            var wfInstances = node.getParent().getParent().getWorkflowInstances().toArray();
                            if (wfInstances.length == 0) {
                                // object is not in any workflow so start maintenance
                                if (node.getParent().getParent().getValue("a_Style_Life_Cycle_Status").getSimpleValue() == "Approved") {
                                    //log.info("Initiating Style Maintenance WF");
                                    node.getParent().getParent().startWorkflowByID("wf_StyleMaintenanceWorkflow", "Style Maintenance Invocation based on new Size Code addition");
                                }
                            }
                        }
                    }
                }

            }
        } else {
            throw "a_Size_Code attribute do not have value";
        }
    }
} catch (e) {
    logger.info("SKU Created Size Code Invocation Event Processor Failed for ID : " + node.getID());
}

}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "setACLMarketDesig"
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
    "value" : "StyleValidationACL"
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
    "value" : "br_Calculated_Values_Style"
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
    "value" : "Set_Name_SKU"
  } ],
  "pluginType" : "Operation"
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation5 = function (node) {
if(node.getObjectType().getID()=="SKU"){
	var time1 = new java.util.Date();
	var iso1 = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	//logger.info(iso.format(time));
	node.getValue("a_main_last_modified_date").setSimpleValue(iso1.format(time1));
	log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
}
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBABusinessAction",
  "parameters" : [ {
    "id" : "ReferencedBA",
    "type" : "com.stibo.core.domain.businessrule.BusinessAction",
    "value" : "InitiateWorkflowAction"
  } ],
  "pluginType" : "Operation"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "CheckSizeModelAssociationCondition"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/

/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "br_CheckCatSyncUserUpdate"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Precondition"
}
*/
