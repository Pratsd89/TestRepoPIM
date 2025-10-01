/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "GlobalUtilLibrary",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Global Util Library",
  "description" : null,
  "scope" : null,
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : null,
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessLibrary",
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
function indexOfMax(arr) {
	if (arr.length === 0) {
		return -1;
	}
	var min = arr[0];
	var minIndex = 0;
	for (var i = 1; i < arr.length; i++) {
		if (arr[i] < min) {
			minIndex = i;
			min = arr[i];
		}
	}
	return minIndex;
}


/**
 * 08/16/21
 * Copy all attributes in param attributeGroupName from source object to target object
 * @param source Object
 * @param target Object
 * @param agName attribute group name 
 */
function copy(stepManager, source, target, agName){
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	target.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
	if(source.getName()!=null)
		target.setName(source.getName());
	var attributeGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID(agName);
  	var attNameList = attributeGroup.getAttributes().toArray();
  	for (x in attNameList) {
    		var sourceValue = source.getValue(attNameList[x].getID()).getSimpleValue();       			
	    	if(sourceValue != null){
		    target.getValue(attNameList[x].getID()).setSimpleValue(sourceValue);
	     }			
	}
}


/**
 * 08/16/21
 * Copy all attributes in param attributeGroupName from source object to target object
 * @param source Object
 * @param target Object
 * @param agName attribute group name 
 */
function copyWebHierarchy(stepManager, source, target, agName){
	if(source.getName()!=null)
		target.setName(source.getName());
	var attributeGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID(agName);
  	var attNameList = attributeGroup.getAttributes().toArray();
  	for (x in attNameList) {
    		var sourceValue = source.getValue(attNameList[x].getID()).getSimpleValue();       			
	    	if(sourceValue != null){
		    target.getValue(attNameList[x].getID()).setSimpleValue(sourceValue);
	     }			
	}
}



/**
 * 08/16/21
 * Copy all attributes in param attributeGroupName from source object to target object in other context
 * @param 
 * @param source Object
 * @param target Object
 * @param agName attribute group name 
 */
function copyInOtherContext(stepManager, targetContext, sourceID, targetID, agName){
	var time = new java.util.Date();
	var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	stepManager.executeInContext(targetContext,function(otherContext){
		var source = otherContext.getClassificationHome().getClassificationByID(sourceID);
		var target = otherContext.getClassificationHome().getClassificationByID(targetID);		
		
		target.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
		if(source.getName()!=null)
			target.setName(source.getName());
		var attributeGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID(agName);
  		var attNameList = attributeGroup.getAttributes().toArray();
  		for (x in attNameList) {
    			var sourceValue = source.getValue(attNameList[x].getID()).getSimpleValue();       			
	    		if(sourceValue != null){
		    		target.getValue(attNameList[x].getID()).setSimpleValue(sourceValue);
	    		}			
		}	
	})
}

/**
 * 08/16/21
 * Check if the current user has privilege to copy between context.
 * @param stepManager
 * @param group Name of the group where to check
 */
function canCopyUS(stepManager, group){
	if(stepManager.getCurrentContext().getID() == "EN_US"){
		return true;
	}
	var canCopy  = false;
	var userGroups = new java.util.ArrayList();
	userGroups.addAll(stepManager.getCurrentUser().getGroups());
	for(var n = 0 ; n < userGroups.size(); n++){
		if(userGroups.get(n).getID() == group){
			canCopy = true;
		}
	}
	return canCopy;
}


/**
 * Set Translation due to date
 * @param Style
 * 
 */
function setTranslationDueDate(node, stepManager, context) {
    stepManager.executeInContext(context, function (step) {
    	
        var stepNode = step.getProductHome().getProductByID(node.getID());
        //PPIM-10284
        if (stepNode == null){
        	  stepNode = step.getClassificationHome().getClassificationByID(node.getID());
        }
        
        var translationUrgency = null;
        var objectType = stepNode.getObjectType().getID();

        if (objectType == "Style"){
        	  translationUrgency = stepNode.getValue('a_Translation_Urgency').getSimpleValue();
        }
        else if (objectType == "CustomerChoice"){
        	  translationUrgency = stepNode.getValue('a_CC_Translation_Urgency').getSimpleValue();
        }
        else{
        	  translationUrgency = stepNode.getValue('a_Cat_Translation_Urgency').getSimpleValue();
        }
        
        var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
        var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");

        var zonedTime = java.time.ZonedDateTime.now();
        var todayDay = zonedTime.getDayOfWeek().getValue();

        switch (true) {
            case (translationUrgency == '3. Urgent'):
                var plusDays = 1;
            break;
            case (translationUrgency == '2. Medium'):
                var plusDays = 2;
            break;
            case (translationUrgency == '1. Standard'):
                var plusDays = 5;
            break;
        }
        
        // Check last weekday
        var lastDate = zonedTime.plusDays(plusDays);
        var lastDay = lastDate.getDayOfWeek().getValue();
 

        //PPIM-6845
        if (zonedTime.toLocalTime().compareTo(java.time.LocalTime.parse("20:30")) > 0)  {
            plusDays++;
        }
                 
        // If last day is Saturday or Sunday, translation day must be next Monday
        var weekendDays = 0;

        switch (true) {
            case todayDay + plusDays > 6:
                weekendDays += 2;
            break;
            case lastDay == 6:
                weekendDays += 2;
            break;
            case lastDay == 0:
                weekendDays += 1;
            break;
            default:
                weekendDays = 0;		
            break;
        }	
       
        //PPIM-6845
        var dueDate = zonedTime.plusDays(plusDays + weekendDays);
        
        var formattedDueDate = dueDate.format(formatter);

        var finalDay = java.text.SimpleDateFormat("EEEE").format(simpleDateFormat.parse(formattedDueDate));
        

        if (finalDay == "Saturday") {
            dueDate = dueDate.plusDays(2);
        }
        else if (finalDay == "Sunday") {
            dueDate = dueDate.plusDays(1);
        }

        if (objectType == "Style"){
        	  stepNode.getValue('a_Translation_Due_Date').setValue(dueDate.format(formatter));
        }
        else if (objectType == "CustomerChoice"){
        	  stepNode.getValue('a_CC_Translation_Due_Date').setValue(dueDate.format(formatter));
        }
        else{
        	  stepNode.getValue('a_Cat_Translation_Due_Date').setValue(dueDate.format(formatter));
        }
        	
    });
}

/**
 * Gets context based on Market designation. 
 * @return Array with all context related
 */
function getContextBasedOnMarket(NODE, LKT){
	var Contexts = new Array();
	
	if (NODE.getObjectType().getID() == "Style") {
		//get market designation for node and make array
		var MktDsg = NODE.getValue("a_Style_Market_Designation").getValues().toArray();
	}
	if (NODE.getObjectType().getID() == "CustomerChoice") {
		//get market designation for node and make array
		var MktDsg = NODE.getValue("a_Market_Designation").getValues().toArray();
	}
	
	//get context ID for each market from lookup table
	MktDsg.forEach(function (Mkt) {
		Contexts.push(LKT.getLookupTableValue("LKT_MarketDesignationToMarket", Mkt.getSimpleValue()));
	});
	return Contexts;
}


/**
 * Return an ArrayList with all context related to a_Shared_Markets attribute.
 */
 /**
function getContextBasedOnSharedMarkets(NODE){
	var context = java.util.ArrayList();
	var marketDesignation = NODE.getValue("a_Shared_Markets").getValues().iterator();
	while(marketDesignation.hasNext()){
		var market = marketDesignation.next().getValue();
		switch(true){
			case market == 'US':
				context.add("EN_US");
			break;
			case market == 'CAN':
				context.add("EN_CA");
			break;
			case market == 'JPN':
				context.add("EN_JP");
			break;
		}
	}
	return context;
}
*/

/*===== business library exports - this part will not be imported to STEP =====*/
exports.indexOfMax = indexOfMax
exports.copy = copy
exports.copyWebHierarchy = copyWebHierarchy
exports.copyInOtherContext = copyInOtherContext
exports.canCopyUS = canCopyUS
exports.setTranslationDueDate = setTranslationDueDate
exports.getContextBasedOnMarket = getContextBasedOnMarket