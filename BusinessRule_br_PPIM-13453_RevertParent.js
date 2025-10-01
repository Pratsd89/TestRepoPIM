/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_PPIM-13453_RevertParent",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_PPIM-13453_RevertParent",
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
    "contract" : "ManagerBindContract",
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LookupTableHomeBindContract",
    "alias" : "LKT",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,LKT) {
/*//var CCRevert = ["000141403002"]
var parameter1 = "CCRevert";
var CC = LKT.getLookupTableValue("PPIM-13453_CCList", parameter1);
var CCRevert = CC.split(";");
for(var i in CCRevert){
	var cc = manager.getProductHome().getProductByID(CCRevert[i]);
	*/
	var revisions = node.getRevisions();
	var Previousnode = revisions.get(revisions.size()-1).getNode();
	var OldParent = Previousnode.getParent();
	log.info(OldParent);
	node.setParent(OldParent);
       


}