/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateMultiVariantGroup",
  "type" : "BusinessAction",
  "setupGroups" : [ "Super PDP Consolidation" ],
  "name" : "br_CreateMultiVariantGroupfromSearchStyle",
  "description" : "Create Product Group button in Search Style screen &  Create Product Groups from a list of selected Styles.",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ProductGroupLibrary",
    "libraryAlias" : "pgLibrary"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
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
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (manager,webui,node,logger,pgLibrary) {
var selection = webui.getSelection();
var selectionCount = selection.size();
if (selectionCount >= 1) {
    var AllMVGDivMatching = true;
    var PrimaryStyle = selection.get(0);
    log.info("PrimaryStyle=" + PrimaryStyle);
    var PrimaryBrand = PrimaryStyle.getValue("a_Brand_Number").getSimpleValue();
    var PrimaryDivNumber = PrimaryStyle.getValue("a_Division_Number").getSimpleValue();
    var PrimaryMVGDivision = PrimaryBrand + "_" + PrimaryDivNumber;
    log.info("PrimaryMVGDivision=" + PrimaryMVGDivision);
    for (var i = 0; i < selectionCount; i++) {
        var SecondaryStyle = selection.get(i);
        log.info("SecondaryStyle=" + SecondaryStyle);
        var SecondaryBrand = SecondaryStyle.getValue("a_Brand_Number").getSimpleValue();
        var SecondaryDivNumber = SecondaryStyle.getValue("a_Division_Number").getSimpleValue();
        var SecondaryMVGDivision = SecondaryBrand + "_" + SecondaryDivNumber;
        log.info("SecondaryMVGDivision=" + SecondaryMVGDivision);
        if (PrimaryMVGDivision != SecondaryMVGDivision) {
            AllMVGDivMatching = false;
        }
    }
    log.info("AllMVGDivMatching=" + AllMVGDivMatching);
    if (AllMVGDivMatching == true) {
        var MultiVariantGroupingTypeID = PrimaryMVGDivision + "_MultiVariantGroups";

        var MultiVariantGroupingTypeObj = manager.getProductHome().getProductByID(MultiVariantGroupingTypeID);
        if (MultiVariantGroupingTypeObj) {
            var newMVGroupID = PrimaryBrand + '_MVG_' + generateSequenceNumber();
            var newMVGroup = MultiVariantGroupingTypeObj.createProduct(newMVGroupID, "MultiVariantGroup");
            newMVGroup.setName(PrimaryStyle.getName());
            for (var j = 0; j < selectionCount; j++) {
                var selStyle = selection.get(j);
                ref = newMVGroup.createReference(selStyle, "MultiVariant_Group_Reference");
            }
            webui.navigate("MultiVariantGroupScreen", newMVGroup);
        }
    } else {
        webui.showAlert("ERROR", "All selected Styles must be under same parent Class.");
    }
} else {
    webui.showAlert("ERROR", "Please select at least two styles.");
}

function generateSequenceNumber() {
    const timestamp = new Date().getTime();
    const sequenceNumber = timestamp.toString().slice(-7);
    return sequenceNumber;
}
}