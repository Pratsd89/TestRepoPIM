/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_batch_process_update",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Batch Create Update",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "AssetLevel1", "AssetLevel2", "Brand", "CPBrand", "Class", "ColorPalette", "Content", "CustomerChoice", "CustomerServiceBusinessUnit", "CustomerServiceCategory", "CustomerServiceHome", "Department", "Dim1", "Dim2", "Division", "ExternalAssets", "ExternalStoredDAMAsset", "NonProductBusinessUnit", "NonProductCategory", "Prodtoclassificationlink", "ProductShotRequest", "ProductTag", "ProductTagType", "SKU", "SeasonCode", "SeasonYear", "SizeChart", "SizeCode", "SizeFacetCategory", "SizeFacetCode", "SizeFacetValue", "SizeModel", "Style", "SubClass", "WebBU", "WebCategory", "WebDivision", "WebSubCategory" ],
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
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log) {
var seq_No = node.getValue("a_Batch_Record_Sequence_No").getSimpleValue();
var totalCnt = node.getValue("a_Batch_Total_Record_Count").getSimpleValue();
var batchID = node.getValue("a_Batch_Identifier").getSimpleValue();
//post method start
var currentContext = step.getCurrentContext().getID();
currentContext = '"'+currentContext+'"';
var url = new java.net.URL("https://api.gap.com/commerce/stibo/catalogsync/file-status");
var conn = url.openConnection();
conn.setDoOutput(true);
conn.setRequestMethod("POST");
conn.setRequestProperty("Content-Type", "application/xml");
conn.setRequestProperty("x-api-key", "FXAKGPZfYS42ZsVU4M8gre1qSh8KbovX");
//post method ends
if(seq_No != null && totalCnt !=null)
  {
   // Execute create bacth for first record in the XML 	
    if(seq_No == 1)
	{
	var batchRoot = step.getProductHome().getProductByID("BatchRoot");	
	var batch = batchRoot.createProduct(null, "Batch");	
	batch.setName(batchID);
	batch.getValue("a_Batch_Status").setSimpleValue("STARTED");
	batch.getValue("a_Batch_Identifier").setSimpleValue(batchID);
	//sending post method
	var input = new java.lang.String(	"<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
							"<STEP-ProductInformation ContextID="+currentContext+" WorkspaceID=\"Main\" UseContextLocale=\"false\">" +
							"	<Products>" +
							"		<Product>" +
							"			<BatchIdentifier>"+batchID+"</BatchIdentifier>" +
							"			<Status>STARTED</Status>" +
							"		</Product>" +
							"	</Products>" +
							"</STEP-ProductInformation>"); 
	log.info(input);
	var os = conn.getOutputStream();
	os.write(input.getBytes());
	os.flush();
	os.close();
	if (conn.getResponseCode() != java.net.HttpURLConnection.HTTP_CREATED){
		log.info("Failed : HTTP error code : " + conn.getResponseCode());
		}							
	}
	
 // Execute create bacth for last record in the XML 	
	else if(seq_No == totalCnt)
	{
	var batchRoot = step.getProductHome().getProductByID("BatchRoot");	
	var batch = batchRoot.createProduct(null, "Batch");	
	batch.setName(batchID);
	batch.getValue("a_Batch_Status").setSimpleValue("COMPLETED");
	batch.getValue("a_Batch_Identifier").setSimpleValue(batchID);
	var input = new java.lang.String(	"<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
							"<STEP-ProductInformation ContextID="+currentContext+" WorkspaceID=\"Main\" UseContextLocale=\"false\">" +
							"	<Products>" +
							"		<Product>" +
							"			<BatchIdentifier>"+batchID+"</BatchIdentifier>" +
							"			<Status>COMPLETED</Status>" +
							"		</Product>" +
							"	</Products>" +
							"</STEP-ProductInformation>");
	log.info(input);
	var os = conn.getOutputStream();
	os.write(input.getBytes());
	os.flush();
	os.close();
	if (conn.getResponseCode() != java.net.HttpURLConnection.HTTP_CREATED){
		log.info("Failed : HTTP error code : " + conn.getResponseCode());
		}
	}
  }
}