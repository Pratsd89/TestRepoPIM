/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_setObjectName",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Set Name",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "CMS_Slot", "Class", "CustomerServiceCategory", "CustomerServiceHome", "Department", "Division", "NonProductCategory", "SKU", "SubClass", "WebCategory", "WebDivision", "WebSubCategory" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "global"
  }, {
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "br_Append_StartDate_EndDate",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Append_StartDate_EndDate",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,br_Append_StartDate_EndDate,global,helper) {
function updateName(node, name) {
    if (name.length > 100) {
        name = name.substring(0, 100);
    }
    return name;
}
//PPIM-2433 : SET NAME IN EACH CONTEXT
function othercontext(node, contextID) {
    manager.executeInContext(contextID, function(otherManager) {
        var otherNode = otherManager.getObjectFromOtherManager(node);
        if (node.getObjectType().getID() == "Division") {
            var namecontext = otherNode.getValue("a_Division_Description").getSimpleValue() + "-" + otherNode.getValue("a_Division_Number").getSimpleValue();
            namecontext = checkName(namecontext);
            var nametrim = namecontext.trim();
            if (otherNode.getName() != nametrim) {
                nametrim = updateName(otherNode, nametrim);
            }
            otherNode.setName(nametrim);
            //log.info("context" + nametrim)
        } else if (node.getObjectType().getID() == "Department") {
            var namecontext = otherNode.getValue("a_Department_Description").getSimpleValue() + "-" + otherNode.getValue("a_Department_Number").getSimpleValue();
            namecontext = checkName(namecontext);
            var nametrim = namecontext.trim();
            if (otherNode.getName() != nametrim) {
                nametrim = updateName(otherNode, nametrim);
            }
            otherNode.setName(nametrim);
            //log.info("context" + nametrim)
        } else if (node.getObjectType().getID() == "Class") {
            var namecontext = otherNode.getValue("a_Class_Description").getSimpleValue() + "-" + otherNode.getValue("a_Class_Number").getSimpleValue();
            namecontext = checkName(namecontext);
            var nametrim = namecontext.trim();
            if (otherNode.getName() != nametrim) {
                nametrim = updateName(otherNode, nametrim);
            }
            otherNode.setName(nametrim);
            //log.info("context" + nametrim)
        } else if (node.getObjectType().getID() == "SubClass") {
            var namecontext = otherNode.getValue("a_SubClass_Description").getSimpleValue() + "-" + otherNode.getValue("a_SubClass_Number").getSimpleValue();
            namecontext = checkName(namecontext);
            var nametrim = namecontext.trim();
            if (otherNode.getName() != nametrim) {
                nametrim = updateName(otherNode, nametrim);
            }
            otherNode.setName(nametrim);
            //log.info("context" + nametrim)
        } else if (node.getObjectType().getID() == "SKU") {
            // PPIM-2719 - ignore Non-Merch SKU in this rule
            var merchType = otherNode.getParent().getParent().getValue("a_product_merch_type").getSimpleValue();
            if (merchType == "COMPLIMENTARY GIFT BOXES" ||
                merchType == "GIFTS" ||
                merchType == "MONOGRAM SERVICE" ||
                merchType == "PREMIUM GIFT BOXES" ||
                merchType == "PREMIUM GIFT BOXES SVC" ||
                merchType == "STORED VALUE CARDS FIXED" ||
                merchType == "STORED VALUE CARDS FIXED OPTIONS" ||
                merchType == "STORED VALUE CARDS OPEN") {
                log.info("Non-Merch SKU. Set Name ignored.");
            } else {
                // 10292020 Vimal: Remove updates to Size Dim1 and Dim2 description attributes on SKU. PPIM-3306
                // Set name directly from Size code
                helper.setSKUNameFromSizeCode(otherNode, otherManager);

                /*
                var namecontext = otherNode.getValue("a_Size_Dim1_Description").getSimpleValue() + "-" + otherNode.getValue("a_Size_Dim2_Description").getSimpleValue() + "-" + otherNode.getValue("a_SKU_Variant").getSimpleValue();
                namecontext = checkName(namecontext); 
                var nametrim = namecontext.trim();
                if (otherNode.getName() != nametrim) 
                	{		
                	 nametrim= updateName(otherNode,nametrim);
                	}
                	otherNode.setName(nametrim);
                	//log.info("context" + nametrim)	
                	*/
            }
        } else if (node.getObjectType().getID() == "WebCategory" || node.getObjectType().getID() == "WebDivision" ||
            node.getObjectType().getID() == "WebSubCategory" || node.getObjectType().getID() == "CustomerServiceHome" ||
            node.getObjectType().getID() == "CustomerServiceCategory" || node.getObjectType().getID() == "NonProductCategory") {
            br_Append_StartDate_EndDate.execute(node)
        }

        //PPIM-6055 Copy name from FR_CA context to EN_CA context for categories/subcategories and vice-versa
        if (contextID == "FR_CA" && otherNode.getValue("a_Category_Description").getSimpleValue() != null) {
            var frNode = otherManager.getClassificationHome().getClassificationByID(otherNode.getID());
            var frAttributeValue = otherNode.getValue("a_Category_Description").getSimpleValue();
            otherManager.executeInContext("EN_CA", function(toContextManager) {
                var toNode = toContextManager.getClassificationHome().getClassificationByID(frNode.getID());
                if (toNode.getValue("a_Category_Description").getSimpleValue() == null) {
                    //toNode.getValue("a_Category_Description").setSimpleValue(frAttributeValue);
                }
            });
        } else if (contextID == "EN_CA" && otherNode.getValue("a_Category_Description").getSimpleValue() != null) {
            var frNode = otherManager.getClassificationHome().getClassificationByID(otherNode.getID());
            var frAttributeValue = otherNode.getValue("a_Category_Description").getSimpleValue();
            otherManager.executeInContext("FR_CA", function(toContextManager) {
                var toNode = toContextManager.getClassificationHome().getClassificationByID(frNode.getID());
                if (toNode.getValue("a_Category_Description").getSimpleValue() == null) {
                    //toNode.getValue("a_Category_Description").setSimpleValue(frAttributeValue);
                }
            });
        }
        //Copy name from EN_JP context to JA_JP context for categories/subcategories and vice-versa
        if (contextID == "JA_JP" && otherNode.getValue("a_Category_Description").getSimpleValue() != null) {
            var jpNode = otherManager.getClassificationHome().getClassificationByID(otherNode.getID());
            var jpAttributeValue = otherNode.getValue("a_Category_Description").getSimpleValue();
            otherManager.executeInContext("EN_JP", function(toContextManager) {
                var toNode = toContextManager.getClassificationHome().getClassificationByID(jpNode.getID());
                if (toNode.getValue("a_Category_Description").getSimpleValue() == null) {
                    //toNode.getValue("a_Category_Description").setSimpleValue(jpAttributeValue); //PPIM-13502
                }
            });
        } else if (contextID == "EN_JP" && otherNode.getValue("a_Category_Description").getSimpleValue() != null) {
            var jpNode = otherManager.getClassificationHome().getClassificationByID(otherNode.getID());
            var jpAttributeValue = otherNode.getValue("a_Category_Description").getSimpleValue();
            otherManager.executeInContext("JA_JP", function(toContextManager) {
                var toNode = toContextManager.getClassificationHome().getClassificationByID(jpNode.getID());
                if (toNode.getValue("a_Category_Description").getSimpleValue() == null) {
                    //toNode.getValue("a_Category_Description").setSimpleValue(jpAttributeValue); //PPIM-13502
                }
            });
        }

        /*
        	var frID = otherNode.getID();
        	otherManager.executeInContext("EN_CA", function (caManager) {
        		var caNode = otherManager.getObjectFromOtherManager(otherNode);
        		var caID = caNode.getID();
        		
        		
        		var time = new java.util.Date();
        		var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        		
        		caManager.executeInContext("FR_CA", function(newContext){
        			
        			var source = newContext.getClassificationHome().getClassificationByID(frID);
        			var target = newContext.getClassificationHome().getClassificationByID(caID);		
        			
        			target.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
        			//target.setName(source.getName());
        			target.setName("TestVal");
        			
        			var attributeGroup = caManager.getAttributeGroupHome().getAttributeGroupByID("ag_Web_Category_Attributes");
        				var attNameList = attributeGroup.getAttributes().toArray();
        											log.info("nametrim = " + otherNode.getName() + " ContextID: " + contextID);	
        			log.info("frID = " + source + " caID: " + target);			  		
        				for (x in attNameList) {
        					var sourceValue = source.getValue(attNameList[x].getID()).getSimpleValue();   			
        					if(sourceValue != null){
        						log.info("attribute: " + x + " sourceValue: " + sourceValue + " targetValue: " + target.getValue(attNameList[x].getID()).getSimpleValue());  
        						target.getValue(attNameList[x].getID()).setSimpleValue(sourceValue);
        					}			
        			}	
        		})
        	}) */
    })
}

try {
    var parentID;
    //othercontext required when object type has Language dependency && parent node is not ON_Non-Merch_Division
    if (node.getObjectType().getID() == "Division" || node.getObjectType().getID() == "Department" || node.getObjectType().getID() == "Class" || node.getObjectType().getID() == "SubClass") {
        var brandNumber = node.getValue("a_Brand_Number").getSimpleValue();
        var parentIDCheckValue = brandNumber + "_Non-Merch_Division";
        //excluding non-merch heirarchy as per PPIM-3820
        if (node.getObjectType().getID() == "SubClass") {
            parentID = node.getParent().getParent().getParent().getID();
        }
        if (node.getObjectType().getID() == "Class") {
            parentID = node.getParent().getParent().getID();
        }
        if (node.getObjectType().getID() == "Department") {
            parentID = node.getParent().getID();
        }
        if (node.getObjectType().getID() == "Division") {
            parentID = node.getID();
        }

        if (parentID != parentIDCheckValue) {
            othercontext(node, "EN_US");
            othercontext(node, "FR_CA");
            othercontext(node, "JA_JP");
        }

    }
    //othercontext required when object type has Market & Language dependency && parent node is not ON_Non-Merch_Division
    else if (node.getObjectType().getID() == "SKU") {
        var brandNumber = node.getValue("a_Brand_Number").getSimpleValue();
        var parentIDCheckValue = brandNumber + "_Non-Merch_Division";
        //excluding non-merch heirarchy as per PPIM-3820
        // Added EN_SA as per PPIM-10485
        parentID = node.getParent().getParent().getParent().getParent().getParent().getParent().getID();
        if (parentID != parentIDCheckValue) {
            othercontext(node, "EN_US");
            othercontext(node, "EN_SA");
            othercontext(node, "EN_CA");
            othercontext(node, "FR_CA");
            othercontext(node, "EN_JP");
            othercontext(node, "JA_JP");
        }

    }
    //othercontext required when object type has Language dependency
    else if (node.getObjectType().getID() == "WebDivision" || node.getObjectType().getID() == "CustomerServiceHome") {
        othercontext(node, "EN_US");
        othercontext(node, "FR_CA");
        othercontext(node, "JA_JP");

    }
    //othercontext required when object type has Market & Language dependency
    else if (node.getObjectType().getID() == "WebCategory" || node.getObjectType().getID() == "WebSubCategory" || node.getObjectType().getID() == "CustomerServiceCategory" || node.getObjectType().getID() == "NonProductCategory") {
        othercontext(node, "EN_US");
        othercontext(node, "EN_CA");
        othercontext(node, "FR_CA");
        othercontext(node, "EN_JP");
        othercontext(node, "JA_JP");

    }
    else if(node.getObjectType().getID() == "CMS_Slot" )
    {
    	var slotID = node.getValue("a_Slot_ID").getSimpleValue();
	var name = "Slot "+slotID;
	if (slotID != null)
		{
		node.setName(name);
		}
    }
} catch (e) {
    //logger.info(e);
    logger.info("Set STEP Name Event Processor Failed for ID : " + node.getID());
}



function checkName(valstr) {

    var tokens = valstr.split("-");
    var filterName = "";

    for (i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (token != "null") {
            filterName += token;
            if (i < tokens.length - 1)
                filterName += "-";
        }

    }
    if (filterName == "")
        filterName = "(" + node.getID().toString() + ")";
    //log.info(filterName)
    return filterName;
}
}