/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_DeleteProductGroups",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Delete Product Groups",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "smgRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "mvgRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (stepManager,smgRef,mvgRef) {
var PGroot = stepManager.getProductHome().getProductByID("ProductGroupingRoot");
var currentContext = stepManager.getCurrentContext().getID();
var otherContext;
if (currentContext == "EN_US") {
    otherContext = "EN_CA";
}
else if (currentContext == "EN_CA") {
    otherContext = "EN_US";
}

var count = 0;
var groupsRoot = PGroot.getChildren().iterator();
while (groupsRoot.hasNext()) {
    groupRoot = groupsRoot.next();

    var brandFolders = groupRoot.getChildren().iterator();
    while (brandFolders.hasNext()) {
        var brandFolder = brandFolders.next();

        var brand = brandFolder.getValue("a_Brand_Number").getSimpleValue();
        //log.info("checking brand: " + brand);

        var divisionFolders = brandFolder.getChildren().iterator();
        while (divisionFolders.hasNext()) {
            var divFolder = divisionFolders.next();

            var groups = divFolder.getChildren().iterator();
            while (groups.hasNext()) {
                var group = groups.next();
                var ref;

                if (group.getObjectType().getID() == "Product_Group") {
                    ref = smgRef;
                }
                else if (group.getObjectType().getID() == "MultiVariantGroup") {
                    ref = mvgRef;
                }
                else continue;

                var groupID = group.getID();
                var styleListCurCxt = group.queryReferences(ref).asList(50);
                var styleListOthCxt;
                var today = new Date().toISOString().substring(0, 10);

                var group_end_date = group.getValue("a_Product_Grouping_End_Date").getSimpleValue();
                stepManager.executeInContext(otherContext, function (otherContextManager) {
                    context_grp = otherContextManager.getProductHome().getProductByID(groupID);
                    context_grp_end_date = context_grp.getValue("a_Product_Grouping_End_Date").getSimpleValue();
                    styleListOthCxt = context_grp.queryReferences(ref).asList(50);
                });
                //log.info(styleListCurCxt.size() + "," + styleListOthCxt.size()+","+group_end_date < today)
                if (styleListCurCxt.size() == 0 && styleListOthCxt.size() == 0 && group_end_date < today && context_grp_end_date < today) {
                    if (group.getWorkflowInstanceByID("wf_MVG_Status") != null) {
                        group.getWorkflowInstanceByID("wf_MVG_Status").delete("")
                    }
                    //log.info("deleting group: " + group);
                    group.delete();
                    log.info(groupID)
                    count++;
                }

            }
        }
    }
}


log.info("Deleted " + count + " Product Groups.");

//var group = stepManager.getProductHome().getProductByID("AT-MVG-261");
//                	if(group.getWorkflowInstanceByID("wf_MVG_Status")!=null){
//                		group.getWorkflowInstanceByID("wf_MVG_Status").delete("")
//                	
//                		log.info("here");
//                	}
//                	log.info("deleting group: " + group);
//                	group.delete();

}