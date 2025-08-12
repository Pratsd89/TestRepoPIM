/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_ApprovesSizeFacetValue",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_Approves Size Facet Value",
  "description" : "BR to approve Size Facet Value",
  "scope" : "Global",
  "validObjectTypes" : [ "SizeFacetValue" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
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
exports.operation0 = function (log,node,portal,stepManager) {
log.info("BR br_ApprovesSizeFacetValue");
if (stepManager.getCurrentWorkspace().getID() == "Main") {
    var i;
    if (node.getApprovalStatus() == "Completely Approved") {
        portal.showAlert("Error", null, "Size Facet Value is already approved!");
    } else {
        /* PPIM - 11783 > Remove SKU publish logic
        var referencedBy = node.getReferencedByClassifications().toArray();
        var uniqueIDList = new java.util.HashSet();
        var time = new java.util.Date();
        var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        for (i = 0; i < referencedBy.length; i++) {
            var x = referencedBy[i].getSource().getObjectType().getID();
            var y = referencedBy[i].getSource();

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
                        // PPIM-3306 - publish as background job for performance reasons
                        if (uniqueIDList.contains(obj.getID()) == false) {
                            log.info("OBJ Publish ID: " + obj.getID());
                            //PPIM-11094- SKUs are not publishing when user updates the size model and save the style in stibo
                            obj.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        } else {
                            uniqueIDList.add(obj.getID());
                        }

                        //obj.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        //log.info(obj.getValue("a_main_last_modified_date").getSimpleValue());
                        log.info("sku published");
                    }
                }

            }
        }/*
        node.approve();
        uniqueIDList = null;
        portal.showAlert("Success", null, "Size Facet Value approved!");
    }

}
}