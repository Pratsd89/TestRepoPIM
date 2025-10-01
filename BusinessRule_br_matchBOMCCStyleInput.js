/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_matchBOMCCStyleInput",
  "type" : "BusinessAction",
  "setupGroups" : [ "SA Issue Fix BRs" ],
  "name" : "MatchAndLinkBOMCCStyle Input",
  "description" : "PPIM-12253",
  "scope" : "Global",
  "validObjectTypes" : [ "CustomerChoice" ],
  "allObjectTypesValid" : false,
  "runPrivileged" : true,
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
    "contract" : "QueryHomeBindContract",
    "alias" : "qh",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "bomCC",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_BOM_CC_Number",
    "description" : null
  }, {
    "contract" : "BusinessActionBindContract",
    "alias" : "createWPTLink",
    "parameterClass" : "com.stibo.core.domain.impl.businessrule.FrontBusinessActionImpl",
    "value" : "styleLinkToWebProductType",
    "description" : null
  }, {
    "contract" : "AttributeBindContract",
    "alias" : "CCNum",
    "parameterClass" : "com.stibo.core.domain.impl.AttributeImpl",
    "value" : "a_CC_Number",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "BOMRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_CC",
    "description" : null
  }, {
    "contract" : "ReferenceTypeBindContract",
    "alias" : "BOMStyleRef",
    "parameterClass" : "com.stibo.core.domain.impl.ReferenceTypeImpl",
    "value" : "rt_BOM_Style",
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (node,manager,log,qh,bomCC,createWPTLink,CCNum,BOMRef,BOMStyleRef) {
/*createCCAndStyleBOMReferences("000840496047","000546879058");
createCCAndStyleBOMReferences("000463506067","000870260076");
createCCAndStyleBOMReferences("000540905012","000522282011");
createCCAndStyleBOMReferences("000540972008","000527414006");
createCCAndStyleBOMReferences("000540972009","000527414007");
createCCAndStyleBOMReferences("000540972007","000527414005");
createCCAndStyleBOMReferences("000795743041","000158082030");
createCCAndStyleBOMReferences("000597953001","000629113000");
createCCAndStyleBOMReferences("000645535000","000656794001");
createCCAndStyleBOMReferences("000550531066","000547250069");
createCCAndStyleBOMReferences("000673521001","000707288001");
createCCAndStyleBOMReferences("000488512024","000608574015");
createCCAndStyleBOMReferences("000715712000","000797098051");
createCCAndStyleBOMReferences("000543727003","000628932003");
createCCAndStyleBOMReferences("000646226002","000627412000");
createCCAndStyleBOMReferences("000796078016","000774398025");
createCCAndStyleBOMReferences("000796078017","000774594022");
createCCAndStyleBOMReferences("000710976001","000683344001");
createCCAndStyleBOMReferences("000646253001","000626633001");
createCCAndStyleBOMReferences("000587125000","000627383000");
createCCAndStyleBOMReferences("000660143000","000514725028");
createCCAndStyleBOMReferences("000868460004","000510981080");
createCCAndStyleBOMReferences("000606755001","000656758000");
createCCAndStyleBOMReferences("000646387000","000890083002");
createCCAndStyleBOMReferences("000645348000","000633399000");
createCCAndStyleBOMReferences("000609448005","000647790002");
createCCAndStyleBOMReferences("000646564012","000628932008");
createCCAndStyleBOMReferences("000543108003","000627454009");
createCCAndStyleBOMReferences("000646068002","000625717003");
createCCAndStyleBOMReferences("000646071003","000521905004");
createCCAndStyleBOMReferences("000646071001","000521905006");
createCCAndStyleBOMReferences("000715720000","000360179006");
createCCAndStyleBOMReferences("000715736000","000710261000");
createCCAndStyleBOMReferences("000540965003","000522262001");


function createCCAndStyleBOMReferences(bomSACCNum, bomUSCCNum) {
	var bomSACC = manager.getProductHome().getProductByID(bomSACCNum);
	var bomUSCC = manager.getProductHome().getProductByID(bomUSCCNum);
     var refType = manager.getReferenceTypeHome().getReferenceTypeByID("rt_BOM_CC");
     var ccRefCreated = bomSACC.createReference(bomUSCC, refType);
}*/


var parentStyle = node.getParent();
var BOMCCRef = node.getReferences(BOMRef).toArray();
if (BOMCCRef.length != 0){
	var targetCC = BOMCCRef[0].getTarget();
	var targetBOMStyle = targetCC.getParent();
	var BOMRefStyle = parentStyle.getReferences(BOMStyleRef).toArray();
	if (BOMRefStyle.length == 0){
		var styleRefCreated = parentStyle.createReference(targetBOMStyle, BOMStyleRef);	
	}	
}


}