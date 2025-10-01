/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setSwatchPrimaryProductImgFromP01",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Content For Swatch Primary Product Image Onetime task",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
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
    "alias" : "stepManager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "ccToPhotoshotRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "CCToPhotoShotRef",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "primaryProductImageRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "PrimaryProductImage",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "swatchRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Swatch",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager,ccToPhotoshotRef,primaryProductImageRef,swatchRef) {
var shotsList=node.getReferences(ccToPhotoshotRef)
if(shotsList.size()>0){
var refListIterator = shotsList.iterator();
var shotIDArray = [];
while(refListIterator.hasNext()) {
	var ref=refListIterator.next()
	var shot=ref.getTarget();
	if(shot.getValue("a_Site_Placement").getLOVValue()!=null){
		var sitePlacement=shot.getValue("a_Site_Placement").getLOVValue().getID();
		var sourceShotLifeCycleStatus=shot.getValue("a_Source_Shot_Request_Lifecycle_Status").getValue()
		var shotLifeCycleStatus=shot.getValue("a_Shot_Request_Lifecycle_Status").getValue()
		if(sourceShotLifeCycleStatus=='Complete' && shotLifeCycleStatus=='Complete' && sitePlacement=='5'){
			shotIDArray.push(Number(shot.getID().substring(3,shot.getID().length())));
		}
	}
}
var sortedShotIds=shotIDArray.sort()
var latestShotID=shotIDArray[shotIDArray.length-1]
var mainShot=stepManager.getEntityHome().getEntityByID('SR-'+latestShotID)
if(mainShot!=null && mainShot!=undefined){
	var primaryProductImageRefExist=false;
	var swatchImageRefExist=false;
	
	if(mainShot.getReferences().size()>0){
	var references = mainShot.getReferences().asList().toArray();
		for (var j =0 ; j< references.length;j++){
		    var referenceTypeID = references[j].getReferenceType().getID();
		    var contentType=references[j].getTarget().getValue('a_Content_Type_ID').getSimpleValue();
		    if(referenceTypeID == 'ShotRequestPrimaryImageRef'){
		         var primaryImageRef=node.getReferences(primaryProductImageRef)
		         if(primaryImageRef.size()==0 && contentType=='216'){
		              node.createReference(references[j].getTarget(),primaryProductImageRef);
		              primaryProductImageRefExist=true;
		         }else {
		         		primaryProductImageRefExist=true;
		         }
		    } else if(referenceTypeID == 'ShotRequestSwatchRef'){
		         var swatchImageRef=node.getReferences(swatchRef)
		         if(swatchImageRef.size()==0 && contentType=='12'){
		              node.createReference(references[j].getTarget(),swatchRef);
		              swatchImageRefExist=true;
		         } else{
		         		swatchImageRefExist=true;
		         }
		    }
	
		    if(primaryProductImageRefExist && swatchImageRefExist){
		    	break;
		    }
		}
	}
 }
}
				

}