/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PPHInheritedValueChanges",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "PPH Inherited Value Changes",
  "description" : "This is a new business rule that runs on PPH hierarchy node and determines changes by comparing the PPH node in Maintenance workspace vs. Approved workspace, then sets maintenance last update date on all Styles and CCs that use modified value(s) by inheriting them.",
  "scope" : "Global",
  "validObjectTypes" : [ "Class", "Department", "Division", "SubClass" ],
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "styleLinkToWebProductType",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "styleLinkToWebProductType",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,queryHome,styleLinkToWebProductType) {
function checkNodeForUpdates(pphNode, resNode, modified_attrs, changedDataContainerList) {
    // this function checks if the changed attributes in PPH Node are inherited to the node object
    var resNodeUpdated = false;
    var iterator2 = modified_attrs.iterator();
    while (iterator2.hasNext()) {
        var modified_attr = iterator2.next();
        if (!resNodeUpdated) {
            // Check if the PPH node's modified value is same as the node's value and that the value is inherited.
            // do not publish a node if it is the Draft state of the workflow
            if ((pphNode.getValue(modified_attr.getID()).getSimpleValue() == resNode.getValue(modified_attr.getID()).getSimpleValue())
                && resNode.getValue(modified_attr.getID()).isInherited()
                && !resNode.isInState("wf_NewStyleEnrichment", "NewStyleEnrichState1")
                && !resNode.isInState("wf_CCEnrichment", "NewCCEnrichState1")
                && !resNode.isInState("wf_NewSKUEnrichment", "NewSKUEnrich1")
            ) {
                impacted_objects.add(resNode);
                resNodeUpdated = true; // adding this to not check any more attributes for this node since it is marked as impacted

                if (resNode.getObjectType().getID() == 'Style' && modified_attr.getID().contains("WebProductType") == true) {
                    styleLinkToWebProductType.execute(resNode)
                }
                // logger.info("logged for - " + resNode.getID() + ", attr - " + modified_attr.getID());
            }
        }
    }


    //checking ASLR changes on Style and CC
    if (changedDataContainerList.length > 0) {
        if (resNode.getObjectType().getID() == 'Style' || resNode.getObjectType().getID() == 'CustomerChoice') {

            var dataContainerList = resNode.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
            var impactedFound = false;
            for (var k = 0; k < dataContainerList.length; k++) {
                var dataContainerObject = dataContainerList[k].getDataContainerObject();
                var ownerObjectID = dataContainerObject.getOwnerObject().getID();
                if (ownerObjectID == pphNode.getID()) {
                    impactedFound = true;
                    break;
                }
            }
            if (impactedFound == true) {
                if (!resNode.isInState("wf_NewStyleEnrichment", "NewStyleEnrichState1")
                    && !resNode.isInState("wf_CCEnrichment", "NewCCEnrichState1")) {
                    impacted_objects.add(resNode);
                }
            }
        }
    }
}


function comparePPHASLRSettings(pphNode, approvedNode) {
    var changedDataContainerList = [];
    var dataContainerList = pphNode.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
    var approvedDataContainerList = approvedNode.getDataContainerByTypeID('a_ASLR_Data_Container').getDataContainers().toArray();
    if (dataContainerList.length == approvedDataContainerList.length) {
        for (var k = 0; k < dataContainerList.length; k++) {
            var dataContainerExistFlag = false;
            var dataContainerObject = dataContainerList[k].getDataContainerObject();
            var shotType = dataContainerObject.getValue('a_Shot_Type').getSimpleValue();
            var shotCode = dataContainerObject.getValue('a_Shot_Code').getSimpleValue();
            var sitePlacement = dataContainerObject.getValue('a_ASLR_Site_Placement').getSimpleValue();

            for (var l = 0; l < approvedDataContainerList.length; l++) {
                var approvedDataContainerObject = approvedDataContainerList[l].getDataContainerObject();
                var approvedShotType = approvedDataContainerObject.getValue('a_Shot_Type').getSimpleValue();
                var approvedShotCode = approvedDataContainerObject.getValue('a_Shot_Code').getSimpleValue();
                var approvedSitePlacement = approvedDataContainerObject.getValue('a_ASLR_Site_Placement').getSimpleValue();
                if (shotType == approvedShotType && shotCode == approvedShotCode && sitePlacement == approvedSitePlacement) {
                    dataContainerExistFlag = true;
                    break;
                }
            }

            if (dataContainerExistFlag == false) {
                changedDataContainerList.push(dataContainerObject);
            }
        }
    }
    else {
        for (var k = 0; k < dataContainerList.length; k++) {
            var dataContainerObject = dataContainerList[k].getDataContainerObject();
            changedDataContainerList.push(dataContainerObject);
        }
    }
    return changedDataContainerList;
}

var approvedNode = step.executeInWorkspace("Approved", function (approvedManager) {
    var approvedNode = approvedManager.getProductHome().getProductByID(node.getID());
    return approvedNode;
});
/*
var styleCount = 0;
var ccCount = 0;
var skuCount = 0;
*/

if (approvedNode) {
    //logger.info("found approved node");
    var modified_attrs = new java.util.HashSet();
    var impacted_objects = new java.util.HashSet();
    var brandNum = node.getValue("a_Brand_Number").getSimpleValue();

    //checking for product tags changes in PPH as per PPIM - 4778
    var attrs = step.getAttributeGroupHome().getAttributeGroupByID("ag_Product_Tags").getAttributes();
    var iterator = attrs.iterator();
    while (iterator.hasNext()) {
        var attr = iterator.next();
        var validityFlag = false;
        var validObjectTypes = attr.getValidForObjectTypes().toArray();
        for (var j = 0; j < validObjectTypes.length; j++) {
            if (validObjectTypes[j].getID() == node.getObjectType().getID()) {
                validityFlag = true;
                break;
            }
        }
        if (validityFlag == true) {
            if (node.getValue(attr.getID()).getSimpleValue() != approvedNode.getValue(attr.getID()).getSimpleValue()) {
                modified_attrs.add(attr);
            }
        }
    }
    //checking for WPT changes in PPH
    var webProductTypeAttrList = step.getAttributeGroupHome().getAttributeGroupByID("ag_PPH_Inherit_Web_Details").getAttributes();
    var wptali = webProductTypeAttrList.iterator();
    while (wptali.hasNext()) {
        var wptalattr = wptali.next();
        if (wptalattr.getID().contains(brandNum) && node.getValue(wptalattr.getID()).getSimpleValue() != approvedNode.getValue(wptalattr.getID()).getSimpleValue()) {
            var wptValue = node.getValue(wptalattr.getID()).getSimpleValue();

            node.getValue("a_Web_Product_Type").setSimpleValue(wptValue);
            modified_attrs.add(wptalattr);
        }
    }


    //Comparing the ASLR settings of the  styles and CC
    var changedDataContainerList = comparePPHASLRSettings(node, approvedNode);
    if (modified_attrs.size() > 0 || changedDataContainerList.length > 0) {
        var c = com.stibo.query.condition.Conditions;
        var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
            c.hierarchy().simpleBelow(node)
                .and(c.objectType(step.getObjectTypeHome().getObjectTypeByID("Style")))
            //c.valueOf(modified_attr).inherited().eq(node.getValue(modified_attr.getID()).getSimpleValue())
        );
        var res = querySpecification.execute();
        //logger.info("res size = "+res.asList(10000).size());
        res.forEach(function (resNode) {
            // Start with Style and check CC and SKU to if they are impacted.
            checkNodeForUpdates(node, resNode, modified_attrs, changedDataContainerList);

            // loop through and publish Style's children as needed.

            var styleChildren = resNode.getChildren();
            if (styleChildren.size() > 0) {
                var childIter1 = styleChildren.iterator();
                while (childIter1.hasNext()) {
                    var cc = childIter1.next();
                    checkNodeForUpdates(node, cc, modified_attrs, changedDataContainerList);
                    // do the same for CC's children
                    var ccChildren = cc.getChildren();
                    if (ccChildren.size() > 0) {
                        var childIter2 = ccChildren.iterator();
                        while (childIter2.hasNext()) {
                            var sku = childIter2.next();
                            checkNodeForUpdates(node, sku, modified_attrs, changedDataContainerList);
                        }
                    }
                }
            }

            //	impacted_objects.add(resNode);
            return true; // this is needed for the "res.forEach" function
        });

    }

    // if any objects are inheriting changed attributes, publish them to the event processor to update the maintenance last update date
    if (impacted_objects.size() > 0) {
        var iterator3 = impacted_objects.iterator();
        while (iterator3.hasNext()) {
            var impacted_object = iterator3.next();
            var time = new java.util.Date();
            var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            impacted_object.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        }
    }
}

}