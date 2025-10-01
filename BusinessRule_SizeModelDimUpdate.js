/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "SizeModelDimUpdate",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "SizeModelDimUpdate",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "SizeModel" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log) {
var obj = node.getObjectType().getID();
log.info(obj);
if(obj == "SizeModel"){
	var children = node.getChildren();
	if(children){
        var childIter = children.iterator();
        while(childIter.hasNext()){
            var child = childIter.next();
            var sVariant = child.getValue("a_SizeCodeVariant").getSimpleValue();
            if (sVariant != null){
            	var children1 = child.getChildren();
			if(children1){
        		var childIter1 = children1.iterator();
        		while(childIter1.hasNext()){
            	var child1 = childIter1.next();
            	//log.info(child1.getObjectType().getID());
            	var tObj = child1.getObjectType().getID();
            	if (tObj == "Dim1"){
            		var sDim1 = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
            		if(sDim1 != null){
            			var skuDim1 = sVariant+" "+sDim1;
            			log.info("skuDim1 "+skuDim1);
            			}
            		}
            	if (tObj == "Dim2"){
            		var sDim2 = child1.getValue("a_Advanced_Dimension_Value").getSimpleValue();
            		if(sDim2 != null){
            			var skuDim2 = sVariant+" "+sDim2;
            			log.info("skuDim2 "+skuDim2);
            			}
            		}
			}
			}
			// 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
			/*
            	var classSKU = child.getClassificationProductLinks();
			log.info("classSKU: "+classSKU);
				if(classSKU){
            		var chIter11=classSKU.iterator();
            		while(chIter11.hasNext()){
            			var chprod11 = chIter11.next(); 
						//log.info("chprod11 "+chprod11.getProduct().getID());
						chprod11.getProduct().getValue("a_Size_Dim1_Description").setSimpleValue(skuDim1);
						chprod11.getProduct().getValue("a_Size_Dim2_Description").setSimpleValue(skuDim2);
            		}
            		}
            	*/
            }
            	/*else{
            		throw "The Size Code does not have a value for variant attribute.";
            		}*/ //Commented for PPIM-3051
            
		}
	}
}
}