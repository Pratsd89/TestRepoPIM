/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_MVGSmartsheetCondition",
  "type" : "BusinessCondition",
  "setupGroups" : [ "GlobalBusinessRulesRoot" ],
  "name" : "br_MVGSmartsheetCondition",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "MultiVariantGroup" ],
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
  }, {
    "contract" : "DataIssuesContextBind",
    "alias" : "dataIssues",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "MultiVariant_Group_Reference",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  }, {
    "contract" : "ClassificationProductLinkTypeBindContract",
    "alias" : "PPHToMVGTemplate",
    "parameterClass" : "com.stibo.core.domain.impl.ClassificationProductLinkTypeImpl",
    "value" : "PPHToMVGTemplate",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,dataIssues,MultiVariant_Group_Reference,PPHToMVGTemplate) {
var error = null;
var StyleBrand = null;
var TemplateBrand = null;
var currentID = node.getID();
var time_product = new java.util.Date();
var iso_product = new java.text.SimpleDateFormat("yyyy-MM-dd");
var todayDate = iso_product.format(time_product);
//log.info(todayDate);

var Attributes = ["a_Color_Display", "a_Product_Grouping_End_Date", "a_Product_Grouping_Start_date", "a_Start_Time"];
for (var i in Attributes) {
    var value = node.getValue(Attributes[i]).getSimpleValue();
    if (value == null) {
        var attr = manager.getAttributeHome().getAttributeByID(Attributes[i]);
        var attrName = attr.getName();
        error = addError(error, attrName + " is Mandatory");
        dataIssues.addError(attrName + " is Mandatory", node, attr);
    }
}

var MVGTemplate = node.queryClassificationProductLinks(PPHToMVGTemplate).asList(10).toArray();
for (var i in MVGTemplate) {
    var Template = MVGTemplate[i].getClassification();
    var TemplateParent = Template.getParent().getID();
    //log.info(TemplateParent);
    var TemplateParent = TemplateParent.split("_");
    TemplateBrand = TemplateParent[1];
}


var Style = node.queryReferences(MultiVariant_Group_Reference).asList(1000).toArray();

for (var t in Style) {

    var StyleObj = Style[t].getTarget();
    var StyleID = Style[t].getTarget().getID();
    //log.info(StyleID);

    var StyleBrand = StyleObj.getValue("a_Brand_Number").getSimpleValue();
    //log.info(StyleBrand);
    if (StyleBrand != TemplateBrand) {
        error = addError(error, "Style :" + StyleID + " has a different brand of the selected MVG template");
    }


    var status = StyleObj.getValue("a_Style_Life_Cycle_Status").getSimpleValue();
    if (status == "Draft" || status == "Purged") {
        error = addError(error, "Style :" + StyleID + " with status Draft/Purged cannot be used to create MVG");
    }

    var MVGref = StyleObj.queryReferencedBy(MultiVariant_Group_Reference).asList(100).toArray();
    for (var a in MVGref) {
        var MVGID = MVGref[a].getSource().getID();
        if (currentID != MVGID) {
            error = addError(error, "The selected style " + StyleID + " already has a MVG");
        }
    }

    var DeactivationDate = StyleObj.getValue("a_Style_End_Date").getSimpleValue();

    if (DeactivationDate != null) {
        var DeactivationDate = new Date(DeactivationDate);
        var todayDate = new Date(todayDate);
        if (todayDate.getTime() > DeactivationDate.getTime()) {
            error = addError(error, "Deactivated Style " + StyleID + " cannot be used to create MVG");
        }

    }
}


for (var k = 0; k < Style.length - 1; k++) {
    var firstStyle = Style[k].getTarget();
    var firstStyleID = Style[k].getTarget().getID();
    var Brand = firstStyle.getValue("a_Brand_Number").getSimpleValue();
    var Division = firstStyle.getValue("a_Division_Number").getSimpleValue();
    var firstParentID = Brand + "_" + Division + "_MultiVariantGroups";
    for (var j = k + 1; j < Style.length; j++) {
        var secondStyle = Style[j].getTarget();
        var secondStyleID = Style[j].getTarget().getID();
        //log.info(secondStyle);
        var Second_Brand = secondStyle.getValue("a_Brand_Number").getSimpleValue();
        //log.info(Brand);
        var Second_Division = secondStyle.getValue("a_Division_Number").getSimpleValue();
        var Second_ParentID = Second_Brand + "_" + Second_Division + "_MultiVariantGroups";
        if (firstParentID != Second_ParentID) {
            error = addError(error, "The Styles " + firstStyleID + " , " + secondStyleID + " doesn't have same brand and same division number");
        }
    }


}


if (Style.length == 0) {
    error = addError(error, "Please select atleast select one style to create MVG");
}

if (MVGTemplate.length == 0) {
    error = addError(error, "Please select atleast one template to create MVG");
}

if (error == null) {
    return true;
} else {
    //return dataIssues;
    return error;
};


function addError(error, message) {

    if (error == null) {
        error = message;
    } else {
        error = error + "\n" + message;
    }
    return error;
}
}