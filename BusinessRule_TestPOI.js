/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TestPOI",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "TestPOI",
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
  }, {
    "contract" : "MailHomeBindContract",
    "alias" : "mailer",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,mailer) {
// This function add/remove attributes in the header
function getAttributeIDs(node)
{
	
	var Attributes = [];           
	var objType = node.getObjectType().getID();
	
	if(objType.equals("CustomerChoice"))                                      // For Product attributes
	{
		Attributes =[
		'Name'
		];                             
					
	}
	else                                                                     // For Sub Product attributes
	{
		Attributes =[
		'a_Shot_Code',
		];                             
	}
					
	return Attributes;
}

var urls = [new java.net.URL("File:///opt/stibo/step/deployed/spot/poi-4.1.0.jar")];
var classloader = new java.net.URLClassLoader(urls, step.getClass().getClassLoader());
var currentDate = new java.util.Date().getTime();
var fileName = "Report_" + currentDate + ".xls";
var excelFile = new java.io.File("/opt/stibo/" + fileName);

var workbook = classloader.loadClass("org.apache.poi.hssf.usermodel.HSSFWorkbook").newInstance();
var objHSSFColor = classloader.loadClass("org.apache.poi.hssf.util.HSSFColor").newInstance();
var excelSheet = workbook.createSheet("Report");

var oMap = objHSSFColor.getMutableIndexHash();
var oEntries = oMap.entrySet();
var itr = oEntries.iterator();
var color = null;

while (itr.hasNext())
{
    var entry = itr.next();
	if(entry.getKey()==46) 				// Get the color code
	{
		color = entry.getValue().getIndex();
		break;
	}
}

var oStyle = workbook.createCellStyle();
var allignCenter = oStyle.ALIGN_CENTER;
//var solidForeground = oStyle.SOLID_FOREGROUND;
var borderMedium = oStyle.BORDER_MEDIUM;
var ofont = workbook.createFont();
oStyle.setFont(ofont);
//oStyle.setAlignment(allignCenter);
//oStyle.setBorderBottom(borderMedium);
//oStyle.setBorderTop(borderMedium);
//oStyle.setBorderRight(borderMedium);
//oStyle.setBorderLeft(borderMedium);
oStyle.setWrapText(true);

var headerStyle = workbook.createCellStyle();
var allignCenter = headerStyle.ALIGN_CENTER;
//var solidForeground = headerStyle.SOLID_FOREGROUND;
var borderMedium = headerStyle.BORDER_MEDIUM;
var headerFont = workbook.createFont();
var boldWt = headerFont.BOLDWEIGHT_BOLD;
//headerFont.setBoldweight(boldWt);
headerFont.setFontHeightInPoints(10);
headerStyle.setFont(headerFont);
/*headerStyle.setAlignment(allignCenter);
headerStyle.setBorderBottom(borderMedium);
headerStyle.setBorderTop(borderMedium);
headerStyle.setBorderRight(borderMedium);
headerStyle.setBorderLeft(borderMedium);*/

var sFineDots = headerStyle.FINE_DOTS;
/*headerStyle.setFillPattern(sFineDots);
headerStyle.setFillForegroundColor(color);
headerStyle.setFillBackgroundColor(color);
headerStyle.setWrapText(true);*/

var arrayAttributes = getAttributeIDs(node);
var attributeHome = step.getAttributeHome();
var rowCount = 0;
var row = null;
for(var arrIndex=0;arrIndex<arrayAttributes.length;arrIndex++) 				// Creating the header
{
	var cellCount = 0;
	row = excelSheet.createRow(arrIndex);
	var attrName = "";
	var attrValue = "";
	
	if(arrayAttributes[arrIndex].equals("Name"))
	{
		attrName = node.getObjectType().getID() + " Name";
		attrValue = node.getName();
	}
	else
	{
		attrName = attributeHome.getAttributeByID(arrayAttributes[arrIndex]).getName();
		attrValue = node.getValue(arrayAttributes[arrIndex]).getSimpleValue();
	}
	
	log.info(attrName +" :::: "+attrValue);
	row.createCell(cellCount).setCellValue(attrName);
	row.getCell(cellCount).setCellStyle(headerStyle);
	cellCount++;
	if(attrValue!=null)row.createCell(cellCount).setCellValue(attrValue.toString());
	else row.createCell(cellCount).setCellValue(" ");

	row.getCell(cellCount).setCellStyle(oStyle);

	rowCount = arrIndex;
}
var blankRow = rowCount+5;
//Skip rows
log.info("rowCount : "+rowCount);
for(var rCt=rowCount+1;rCt<(blankRow);rCt++)
{
	row = excelSheet.createRow(rowCount+5);
	rowCount = rCt
}
log.info("rowCount : "+rowCount);
var isHeaderCreated = false;

var tRef = step.getReferenceTypeHome().getReferenceTypeByID("StyleColorToPhotoShot");

if (tRef) 
{
	var tError = null;
	var tReferences = node.getReferences(tRef);
	if (!tReferences.isEmpty())
	{
		for (var i = 0; i < tReferences.size(); i++)
		{
			var tLink = tReferences.get(i);
			var targetObject = tLink.getTarget();
			log.info("Target :: "+targetObject.getID());
			var arrAttributes = null;
			if(!isHeaderCreated)
			{
				arrAttributes = getAttributeIDs(targetObject);
				log.info(rowCount);
				row = excelSheet.createRow(rowCount);
				for(var j=0;j<arrAttributes.length;j++)
				{
					var attrName = "";
					attrName = attributeHome.getAttributeByID(arrAttributes[j]).getName();                                                                                                
					row.createCell(j).setCellValue(attrName);
					row.getCell(j).setCellStyle(headerStyle);
				}
				isHeaderCreated = true;
				arrAttributes = null;
				rowCount++;
			}
			arrAttributes = getAttributeIDs(targetObject);
			log.info(rowCount);
			row = excelSheet.createRow(rowCount);
			for(var k=0;k<arrAttributes.length;k++)     		// setting the values
			{
				var attrValue = "";
				log.info("_----------_ " + arrAttributes[k]);
				attrValue = targetObject.getValue(arrAttributes[k]).getSimpleValue();
				log.info("VALUE -----> " + attrValue);
				if(attrValue!=null)row.createCell(k).setCellValue(attrValue.toString());
				else row.createCell(k).setCellValue(" ");		// To avoid the null setting in the excel
				
				row.getCell(k).setCellStyle(oStyle);
			}
			rowCount++;
			log.info(rowCount);                                        
		}
	}              
}
excelSheet.setDefaultColumnWidth(30);
excelSheet.setDisplayGridlines(false);
var outputStream = new java.io.FileOutputStream(excelFile);
workbook.write(outputStream);
outputStream.close();

//var userMail = step.getCurrentUser().getEMail();
//mailer.send("Abhijeet.Mohanty@cognizant.com","Abhijeet.Mohanty@cognizant.com","Report","Report attached in the mail", excelFile);

log.info("Report Created Successfully");
}