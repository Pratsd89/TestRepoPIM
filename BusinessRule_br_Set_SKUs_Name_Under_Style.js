/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Set_SKUs_Name_Under_Style",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set SKUs Name under Style and publish",
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
    "contract" : "BusinessActionBindContract",
    "alias" : "setSKUName",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "Set_Name_SKU",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,setSKUName,refType) {
//PPIM-11586 Find SKUs under a style and set it's name using other BR 

var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

var styleId = node.getID();
var sizeModelRef = node.getClassificationProductLinks(refType);
if (sizeModelRef.size() == 1){
	node.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
}

var ccList = new java.util.ArrayList();
ccList.addAll(node.getChildren());

for (var i = 0; i < ccList.size(); i++) {
    var CC_ID = ccList.get(i).getID();
    if (CC_ID != null) {
        var SKUCheck = manager.getProductHome().getProductByID(CC_ID);
        if (SKUCheck != null) {
            var skuList = new java.util.ArrayList();
            skuList.addAll(SKUCheck.getChildren());
            for (var j = 0; j < skuList.size(); j++) {
                var SKU_ID = skuList.get(j);
                if (SKU_ID != null) {
                    setSKUName.execute(SKU_ID);
                    if (SKU_ID.getName() != null){
                        SKU_ID.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                    }
                }
            }
        }
    }
}
}