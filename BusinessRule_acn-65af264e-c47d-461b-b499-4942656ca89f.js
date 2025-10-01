/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "acn-65af264e-c47d-461b-b499-4942656ca89f",
  "type" : "BusinessAction",
  "setupGroups" : [ "Workflows" ],
  "name" : null,
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : false,
  "onApprove" : "Never",
  "dependencies" : [ {
    "libraryId" : "ID_Generator_Library",
    "libraryAlias" : "IDGeneratorLibrary"
  }, {
    "libraryId" : "LIBRARY_SLUG_GENERATOR",
    "libraryAlias" : "slug"
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
    "alias" : "step",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,step,IDGeneratorLibrary,slug) {
objType = node.getObjectType().getID();
log.info("node id"+ node.getID() +","+objType)
if(objType == "CMS_Slot") {
	IDGeneratorLibrary.setIDValue(node,step,'CMF_Slot_ID_Generator','a_Slot_ID');
}
/*else if(objType =="CMS_Content_Group") {

	log.info(node.getID())
	log.info(node.getName())
	var slugValue = slug.slugify(String(node.getName()), {
        locale: "en"
    });
    log.info(slugValue)
    if(slugValue ==null) {
    	node.getValue("a_Content_Category_ID").setSimpleValue(node.getName());
    } else{
    node.getValue("a_Content_Category_ID").setSimpleValue(slugValue);
    }
    log.info(node.getValue("a_Content_Category_ID").getSimpleValue())
	//IDGeneratorLibrary.setIDValue(node,step,'CMF_Content_Group_ID_Generator','a_Content_Category_ID');
}*/

}
/*===== business rule plugin definition =====
{
  "pluginId" : "BulkUpdateTriggerStateFlowEvent",
  "parameters" : [ {
    "id" : "currentStateID",
    "type" : "java.lang.String",
    "value" : "intial_state"
  }, {
    "id" : "eventID",
    "type" : "java.lang.String",
    "value" : "SUBMIT"
  }, {
    "id" : "processNote",
    "type" : "java.lang.String",
    "value" : ""
  }, {
    "id" : "stateFlowID",
    "type" : "java.lang.String",
    "value" : "wf_CMS_id_generation"
  } ],
  "pluginType" : "Operation"
}
*/
