/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Hemmablecheck",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "br_Hemmablecheck",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice", "SKU", "Style" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessConditionWithBinds",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager) {
var finalresult = true;
var objectType = node.getObjectType().getID();
if (objectType == "Style") {
    var HemmableFlag = node.getValue("a_Hemmable").getSimpleValue();
    var ParentID = node.getParent().getParent().getParent().getParent().getParent().getID();
    if (HemmableFlag == "Yes" && ParentID == "220aeb50-7748-49eb-91a7-c70d6290d630") {
        finalresult = HemmableCheck(node);
    }
}

if (objectType == "CustomerChoice") {
    var Style = node.getParent();
    var HemmableFlag = Style.getValue("a_Hemmable").getSimpleValue();
    var ParentID = Style.getParent().getParent().getParent().getParent().getParent().getID();
    if (HemmableFlag == "Yes" && ParentID == "220aeb50-7748-49eb-91a7-c70d6290d630") {

        finalresult = HemmableCheck(Style);
        log.info(finalresult);

    }
}

if (objectType == "SKU") {
    var Style = node.getParent().getParent();
    var HemmableFlag = Style.getValue("a_Hemmable").getSimpleValue();
    var ParentID = Style.getParent().getParent().getParent().getParent().getParent().getID();
    if (HemmableFlag == "Yes" && ParentID == "220aeb50-7748-49eb-91a7-c70d6290d630") {
        finalresult = HemmableCheck(Style);
    }
}

if (finalresult == true) {
    return true;
} else {
    return finalresult;
}


function HemmableCheck(node) {
    var errormsg = "The following attributes are missing for the below mentioned products:";
    var styleResult;
    var CCResult;
    var SKUResult;
    var SKUFinalResult=null;
    var CCFinalResult=null;
    var styleResult = mandatoryAttributeCheck(node, manager, "ag_Style_Hemmable_Attributes");
    if (styleResult != "" && styleResult != true) {
        styleResult = node.getName() + " : " + styleResult;
    }
    //log.info("styleResult=" + styleResult);
    var CC = node.getChildren().toArray();
    for (var i in CC) {
        var CCnode = CC[i];
        //log.info("CCnode=" + CCnode);
        var CCResult = mandatoryAttributeCheck(CCnode, manager, "ag_CC_Hemmable_Attributes");
        if (CCResult != "" && CCResult != true) {
            if (CCFinalResult == null) {
                CCFinalResult = CCnode.getName() + " : " + CCResult;
            } else {
                CCFinalResult = CCFinalResult + "\n" + CCnode.getName() + " : " + CCResult;
            }
        }
        var SKU = CCnode.getChildren().toArray();
        for (var j in SKU) {
            var SKUnode = SKU[j];
            //log.info("SKUnode=" + SKUnode.getName());
            var SKUResult = mandatoryAttributeCheck(SKUnode, manager, "ag_SKU_Hemmable_Attributes");
            //log.info("SKUResult=" + SKUResult);            
            if (SKUResult != "" && SKUResult != true) {
            	//log.info("SKUnode=" + SKUnode.getName());
            	// log.info("SKUResult=" + SKUResult); 
                if (SKUFinalResult == null) {
                    SKUFinalResult = SKUnode.getName() + " : " + SKUResult;
                    //log.info("SKUFinalResult1="+SKUFinalResult);
                } else {
                    SKUFinalResult = SKUFinalResult + "\n" + SKUnode.getName() + " : " + SKUResult;
                    //log.info("SKUFinalResult2="+SKUFinalResult);
                }
            }

        }
     log.info("SKUFinalResult2="+SKUFinalResult); 
    }
   
    if ((styleResult == true) && (CCFinalResult == null) && (SKUFinalResult == null)) {
        return true;
    } else {
        if (styleResult != "" && styleResult != true) {
            errormsg = errormsg + "\n" + styleResult;
        }
        if (CCFinalResult != "" && CCFinalResult != true && CCFinalResult != null) {
            errormsg = errormsg + "\n" + CCFinalResult;
        }
       
         //log.info("SKUFinalResult="+SKUFinalResult);
        if (SKUFinalResult != "" && SKUFinalResult != true && SKUFinalResult != null) {
            errormsg = errormsg + "\n" + SKUFinalResult;
        }
         log.info("errormsg="+errormsg);
        return errormsg;
    }
}



function mandatoryAttributeCheck(node, manager, attrGroup) {
    var emptyAttributes = [];
    var attributeGroup = manager.getAttributeGroupHome().getAttributeGroupByID(attrGroup);
    //log.info("attributeGroup="+attributeGroup);
    var attributeList = attributeGroup.getAllAttributes().toArray();
    //log.info("attributeList="+attributeList);
    for (var i in attributeList) {
        var attrID = attributeList[i].getID();
        //log.info("attrID="+attrID);
        var attrVal = node.getValue(attrID).getSimpleValue();
        if (attrVal == null || attrVal == '') {
            emptyAttributes.push(attributeList[i].getName());
        }
    }

    if (emptyAttributes.length == 0) {
        return true;
    } else {
        return emptyAttributes.join(', ');
    }
}
}