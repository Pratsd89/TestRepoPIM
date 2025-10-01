/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Test_Style_Import",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Size Model Reference Bulk Update(2)",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
exports.operation0 = function (node,step,sizeModelRef,sizeCodeRef,LKT) {
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

        if (skuMarketDesig.contains(mkt)) {
            refsc.addAll(sku.getClassificationProductLinks(sizeCodeRef));
            if (refsc.size() == 1) {
                for (k = 0; k < refsc.size(); k++) {
                    //PPIM-11094
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
exports.precondition0 = function (node,sizeModelRef) {
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