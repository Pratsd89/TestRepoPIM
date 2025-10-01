/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Br_Source_Size_Ref",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Br Source Size Ref",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "ref",
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
exports.operation0 = function (node,manager,log,ref,ref_SKU) {
/*var refs = node.getClassificationProductLinks(ref); // get STYLE reference
log.info(refs);
if(refs!=null)
{
	log.info("delete done");
	refs.delete;
}*/



var nodeID=node.getID();
var id_classification_STYLE = node.getValue("a_Source_Size_Model").getSimpleValue();
log.info(id_classification_STYLE);





///relate Style to Classification

if(id_classification_STYLE != null )
{

	var classification_STYLE = manager.getClassificationHome().getClassificationByID(id_classification_STYLE);
	var linkType = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SizeModelRef");
	if(classification_STYLE != null)
	{
              // classification_STYLE.createClassificationProductLink(node,linkType);
              //log.info("linked_STYLE"); ///style linking done
              
              		var refs = new java.util.ArrayList();
				refs.addAll(node.getChildren());

					for(var i=0;i<refs.size();i++)
						{
						var CC_ID = refs.get(i).getID();
						log.info("CC"+CC_ID);
						if(CC_ID !=null)
						{
							var refs1 = new java.util.ArrayList();
							var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
							log.info("test: "+SKUCheck);
							refs1.addAll(SKUCheck.getChildren());
								for(var j=0;j<refs1.size();j++)
									{
									var SKU_ID = refs1.get(j).getID();
									log.info("SKU"+SKU_ID);


										


									

									/// relate to SKU and classification

	
									var id_classification_SKU = manager.getProductHome().getProductByID(SKU_ID).getValue("a_Size_Code").getSimpleValue();
									log.info(id_classification_SKU)

										if(id_classification_SKU != null )
										{

										var classification_SKU = manager.getClassificationHome().getClassificationByID(id_classification_SKU);
										var linkType1 = manager.getLinkTypeHome().getClassificationProductLinkTypeByID("SKUToSizeCode");
										log.info(classification_SKU)
											if(classification_SKU != null)
												{
													var refs = node.getClassificationProductLinks(ref); // get STYLE reference
														log.info(refs);
															if(refs!=null)
															{
																log.info("delete done");
																refs.delete;
															}
											 classification_STYLE.createClassificationProductLink(node,linkType);
											 log.info("linked_STYLE");  //style linked
											 var refs_SKU = node.getClassificationProductLinks(ref_SKU); /// sku reference delete
										log.info(refs_SKU);
										if(refs_SKU!=null)
											{
											log.info("delete done for sku");
											refs.delete;
											}
              								 classification_SKU.createClassificationProductLink((manager.getProductHome().getProductByID(SKU_ID)),linkType1);
              								 log.info("linked_SKU")  //sku linked
													}
											else
											{
												throw "Classification for SKU donot exist";
											}
										}
										else
										{
											throw "a_Size_Code attribute do not have value";
										}
									}
						}
								}
						}
	else
	{
		throw "The classification is not present in STIBO"
		// initiate the size model workflow
	}
}

else
{
	throw "a_Source_Size_Model attribute donot have data"
}




}