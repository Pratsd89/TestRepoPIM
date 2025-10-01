/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_RemoveStyleFromSSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_RemoveStyleFromSSG",
  "description" : "Runs behind the button labelled 'Remove Style' on the screen with ID \"SimilarStyleGroups_Details_Screen\"",
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "contract" : "WebUiContextBind",
    "alias" : "webui",
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
exports.operation0 = function (node,webui,step) {
var Market = node.getValue("a_SuperPDP_Market").getSimpleValue();
var RefType = step.getReferenceTypeHome().getReferenceTypeByID("rt_styles");
var ssg_refs = node.getReferences(RefType);
var ssg_refsCount = ssg_refs.size()
var delete_RefArray = [];
var selection = webui.getSelection();
var selectionCount = selection.size();
//ANSI Added
if(selectionCount == 0){
	webui.showAlert("ERROR", null, "<b>Please select any Style to perform this action</b>");
} 
else if (ssg_refsCount - selectionCount < 2){
	webui.showAlert("WARNING", null, "<b>ALERT: " + "Removing the selected Styles would result in only one Style for this SimilarStyleGroup. Please delete the SimilarStyleGroup or add more Styles prior to performing this action" + "</b>");
   
}
else {
	//get selected styles
	var selectionIter = selection.iterator();
	while (selectionIter.hasNext()) {
		//current selected style
		var curr_style = selectionIter.next();
		var curr_styleID = curr_style.getID();
		var isPrimaryStyle = curr_style.getValue("a_Primary_Selling_Style").getSimpleValue();
		
		if (isPrimaryStyle == "Yes"){
			webui.showAlert("WARNING", null, "<b>ALERT: " + "You are attempting to remove the Primary Style for this group. Please indicate which Style is the new Primary Style and save prior to removing this Style from the group" + "</b>");		
	     }
		else if ((step.getCurrentContext().getID() == "EN_CA") && (Market.contains("multisep"))) {
        		webui.showAlert("WARNING", null, "<b>ALERT: " + "This a shared item between US and Canada, Kindly perform this action is EN_US context" + "</b>");
       	 }
        else if(node.getID().contains(curr_styleID)){
        	    webui.showAlert("WARNING", null, "<b>ALERT: " + "This style was earlier used a Primary Style for this SSG. Kindly delete this and create a new SSG." + "</b>");
        }
	
		else {
			log.info(ssg_refs.size());
			for (var i = 0; i < ssg_refs.size(); i++) {
        			var ref_style = ssg_refs.get(i).getTarget();
        	
        			if (curr_styleID == ref_style.getID()){
        		
        				
        				log.info(ssg_refs.size());
        				//Set the "a_Primary_Selling_Style_ID" and "a_Primary_Selling_Style" attributes on the selected style to be null and publish it
        				ref_style.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
        				ref_style.getValue("a_Primary_Selling_Style").setSimpleValue("");
        				ref_style.getValue("a_SuperPDP_Program_ID").setSimpleValue("");
        				var time = new java.util.Date();
	          		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					ref_style.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
					delete_RefArray.push(ssg_refs.get(i));
        			
               		//remove the selected style from the supporting styles of the Primary Style of the SSG
               		var primaryStyleID = node.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
					var primaryStyle = step.getProductHome().getProductByID(primaryStyleID);
					var supportingStyles = primaryStyle.getValue("a_Supporting_Styles").getSimpleValue();
					
					if (supportingStyles.indexOf(curr_styleID) >= 0){
						
						var ss = primaryStyle.getValue("a_Supporting_Styles").getValues().iterator();
						
						while (ss.hasNext()) {
							var nextSS = ss.next();
							var nextSSName = nextSS.getValue();
							
							if (nextSSName == curr_styleID) {
								nextSS.deleteCurrent();
								break;
			     			}
                			}	
            			} 
                         primaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                         
       			}
        	
           	}
				if ((step.getCurrentContext().getID() == "EN_US") && (Market.contains("multisep"))) {
                step.executeInContext("EN_CA", function(caContextManager) {
                    var caNode = caContextManager.getProductHome().getProductByID(node.getID());
                    var caRefType = caContextManager.getReferenceTypeHome().getReferenceTypeByID("rt_styles");
                    var dsg_refsCA = caNode.getReferences(caRefType);
                    for (var j = 0; j < dsg_refsCA.size(); j++) {
                        var ref_styleCA = dsg_refsCA.get(j).getTarget();
                        if (curr_styleID == ref_styleCA.getID()) {
                            //Set the "a_Primary_Selling_Style_ID" and "a_Primary_Selling_Style" attributes on the selected style to be null and publish it
                            ref_styleCA.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
                            ref_styleCA.getValue("a_Primary_Selling_Style").setSimpleValue("");
                            ref_styleCA.getValue("a_SuperPDP_Program_ID").setSimpleValue("");
                            var time = new java.util.Date();
                            var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                            ref_styleCA.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                            ref_styleCA.getValue("a_Style_Group_Type").setSimpleValue("");
                            delete_RefArray.push(dsg_refsCA.get(j));
                            //remove the selected style from the supporting styles of the Primary Style of the DSG
                            var primaryStyleID = caNode.getValue("a_Primary_Selling_Style_ID").getSimpleValue();
                            var primaryStyle = caContextManager.getProductHome().getProductByID(primaryStyleID);
                            var supportingStyles = primaryStyle.getValue("a_Supporting_Styles").getSimpleValue();
                            if (supportingStyles.indexOf(curr_styleID) >= 0) {
                                var ss = primaryStyle.getValue("a_Supporting_Styles").getValues().iterator();
                                while (ss.hasNext()) {
                                    var nextSS = ss.next();
                                    var nextSSName = nextSS.getValue();
                                    if (nextSSName == curr_styleID) {
                                        nextSS.deleteCurrent();
                                        break;
                                    }
                                }
                            }
                            primaryStyle.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
                        }
                    }
                });
            }
           	
      }
	
 }
  
}
//webui.showAlert("WARNING", null, "<b>ALERT: " + tbd  + "</b>");
for (var i = 0; i < delete_RefArray.length; i++) {
		var refToDelete = delete_RefArray[i];

			refToDelete.delete();
		}


}