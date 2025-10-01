/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_fetch_all_styles_from_BGP_node",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_fetch_all_styles_from_BGP_node",
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
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,mvgRef,smgRef,step,divisionObjectType,correspondingDivisionAttr,ProductGroupIDGenerator,queryHome,ProductGroupsDivision) {
// node here is the parent root node with bgp id in it 

var childrens = node.getChildren().iterator();
var identifier_styles_map = new java.util.HashMap();
var identifier_temp_map = new java.util.HashMap();
var not_unique_templates = new java.util.HashSet();

while (childrens.hasNext()) {
    var temp_node = childrens.next();
    style_id = temp_node.getValue("a_MVGTemp_Style_ID").getSimpleValue();
    log.info(style_id)
    style_id = style_id.toString().padStart(9, '0');
    style_id = "000141403"
    log.info("z "+style_id)
    identifier = temp_node.getValue("a_MVG_GroupID").getSimpleValue();
    if (!not_unique_templates.contains(identifier)) {
        if (style_id != "" && style_id != null) {
        		
            style_node = step.getProductHome().getProductByID(style_id);
            //check if template is unique for all the rows provided for this identifier
            temp_id = temp_node.getValue("a_MVGTemp_TemplateID").getSimpleValue();
            if (temp_id != null && !identifier_temp_map.get(identifier)) {
            	log.info("hereee")
                identifier_temp_map.put(identifier, temp_id);
            } else {
                if (temp_id != null && identifier_temp_map.get(temp_id) != temp_id) {
                    //temp doesn't match so add it to the not unique templates set
                    not_unique_templates.add(identifier);
                    log.info(not_unique_templates +" not_unique_templates")
                }
            }
            style_node.queryReferencedBy(smgRef).forEach(function (refInstance) {
                smg = refInstance.getSource();
                smg_styles = new java.util.HashSet();
                smg.queryReferences(smgRef).forEach(function (referenceInstance) {
                    smg_styles.add(referenceInstance.getTarget());
                    return true;
                });
                if (identifier_styles_map.get(identifier) != null) {
                    var styles = identifier_styles_map.get(identifier);
                        styles.forEach(eachStyle => {
                        	smg_styles.add(eachStyle);
    })
                       
                    identifier_styles_map.put(identifier, smg_styles)
                } else {
                    identifier_styles_map.put(identifier, smg_styles)
                }
                return true;
            });


        } else {
            log.info("//*style id can't be empty")
        }
    }
    else {
        //*this identifier had multiple templates for different rows
    }
    //pending -- to handle update case - check if the identifier is an mvg id then check if the mvg's template and template provided in the row are same or not

}

var identifiers_iterator = identifier_styles_map.keySet().iterator();
while (identifiers_iterator.hasNext()) {
	
    var identifier = identifiers_iterator.next();
   // log.info(identifier_styles_map.get(identifier))
    if (identifier && !not_unique_templates.contains(identifier)) {
        styleList = identifier_styles_map.get(identifier);
        to_be_sent_to_indu(styleList, node, identifier)
    }
}
}