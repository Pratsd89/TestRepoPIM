/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "PPIM-5190_CAN",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "PPIM-5190_CAN",
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
    "alias" : "topLevelNode",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "clcs",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Life_Cycle_Status",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (topLevelNode,clcs,stepManager) {
Array.prototype.contains = function(v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr;
}


        var classification = stepManager.getClassificationHome().getClassificationByID(topLevelNode.getID());
    var productsList = classification.getClassificationProductLinks().toArray();
   var productArray = [];
    for(var k=0;k<productsList.length;k++){
        productArray.push(productsList[k].getProduct());
        }

    log.info(productArray);


log.info('top level node ' + topLevelNode);
var styles = productArray
log.info ('Styles ' + styles);
log.info('Amount of styles ' + styles.length);
		var finalArray = [];
	for (var i=0; i < styles.length; i++) {
		var CCs = styles[i].getChildren();
		log.info('Style ' + styles[i]);
		log.info('CCs ' + CCs);
		log.info('CCs per style ' + CCs.size());
		var def = [];
		var defu = "";
		var photoStatus = [];
		var photoStatusU = "";

//log.info('Check this object ' + typeof(CCs));
//log.info('Check this object ' + typeof(styles));
//if( CCs.get(z).getValue('a_Market_Designation').getSimpleValue().indexOf('US') >= 0) {
				
			var z = 0;
				for (var s=0; s < CCs.size(); s++){
						if( CCs.get(s).getValue('a_Market_Designation').getSimpleValue().indexOf('CAN') >= 0) {
						//log.info('Log my Market Designation ' + CCs.get(s).getValue('a_Market_Designation').getSimpleValue());
						def.push(CCs.get(s).getValue('a_CC_Life_Cycle_Status').getSimpleValue());
						photoStatus.push(CCs.get(s).getValue('a_CC_Photo_Status').getSimpleValue());
						} else {
							//log.info('Log my Market Designation ' + CCs.get(s).getValue('a_Market_Designation').getSimpleValue());
							def.push('Skip');
							photoStatus.push('Skip');
						}

					/*if( CCs.get(s).getValue('a_Market_Designation').getSimpleValue().indexOf('US') >= 0){
						photoStatus.push(CCs.get(s).getValue('a_CC_Photo_Status').getSimpleValue());
						//log.info('Array building ' + CCs.get(s) + ' ' + photoStatus);
						log.info(photoStatus[s] + ' PHOTO STATUS VALUE TO BE USED FOR IF STATEMENTS');
					}*/
				//}

				
		/*			
				var defu = def.unique();
		
				for (var k=0; k < CCs.size(); k++){
					if( CCs.get(k).getValue('a_Market_Designation').getSimpleValue().indexOf('US') >= 0){
					photoStatus.push(CCs.get(k).getValue('a_CC_Photo_Status').getSimpleValue());
					}
				}
				var photoStatusU = photoStatus.unique();

				

				log.info('Return the cc life cycle full array ' + def);
				log.info('Return the photostatus full array ' + photoStatus);

				log.info('Current CC ' + CCs.get(s));
				log.info('Current Array number ' + s);
				
				log.info('Lifecycle Status used for if checks ' + def[s]);
				log.info('Photo Status used for if checks ' + photoStatus[s]);

		*/		

			if (def[s] != 'Skip' && photoStatus[s] != 'Skip') {
						
				if (def[s] == 'Draft' && photoStatus[s] == 'Complete' || def[s]  == 'Purged' && photoStatus[s] == 'Complete' || def[s]  == null) {
						finalArray.push(styles[i] + ' '+ defu);
						styles[i].getValue("a_Style_has_CC_to_approve").setSimpleValue("No");
						//log.info('Styles: ' + styles[i] + ' has CC to approve = NO');
						log.info('DRAFT/COMPLETE OR PURGED/COMPLETE OR NULL');
					}
				if (def[s] == 'Approved' && photoStatus[s] == 'Complete' || def[s] == 'Approved' && photoStatus[s] == 'Complete: Request Submitted') {
						finalArray.push(styles[i] + ' defu: '+ defu + ', photoStatusU: ' + photoStatusU);
						styles[i].getValue("a_Style_has_CC_to_approve").setSimpleValue("No");
						//log.info('Styles: ' + styles[i] + ' has CC to approve = NO');
						log.info('APPROVED COMPLETE/COMPLETE: REQUEST SUBMITTED');
					}
				if (photoStatus[s] == 'Shot Request Submitted' ) {
						finalArray.push(styles[i] + ' defu: '+ defu + ', photoStatusU: ' + photoStatusU);
						styles[i].getValue("a_Style_has_CC_to_approve").setSimpleValue("No");
						//log.info('Styles: ' + styles[i] + ' has CC to approve = NO');
						log.info('SHOT REQUEST SUBMITTED');						
					}
				if (def[s] == 'Draft' && photoStatus[s] == null ) {
						finalArray.push(styles[i] + ' defu: '+ defu + ', photoStatusU: ' + photoStatusU);
						styles[i].getValue("a_Style_has_CC_to_approve").setSimpleValue("No");
						//log.info('Styles: ' + styles[i] + ' has CC to approve = NO');
						log.info('DRAFT AND NULL');
					}
				if (def[s] == 'In Progress' && photoStatus[s] == 'Ready For Review' ) {
						finalArray.push(styles[i] + ' defu: '+ defu + ', photoStatusU: ' + photoStatusU);
						styles[i].getValue("a_Style_has_CC_to_approve").setSimpleValue("Yes");
						log.info('Styles: ' + styles[i] + ' has CC to approve = YES');
						log.info('IN PROGRESS AND READY FOR REVIEW');
						break;
					}
				if (def[s] == 'Waiting for Style Approval' && photoStatus[s] == 'Complete' ) {
						finalArray.push(styles[i] + ' defu: '+ defu + ', photoStatusU: ' + photoStatusU);
						styles[i].getValue("a_Style_has_CC_to_approve").setSimpleValue("Yes");
						log.info('Styles: ' + styles[i] + ' has CC to approve = YES');
						log.info('WAITING FOR STYLE APPROVAL AND COMPLETE');
						break;
					}
				} else {
					log.info('Skipped!');
				}
			}

				
				log.info('');
				log.info('STYLE: ' + styles[i] + ' HAS CC TO APPROVE = ' + styles[i].getValue("a_Style_has_CC_to_approve").getSimpleValue());
				log.info('');
		}
		
	//log.info('Final list ' + finalArray);


}