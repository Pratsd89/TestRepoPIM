/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_AssetNavigate",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_AssetNavigate",
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
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,web) {
var selectedIter = web.getSelection().iterator();
while (selectedIter.hasNext()) {
    var result = true;
    var currSelected = selectedIter.next();
    var StyleID = currSelected.getID();
    var StyleName = currSelected.getName();
    var StyleNumber = currSelected.getValue("a_Style_Number").getSimpleValue();

    var header = "StyleID, StyleName, StyleNumber \n"
    var msg = StyleID + "," + StyleName + "," + StyleNumber+"\n";
    ReportGeneration(manager, msg, header, "TestingFile_04_07_2025");
}
var asset = manager.getAssetHome().getAssetByID("TestingAsset");
log.info(asset);
web.navigate("AssetPreviewScreen", asset);

function ReportGeneration(manager, msg, header, filename) {
    if (msg) {
        var Path = "/opt/stibo/"+filename+".csv";
        var file = new java.io.File(Path);
        var isFileExists = file.exists();
        var writer = null
        if (isFileExists != false) {
            writer = new java.io.FileWriter(Path, true);
        } else {
            writer = new java.io.FileWriter(file);
            writer.append(header);
        }
        writer.append(msg);
        writer.close();

        var fileInputStream = new java.io.FileInputStream(Path);
        var asset = manager.getAssetHome().getAssetByID("TestingAsset");
        asset.upload(fileInputStream, "TestingAsset");
    }
}
}