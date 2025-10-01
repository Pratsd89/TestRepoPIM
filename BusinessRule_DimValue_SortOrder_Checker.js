/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "DimValue_SortOrder_Checker",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "DimValue SortOrder Checker",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeModel" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var sizeCodes = node.getChildren();
var dim1ValueMap =  new java.util.HashMap();
var dim2ValueMap =  new java.util.HashMap(); 
var advancedDim1ValueMap =  new java.util.HashMap();
var advancedDim2ValueMap =  new java.util.HashMap();
var dim1ValueSortOrderList =   new java.util.ArrayList();    
var dim2ValueSortOrderList = new java.util.ArrayList();      
var advancedDim1SortOrderList =   new java.util.ArrayList();;     
var advancedDim2SortOrderList =   new java.util.ArrayList();
var advancedDim1ValSortOrderMap =  new java.util.HashMap();
var advancedDim2ValSortOrderMap =  new java.util.HashMap();
var dim1ValSortOrderMap =  new java.util.HashMap();
var dim2ValSortOrderMap =  new java.util.HashMap();
var sizeCodes = node.getChildren().toArray().sort();  
if(sizeCodes){
	sizeCodes.forEach(function(sizecode)
	{
       var sizeDims = sizecode.getChildren();
	   if(sizeDims){
        var childIter1 = sizeDims.iterator();
        while(childIter1.hasNext()){
        var child1 = childIter1.next();
        var ObjNm = child1.getObjectType().getID();           	          
        if (ObjNm == "Dim1"){
            var sDim1Value = child1.getValue("a_Dimension_value").getSimpleValue();
            var sDim1ID = child1.getValue("a_Dimension_value").getID();
            var dim1ValSortOrder = sDim1ID.substring(sDim1ID.indexOf("-") + 1);
            var dim1ValID = sDim1ID.substring(0, sDim1ID.indexOf("-"));
            dim1ValueMap.put(dim1ValID,sDim1Value);
            dim1ValueSortOrderList.add(dim1ValSortOrder);
            dim1ValSortOrderMap.put(dim1ValID,dim1ValSortOrder);
            var advsDim1Value = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
            var advsDim1ID = child1.getValue("a_Advanced_Dimension_Value").getID();
            if (advsDim1Value != null){
            	advancedDim1ValueMap.put(advsDim1ID,advsDim1Value);
            }
            var templateClassification=manager.getClassificationHome().getClassificationByID("SDV-"+advsDim1ID);
            if (templateClassification != null){
            var sortOrder=templateClassification.getValue("a_Dimension_Value_Sort_Order").getSimpleValue();
            advancedDim1SortOrderList.add(sortOrder);
            advancedDim1ValSortOrderMap.put("SDV-"+advsDim1ID,sortOrder);
            }            		
          }          	
            if (ObjNm == "Dim2"){
            	var sDim2Value = child1.getValue("a_Dimension_value").getSimpleValue();
            	var sDim2ID = child1.getValue("a_Dimension_value").getID();
            	var dim2ValSortOrder = sDim2ID.substring(sDim2ID.indexOf("-") + 1);
            	var dim2ValID = sDim2ID.substring(0, sDim2ID.indexOf("-"));
            	dim2ValueMap.put(dim2ValID,sDim2Value);
            	dim2ValueSortOrderList.add(dim2ValSortOrder);
            	dim2ValSortOrderMap.put(dim2ValID,dim2ValSortOrder);
            	var advsDim2Value = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
            	var advsDim2ID = child1.getValue("a_Advanced_Dimension_Value").getID();
            	advancedDim2ValueMap.put(advsDim2ID,advsDim2Value);
            	var templateClassification=manager.getClassificationHome().getClassificationByID("SDV-"+advsDim2ID);
            	if (templateClassification != null){
            	var sortOrder=templateClassification.getValue("a_Dimension_Value_Sort_Order").getSimpleValue();
            	advancedDim2SortOrderList.add(sortOrder);
            	advancedDim2ValSortOrderMap.put("SDV-"+advsDim2ID,sortOrder);
            	}
            }
		}
	  }
   })
		var isAscending = true;
		 for(i=0;i<advancedDim1SortOrderList.size()-1;i++){
			var val1 = parseInt(advancedDim1SortOrderList.get(i));
			var val2 = parseInt(advancedDim1SortOrderList.get(i+1));
 			if(val1 >= val2){
                isAscending=false;
                break;
           	}
            else {
           		isAscending =true;
            }
		}
		for(i=0;i<advancedDim2SortOrderList.size()-1;i++){
			var val1 = parseInt(advancedDim2SortOrderList.get(i));
			var val2 = parseInt(advancedDim2SortOrderList.get(i+1));
			if(val1 >= val2){
				isAscending=false;
				break;
			}
			else{
				isAscending =true;
			}
		}
		if (isAscending == true){
  			log.info("Dim1/Dim2 Sort order is Ascending");
		}
		else{
			log.info("Dim1/Dim2 Sort order is not Ascending for SM-"+node.getName());
       		//log.info("Dim1/Dim2 Sort order is not Ascending  for SM "+node.getName()+advancedDim1ValSortOrderMap+"Dim2 Advanced"+advancedDim2ValSortOrderMap);
		}
		if (dim1ValueSortOrderList.equals(advancedDim1SortOrderList) == true) {
            log.info(" Matching Dim1 Sortorder "); 
        }
		else{
			log.info("Not matching Dim1 Sortorder  for SM-"+node.getName());
			//log.info("Not matching Dim1 Sortorder Dim1 Current- for SM "+node.getName() +dim1ValSortOrderMap+" Dim1 Advanced"+advancedDim1ValSortOrderMap);
		}
		if (dim2ValueSortOrderList.equals(advancedDim2SortOrderList) == true) {
            log.info(" Matching Dim2 Sortorder");
        }
		else{
			log.info(" Not matching Dim2 Sortorder for SM-"+node.getName());
			//log.info(" Not matching Dim2 Sortorder,Dim2 Current for SM "+node.getName() +dim2ValSortOrderMap+" Dim2 Advanced"+advancedDim2ValSortOrderMap);
		}
        if(dim1ValueMap.equals(advancedDim1ValueMap)) {
        	log.info("Dim1 values are same");
        }
        else{
			log.info("Dim1 values are not same for SM- "+node.getName());
        	//log.info("Dim1 values are not same - Current Value  for SM "+node.getName()+ dim1ValueMap+ "- New Values" +advancedDim1ValueMap);
        }
        if(dim2ValueMap.equals(advancedDim2ValueMap)){
        	log.info("Dim2 values are same");
        }
        else{
			log.info("Dim2 values are not same SM-"+node.getName());
        	//log.info("Dim2 values are not same - Current Value for SM "+node.getName()+ dim2ValueMap+ "- New Values" +advancedDim2ValueMap);

        }
	}
}