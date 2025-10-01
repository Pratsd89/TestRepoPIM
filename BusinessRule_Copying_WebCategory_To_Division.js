/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "Copying_WebCategory_To_Division",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Copying WebCategory To Division",
  "description" : "Drives WebUI Copy Category Button on CategoryList_Screen. Copies WebCategories, WebSubCategories and SubProducts under each selected WebDivision",
  "scope" : "Global",
  "validObjectTypes" : [ "WebDivision" ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "GlobalUtilLibrary",
    "libraryAlias" : "utilLib"
  } ]
}
*/
/*===== business rule plugin definition =====
{
  "pluginId" : "JavaScriptBusinessActionWithBinds",
  "binds" : [ {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "SORT_ORDER_BUFFER",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "br_Web_Hierarchy_Sort_Order_Buffer",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "categoryName",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Category_Description",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,web,LKT,SORT_ORDER_BUFFER,qh,categoryName,utilLib) {
function copyAttributeValues(attributeGroup, source, target) {
    //attributes to copy from attribute group
   log.info("this is beginning of copying "+target.getID());
   setSeoNonIndexable(target);
   var attributeGroup = step.getAttributeGroupHome().getAttributeGroupByID(attributeGroup);
    var attributeList = attributeGroup.getAttributes().toArray();

    attributeList.forEach(function(attr) {
        if(attr.getID() !='a_SEO_Page_Title' && attr.getID() !='a_SEO_Meta_Description'  ){
    	
        //get value from source
        var attrVal = source.getValue(attr.getID()).getSimpleValue();

        displayLog.push("\n <-- Getting value for <b>" + attr.getID() + "</b>. Value is <b>" + attrVal + "</b>");

        //set value on target
        target.getValue(attr.getID()).setSimpleValue(attrVal);

        displayLog.push("\n --> Setting value <b>" + attr.getID() + "</b> on target to <b>" + attrVal + "</b>");
        }
    });
}



function getBrandNumber(category) {
    //get category object type
    var type = category.getObjectType().getID();
    displayLog.push("\n - Category Object Type is: " + type);

    //get parent
    var parent = category.getParent();

    //get parent object type
    var parentType = parent.getObjectType().getID();
    displayLog.push("\n - First Parent Object Type is: " + parentType);

    //if category object type is WebCategory || WebSubCategory || WebDivision
    if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
        //then keep getting parent until type is WebBU
        while (parentType != "WebBU") {
            parent = parent.getParent();

            parentType = parent.getObjectType().getID();
        }
        displayLog.push("\n - Final Parent Found. Object Type is: " + parentType + ".\n<-- Getting Brand Number...");

        //get a_Brand_Number
        var brandNum = parent.getValue("a_Brand_Number").getSimpleValue();
    }

    //else get Brand Number
    else {
        displayLog.push("\n<-- Getting Brand Number...");
        var brandNum = category.getValue("a_Brand_Number").getSimpleValue();
    }

    displayLog.push("\n - Brand Number is: " + brandNum);
    return brandNum;
}

function getChannelNumber(category) {
    //get category object type
    var type = category.getObjectType().getID();
    displayLog.push("\n - Category Object Type is: " + type);

    //get parent
    var parent = category.getParent();

    //get parent object type
    var parentType = parent.getObjectType().getID();
    displayLog.push("\n - First Parent Object Type is: " + parentType);

    //if category object type is WebCategory || WebSubCategory || WebDivision
    if (type == "WebCategory" || type == "WebSubCategory" || type == "WebDivision") {
        //then keep getting parent until type is WebBU
        while (parentType != "WebBU") {
            parent = parent.getParent();

            parentType = parent.getObjectType().getID();
        }
        displayLog.push("\n - Final Parent Found. Object Type is: " + parentType + ".\n<-- Getting Channel Number...");

        //get a_Channel_Number
        var channelNum = parent.getValue("a_Channel_Number").getSimpleValue();
    }

    //else a_Channel_Number
    else {
        displayLog.push("\n<-- Getting Channel Number...");
        var channelNum = category.getValue("a_Channel_Number").getSimpleValue();
    }

    displayLog.push("\n - Channel Number is: " + channelNum);
    return channelNum;
}

function APICallToCopyProducts(channelNumber, copySource, copyTarget, market) {
    var fromCategoryId = copySource.getValue("a_WebCategory_CID").getSimpleValue();
    var toCategoryId = copyTarget.getValue("a_WebCategory_CID").getSimpleValue();
    var bmcId = brandNumber + "-" + market + "-" + channelNumber;
    var url = new java.net.URL("https://api.gap.com/commerce/pim/data-governance/core/categories/copy");
    var conn = url.openConnection();
    conn.setDoOutput(true);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/json");
    conn.setRequestProperty("apikey", "tn23uGq0bWOdbxCAKXju1u2GGseATTvn");
    conn.setRequestProperty("env", "prod");
    var input = new java.lang.String("{\"bmcId\":\"" + bmcId +
        "\",\"fromCategoryId\":\"" + fromCategoryId +
        "\",\"toCategoryId\":\"" + toCategoryId +
        "\"}");
    log.info(input);
    var os = conn.getOutputStream();
    os.write(input.getBytes());
    os.flush();
    os.close();
    if (conn.getResponseCode() != java.net.HttpURLConnection.HTTP_OK) {
        log.info("Failed : HTTP error code : " + conn.getResponseCode());
    }
    displayLog.push("\n<b style='color:Blue;'> Invoked DGL API to copy products of source category to copy category </b>");
}

/*
    RULE STARTS HERE
*/

//get todays date
var today = new java.time.ZonedDateTime.now();

//array for webUI log messages
var displayLog = new Array();
var warningMsg = new Array();

//get selected categories
var selected = web.getSelection().iterator();

//for each category
while (selected.hasNext()) {
    //current selected category
    var Context = step.getCurrentContext().getID();
    var cat = selected.next();
    var catCID = cat.getValue("a_WebCategory_CID").getSimpleValue();
    var catBrand = cat.getValue("a_Brand_Number").getSimpleValue();
    //get children of current selected category
    var children = cat.getChildren().iterator();

    //get Divisions or Categories from picker(target/selected Node)
    var pickerClass = web.getSelectedSetOfNodes().iterator();

    //for each picker(target) class
    while (pickerClass.hasNext()) {
        //current picker division
        var div = pickerClass.next();
        var divCID = div.getValue("a_WebCategory_CID").getSimpleValue();
        var divStart = div.getValue("a_WebCategory_Start_Date").getSimpleValue();
        var divEnd = div.getValue("a_WebCategory_End_Date").getSimpleValue();
        var PickedBrand = div.getValue("a_Brand_Number").getSimpleValue();
        var targetObjectType = div.getObjectType().getID(); // Check the Object Type of target from Selected nodes
        if (catBrand != PickedBrand) {
            warningMsg.push("\nCopy was not performed for " + catCID + ", as the selected Divison (" + divCID + ") is in different Brand. Please select same brand Web Divison");
        }
        if (divStart == null || divEnd < today) {
            if (targetObjectType == "Web Division")
                warningMsg.push("\nCopy was not performed for " + catCID + ", as the selected Web Division (" + divCID + ") is not active in the current market. Please adjust start/end date of the parent Web Division before copying categories.");
            else if (targetObjectType == "Web Category") /* PPIM-6165 - Added condition if Target is WebCategory */
                warningMsg.push("\nCopy was not performed for " + catCID + ", as the selected Web Category (" + divCID + ") is not active in the current market. Please adjust start/end date of the parent Web Category before copying categories.");
        } else {
            //source = category
            var source = cat;

            //identify inactive mkts for each selected Division
            var inactiveMkts = null;

            //target = divison
            var target = div;

            //recurse exit conditions
            var recurse = true;
            var recurCount = 0;

            var fixSortOrder = false;
            var copyTarget = null;
            var executed = 0
            while (recurse) {
                //get object type of source
                var sourceObjectType = source.getObjectType().getID();
			log.info("at start target object type " + targetObjectType+" source object type "+ sourceObjectType)
                /* PPIM-6165 Create Classification based on Target Node Selected from UI */
                var copyTarget = null
                var isClassificationCreated = false
                targetObjectType = target.getObjectType().getID();
                //If Target object type is WebCategory then create classification of Type WebSubCategory iff source Category doesn't have child objects(Web Sub Categories)
                if (executed == 0 && targetObjectType == "WebCategory") {
                    //check if source have child objects
                    var isLeafObject = true
                    var childObjects = source.getChildren()
                    if (childObjects) {
                        var childIterator = childObjects.iterator()
                        while (childIterator.hasNext()) {
                            isLeafObject = false
                            break;
                        }
                    }
                    if (isLeafObject) {
                        copyTarget = target.createClassification(
                            null,
                            "WebSubCategory"
                        );
                        isClassificationCreated = true
                    } else {
                        // Show Alert if WebCategory have Sub Categories within it
                        warningMsg.push("\n Either Web Category should not contain Child objects to allow copy within Web Category. (or) Web Category with Child objects should be copied to Web Division.")
                    }
                    executed = 1
                }
                // Create Classification of Type WebCategory if Selected Node(Target) is Web Division (existing behaviour)
                else {
                	log.info(" inside else target object type " + targetObjectType+" source object type "+ sourceObjectType)
                	//web.showAlert("WARNING", "<b>ALERT: target object type " + targetObjectType+" source object type "+ sourceObjectType + "</b>");
                    copyTarget = target.createClassification(
                        null,
                        sourceObjectType
                    );
                    isClassificationCreated = true
                } /* PPIM-6165 logic ends here	*/

                // Perform existing functionality only if Classification created based on Target else terminate the loop
                if (isClassificationCreated) {
                    var updateParentSortOrders = false;

                    var channelNumber = getChannelNumber(source);

                    displayLog.push("\n<b style='color:Blue;'> + Created copy of source " + source.getID() + ". Copy ID is " + copyTarget.getID() + "</b>");
                    //get a_Brand_Number of parent of source
                    var brandNumber = getBrandNumber(source);

                    //copy values from source to copyTarget for all atts in ag_WebCat_Not_Dimension_Dependent_ATTs
                    copyAttributeValues("ag_WebCat_Not_Dimension_Dependent_ATTs", source, copyTarget);
					
                    //query a_Brand_Number against LKT_Brand_Number_to_Market
                    var markets = LKT.getLookupTableValue("LKT_Brand_Number_to_Market", brandNumber);
                    var marketsArray = [];

                    if (markets.contains(";")) {
                        //split on ";"
                        markets.split(";").forEach(function(mkt) {
                            marketsArray.push(mkt);
                        });
                    } else {
                        marketsArray.push(markets);
                    }

                    //for each market
                    marketsArray.forEach(function(mkt) {
                        displayLog.push("\n<-> Copying attributes in market: <b style='color:Green;'>" + mkt + "</b>");

                        step.executeInContext(mkt, function(manager) {
                            //get the current market from mkt
                            var currentMarket = LKT.getLookupTableValue("LKT_Context_to_Market", mkt);

                            //fetch context specific source
                            var mSource = manager.getClassificationHome().getClassificationByID(source.getID());

                            //fetch context specific target
                            var mTarget = manager.getClassificationHome().getClassificationByID(copyTarget.getID());

                            //get new Parent Object Type
                            var parentObjectType = mTarget.getParent().getObjectType().getID();

                            if (parentObjectType == "WebDivision" || parentObjectType == "WebCategory") {
                                var parentStartDate = mTarget.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                                var parentEndDate = mTarget.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();
                                var mSourceStart = mSource.getValue("a_WebCategory_Start_Date").getSimpleValue();
                                var mSourceEnd = mSource.getValue("a_WebCategory_End_Date").getSimpleValue();
                                var USCatActive = true;

                                //set variables if user moves active WebCat to inactive division
                                if (parentStartDate == null || parentEndDate < today) {
                                    if (inactiveMkts == null) {
                                        inactiveMkts = currentMarket;
                                    } else if (inactiveMkts.indexOf(currentMarket) == -1) {
                                        inactiveMkts = inactiveMkts + ";" + currentMarket;
                                    }

                                    mTarget.getValue("a_WebCategory_Sort_Order").setValue("999999");
                                } else {
                                    if (mkt != "EN_US") {
                                        // determine if cat is active in US
                                        var inheritAtt = "a_" + currentMarket + "_Inherit_Option";
                                        var parentInheritOption = mTarget.getValue(inheritAtt).getSimpleValue();

                                        if (parentInheritOption == "Attributes & Sort Order") {
                                            manager.executeInContext("EN_US", function(man) {
                                                var USSource = man.getClassificationHome().getClassificationByID(mSource.getID());

                                                var USStart = USSource.getValue("a_WebCategory_Start_Date").getSimpleValue();
                                                var USEnd = USSource.getValue("a_WebCategory_End_Date").getSimpleValue();

                                                if (USStart == null || USEnd < today) {
                                                    USCatActive = false;
                                                }
                                            });
                                        }

                                        if (mSourceStart != null && mSourceEnd == null || mSourceStart != null && mSourceEnd > today) {
                                            if (USCatActive == false) {
                                                mTarget.getValue("a_Exclude_from_US_Sort_Inherit").setSimpleValue("Yes");

                                                mTarget.getValue("a_WebCategory_Sort_Order").setValue("1");

                                                fixSortOrder = true;
                                            } else {
                                                mTarget.getValue("a_WebCategory_Sort_Order").setValue("1");

                                                fixSortOrder = true;
                                            }
                                        } else {
                                            mTarget.getValue("a_WebCategory_Sort_Order").setValue("999999");
                                        }
                                    } else {
                                        if (mSourceStart != null && mSourceEnd == null || mSourceStart != null && mSourceEnd > today) {
                                            //set variables if user moves active WebCat to inactive division
                                            if (parentStartDate == null || parentEndDate < today) {
                                                if (inactiveMkts == null) {
                                                    inactiveMkts = currentMarket;
                                                } else if (inactiveMkts.indexOf(currentMarket) == -1) {
                                                    inactiveMkts = inactiveMkts + ";" + currentMarket;
                                                }
                                            }

                                            mTarget.getValue("a_WebCategory_Sort_Order").setValue("1");

                                            fixSortOrder = true;
                                        } else {
                                            mTarget.getValue("a_WebCategory_Sort_Order").setValue("999999");
                                        }
                                    }
                                }
                            } else {
                                var mSourceSort = mSource.getValue("a_WebCategory_Sort_Order").getSimpleValue();

                                mTarget.getValue("a_WebCategory_Sort_Order").setValue(mSourceSort);
                            }

                            var webCategoryAssortmentType = mSource.getValue('a_WebCategory_Assortment_Type').getSimpleValue();

                            if (webCategoryAssortmentType == 'Manual') {
                                APICallToCopyProducts(channelNumber, mSource, mTarget, currentMarket);
                            }

                            //copy attribute values for ag_WebCat_Market_Dependent_ATTs in context
                            copyAttributeValues("ag_WebCat_Market_Dependent_ATTs", mSource, mTarget);
                            mTarget.getValue("a_Natural_Language_URL").setValue(null);
                            mTarget.getValue("a_Category_Slug").setValue(null);
                            mTarget.getValue("a_SubCategory_Slug").setValue(null);

                        });
                    });
                    //query a_Brand_Number of parent against LKT_Brand_Number_to_Context
                    var contexts = LKT.getLookupTableValue("LKT_Brand_Number_to_Context", brandNumber);
                    var contextsArray = [];

                    if (contexts.contains(";")) {
                        //split on ";"
                        contexts.split(";").forEach(function(ctx) {
                            contextsArray.push(ctx);
                        });
                    } else {
                        contextsArray.push(contexts);
                    }

                    //for each context
                    contextsArray.forEach(function(ctx) {
                        displayLog.push("\n<-> Copying attributes in context: <b style='color:Green'>" + ctx + "</b>");

                        step.executeInContext(ctx, function(manager) {
                            var mSource = manager.getClassificationHome().getClassificationByID(source.getID());

                            var mTarget = manager.getClassificationHome().getClassificationByID(copyTarget.getID());

                            var parentStartDate = mTarget.getParent().getValue("a_WebCategory_Start_Date").getSimpleValue();
                            var parentEndDate = mTarget.getParent().getValue("a_WebCategory_End_Date").getSimpleValue();

                            if (parentStartDate != null && parentEndDate == null || parentStartDate != null && parentEndDate > today) {
                                //copy attribute values for ag_WebCat_Market_Language_Dependent_ATTs in context
                                copyAttributeValues("ag_WebCat_Market_Language_Dependent_ATTs", mSource, mTarget);
                                mTarget.setName(mSource.getName());
                                
                                //PPIM-11877, PPIM-13846
                                //if copied within same parent, keep the name blank
                                if (mSource.getParent().getID() == mTarget.getParent().getID()){
                            	      mTarget.getValue("a_Category_Description").setSimpleValue(null);
                            	      mTarget.setName(null);
                                }
                                else {
                                	if (checkUniqueName(mTarget) != true){//if copied within diff parent and the name is not unique, keep the name blank
                                	    mTarget.getValue("a_Category_Description").setSimpleValue(null);
                                	    mTarget.setName(null);
                                	}
                                }
                            }
                        });
                    });
              
                    //set a_main_last_modified_date on new category
                    var time = new java.util.Date();
                    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    displayLog.push("\n--> Setting a_main_last_modified_date on <b>" + copyTarget.getID() + "</b>");

                    copyTarget.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));

                    //keep recursing if more children
                    if (children.hasNext()) {
                        //new source is next child
                        source = children.next();
                        displayLog.push("\n--> Setting source to <b style='color:Green;'>" + source.getID() + "</b>");

                        //make sure we keep copying under the same target
                        if (target.getObjectType().getID() == "WebDivision") {
                            target = copyTarget;
                            displayLog.push("\n--> Setting target to <b style='color:Green;'>" + target.getID() + "</b>");
                        }

                        //increment recur count
                        recurCount++;

                        //infinite loop failsafe
                        if (recurCount > 100) {
                            displayLog.push("\n<b style='color:Red;'>*** Exiting recursion due to timeout</b>");
                            recurse = false;
                        }
                    }
                    //if no more children
                    else {
                        //stop recursing
                        recurse = false;

                        //remake iterator for next loop
                        var children = cat.getChildren().iterator();
                    }

                    //build warning msg to alert user of inactve divisions
                    if (inactiveMkts != null) {
                        var copyTargetCID = copyTarget.getValue("a_WebCategory_CID").getSimpleValue();
                        if (targetObjectType == "Web Category") /* PPIM-6165 - Added condition if Target is WebCategory */
                            warningMsg.push("\nThe copied Web Sub Category with CID" + copyTargetCID + " was not copied in market(s) " + inactiveMkts + ", as the selected Web Category (" + divCID + ") is not active in Market(s) " + inactiveMkts + ".");
                        else if (targetObjectType == "Web Division")
                            warningMsg.push("\nThe copied Web Category with CID" + copyTargetCID + " was not copied in market(s) " + inactiveMkts + ", as the selected Web Division (" + divCID + ") is not active in Market(s) " + inactiveMkts + ".");
                    }
                } else {
                    recurse = false;
                }
            }

            // run BR
            if (fixSortOrder == true) {
                SORT_ORDER_BUFFER.execute(div);
            }
        }
    }    
    
}
if (warningMsg.length > 0) {
    web.showAlert("WARNING", "<b>ALERT: " + warningMsg + "</b>");
}
// added to set the value for the SEO page index tag attribute 
	
function getContextSpecificObject(object, context)
	{
		var contextSpecificObject = "";
		contextSpecificObject = step.executeInContext(context, function(specificManager) {
				var ObjectinContext =  specificManager.getObjectFromOtherManager(object);
				if (ObjectinContext != "undefined" && ObjectinContext !=  null  ){
				 return ObjectinContext; }
			});		
			return contextSpecificObject ;
	}

function setValuesAcrossContexts(nodeObject){
		
		var currentContext=step.getCurrentContext().getID();
		if(currentContext == "EN_US")
		{
		var en_CAObject = getContextSpecificObject(nodeObject,"EN_CA");
		var fr_CAObject = getContextSpecificObject(nodeObject,"FR_CA");
		setValuesForChildern(nodeObject);
		setValuesForChildern(en_CAObject);
		setValuesForChildern(fr_CAObject);
		}
		else if (currentContext == "EN_CA"){
	
		var fr_CAObject = getContextSpecificObject(nodeObject,"FR_CA");
		var en_USObject = getContextSpecificObject(nodeObject,"EN_US");
		setValuesForChildern(nodeObject);
		setValuesForChildern(fr_CAObject);
		setValuesForChildern(en_USObject);
		}
}

function setValuesForChildern (nodeObject)
{
		var objectTypeName = nodeObject.getObjectType().getName();
		if(objectTypeName == "Web Category"  || objectTypeName == "Web Sub Category" ){
		log.info("setSeoNonIndexable in setValuesForChildern  "   +objectTypeName);
		nodeObject.getValue("a_SEO_Non_Indexable").setSimpleValue("Index");
		nodeObject.getValue("a_Old_SEO_Non_Indexable").setSimpleValue("");
		
		}
}

	
function setSeoNonIndexable(nodeObject)
{
		var objectTypeName = nodeObject.getObjectType().getName();
		log.info("setSeoNonIndexable in setSeoNonIndexable  "   +objectTypeName);
		if (objectTypeName == "Web Category" || objectTypeName == "Web Sub Category")
		{
			//var webCtyChildren  =  nodeObject.getChildren();
			setValuesAcrossContexts(nodeObject);	
		}
}


function checkUniqueName(nodeToCheck) {
    var c = com.stibo.query.condition.Conditions;
    var objType = nodeToCheck.getObjectType();
    var nameToCheck = nodeToCheck.getValue("a_Category_Description").getSimpleValue();
    var nodeParent = nodeToCheck.getParent();
    if (nameToCheck != null) {
        var query = qh.queryFor(com.stibo.core.domain.Classification).where(c.objectType(objType).and(c.hierarchy().simpleBelow(nodeParent)).and(c.valueOf(categoryName).ignoreCase().eq(nameToCheck)));
        var resList = query.execute().asList(100000);
        var resSize = resList.size();
        if (resSize > 1) { //found multiple records with same name
            return false;
        }
    }
    return true;
}
//final display message. comment out line when not in development
//web.showAlert("Warning", "Selected Nodes:", displayLog);
}