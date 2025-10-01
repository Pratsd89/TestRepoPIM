/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Email_WF_Library",
  "type" : "BusinessLibrary",
  "setupGroups" : [ "Libraries" ],
  "name" : "Email WF Library",
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
/**
* Function to send email notification 
* @param 
*/

function sendEmail(mailHome, template, logger, manager, parameters, procDetailsMap){
	
	//try{
		//logger.info("Inside send email function :: "+template.getValue("a_Email_Active_Status").getSimpleValue());
		if(template.getValue("a_Email_Active_Status").getSimpleValue() == "Yes")
		{
			logger.info("Email is Active...");
			var mailWrapper = mailHome.mail();
			var emailSubject = getEmailSubject(template, parameters);
			mailWrapper.subject(emailSubject);
			var emailSender = template.getValue("a_Email_Sender").getSimpleValue();
			mailWrapper.from(emailSender);
			//var emailIDs = template.getValue("a_Email_Sender").getSimpleValue().split(';');
			var emailIDs = getEmailReceiver(template, manager);
			logger.info("EmailSender : " + emailIDs);
			for(var ind in emailIDs)
			{
				mailWrapper.addTo(emailIDs[ind]);
				logger.info("To email added : " + emailIDs[ind]);
			}
			var emailBody = getEmailBody(template,  emailSender, parameters);
			logger.info("Body = " + emailBody);
			mailWrapper.htmlMessage("<html>" + getTagReplace(emailBody) + "</html>");
			
			mailWrapper.send();
			logger.info("email sent");
		}
	/* }catch(e){
		logger.info("Exception occurred in sending mail "+e);
		
		var expMsg = new java.lang.String(e);
		procDetailsMap.put("JOB_ERR_MSG",expMsg);
		procDetailsMap.put("ERROR_CD",template.getValue("a_Email_Error_Code").getSimpleValue());
		updateJobErrorLog(manager,procDetailsMap);
	} */
	
}

/**
* Function to prepare email subject 
* @param 
*/

function getEmailSubject(template, parameters){
	var subject = template.getValue("a_Email_Subject").getSimpleValue();
	subject = replaceParameters(subject, parameters);
	return subject;
}

/**
* Function to prepare email body 
* @param 
*/

function getEmailBody(template, emailId, parameters){
	
	var bodyText = template.getValue("a_Email_Body").getSimpleValue();
	logger.info("before replavement bodyText :: "+bodyText);
	
	var now = new java.time.LocalDateTime.now();
    var currentTimeString = now.format(java.time.format.DateTimeFormatter.ISO_DATE_TIME).slice(0,19).replace('T',' ');
	
	bodyText = bodyText.replace("$$Timestamp$$", currentTimeString);
	
	bodyText = bodyText.replace("$$EmailId$$", emailId);

	bodyText = replaceParameters(bodyText, parameters);

	logger.info("After replacement bodyText :: "+bodyText);		
	return bodyText;
}

/**
* Function to prepare email body 
* @param 
*/

function getTagReplace(bodyText){
	
	logger.info("before replacement bodyText :: "+bodyText);
	
	/*
	bodyText = bodyText.replace("<lt/>br<gt/>", "<br>");
	bodyText = bodyText.replace("<lt/>/br<gt/>", "</br>");
	bodyText = bodyText.replace("<lt/>/li<gt/>", "</li>");
	bodyText = bodyText.replace("<lt/>li<gt/>", "<li>");
	*/
	bodyText = bodyText.replace("<lt/>", "<");
	bodyText = bodyText.replace("<gt/>", ">");

	logger.info("After replacement bodyText :: "+bodyText);		
	return bodyText;
}



/**
* Function to prepare email receiver list 
* @param 
*/

function getEmailReceiver(template, manager){
	
	var filnalEmailIDs = [] ;
	var emailIDs = template.getValue("a_Email_Receiver").getSimpleValue().split(';');
	
	for(var ind in emailIDs)
	{
		filnalEmailIDs.push(emailIDs[ind]);
	}
	
	return filnalEmailIDs;
}


/**
* Function to replace parameters in a string
* @param 
*/

function replaceParameters(text, parameters) {
	var keys = parameters.keySet();
	var iter = keys.iterator();
	var outputText = text;
	while (iter.hasNext()) {
		var key = iter.next();
		var value = parameters.get(key);
		var replaceText = "$$"+key+"$$";
		if(value == null || value == "") {
			value = "N/A"
		}
		outputText = outputText.replace(replaceText, value);
	}
	return outputText;	
}


/*===== business library exports - this part will not be imported to STEP =====*/
exports.sendEmail = sendEmail
exports.getEmailSubject = getEmailSubject
exports.getEmailBody = getEmailBody
exports.getTagReplace = getTagReplace
exports.getEmailReceiver = getEmailReceiver
exports.replaceParameters = replaceParameters