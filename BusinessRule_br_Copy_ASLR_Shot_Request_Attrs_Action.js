/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Copy_ASLR_Shot_Request_Attrs_Action",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Copy ASLR Shot Request Attributes Action",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ShotRequestLibrary",
    "libraryAlias" : "shotLibrary"
  } ]
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "oldStylingRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "OldShotRequestToStylingPieceCCRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "stylingRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "ShotRequestToStylingPieceCCRef",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "portal",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "lookupTable",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,oldStylingRef,stylingRef,stepManager,portal,lookupTable,shotLibrary) {
//PPIM-8231 ShotRequest Shared Market Validation logic added
var isSharedMarketValid = null;
isSharedMarketValid = shotLibrary.shotRequestSharedMarketValidation(node, stepManager, portal,lookupTable)
   
if(stepManager.getCurrentWorkspace().getID()== "Main" && 'valid' == isSharedMarketValid)
{
var shotRequestMethod = node.getValue('a_Shot_Request_Method').getSimpleValue();
if(shotRequestMethod == 'ASLR'){
	
	var shotCode = node.getValue('a_Shot_Code').getSimpleValue();
	var shotType = node.getValue('a_Shot_Type').getSimpleValue();
	var sitePlacement = node.getValue('a_Site_Placement').getSimpleValue();
	var marketCode = node.getValue('a_Shared_Markets').getSimpleValue();
	var shotInstructions = node.getValue('a_Shot_Instructions').getSimpleValue();
	var oldShotCode = node.getValue('a_Old_Shot_Code').getSimpleValue();
	var oldShotType = node.getValue('a_Old_Shot_Type').getSimpleValue();
	var oldSitePlacement = node.getValue('a_Old_Site_Placement').getSimpleValue();
	var oldMarketCode = node.getValue('a_Old_Shared_Markets').getSimpleValue();
	var oldShotInstructions = node.getValue('a_Old_Shot_Instructions').getSimpleValue();
	
	var oldStylingReferences = node.getReferences(oldStylingRef).toArray();
	var newStylingReferences = node.getReferences(stylingRef).toArray();
	var changeInRefFlag = false;
	if(newStylingReferences.length != oldStylingReferences.length){
		changeInRefFlag = true;
	}
	else{
		for(var  i=0 ; i<newStylingReferences.length; i++){
			var sameReferenceExistFlag = false;
			var target = newStylingReferences[i].getTarget().getID();
			var stylingPieceInstructions =newStylingReferences[i].getValue('a_Styling_Piece_Instructions').getSimpleValue();
			for(var j = 0;j<oldStylingReferences.length;j++){			
				var oldTarget = oldStylingReferences[j].getTarget().getID();
				var oldStylingPieceInstructions =oldStylingReferences[j].getValue('a_Styling_Piece_Instructions').getSimpleValue();
				if(oldTarget == target && stylingPieceInstructions == oldStylingPieceInstructions){
					sameReferenceExistFlag = true;
					break;
				}
			}
			if(sameReferenceExistFlag == false){
				changeInRefFlag = true;
				break;
			}
		}
	}
	
	if(shotCode != oldShotCode || shotType != oldShotType || sitePlacement != oldSitePlacement || marketCode != oldMarketCode || shotInstructions != oldShotInstructions || changeInRefFlag == true){
		node.getValue('a_Shot_Request_Method').setSimpleValue('Manual');
		node.getValue('a_Old_Shot_Code').setSimpleValue(shotCode);
		node.getValue('a_Old_Shot_Type').setSimpleValue(shotType);
		node.getValue('a_Old_Site_Placement').setSimpleValue(sitePlacement);
		node.getValue('a_Old_Shared_Markets').setSimpleValue(marketCode);
		node.getValue('a_Old_Shot_Instructions').setSimpleValue(shotInstructions);
	
		for(var k =0 ; k< oldStylingReferences.length; k ++ ){
			oldStylingReferences[k].delete();
		}
	
		for(var m = 0;m < newStylingReferences.length ; m++){
			var target = newStylingReferences[m].getTarget();
			var newStylingInstruction = newStylingReferences[m].getValue('a_Styling_Piece_Instructions').getSimpleValue();
			var reference = node.createReference(target,oldStylingRef);
			reference.getValue('a_Styling_Piece_Instructions').setSimpleValue(newStylingInstruction);
		}
	}
}
}
}