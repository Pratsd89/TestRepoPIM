/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_RemoveStyleFromDSG",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_RemoveStyleFromDSG",
  "description" : "Runs behind the button labelled 'Remove Style' on the screen with ID “DuplicateStyleGroups_Details_Screen”",
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
var RefType = step.getReferenceTypeHome().getReferenceTypeByID("rt_mergeDuplicateStyles");
var dsg_refs = node.getReferences(RefType);
var dsg_refsCount = dsg_refs.size()
var delete_RefArray = [];
var selection = webui.getSelection();
var selectionCount = selection.size();
//ANSI Added
if(selectionCount == 0){
	webui.showAlert("ERROR",  "<b>Please select any Style to perform this action</b>");
} 
else if (dsg_refsCount - selectionCount < 2){
	webui.showAlert("WARNING",  "<b>ALERT: " + "Removing the selected Styles would result in only one Style for this DuplicateStyleGroup. Please delete the DuplicateStyleGroup or add more Styles prior to performing this action" + "</b>");
   
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
			webui.showAlert("WARNING",  "<b>ALERT: " + "You are attempting to remove the Primary Style for this group. Please indicate which Style is the new Primary Style and save prior to removing this Style from the group" + "</b>");
		
	     }

	
		else {
			log.info(dsg_refs.size());
			for (var i = 0; i < dsg_refs.size(); i++) {
        			var ref_style = dsg_refs.get(i).getTarget();
        	
        			if (curr_styleID == ref_style.getID()){
        		
        				
        				log.info(dsg_refs.size());
        				//Set the "a_Primary_Selling_Style_ID" and "a_Primary_Selling_Style" attributes on the selected style to be null and publish it
        				ref_style.getValue("a_Primary_Selling_Style_ID").setSimpleValue("");
        				ref_style.getValue("a_Primary_Selling_Style").setSimpleValue("");
        				ref_style.getValue("a_SuperPDP_Program_ID").setSimpleValue("");
        				var time = new java.util.Date();
	          		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					ref_style.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
					delete_RefArray.push(dsg_refs.get(i));
        			
               		//remove the selected style from the supporting styles of the Primary Style of the DSG
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
      }
	
 }
  
}
//webui.showAlert("WARNING", null, "<b>ALERT: " + tbd  + "</b>");
for (var i = 0; i < delete_RefArray.length; i++) {
		var refToDelete = delete_RefArray[i];

			refToDelete.delete();
		}


}