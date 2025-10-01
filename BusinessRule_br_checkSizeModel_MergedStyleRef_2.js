/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_checkSizeModel_MergedStyleRef_2",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_checkSizeModel_MergedStyleRef_2",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "LIB_AT",
    "libraryAlias" : "LIB_AT"
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
    "alias" : "SizeModelRef",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "SizeModelRef",
    "description" : null
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,SizeModelRef,mail,LIB_AT) {
// File path setup
var filePath = "/opt/stibo/SEO-PIM-Report_SizeModelGroups.csv";
var file = new java.io.File(filePath);
if (!file.exists()) {
	file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);
fw.write("GroupStyles,GroupSizeModels,SameSizeModel\n");

// Reference types
var mergedStylesRef = step.getReferenceTypeHome().getReferenceTypeByID("MergedStylesRef");
var sizeModel = step.getClassificationHome().getClassificationByID("SizeModel"); // Adjust ID if needed

// To track already visited styles
var visited = new java.util.HashSet();

// DFS-style function to collect connected styles
function getConnectedStyles(styleNode, groupSet) {
	if (visited.contains(styleNode.getID())) return;

	visited.add(styleNode.getID());
	groupSet.add(styleNode);

	var references = styleNode.queryReferences(mergedStylesRef);
	references.forEach(function (ref) {
		var target = ref.getTarget();
		if (target && !visited.contains(target.getID())) {
			getConnectedStyles(target, groupSet);
		}
		return true;
	});
}

// Fetch all relevant styles to check – adjust this based on scope!
var allStyles = LIB_AT.getNodeList();// You can filter this if needed

// Main logic
allStyles.forEach(function (styleNode) {
	styleNode = step.getProductHome().getProductByID(styleNode);
	if (visited.contains(styleNode)) return;
	var groupSet = new java.util.HashSet();
	getConnectedStyles(styleNode, groupSet);

	var styleList = new java.util.ArrayList();
	var sizeModelList = new java.util.ArrayList();
	var sizeModelIDSet = new java.util.HashSet();

	groupSet.forEach(function (groupNode) {
		var links = groupNode.getClassificationProductLinks(SizeModelRef);
		if (links != null && links.size() > 0) {
			var sizeModelID = links.get(0).getClassification().getID();
			sizeModelList.add(sizeModelID);
			sizeModelIDSet.add(sizeModelID);
		} else {
			sizeModelList.add("N/A");
			sizeModelIDSet.add("N/A");
		}
		styleList.add(groupNode.getID());
		return true;
	});

	var sameSizeModel = (sizeModelIDSet.size() === 1);
	fw.write(styleList.toArray().join("|") + "," + sizeModelList.toArray().join("|") + "," + sameSizeModel + "\n");

	return true;
});

fw.flush();
fw.close();

// Upload file to asset
var fileInputStream = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("SizeModelCheckMergedStylesRef"); // Ensure asset exists
var uploaded = asset.upload(fileInputStream, filePath);

// Email logic
var mailMethod = mail.mail();
mailMethod.addTo("jagadish_beejapu@gap.com; sri_indu_dekkapati@gap.com;");
mailMethod.subject("Size Model Group Check");
mailMethod.plainMessage("Attached is the size model consistency report for merged style groups.");

// Attach CSV
var attachment = mailMethod.attachment();
attachment.fromAsset(asset);
attachment.name("SizeModelCheckMergedStylesRef.csv");
attachment.attach();

// Send
var mailSentStatus = mailMethod.send();

}