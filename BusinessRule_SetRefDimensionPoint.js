/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SetRefDimensionPoint",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SetRefDimensionPoint",
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
var contextHome = step.getContextHome();
var currentContext = step.getCurrentContext().getID();
//var ref = null;
var context = null; 
log.info(currentContext);
if(node.getReferencedBy().size() == 0){
	if(currentContext == "EN_US"){
		//context = contextHome.getContextByID("EN_CA");
		context = "EN_CA";
	}else{
		//context = contextHome.getContextByID("EN_US");
		context = "EN_US";
	}
}

log.info("---------" + context);
setVisibility(context);


function setVisibility(ctx){
	
	step.executeInContext(ctx, function(step)
	 {

		var oEntity = step.getEntityHome().getEntityByID(node.getID());
		var dimensionPoint;
		var ref = null;
		var marketRoot;
		var parentDimPoint;
		log.info("---------- " + oEntity.getID());
		var setofReferences = oEntity.getReferencedByProducts();
		log.info("setofReferences" + setofReferences);
		var itr = setofReferences.iterator();
		if(setofReferences != null){
			
			while (itr.hasNext()) {
				ref = itr.next();
				log.info("Target id = " + ref.getTarget().getID());
				log.info("Source id = " + ref.getSource().getID());
				break;
			}
		
			var setOfDimensionPoints = ref.getDimensionPoints();
			log.info("setOfDimensionPoints "+ setOfDimensionPoints.size());
			var itr2 = setOfDimensionPoints.iterator();
			
			while(itr2.hasNext()){
				dimensionPoint = itr2.next();
				log.info("dimensionPoint id = " + dimensionPoint.getID());
				break;
			}
			
			if(dimensionPoint.getID() == "MarketRoot"){
				parentDimPoint = dimensionPoint;
				log.info("This is set on Market root");
			}else{
				log.info("This is set on -- " + dimensionPoint.getID());
				parentDimPoint = dimensionPoint.getParent();
			}
		
			//Clear the existing visibility
			setOfDimensionPoints.clear();
			
			var setOfAllDimPoints = parentDimPoint.getChildren();
			var itrAllDimPoints = setOfAllDimPoints.iterator();
			
			if(node.getValue("a_Shared_Markets").getSimpleValue() == null){
				//Do Nothing
			}else if(node.getValue("a_Shared_Markets").getSimpleValue() == "US"){
				while(itrAllDimPoints.hasNext()){
					var currentDimPoint = itrAllDimPoints.next();
					if(currentDimPoint.getID() == "USA"){
						setOfDimensionPoints.add(currentDimPoint);
					}
				}
			}else if(node.getValue("a_Shared_Markets").getSimpleValue() == "CAN"){
				while(itrAllDimPoints.hasNext()){
					var currentDimPoint = itrAllDimPoints.next();
					if(currentDimPoint.getID() == "Canada"){
						setOfDimensionPoints.add(currentDimPoint);
					}
				}
			}else{
				setOfDimensionPoints.add(parentDimPoint);
			}
			
			log.info("setOfDimensionPoints "+ setOfDimensionPoints.size());
			ref.setDimensionPoints(setOfDimensionPoints);
		}
	 });
}
}