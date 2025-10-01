/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_calculateDueDate_OneTimeUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_calculateDueDate_OneTimeUpdate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step) {
var context = step.getCurrentContext().getID();

step.executeInContext(context, function (otherManager) {
    var stepNode = otherManager.getProductHome().getProductByID(node.getID());
    //PPIM-10284
    if (stepNode == null) {
        stepNode = otherManager.getClassificationHome().getClassificationByID(node.getID());
    }

    var translationUrgency = null;
    var objectType = stepNode.getObjectType().getID();

    if (objectType == "Style") {
        //translationUrgency = stepNode.getValue('a_Translation_Urgency').getSimpleValue();
    }
    else if (objectType == "CustomerChoice") {
          
        translationUrgency = stepNode.getParent().getValue('a_Translation_Urgency').getSimpleValue();
        stepNode.getValue('a_CC_Translation_Urgency').setValue(translationUrgency);
        
          
    
    }
    else {
       // translationUrgency = stepNode.getValue('a_Cat_Translation_Urgency').getSimpleValue();
    }

    var formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
    var simpleDateFormat = java.text.SimpleDateFormat("yyyy-MM-dd");

    var customFormatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    var xtm = stepNode.getValue("a_File_XTM_TimeStamp").getSimpleValue();
    var xtmDateTime = java.time.LocalDateTime.parse(xtm, customFormatter);
    
    var zonedTime = xtmDateTime.atZone(java.time.ZoneId.of("US/Pacific"));
    var todayDay = zonedTime.getDayOfWeek().getValue();

    var plusDays = 0;
    switch (true) {
        case (translationUrgency == '3. Urgent'):
            plusDays = 1;
            break;
        case (translationUrgency == '2. Medium'):
            plusDays = 2;
            break;
        case (translationUrgency == '1. Standard'):
            plusDays = 5;
            break;
    }

    // Check last weekday
    var lastDate = zonedTime.plusDays(plusDays);
    var lastDay = lastDate.getDayOfWeek().getValue();

    // PPIM-6845: Adjust for times after 20:30
    if (zonedTime.toLocalTime().compareTo(java.time.LocalTime.parse("20:30")) > 0) {
        plusDays++;
    }

    // Adjust for weekend days
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

    var dueDate = zonedTime.plusDays(plusDays + weekendDays);

    // Format and adjust for weekend days (if due date falls on Saturday or Sunday)
    var formattedDueDate = dueDate.format(formatter);

    var finalDay = java.text.SimpleDateFormat("EEEE").format(simpleDateFormat.parse(formattedDueDate));

    if (finalDay == "Saturday") {
        dueDate = dueDate.plusDays(2); // Move to Monday
    }
    else if (finalDay == "Sunday") {
        dueDate = dueDate.plusDays(1); // Move to Monday
    }

    // Set the calculated due date in the appropriate field
    if (objectType == "Style") {
        //stepNode.getValue('a_Translation_Due_Date').setValue(dueDate.format(formatter));
    }
    else if (objectType == "CustomerChoice") {
    	
        stepNode.getValue('a_CC_Translation_Due_Date').setValue(dueDate.format(formatter));
        stepNode.getValue('a_CC_Translation_Status').setValue('Submitted');
        
    }
    else {
      //  stepNode.getValue('a_Cat_Translation_Due_Date').setValue(dueDate.format(formatter));
    }

    log.info("DUE " + dueDate.format(formatter));
    log.info(translationUrgency);
});

}