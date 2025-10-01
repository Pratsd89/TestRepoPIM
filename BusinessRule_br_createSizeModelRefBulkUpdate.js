/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_createSizeModelRefBulkUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Size Model Reference Bulk Update",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeCodeRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SKUToSizeCode",
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,sizeModelRef,sizeCodeRef,LKT,helper) {
var newSizeModel = node.getClassificationProductLinks(sizeModelRef).toArray()[0];
var newSizeModelNode = newSizeModel.getClassification();
var newSizeModelNodeID = newSizeModelNode.getID();

var i = null;
var j = null;
var k = null;

var currentCtx = step.getCurrentContext().getID();
var mkt = LKT.getLookupTableValue("LKT_Context_to_Market", currentCtx);
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var refc = new java.util.ArrayList();
refc.addAll(node.getChildren());
for (i = 0; i < refc.size(); i++) {
    //var cc = refc.get(i).getID();
    var cc = refc.get(i);
    var refsk = new java.util.ArrayList();
    refsk.addAll(cc.getChildren());
    var flag = 0;
    for (j = 0; j < refsk.size(); j++) {
        //var sku = refsk.get(j).getID();
        var sku = refsk.get(j);
        var refsc = new java.util.ArrayList();
        var skuMarketDesig = sku.getValue("a_Market_Designation").getSimpleValue();
        var skuEndDate = sku.getValue('a_SKU_End_Date').getSimpleValue();
        var skuLcs = sku.getValue('a_SKU_Life_Cycle_Status').getSimpleValue();

        var isMarketMatch = skuMarketDesig.contains(mkt);
        var isActive = (skuEndDate == null || skuEndDate >= time);

        //PPIM-14056
        if (isMarketMatch) {
            refsc.addAll(sku.getClassificationProductLinks(sizeCodeRef));
            if (refsc.size() == 1) {
                for (k = 0; k < refsc.size(); k++) {
                    //PPIM-12205
                    var sizeCode = refsc.get(k).getClassification();
                    var parentSizeModelID = sizeCode.getParent().getID();
                    if (parentSizeModelID == newSizeModelNodeID) {
                        flag = 1;
                        break;
                    }
                    else {
                        var sizeCodeName = refsc.get(k).getClassification().getName();
                        //check new size model for proper size code and do linking/unlinking
                        var refsmc = new java.util.ArrayList();
                        refsmc.addAll(newSizeModelNode.getChildren());
                        for (var m = 0; m < refsmc.size(); m++) {
                            var newScode = refsmc.get(m);
                            var newSCName = refsmc.get(m).getName();
                            if (newSCName == sizeCodeName) {
                                refsc.get(k).delete();
                                sku.createClassificationProductLink(newScode, sizeCodeRef);
                                //PPIM-11094- SKUs are not publishing when user updates the size model and save the style in stibo
                                sku.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                            }
                        }
                    }
                }
            } else {
                var sizeCode = sku.getValue("a_Size_Code").getSimpleValue();
                if (sizeCode != null) {
                    var refsmclasc = newSizeModelNode.getChildren();
                    for (var n = 0; n < refsmclasc.size(); n++) {
                        var newScode = refsmclasc.get(n);
                        var newSCName = refsmclasc.get(n).getName();
                        if (newSCName.equals(sizeCode)) {
                            sku.createClassificationProductLink(newScode, sizeCodeRef);
                            helper.setSKUNameFromSizeCode(sku, step);
                            sku.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        }
                    }
                }
            }

            if (!isActive || skuLcs == "Purged") {
                //PPIM-12846
                var refSizeCode = new java.util.ArrayList();
                refSizeCode.addAll(sku.getClassificationProductLinks(sizeCodeRef));
                if (refSizeCode.size() == 1) {
                    if (refSizeCode.get(0).getClassification().getParent().getID() != newSizeModelNode.getID()) {
                        refSizeCode.get(0).delete();
                        sku.setName(null);
                    }
                }
            }
        }

        if (flag == 1) {
            break;
        }
    }
}

/*var refs = new java.util.ArrayList();
refs.addAll(node.getClassificationProductLinks(sizeModelRef));
if (refs.size() == 1) {
    for (i = 0; i < refs.size(); i++) {
        refs.get(i).delete();
        node.createClassificationProductLink(newSizeModelNode, sizeModelRef);
        //PPIM-11094- SKUs are not publishing when user updates the size model and save the style in stibo
        node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }
}*/
}
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
  "binds" : [ {
    "contract" : "CurrentObjectBindContract",
    "alias" : "node",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "sizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Precondition"
}
*/
exports.precondition0 = function (node,sizeModelRef,helper) {
var newSizeModel = node.getClassificationProductLinks(sizeModelRef).toArray()[0];
var newSizeModelNode = newSizeModel.getClassification().getID();
var allRevs = node.getRevisions();

if (allRevs.size() <= 1) {
	return true;
}

var prevRevNode = allRevs.get(1).getNode();
var prevSizeModel = prevRevNode.getClassificationProductLinks(sizeModelRef).toArray()[0];
var prevSizeModelNode = null;

if (prevSizeModel == true) {
	prevSizeModelNode = prevSizeModel.getClassification().getID();
}

//log.info("newSizeModelNode is " + newSizeModelNode + "prevSizeModelNode is " + prevSizeModelNode);
if (newSizeModelNode != prevSizeModelNode) {
	return true;
}
else {
	return false;
}
}