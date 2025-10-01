/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Get_Code_From_Dim_Test",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Get Code From Dim",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Dim1", "Dim2", "Dimension_Value", "stibo.grouping attribute" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "lib_HelperFunctions",
    "libraryAlias" : "helper"
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "advDim",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Advanced_Dimension_Value",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,portal,qh,advDim,helper) {
/*var advDimLovId= node.getID().substr(4);
log.info(advDimLovId);
    var c = com.stibo.query.condition.Conditions;

    var querySpecification = qh.queryFor(com.stibo.core.domain.Classification).where(
       c.valueOf(advDim).eq("XS")
        .and(c.objectType(step.getObjectTypeHome().getObjectTypeByID("Dim1")))
    );
    var res = querySpecification.execute();
log.info (res);
	if(res){
		log.info ("reached");
    res.forEach(function(resNode) {
    	log.info(resNode.getID());
        
    });
    }*/










var advDimLovId= node.getID().substr(4);
log.info (advDimLovId);
var sizeModelClassParent = step.getClassificationHome().getClassificationByID("101471");
var dim1Objects = new java.util.ArrayList(); 
var dim2Objects = new java.util.ArrayList(); 
var sizeModels = sizeModelClassParent.getChildren().toArray();  
var sizeCodes = new java.util.ArrayList(); 
sizeModels.forEach(function(sizemodel)
{
	 var sizeCode = sizemodel.getChildren();
	
	   if(sizeCode){
        var childIter = sizeCode.iterator();
        while(childIter.hasNext()){
        	var child = childIter.next();
        	sizeCodes.add(child);
        	}
	   }
})
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
            var advsDim1ID = child1.getValue("a_Advanced_Dimension_Value").getID();
            if (advDimLovId == advsDim1ID)
            {
            	dim1Objects.add(child1.getParent().getID());
            }          		
          }          	
            if (ObjNm == "Dim2"){
            	
            var sDim2ID = child1.getValue("a_Dimension_value").getID();
             if (advDimLovId == sDim2ID)
            {
            	dim2Objects.add(child1.getParent().getID());
            }
            }
		}
	  }
   })
}
log.info("dim1Objects"+dim1Objects);
log.info("dim2Objects"+dim2Objects);

}