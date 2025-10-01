/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Populate_Shot_Request_Attributes",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br Populate Shot Request Attributes",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "ProductShotRequest" ],
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
    "alias" : "manager",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "LoggerBindContract",
    "alias" : "log",
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
exports.operation0 = function (node,manager,log,LKT) {
// This rule works as follows:
var marketCode = node.getValue('a_Shared_Markets').getValues().toArray();

var Contexts = new Array();

//get context ID for each market from lookup table
marketCode.forEach(function (Mkt) {
	Contexts.push(LKT.getLookupTableValue("LKT_MarketDesignationToMarket", Mkt.getSimpleValue()));
});

var ent_ID = node.getID();

//add reference in each context
Contexts.forEach(function (Ctxt) {
	manager.executeInContext(
		Ctxt,
		function (step) {
			var refs = new java.util.ArrayList();

			var contextEntity = step.getEntityHome().getEntityByID(node.getID());
			
			refs.addAll(contextEntity.getReferencedBy());
			//log.info( "array size "+refs.size()); 
			if (refs.size() != 0) {

				var CC_ID = refs.get(0).getSource().getID();
				var currentProduct = step.getProductHome().getProductByID(CC_ID);
				var val = currentProduct.getValue('a_CC_Number').getSimpleValue();
				var currentEntity = step.getEntityHome().getEntityByID(ent_ID);

				currentEntity.getValue('a_Shot_CC_Number').setSimpleValue(val);
			}

			else {
				//if user is STIBOCATALOG USER then do no throw exception(XML Delta Load)
				var lastModifiedUser = node.getRevision().getUserID();
				if (lastModifiedUser.toUpperCase() != "STIBOCATALOGSYNCUSER") {
					throw "This PhotoShot does not have a linked CC";
				}
			}
		}
	)
});
}