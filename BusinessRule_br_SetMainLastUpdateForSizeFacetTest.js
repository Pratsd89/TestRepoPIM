/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_SetMainLastUpdateForSizeFacetTest",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_SetMainLastUpdateForSizeFacetTest",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeFacetCategory" ],
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
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "SKUDGL_OutboundUSDEvent",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_SKU_US",
    "description" : null
  }, {
    "contract" : "DerivedEventTypeBinding",
    "alias" : "SKUDGL_OutboundCADEvent",
    "parameterClass" : "com.stibo.core.domain.impl.eventqueue.DerivedEventTypeImpl",
    "value" : "trigger_SKU_CA",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "SKUDGL_OutboundUS",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishSKUToDGL_Main_EN_US",
    "description" : null
  }, {
    "contract" : "EventQueueBinding",
    "alias" : "SKUDGL_OutboundCA",
    "parameterClass" : "com.stibo.core.domain.impl.integrationendpoint.FrontOutboundIntegrationEndpointImpl",
    "value" : "step://OutBoundIntegrationEndpoint?id=PublishSKUToDGL_Main_EN_CA",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,stepManager,portal,SKUDGL_OutboundUSDEvent,SKUDGL_OutboundCADEvent,SKUDGL_OutboundUS,SKUDGL_OutboundCA) {
log.info("BR br_SetMainLastUpdateForSizeFacetCategory");
if (stepManager.getCurrentWorkspace().getID() == "Main") {
    var time = new java.util.Date();
    var uniqueIDList = new java.util.HashSet();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    log.info(node.getValue("a_main_last_modified_date").getSimpleValue());
    var referencecat = node.getChildren().toArray();
    for (var j = 0; j < referencecat.length; j++) {
        var referencedBy = referencecat[j].getReferencedByClassifications().toArray();
        for (var i = 0; i < referencedBy.length; i++) {
            var x = referencedBy[i].getSource().getObjectType().getID();
            var y = referencedBy[i].getSource();
            log.info(x);
            if (x == "Dim1" || x == "Dim2") {
                //var scode= y.getValue("a_SizeCode_Parent_of_Dim1").getSimpleValue();
                var scode = y.getParent();
                log.info("scode : " + scode);
                var classSKU = scode.getClassificationProductLinks();
                if (classSKU) {
                    log.info(classSKU);
                    var chIter11 = classSKU.iterator();
                    while (chIter11.hasNext()) {
                        var chprod11 = chIter11.next();
                        //log.info(chprod11.getObjectType().getID());
                        var obj = chprod11.getProduct();
                        log.info(obj);
                        var time = new java.util.Date();
                        var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						if(uniqueIDList.contains(obj.getID()) == false)
						{
							// PPIM-3306 - publish as background job for performance reasons
							log.info("SKU Publish ID: " + obj.getID());
							//updateEVP.republish(obj);
							//SKUDGL_OutboundUS.republish(obj);
							SKUDGL_OutboundUS.queueDerivedEvent(SKUDGL_OutboundUSDEvent, obj);
							//SKUDGL_OutboundCA.republish(obj);
							SKUDGL_OutboundCA.queueDerivedEvent(SKUDGL_OutboundCADEvent, obj);
							//obj.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
							//log.info(obj.getID() + "   " + obj.getValue("a_main_last_modified_date").getSimpleValue());
							log.info("sku published");
							uniqueIDList.add(obj.getID());
						}
                    }
                }
            }
        }
    }

    //PPIM-3306 remove approval button from Size Facet Category. Adding approval on Save
    node.approve();
    uniqueIDList=null;
} else if (stepManager.getCurrentWorkspace().getID() == "Approved") {
    portal.showAlert("Warning",  "Modifications not allowed in Approved workspace. Please switch to Main workspace.");
}

}