/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "ClassifyRuleSet",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "ClassifyRuleSet",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "AutoClassificationMap" ],
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
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "linkType",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "StyleToWebSubCategoryRef",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,log,linkType) {
//INFO: {com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl: StyleToWebSubCategoryRef=[com.stibo.core.domain.impl.FrontClassificationProductLinkImpl@23def107], com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl: stibo.IndexWord=[]}
//var prodClassLinkTypeID = "StyleToWebSubCategoryRef";
//var linkType = step.getLinkTypeHome().getClassificationProductLinkTypeByID(prodClassLinkTypeID);
//var linkInMain = node.getClassificationProductLinks().asList();
//log.info(linkInMain.get(0).getProduct().getID());

//--Get Target--//
var classificationTypeHome = step.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome);
var classificationType = classificationTypeHome.getLinkTypeByID('StyleToWebSubCategoryRef'); 
var x = node.getClassificationProductLinks(classificationType).toArray();
var tarLen= x.length;//Target length
if(x[0] != null && x[0] !=''){
var a_TarObj = x[0].getClassification();
var prdtype=a_TarObj.getValue("a_WebCategory_Product_Type").getSimpleValue();
	}
//var a_Target=x[0].getClassification().getID();
//var a_TarObj = x[0].getClassification();
//var prdtype=a_TarObj.getValue("a_WebCategory_Product_Type").getSimpleValue();
//--Get Source--//
var a_So = node.getReferencedBy().toArray();
var a_SorObj = a_So.length; //Source Length
if(tarLen == 1 && a_SorObj == 1 && prdtype != null && prdtype != '' ){
var a_Source = a_So[0].getSource().getID();
var a_Sobj = a_So[0].getSource().getObjectType().getID();
//log.info(a_Source+" type "+a_Sobj);
if(a_Sobj == "WebCategory"){
	
	if(prdtype == "Style"){
		//web category immediate child
		var catProd = a_So[0].getSource().getClassificationProductLinks();
		if(catProd){
            		var chIter=catProd.iterator();
            		while(chIter.hasNext()){
            			var chprod = chIter.next();
            			//log.info(chprod.getProduct());
            			var objTypeS = chprod.getProduct().getObjectType().getID();
            			
            			if (objTypeS == "Style")
            			{
            				try {
							chprod.getProduct().createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + chprod.getProduct().getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
            				
            				}
            			
            			}
            		}
		
		//web category's child = sub category traversing
	/*var children = a_So[0].getSource().getChildren();
	if(children){
        var childIter = children.iterator();
        while(childIter.hasNext()){
            var child = childIter.next();
            if(child){
            	var subcatchild = child.getClassificationProductLinks();
            	if(subcatchild){
            		var chIter=subcatchild.iterator();
            		while(chIter.hasNext()){
            			var chprod = chIter.next();
            			//log.info(chprod.getProduct());
            			var objTypeS = chprod.getProduct().getObjectType().getID();
            			
            			if (objTypeS == "Style")
            			{
            				try {
							chprod.getProduct().createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + chprod.getProduct().getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
            				
            				}
            			
            			}
            		}
            	//var chIter=child.iterator();
            	//while(chIter.hasNext()){
            	//	var chprod = chIter.next();
            	//	log.info(chprod);
            		
            		}
            	}
            //log.info(child);
            //child.createClassificationProductLink(a_TarObj,linkType);
            }*/
            }
		
		
		if (prdtype == "CC"){
		//web category immediate child
		var catProd = a_So[0].getSource().getClassificationProductLinks();
		if(catProd){
            		var chIter=catProd.iterator();
            		while(chIter.hasNext()){
            			var chprod = chIter.next();
            			//log.info(chprod.getProduct());
            			var objTypeS = chprod.getProduct().getObjectType().getID();
            			//log.info(chprod.getProduct());
            			
            			if (objTypeS == "CustomerChoice")
            			{
            				try {
							chprod.getProduct().createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + chprod.getProduct().getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
            				
            				}
            			
            			}
            		}
		
		//web category's child = sub category traversing
	/*var children = a_So[0].getSource().getChildren();
	//into subcat
	if(children){
        var childIter = children.iterator();
        while(childIter.hasNext()){
            var child = childIter.next();
            if(child){
            	//get style of sub cat
            	var subcatchild = child.getClassificationProductLinks();
            	if(subcatchild){
            		var chIter1=subcatchild.iterator();
            		while(chIter1.hasNext()){
            			var chprod1 = chIter1.next();
            			//log.info(chprod.getProduct());
            			var objTypeS = chprod1.getProduct().getObjectType().getID();
            			log.info(chprod1.getProduct().getID());
            			
            			if (objTypeS == "CustomerChoice")
            			{
            				try {
            					log.info("in classification addition");
							chprod1.getProduct().createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + chprod.getProduct().getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
            				
            				}
            			
            			}
            		}
            	//var chIter=child.iterator();
            	//while(chIter.hasNext()){
            	//	var chprod = chIter.next();
            	//	log.info(chprod);
            		
            		}
            	}
            //log.info(child);
            //child.createClassificationProductLink(a_TarObj,linkType);
            }*/
            }
	
	}
if (a_Sobj == "WebSubCategory"){

	if(prdtype == "Style"){
		var catProdSC = a_So[0].getSource().getClassificationProductLinks();
		if(catProdSC){
            		var chIterSC=catProdSC.iterator();
            		while(chIterSC.hasNext()){
            			var chprodSC = chIterSC.next();
            			//log.info(chprodSC.getProduct());
            			var objTypeSC = chprodSC.getProduct().getObjectType().getID();
            			
            			if (objTypeSC == "Style")
            			{
            				try {
							chprodSC.getProduct().createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + chprodSC.getProduct().getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
            				
            				}
            			
            			}
            		}
		}
		if (prdtype == "CC"){
			var catProdSC = a_So[0].getSource().getClassificationProductLinks();
		if(catProdSC){
            		var chIterSC=catProdSC.iterator();
            		while(chIterSC.hasNext()){
            			var chprodSC = chIterSC.next();
            			//log.info(chprodSC.getProduct());
            			var objTypeSC = chprodSC.getProduct().getObjectType().getID();
            			
            			if (objTypeSC == "CustomerChoice")
            			{
            				try {
							chprodSC.getProduct().createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + chprodSC.getProduct().getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
            				
            				}
            			
            			}
            		}
			
			}
	
	}
if (a_Sobj == "SubClass"){
	
	if(prdtype == "Style"){
	var children = a_So[0].getSource().getChildren();
	if(children){
        var childIter = children.iterator();
        while(childIter.hasNext()){
            var child = childIter.next();
            var sObj = child.getObjectType().getID();
            //child.createClassificationProductLink(a_TarObj,linkType);
            if (sObj == "Style")
            			{
            				try {
							child.createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + child.getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
            				
            				}
            }
            }
		}
		if (prdtype == "CC"){
			var children = a_So[0].getSource().getChildren();
	if(children){
        var childIter = children.iterator();
        while(childIter.hasNext()){
            var child = childIter.next();
			//traversing one level below
			var ccPrt = child.getChildren();
			if (ccPrt){
			var ccIter = ccPrt.iterator();
			while (ccIter.hasNext()){
			var ccOb = ccIter.next();
			try {
							ccOb.createClassificationProductLink(a_TarObj,linkType);
							} catch (e) {
							if (e.javaException instanceof com.stibo.core.domain.UniqueConstraintException) {
							log.warning("Link between product with ID '" + ccOb.getID() + "' and classification with ID '" + a_TarObj.getID() + "' already exists.");
							} else {
								throw e;
								}
							}
			
			}
			}
            }
            }
			
			}
	
	
	}
	}
	else
	{
		if(!(tarLen == 1)){
		//throw "<<<Please verify there is only One Source, One Target and a valid value for Web Category Product Type>>>";
		throw "<<<Please add one Target>>>";
		}
		if(!(a_SorObj == 1)){
			throw "<<<Please add one Source>>>";
			}
		if(prdtype == null || prdtype == ''){
			throw "<<<Please add value of attribute Web Category Product Type for the selected Target>>";
			
		}
	}

							
}