/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Web Hierarchy Approval Code_sugu",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Web Hierarchy Approval Code_sugu",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "WebCategory", "WebSubCategory" ],
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,stepManager) {
//Doing the style and CC Validation on the web catergory and sub-category
function referencecheck(node, contextID) {
    stepManager.executeInContext(contextID, function(otherManager) {
        var othernode = otherManager.getClassificationHome().getClassificationByID(node.getID());
        var webCategoryProductType = othernode.getValue('a_WebCategory_Product_Type').getSimpleValue();
        if (webCategoryProductType == 'Style') {
            var classification = otherManager.getClassificationHome().getClassificationByID(node.getID());
            var productsList = classification.getClassificationProductLinks().toArray();
            var classificationProductLinkType = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome).getLinkTypeByID('StyleToWebSubCategoryRef');
            for (var k = 0; k < productsList.length; k++) {
                var objectType = productsList[k].getProduct().getObjectType().getID();
                if (objectType == 'CustomerChoice') {
                    var parentStyle = productsList[k].getProduct().getParent();
                    try {
                        othernode.createClassificationProductLink(parentStyle, classificationProductLinkType);
                    } catch (e) {

                    }
                    productsList[k].delete();
                }
            }
        } else if (webCategoryProductType == 'CC') {
            var classification = otherManager.getClassificationHome().getClassificationByID(node.getID());
            var productsList = classification.getClassificationProductLinks().toArray();
            var classificationProductLinkType = stepManager.getHome(com.stibo.core.domain.classificationproductlinktype.ClassificationProductLinkTypeHome).getLinkTypeByID('StyleToWebSubCategoryRef');
            for (var k = 0; k < productsList.length; k++) {
                var objectType = productsList[k].getProduct().getObjectType().getID();
                if (objectType == 'Style') {
                    var childCCList = productsList[k].getProduct().getChildren().toArray();
                    for (var m = 0; m < childCCList.length; m++) {
                        var cc = childCCList[m];
                        try {
                            othernode.createClassificationProductLink(cc, classificationProductLinkType)
                        } catch (e) {

                        }
                    }
                    productsList[k].delete();
                }
            }
        }
    })
}

function approvalcheck(node, contextID) {
    stepManager.executeInContext(contextID, function(otherManager) {
        var othernode = otherManager.getClassificationHome().getClassificationByID(node.getID());
        //othernode.approve();
        var categoryStartDate = othernode.getValue('a_WebCategory_Start_Date').getSimpleValue();
        if (othernode.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate == null || categoryStartDate == '')) {
            othernode.approve();
            time = new java.util.Date();
            iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
            othernode.getValue('a_WebCategory_Start_Date').setSimpleValue(iso.format(time));
            stepManager.executeInContext('EN_CA', function(otherCAManager) {
                var otherCAnode = otherCAManager.getClassificationHome().getClassificationByID(node.getID());
                var categoryStartDate = otherCAnode.getValue('a_WebCategory_Start_Date').getSimpleValue();
                if (categoryStartDate == null || categoryStartDate == '') {
                    otherCAnode.getValue('a_WebCategory_Start_Date').setSimpleValue(iso.format(time));
                }
            })
        } else if (othernode.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate != null || categoryStartDate != '')) {
            othernode.approve();
        } else if (othernode.getApprovalStatus() != "Not in Approved workspace") {
            othernode.approve();
        }

    })
}


if (stepManager.getCurrentWorkspace().getID() == "Main") {
    //checking mandatory attributes
    var currentContext = stepManager.getCurrentContext().getID();
    var categoryDescription = node.getValue('a_Category_Description').getSimpleValue();
    var categoryStartDate = node.getValue('a_WebCategory_Start_Date').getSimpleValue();
    var categoryDisplayType = node.getValue('a_Category_Display_Type').getSimpleValue();

    //Below if condition is commented because of story-3025
    //if(categoryDescription == null || categoryDescription == '' || categoryDisplayType == null || categoryDisplayType == '' || categoryStartDate == null || categoryStartDate == '')
    if (categoryDescription == null || categoryDescription == '' || categoryDisplayType == null || categoryDisplayType == '') {
        throw 'Please fill the mandatory fields and try again.';
        //portal.showAlert("Error", null , "Please fill the mandatory fields and try again.");
    }



    //checking if a_Category_Display_Type == Standard:Core, then there should be atlease one product link with the category and subcategory
    var categoryDisplayType = node.getValue('a_Category_Display_Type').getSimpleValue();
    var oneProductExistFlag = false;
    if (categoryDisplayType == 'Standard: Core') {
        var classification = stepManager.getClassificationHome().getClassificationByID(node.getID());
        var productsList = classification.getClassificationProductLinks().toArray();
        for (var k = 0; k < productsList.length; k++) {
            var objectType = productsList[k].getProduct().getObjectType().getID();
            if (objectType == 'CustomerChoice' || objectType == 'Style') {
                oneProductExistFlag = true;
            }
        }
        if (oneProductExistFlag == false) {
            //throw 'There is no assigned Style or CC with this category. Please add atleast one and try again';
            //portal.showAlert("Warning", null, "Warning : For Category Display Type Standard: Core, please ensure there are products (Style/CC) are assigned to it. In case of missing product list, the Web Category/ Web Sub Category will not display in Site");
        }
    }

    //copying US attributes to CA and FR
    if ((categoryDisplayType == 'Standard: Core' && oneProductExistFlag == true) || (categoryDisplayType != 'Standard: Core' && oneProductExistFlag == false)) {
        var inheritValue = node.getValue('a_WebCategory_Inherit_US').getSimpleValue();
        var attributeGroup = stepManager.getAttributeGroupHome().getAttributeGroupByID("ag_Category_Copy_Attribute");
        var attributes = attributeGroup.getAttributes().toArray();

        if (inheritValue == 'Yes' && currentContext == "EN_US") {
            stepManager.executeInContext('EN_US', function(enContextManager) {
                var enClassification = enContextManager.getClassificationHome().getClassificationByID(node.getID());
                for (var i = 0; i < attributes.length; i++) {
                    var attributeId = attributes[i].getID();
                    var attributeValue = enClassification.getValue(attributeId).getSimpleValue();
                    stepManager.executeInContext('EN_CA', function(caContextManager) {
                        var caClassification = caContextManager.getClassificationHome().getClassificationByID(node.getID());
                        caClassification.getValue(attributeId).setSimpleValue(attributeValue);
                    })
                    stepManager.executeInContext('FR_CA', function(frContextManager) {
                        var frClassification = frContextManager.getClassificationHome().getClassificationByID(node.getID());
                        if (attributeId == "a_Category_Description") {
                            frClassification.getValue(attributeId).setSimpleValue(attributeValue);
                        } else {
                            //frClassification.getValue(attributeId).setSimpleValue(attributeValue);
                        }
                    })

                }
            });
        }

        //End of the copy code



        if (inheritValue == 'Yes' && currentContext == "EN_US") {
            referencecheck(node, "EN_US");
            referencecheck(node, "EN_CA");
            approvalcheck(node, "EN_US");
            approvalcheck(node, "EN_CA");
            approvalcheck(node, "FR_CA");
        } else if (inheritValue == 'Yes' && currentContext == "EN_CA") {
            //portal.showAlert("Error", null, "Approval needs to happen in US context.");
        } else if (inheritValue == 'Yes' && currentContext == "FR_CA") {
            //portal.showAlert("Error", null, "Approval needs to happen in US context.");
        } else if (inheritValue == 'No') {
            referencecheck(node, currentContext);
            //node.approve();
            if (node.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate == null || categoryStartDate == '')) {
                node.approve();
                time = new java.util.Date();
                iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
                node.getValue('a_WebCategory_Start_Date').setSimpleValue(iso.format(time));
            } else if (node.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate != null || categoryStartDate != '')) {
                node.approve();
            } else if (node.getApprovalStatus() != "Not in Approved workspace") {
                node.approve();
            }
        }
        /*else if (inheritValue == null || inheritValue == '')
        {
        	portal.showAlert("Warning", null , "Attribute 'Inherit Category Attributes from US' is a mandatory field for object approval.");
        }*/
    }
	else
	{
		referencecheck(node, currentContext);
		//node.approve();
		if (node.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate == null || categoryStartDate == '')) {
			node.approve();
			time = new java.util.Date();
			iso = new java.text.SimpleDateFormat("yyyy-MM-dd");
			node.getValue('a_WebCategory_Start_Date').setSimpleValue(iso.format(time));
		} else if (node.getApprovalStatus() == "Not in Approved workspace" && (categoryStartDate != null || categoryStartDate != '')) {
			node.approve();
		} else if (node.getApprovalStatus() != "Not in Approved workspace") {
			node.approve();
		}
	}
}
}