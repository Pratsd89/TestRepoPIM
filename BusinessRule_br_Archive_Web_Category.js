/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Archive_Web_Category",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Archive Web Category",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebDivision", "WebSubCategory" ],
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
exports.operation0 = function (node,step,LKT) {
//get current date
var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");
var zonedTime = java.time.ZonedDateTime.now();

//get archive date
var archiveDate = zonedTime.minusDays(4);

var type = node.getObjectType().getID();

//if category object type is WebCategory || WebSubCategory || WebDivision
if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
	var parent = node.getParent();
	var parentID = parent.getID();
	var parentType = parent.getObjectType().getID();
	var path = node.getValue("a_Category_Path").getSimpleValue();

	//then keep getting parent until type is WebBU
	while (parentType != "WebBU") {
		if (parentType == "WebHierarchyArchiveRoot") {
			break;
		}
		parent = parent.getParent();
		parentType = parent.getObjectType().getID();
	}

	if (parentType == "WebBU") {

		//get a_Brand_Number
		var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();

		//query a_Brand_Number against LKT_Brand_Number_to_Market
		var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNum);

		var checkCat = 0;
		var archiveCat = 0;

		if (markets.contains(";")) {
			//split on ";"
			markets = markets.split(";");

			//for each market
			markets.forEach(function (mkt) {
				step.executeInContext(mkt, function (manager) {
					//fetch context specific selected category from executing manager
					var webCat = manager.getClassificationHome().getClassificationByID(node.getID());
					var startDate = webCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
					var endDate = webCat.getValue("a_WebCategory_End_Date").getSimpleValue();

					if (startDate != null) {
						checkCat++;
					}
					if (endDate < archiveDate && startDate != null) {
						archiveCat++;
					}
					if(startDate == null && endDate == null ){
					archiveCat --;
					}
					//webCat.getValue("a_SEO_Non_Indexable").setSimpleValue("No Index");
				});
			});
		}
		else {

			step.executeInContext(markets, function (manager) {
				var webCat = manager.getClassificationHome().getClassificationByID(node.getID());
				var startDate = webCat.getValue("a_WebCategory_Start_Date").getSimpleValue();
				var endDate = webCat.getValue("a_WebCategory_End_Date").getSimpleValue();

				if (startDate != null) {
					checkCat++;
				}
				if (endDate < archiveDate && startDate != null) {
					archiveCat++;
				} if(startDate == null && endDate == null ){
				archiveCat --;
				}
				//webCat.getValue("a_SEO_Non_Indexable").setSimpleValue("No Index");
			});
		}
	//	log.info("archiveCat     "  + archiveCat  );
		//log.info("checkCat     "  + checkCat  );
		if (checkCat == archiveCat) {

			var archiveBU = LKT.getLookupTableValue("LKT_Web_Category_to_Archive", brandNum);

			node.getValue("a_Old_Category_Parent").setValue(parentID);
			node.getValue("a_Old_Category_Path").setValue(path);
			node.setParent(step.getClassificationHome().getClassificationByID(archiveBU));
			setSeoNonIndexable(node);


		}
	}
}
function getContextSpecificObject(object, context)
{
		var contextSpecificObject = "";
		contextSpecificObject = step.executeInContext(context, function(specificManager) {
				var ObjectinContext =  specificManager.getObjectFromOtherManager(object);
				if (ObjectinContext != "undefined" && ObjectinContext !=  null  ){
				 return ObjectinContext; }
			});		
			return contextSpecificObject ;
}

function setValuesAcrossContexts(nodeObject){
		
		var currentContext=step.getCurrentContext().getID();
		if(currentContext == "EN_US")
		{
		var en_CAObject = getContextSpecificObject(nodeObject,"EN_CA");
		var fr_CAObject = getContextSpecificObject(nodeObject,"FR_CA");
		setValuesForChildern(nodeObject);
		setValuesForChildern(en_CAObject);
		setValuesForChildern(fr_CAObject);
		}
		else if (currentContext == "EN_CA"){
	
		var fr_CAObject = getContextSpecificObject(nodeObject,"FR_CA");
		var en_USObject = getContextSpecificObject(nodeObject,"EN_US");
		setValuesForChildern(nodeObject);
		setValuesForChildern(fr_CAObject);
		setValuesForChildern(en_USObject);
		}
}

function setValuesForChildern (nodeObject)
{
		var objectTypeName = nodeObject.getObjectType().getName();
		if(objectTypeName != "Web BU" ){
		nodeObject.getValue("a_SEO_Non_Indexable").setSimpleValue("No Index");
		nodeObject.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("No Index");
		}
}

	
function setSeoNonIndexable(nodeObject)
{
		var objectTypeName = nodeObject.getObjectType().getName();
		if (objectTypeName == "Web Sub Category"){
			setValuesAcrossContexts(nodeObject);
		}else if (objectTypeName == "Web Category")
		{
			var webCtyChildren  =  nodeObject.getChildren();
			setValuesAcrossContexts(nodeObject);
			if(webCtyChildren != null )
			{
				for(var webCtyChildrenIndex = 0 ; webCtyChildrenIndex<webCtyChildren.size();webCtyChildrenIndex ++)
				{
					var subCtyObject= webCtyChildren.get(webCtyChildrenIndex); 
					setValuesAcrossContexts(subCtyObject);
				}
			}			
		}else if (objectTypeName == "Web Division") {
			var divChildren  =  nodeObject.getChildren();
			setValuesAcrossContexts(nodeObject);
			if(divChildren != null )
			{
				for(var divChildrenIndex = 0 ;divChildrenIndex<divChildren.size();divChildrenIndex ++)
				{
					var ctyObject= divChildren.get(divChildrenIndex); 
					setValuesAcrossContexts(ctyObject);
					var ctyChildren  =  ctyObject.getChildren();
					if(ctyChildren != null)
					{
							
						for(var ctyChildrenIndex = 0 ; ctyChildrenIndex<ctyChildren.size();ctyChildrenIndex ++)
						{
							var subCtyObjectNode= ctyChildren.get(ctyChildrenIndex); 
							setValuesAcrossContexts(subCtyObjectNode);
						}
					
					} 
				}
			}	

		}
}
}