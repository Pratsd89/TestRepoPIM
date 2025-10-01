/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Create_Restriction_Style_CC_Ref",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Create Restriction Style CC Ref",
  "description" : null,
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
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "refType",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "Restriction_Product_Ref",
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "logger",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "list",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_CC_List</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\">CC List</Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "ccNum",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "styleNum",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Style_Number",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "styleObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "Style",
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "ccObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "CustomerChoice",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "webui",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,refType,logger,list,ccNum,styleNum,styleObjectType,ccObjectType,webui) {
var time = new java.util.Date();
var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
var logArray = new Array();
var logArray2 = new Array();
var logArray3 = new Array();
if (list == null) {
    webui.showAlert("Error", "Please provide atleast one CC Number and try again.");
} else {
    var brand = node.getParent().getID().slice(15);
    if (brand == "GAPO") {
        brand = "GO";
    }
    var listArray = [];
    listArray = list.split(",");
    listArray.forEach(function (li) {
        var actualList = li.split("\n")
        actualList.forEach(function (ccORStyleNumber) {
            // var ccORStyle = ac
            //check if a product exists with this id;
            var object = step.getProductHome().getProductByID(ccORStyleNumber);
            if (object != null) {
                checkAndCreateRefAndPublish(object, ccORStyleNumber)
            }
            else {
                object = searchWithNumber(styleNum, styleObjectType, ccORStyleNumber);
                if (object != null) {
                    checkAndCreateRefAndPublish(object, ccORStyleNumber)
                }
                else {
                    object = searchWithNumber(ccNum, ccObjectType, ccORStyleNumber);
                    if (object != null) {
                        checkAndCreateRefAndPublish(object, ccORStyleNumber)
                    }
                    else {
                        //webui.showAlert("Error", "Product doens't exist with number "+ccORStyleNumber);
                        //PRODUCT DOESN'T EXISTTTT
                    }
                }
            }
        });
    });
}

if (logArray.length > 0) {
    webui.showAlert("WARNING", "<b>" + "The following products do not belong to this brand: " + logArray.toString() + "</b>");
}

if (logArray2.length > 0) {
    webui.showAlert("WARNING", "<b>" + "The following products are removed as they are children of newly linked style : " + logArray2.toString() + "</b>");
}
if (logArray3.length > 0) {
    webui.showAlert("WARNING", "<b>" + "The following CC is not added as their parent style is already linked : " + logArray3.toString() + "</b>");
}

function checkAndCreateRefAndPublish(object, ccORStyleNumber) {
    var objectBrand = object.getValue("a_Brand_Number").getSimpleValue();
    if (brand == objectBrand) {
    	if(checkIfAlreadyLinked(object)){
        try {
            object.createReference(node, refType);
        }
        catch (e) {
        }
        // webui.showAlert("Error", "link is established for "+ccORStyleNumber);

        object.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        if (object.getObjectType().getID() == "Style") {
            ccs = object.getChildren();
            ccs.forEach(function (cc) {
                cc.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
            });
        }
    	}
    } else {
        logArray.push(ccORStyleNumber);
    }
}

function checkIfAlreadyLinked(product) {
	var alreadyLinkedProducts  = new java.util.ArrayList();

	node.queryReferencedBy(refType).forEach(function (referenceInstance) {
		alreadyLinkedProducts.add(referenceInstance.getSource().getID())
		return true;
	})
	
	if(product.getObjectType().getID() == "Style") {
		ccs = product.getChildren();
            ccs.forEach(function (cc) {
            	if(alreadyLinkedProducts.contains(cc.getID())){
            		//removeccAndGatingLink
            		cc.queryReferences(refType).forEach(function (referenceInstance) {
            			if(referenceInstance.getTarget().getID() ==node.getID()){
            				referenceInstance.delete();
            				return false;
            			}
            			return true;
            		});            		
            		logArray2.push(cc.getID());
            	}
            });
		//check if a cc under this style is already link,if yes then remove the link
	}
	else{
		style  = product.getParent().getID();
		if(alreadyLinkedProducts.contains(style) ){
			logArray3.push(product.getID())
			return false;
		}
		//check if parent style is already linked
		
	}
	return true;
}

function searchWithNumber(attribute, objectType1, number) {
    var c = com.stibo.query.condition.Conditions;
    var qh = step.getHome(com.stibo.query.home.QueryHome);
    var querySpecification = qh.queryFor(com.stibo.core.domain.Product).where(
        c.valueOf(attribute).eq(number)
            .and(c.objectType(objectType1))
    );
    var res = querySpecification.execute();
    var product = null;
    res.forEach(function (object) {
        product = object;
        return false;
    });
    return product;
}

}