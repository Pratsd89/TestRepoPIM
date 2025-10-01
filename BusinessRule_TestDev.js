/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "TestDev",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "Test Dev",
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
  "binds" : [ ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function () {
// Variables
var length = 10;   // Length of the rectangle
var width = 5;     // Width of the rectangle

// Function to calculate the area of the rectangle
function calculateArea(length, width) {
    var area = length * width;
    return area;
}

// Function to calculate the perimeter of the rectangle
function calculatePerimeter(length, width) {
    var perimeter = 2 * (length + width);
    return perimeter;
}

// Calling the functions and storing results
var area = calculateArea(length, width);
var perimeter = calculatePerimeter(length, width);

// Output the results
log.info(area);           // Output: 50
log.info(perimeter); // Output: 30

}