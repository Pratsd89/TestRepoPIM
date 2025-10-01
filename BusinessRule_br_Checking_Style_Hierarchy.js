/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_Checking_Style_Hierarchy",
  "type" : "BusinessCondition",
  "setupGroups" : [ "Conditions" ],
  "name" : "Checking Style Hierarchy For CC And SKU",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ "Style" ],
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
var style = stepManager.getProductHome().getProductByID(node.getID());
var CCList = style.getChildren();
if(CCList.size()==0){
	return 'The Style does not contain any CC. Please add CC and try again.';
}
else{
	for(var i =0 ;i<CCList.size();i++){
		var CC = CCList.get(i);
		var SKUList = CC.getChildren();
		if(SKUList.size()!=0){
			return true;
		}
	}
	return 'There is no SKU assigned with this Style. Please add SKU and try again.';
}
return true;
}
/*===== business rule plugin definition =====
{
  "pluginId" : "ReferenceOtherBCBusinessCondition",
  "parameters" : [ {
    "id" : "ReferencedBC",
    "type" : "com.stibo.core.domain.businessrule.BusinessCondition",
    "value" : "StyleMandatoryAttributeCheck"
  }, {
    "id" : "ValueWhenReferencedIsNA",
    "type" : "com.stibo.util.basictypes.TrueFalseParameter",
    "value" : "false"
  } ],
  "pluginType" : "Operation"
}
*/
