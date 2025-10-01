/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_fetch_mvg_initial_data",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_fetch_mvg_initial_data",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
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
    "contract" : "ReferenceTypeBindContract",
    "alias" : "mvgRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "MultiVariant_Group_Reference",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "smgRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_ProductGroups",
    "description" : null
  }, {
    "contract" : "ManagerBindContract",
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "divisionObjectType",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "MultiVariantGroupingsDivision",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "correspondingDivisionAttr",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_Corresponding_Division_ID",
    "description" : null
  }, {
    "contract" : "EntityBindContract",
    "alias" : "ProductGroupIDGenerator",
    "parameterClass" : "com.stibo.core.domain.impl.entity.FrontEntityImpl$$Generated$$6",
    "value" : "ProductGroupIDGenerator",
    "description" : null
  }, {
    "contract" : "QueryHomeBindContract",
    "alias" : "queryHome",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "ObjectTypeBindContract",
    "alias" : "ProductGroupsDivision",
    "parameterClass" : "com.stibo.core.domain.impl.ObjectTypeImpl",
    "value" : "ProductGroupingsDivision",
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
exports.operation0 = function (node,mvgRef,smgRef,step,divisionObjectType,correspondingDivisionAttr,ProductGroupIDGenerator,queryHome,ProductGroupsDivision,PPHToMVGTemplate) {
//-------------------------------------------------------------------------------
//Create MVG,SMG by assuming there will be a <list<list<style nodes>> given
//stylelist = [[1, 2], [1, 3], [4, 5, 7]]


style1 = step.getProductHome().getProductByID("000294270");
style2 = step.getProductHome().getProductByID("000427214");
style3 = step.getProductHome().getProductByID("000858188");

style4 = step.getProductHome().getProductByID("000907830");

style5 = step.getProductHome().getProductByID("000405938");


stylelist = [[style1, style2, style3, style5]]
removelist = []
primaryStyles = [style2]
template = node
mvg = step.getProductHome().getProductByID("AT-MVG-2234");
name = "ppp"


createMvgSmgFromStyles(stylelist, null, null, null, removelist, primaryStyles, ["US","CA"], template, name)

//mvg_id will be null in create case,
function createMvgSmgFromStyles(stylelist, startDate, EndDate, mvg_id, removelist, primaryStyles, Markets1, template, name) {
    //if market is us and ca then first do everything in us and then check ca
    //else if only one market is given then run the logic only on that market
    markets = []
    Markets1.forEach(eachMarket => {
        if (eachMarket == "US") {
            markets.push("EN_" + eachMarket)
        } else if (eachMarket == "CAN") {
            markets.push("EN_CA")
        }
    })
    //var primary_market, secondary_market;
    log.info("before handle remove list")
    handleRemoveList(step,removelist, markets,smgRef,mvgRef)
    log.info("after handle remove list")
    if (stylelist.length == 1) {
        if (!mvg_id) {       	
            checkAndCreateSmgIfDoesnotExists(step,stylelist[0], markets, startDate, EndDate, primaryStyles, name,smgRef,ProductGroupsDivision)
            return;
        } else {
            //create smg, don't create mvg  when mvg id is given but it doesn't have styles other than this list
            //check if mvg has styles other than the styles came in this group,and also check if these styles are not marked for remove in remove list
            log.info(stylelist[0])
            createSmg = checkIfMvgHasToBeDeleted(step,stylelist[0], removelist, mvg_id, markets,mvgRef)
            if (createSmg) {
                checkAndCreateSmgIfDoesnotExists(step,stylelist[0], markets, startDate, EndDate, primaryStyles, name,smgRef,ProductGroupsDivision,mvgRef)
                //pending-delete mvg
                return;
            }

        }
    }
    log.info("hereee")
    var MVG = mvg_id;
    for (var i = 0; i < stylelist.length; i++) {
        group = stylelist[i]

        //Create MVG for the first time if it doesn't already exists
        if (i == 0 && !MVG) {
            var mvg_Parent = identifyMvgParent(step,group[0],queryHome)
            log.info("mvg_Parent " + mvg_Parent)
            if (mvg_Parent) {
                brand_number = group[0].getValue("a_Brand_Number").getSimpleValue()
                mvg_id1 = brand_number + "-MVG-" + getNewProductGroupId(step,ProductGroupIDGenerator);
                MVG = mvg_Parent.createProduct(mvg_id1, "MultiVariantGroup");
                log.info(MVG + "MVGGGGG ")
                template.createClassificationProductLink(MVG, PPHToMVGTemplate);
                log.info(MVG)

            }
            else {
                break;
                //*we couldn't identify parent for mvg with this name ,ideallly this should never happen
            }
        }
        
        createMVGtoStyleRef(step,MVG, group, markets,mvgRef)

        //check if any of the styles in this group has an smg to it,if yes return the smg id
        //pending - You should update more details on MVG
        checkAndCreateSmgIfDoesnotExists(step,group, markets, startDate, EndDate, primaryStyles, name,smgRef,ProductGroupsDivision);
    }
    //this is better to update at the end for all contextss
    log.info(MVG)
    checkandbreakInheritance(step,MVG, markets)
    updateDetailsOnGroup(step,MVG, startDate, EndDate, markets, name)
    colour_display = MVG.getValue('a_Color_Display').getSimpleValue();
    if (!colour_display) MVG.getValue('a_Color_Display').setSimpleValue("Variant Selected Colors");
    checkAndDeleteGrps(step,[MVG], markets, mvgRef)
    log.info("a_SuperPDP_Market " + MVG.getValue("a_SuperPDP_Market").getSimpleValue())

}

function checkandbreakInheritance(step,group, markets) {
    log.info(group)
    group_market = group.getValue("a_SuperPDP_Market").getSimpleValue()
    if (group_market != null && group_market != "" && group_market.contains("US") && group_market.contains("CA") && markets != "" && markets.length == 1) {
        step.executeInContext("EN_US", function (manager) {
            context_group = manager.getProductHome().getProductByID(group.getID());
            group.getValue("a_SuperPDP_Market").setSimpleValue("US")
        });
        step.executeInContext("EN_CA", function (manager) {
            context_group = manager.getProductHome().getProductByID(group.getID());
            context_group.getValue("a_SuperPDP_Market").setSimpleValue("CAN")
        });
    }

}
function createMVGtoStyleRef(step,MVG, group, markets,mvgRef) {
    markets.forEach(eachMarket => {
        step.executeInContext(eachMarket, function (manager) {
            context_mvg = manager.getProductHome().getProductByID(MVG.getID());
            group.forEach(eachStyle => {
                context_style = manager.getProductHome().getProductByID(eachStyle.getID())
                try {
                    context_mvg.createReference(context_style, mvgRef);
                } catch (e) {
                    log.info("error")
                };
            });

        });
    });

}
function getNewProductGroupId(step,ProductGroupIDGenerator) {
   // var groupid = step.getEntityHome().getEntityByID("ProductGroupIDGenerator");
    var lastId = ProductGroupIDGenerator.getValue("a_Last_ID_Value").getSimpleValue();
    var IDCounter = parseFloat(lastId);
    var ID = IDCounter + 1;
    ProductGroupIDGenerator.getValue("a_Last_ID_Value").setSimpleValue(ID);
    return ID;

}

function handleRemoveList(step,removelist, markets,smgRef,mvgRef) {
    log.info("markets " + markets)
    markets.forEach(eachMarket => {
        step.executeInContext(eachMarket, function (manager) {
            log.info(manager + " manager")
            removelist.forEach(style_node => {
                context_style_node = manager.getProductHome().getProductByID(style_node.getID());
                context_style_node.queryReferencedBy(smgRef).forEach(function (refInstance) {
                    log.info("delete smg link")
                    refInstance.delete();
                    return true;

                });
                context_style_node.queryReferencedBy(mvgRef).forEach(function (refInstance) {
                    log.info("delete mvg link")
                    refInstance.delete();
                    return true;
                });


            });
        });
    });
}

function identifyMvgParent(step,style) {
    //style = group[0]
    // var division_name = style.getValue("a_Division_Description").getSimpleValue();
    var division_name = style.getParent().getParent().getParent().getParent().getName();
    log.info(division_name)
    var brand = style.getValue("a_Brand_Number").getSimpleValue();
    var brandRoot = step.getProductHome().getProductByID(brand + "_" + "MultiVariantGroup");
    log.info(brandRoot)
	divisionObjectType = step.getObjectTypeHome().getObjectTypeByID("MultiVariantGroupingsDivision")
    //optimize the logic hereeee
    var c = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
        (c.objectType(divisionObjectType))
            .and(c.hierarchy().simpleBelow(brandRoot)).and(c.name().eq(division_name))
    );
    var result = querySpecification.execute().asList(10);
    if (result.size() > 0) {
        return result.get(0);
    }
    return null;


}

function getIds(step,stylelist) {
    var styles = new java.util.HashSet();

    stylelist.forEach(eachStyle => {
        styles.add(eachStyle.getID());
    });
    return styles;
}
function checkIfMvgHasToBeDeleted(step,stylelist11, removelist, mvg, markets,mvgRef) {
	log.info("stylelist11 "+stylelist11)
    var stylelist = getIds(step,stylelist11);
    var removelist = getIds(step,removelist);
    log.info(stylelist)
    log.info(removelist)
    var createSmg = true;
    markets.forEach(market => {
        step.executeInContext(market, function (manager) {
            context_mvg = manager.getProductHome().getProductByID(mvg.getID());
            context_mvg.queryReferences(mvgRef).forEach(function (referenceInstance) {
                style = referenceInstance.getTarget()
                style_id = style.getID();
                log.info(style_id)
                if (!removelist.contains(style_id) && !stylelist.contains(style_id)) {
                    log.info("style  " + style)

                    createSmg = false;
                    return false;
                }
                return true;
            });
        })
    });
    log.info("createSmg " + createSmg)
    return createSmg;
}

function identifySmgParent(step,style,ProductGroupsDivision) {
    var division_id = style.getParent().getParent().getParent().getParent().getID();
    log.info(division_id + " , " + correspondingDivisionAttr)
    var brand = style.getValue("a_Brand_Number").getSimpleValue();
    var brandRoot = step.getProductHome().getProductByID(brand + "_" + "ProductGroup");
    var c = com.stibo.query.condition.Conditions;
    var querySpecification = queryHome.queryFor(com.stibo.core.domain.Product).where(
        (c.objectType(ProductGroupsDivision))
            .and(c.hierarchy().simpleBelow(brandRoot)).and(c.valueOf(correspondingDivisionAttr).eq(division_id))
    );
    var result = querySpecification.execute();
    var parent = null
    log.info(result.asList(10).size())
    result.forEach(function (result1) {
        parent = result1
        return false;
    })
    return parent;

}
function checkIfSmgExists(step,group,smgRef) {
    for (var j = 0; j < group.length; j++) {
        result1 = group[i].queryReferencedBy(smgRef).asList(100);
        if (result1.size() > 0) {
            return result.get(0).getSource();
        }

    }
    return null;
}

//checkAndCreateSmgIfDoesnotExist(group, markets, startDate,EndDate,primaryStyles);

function checkAndCreateSmgIfDoesnotExists(step,group, markets, startDate, EndDate, primaryStyles, name,smgRef,ProductGroupsDivision) {

    var styles = new java.util.HashSet();
    var smgsToBeCheckedForDelete = new java.util.HashSet();
    var time = new java.util.Date();
    var iso = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    var smg = null;
    //if group length is 1 then delete the link
    log.info("here")
    markets = ["EN_US", "EN_CA"]
    primaryStyles = ["1", "2"]
    markets.forEach(market => {
        log.info(market)
    });
    if (group.length == 1) {
        markets.forEach(market => {
            step.executeInContext(market, function (manager) {
                context_style = manager.getProductHome().getProductByID(group[0].getID());
                context_style.queryReferencedBy(smgRef).forEach(function (referenceInstance) {
                    smgsToBeCheckedForDelete.add(referenceInstance.geSource())
                    referenceInstance.delete()
                    return false;
                });
            });
        });

    }
    else {
        for (var i = 0; i < group.length; i++) {
            style = group[i]
            log.info("style id" + style.getID())
            life_cycle_status = style.getValue("a_Style_Life_Cycle_Status").getSimpleValue()
            if (life_cycle_status != "Draft" && life_cycle_status != "Purged") {
                result = style.queryReferencedBy(smgRef).forEach(function (referenceInstance) {
                    local_smg = referenceInstance.getSource()
                    if (!smg) {
                        smg = local_smg;
                        //smgsToBeCheckedForDelete.add(local_smg)
                    } else {
                        //check if the local smg id and smg are same
                        if (smg.getID() != local_smg.getID()) {
                            smgsToBeCheckedForDelete.add(local_smg)
                            referenceInstance.delete();
                        }
                    }
                    return true;
                });
                try {
                    smg.createReference(style, smgRef);
                } catch (e) {

                }
                styles.add(style)
            }
        }
        //log.info(smg.getID() + " smg")

        if (!smg) {
            log.info("/create new SMG group and add all these styles to it")
            brand_number = group[0].getValue("a_Brand_Number").getSimpleValue()
            smg_id = brand_number + "-PG-" + getNewProductGroupId(step,ProductGroupIDGenerator);
            var smgParent = identifySmgParent(step,group[0],ProductGroupsDivision)
            smg = smgParent.createProduct(smg_id, "Product_Group");
            markets.forEach(market => {
                step.executeInContext(market, function (manager) {
                    context_smg = manager.getProductHome().getProductByID(smg.getID());
                    for (var j = 0; j < group.length; j++) {

                        context_style = manager.getProductHome().getProductByID(group[j].getID());
                        life_cycle_status = context_style.getValue("a_Style_Life_Cycle_Status").getSimpleValue()
                        //check life cycle status of style ,if it is draft/purged don't add it to the mvg
                        if (life_cycle_status != "Draft" && life_cycle_status != "Purged") {
                            y = context_smg.createReference(context_style, smgRef);
                            log.info(primaryStyles)
                            log.info(group[j].getID())
                            if (primaryStyles.includes(group[j].getID())) {
                                log.info("oo")
                                y.getValue("a_Primary_Selling_Style").setSimpleValue("Yes")
                            } else {
                                log.info("PP")
                                y.getValue("a_Primary_Selling_Style").setSimpleValue("No")
                            }
                        }
                    }
                });
            });
            updateDetailsOnGroup(step,smg, startDate, EndDate, markets, name)
            //pending - you should update more details on SMG

        }
        else {
            //check if markets has both us and ca in that case add the smg to the ca market
            if (markets.includes("EN_US") && markets.includes("EN_CA")) {
                step.executeInContext("EN_CA", function (manager) {
                    context_smg = manager.getProductHome().getProductByID(smg.getID());
                    for (var i = 0; i < group.length; i++) {

                        context_style = manager.getProductHome().getProductByID(group[i].getID());

                        life_cycle_status = context_style.getValue("a_Style_Life_Cycle_Status").getSimpleValue()
                        if (life_cycle_status != "Draft" && life_cycle_status != "Purged") {
                            context_style.queryReferencedBy(smgRef).forEach(function (referenceInstance) {
                                local_smg = referenceInstance.getSource();
                                referenceInstance.delete();
                                if (local_smg.getID() != smg.getID()) {

                                    smgsToBeCheckedForDelete.add(local_smg)
                                }
                                else {
                                    context_smg.createReference(context_style, smgRef);
                                }
                                return true;
                            });
                        }
                    }
                });

            }
            //check if this smg has any extra styles that are not part of the new grouping and delete the link
            markets.forEach(market => {
                step.executeInContext(market, function (manager) {
                    context_smg = manager.getProductHome().getProductByID(smg.getID());
                    context_smg.queryReferences(smgRef).forEach(function (referenceInstance) {
                        style = referenceInstance.getTarget()
                        if (!styles.contains(style)) {
                            referenceInstance.delete()
                        }
                        else {
                            if (primaryStyles.includes(style.getID())) {
                                referenceInstance.getValue("a_Primary_Selling_Style").setSimpleValue("Yes")
                            } else {
                                referenceInstance.getValue("a_Primary_Selling_Style").setSimpleValue("No")
                            }

                        }
                        return true;
                    });
                });
            });
            updateDetailsOnGroup(step,smg, startDate, EndDate, markets, name)


        }
    }
    checkAndDeleteGrps(step,smgsToBeCheckedForDelete, markets, smgRef);
    if (smg != null) {
        checkandbreakInheritance(step,smg, markets)
        smg.getValue("a_main_last_modified_date").setSimpleValue(iso.format(time));
    }
    return true;
}

function updateDetailsOnGroup(step,smg, startDate, endDate, markets, name) {
    var time = new java.util.Date();
    //  var today = new java.util.Date();
    var today = new java.text.SimpleDateFormat("yyyy-MM-dd");
    formated_date = today.format(time)
    markets.forEach(market => {
        step.executeInContext(market, function (manager) {
            context_smg = manager.getProductHome().getProductByID(smg.getID());
            //context_smg.getValue("a_SuperPDP_Market").setSimpleValue(markets);
            //context_smg.getValue("a_SuperPDP_Market").setSimpleValue("US");
            if (markets.length > 1) {
                context_smg.getValue("a_SuperPDP_Market").setSimpleValue("US<multisep/>CAN")
            }
            else {
                if (market == "EN_US") {
                    context_smg.getValue("a_SuperPDP_Market").setSimpleValue("US")
                } else {
                    context_smg.getValue("a_SuperPDP_Market").setSimpleValue("CAN")
                }

            }

            smg_startDate = context_smg.getValue("a_Product_Grouping_Start_date").getSimpleValue();
            smg_endDate = context_smg.getValue("a_Product_Grouping_End_Date").getSimpleValue();
            if (startDate) {
                context_smg.getValue("a_Product_Grouping_Start_date").setSimpleValue(startDate)
            } else {
                if (!smg_startDate) {
                    log.info("todayyy " + today)
                    context_smg.getValue("a_Product_Grouping_Start_date").setSimpleValue(formated_date);
                }
            }
            if (endDate) {
                context_smg.getValue("a_Product_Grouping_End_Date").setSimpleValue(endDate)
            } else {
                if (!smg_endDate) {
                    context_smg.getValue("a_Product_Grouping_End_Date").setSimpleValue("2400-01-01")
                }
            }

        });
    });

    brand = smg.getParent().getValue("a_Brand_Number").getSimpleValue()
    smg.getValue("a_Brand_Number").setSimpleValue(brand);
    if (!name) {
        smg.setName(name)
    }
    //smg name - you should check this
}
function checkAndDeleteGrps(step,ToBeCheckedForDelete, markets, ref) {

    today = new java.util.Date();
    var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var yesterday = new Date(today.getTime() - 86400000);
    yesterday = dateFormat.format(yesterday);
    markets.forEach(market => {
        step.executeInContext(market, function (manager) {
            ToBeCheckedForDelete.forEach(function (grp) {
                context_grp = manager.getProductHome().getProductByID(grp.getID());
                result1 = context_grp.queryReferences(ref).asList(100);
                log.info(result1.size() + " sizee " + grp.getID())
                if (result1.size() == 0) {
                    context_grp.getValue("a_Product_Grouping_End_Date").setSimpleValue(yesterday)
                    //context_smg.getValue("a_Product_Grouping_Start_date").setSimpleValue(null)
                    //should we clear markets value?
                    //smg1.delete();
                }
                return true;
            });

        });
    })
}







}