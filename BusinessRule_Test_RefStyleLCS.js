/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Test_RefStyleLCS",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test_RefStyleLCS",
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MergedStylesRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MergedStylesRef",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webUI",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,log,manager,MergedStylesRef,webUI) {

var referencedBy = node.getReferences(MergedStylesRef).toArray();
log.info(referencedBy.length);
for (var i = 0; i < referencedBy.length; i++) {

    var referenceTypeID = referencedBy[i].getTarget();
    log.info(referenceTypeID.getID() + "::" + referenceTypeID.getValue("a_Style_Life_Cycle_Status").getSimpleValue());
    var reffStyleStatus = referenceTypeID.getValue("a_Style_Life_Cycle_Status").getSimpleValue();

    if ((reffStyleStatus == "Approved") || (reffStyleStatus == "In Progress")) {

    } else {
        webUI.showAlert("WARNING", "PURGED or DRAFT Styles can not be added to MergedStylesRef.");
    }


}

}