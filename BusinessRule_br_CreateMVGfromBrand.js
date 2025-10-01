/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_CreateMVGfromBrand",
  "type" : "BusinessAction",
  "setupGroups" : [ "TestBusinessRules" ],
  "name" : "br_CreateMVGfromBrand",
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
    "contract" : "AttributeValidatedContextParameterStringBinding",
    "alias" : "primaryProductNumber",
    "parameterClass" : "com.stibo.core.domain.businessrule.attributecontextparameter.AttributeValidatedContextParameter",
    "value" : "<AttributeValidatedContextParameter>\n  <Parameters>\n    <Parameter ID=\"Attribute\" Type=\"java.lang.String\">a_Style_Number</Parameter>\n    <Parameter ID=\"ID\" Type=\"java.lang.String\"></Parameter>\n  </Parameters>\n</AttributeValidatedContextParameter>",
    "description" : null
  }, {
    "contract" : "WebUiContextBind",
    "alias" : "web",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,primaryProductNumber,web) {
var Style = manager.getProductHome().getProductByID(primaryProductNumber);
if(Style != null){
	var Brand = Style.getValue("a_Brand_Number").getSimpleValue();
	var DivNumber = Style.getValue("a_Division_Number").getSimpleValue();
	var MVG_ID = Brand+"_"+DivNumber+"_MultiVariantGroups";
	var MVG = manager.getProductHome().getProductByID(MVG_ID);
	if(MVG!=null){
		var newMVG = MVG.createProduct(null,"MultiVariantGroup");
		newMVG.setName(Style.getName());
		newMVG.createReference(Style, "MultiVariant_Group_Reference");
		web.navigate("MultiVariantGroupScreen", newMVG);
	} else {
		throw "MVG doesn't exists for division number";
	}
} else {
	throw "Style doesn't exists";
}

}