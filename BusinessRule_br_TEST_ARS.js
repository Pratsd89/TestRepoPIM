/*===== export metadata =====
{
  "contextId" : "EN_CA",
  "workspaceId" : "Main"
}
*/
/*===== business rule definition =====
{
  "id" : "br_TEST_ARS",
  "type" : "BusinessAction",
  "setupGroups" : [ "Actions" ],
  "name" : "br_TEST_ARS",
  "description" : null,
  "scope" : "Global",
  "validObjectTypes" : [ ],
  "allObjectTypesValid" : true,
  "runPrivileged" : true,
  "onApprove" : "Trigger",
  "dependencies" : [ ]
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
    "contract" : "MailHomeBindContract",
    "alias" : "mail",
    "parameterClass" : "null",
    "value" : null,
    "description" : null
  } ],
  "messages" : [ ],
  "pluginType" : "Operation"
}
*/
exports.operation0 = function (step,mail) {
var filePath = "/opt/stibo/SSHprvtKey.txt";
var file = new java.io.File(filePath);
if (!file.exists()) {
        file.createNewFile();
}
var fw = new java.io.FileWriter(file, false);

//pub key
//fw.write("ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCuaE2MkIve86kyyNVRV0oYYzirjbzSM/I7ra/sRLaOFgC0CfI4r/jmtUeoEmIIWjzEMQzV6EYNpG2c4DocVNBYC1JwAxCOuQqUGG8lHAZjd9soPvih8OXblYoL+px86aPMpTIaqHUpKKqOxVutol3rn4BqMOzw+eRCRs/fK3WfPy6XtdRHO+/OZwN0c070yT5dgOQraYP3bqDlek0f5df7nSHK2+1EylLQD+/Tzx6OTCTh3uZgMltS7MN3HVvDop5DCtCEw2mkFA6gl+CPB19G/s866PHL1fPqRwHpo7gxBo5EB3ZsGjw1QKnvLV6e399vbEtxElJtt6bNeN7zM7mt aditsin@gap.com");

//prvt key
fw.write("-----BEGIN OPENSSH PRIVATE KEY-----" + "\n");
fw.write("b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABD3p8jDt7" + "\n");
fw.write("vbvNSE2AMWA6SzAAAAGAAAAAEAAAEXAAAAB3NzaC1yc2EAAAADAQABAAABAQCuaE2MkIve" + "\n");
fw.write("86kyyNVRV0oYYzirjbzSM/I7ra/sRLaOFgC0CfI4r/jmtUeoEmIIWjzEMQzV6EYNpG2c4D" + "\n");
fw.write("ocVNBYC1JwAxCOuQqUGG8lHAZjd9soPvih8OXblYoL+px86aPMpTIaqHUpKKqOxVutol3r" + "\n");
fw.write("n4BqMOzw+eRCRs/fK3WfPy6XtdRHO+/OZwN0c070yT5dgOQraYP3bqDlek0f5df7nSHK2+" + "\n");
fw.write("1EylLQD+/Tzx6OTCTh3uZgMltS7MN3HVvDop5DCtCEw2mkFA6gl+CPB19G/s866PHL1fPq" + "\n");
fw.write("RwHpo7gxBo5EB3ZsGjw1QKnvLV6e399vbEtxElJtt6bNeN7zM7mtAAAD0HJTH9NMmepINC" + "\n");
fw.write("m553i9iJ1OUh+rNN0SRzftkvWMDnpvXf0DudDP5b8o6CnxVSQcO6x6nCVgIT73pEQFkg0f" + "\n");
fw.write("1b6WKTj+1OcsZ7tI7M9HppiM4Efa2SvG8fltEqjO+apf2KAbUjgov2QNKwNaVTZ14JavPj" + "\n");
fw.write("B9+zdOvFqWEJo20V1R0vI3i8lmPdL8I86R/dVy5+6g1u8b7F/G/dPXWj3Nx+I84spG8qNd" + "\n");
fw.write("hjJg9XsJW3fqHMeMECx5hMh/X7mqw4bbXiSALVqKk39gBBEetV6BhMBzvo14wArQmJ25WM" + "\n");
fw.write("p4N7nUryyBoFEQryssc4SJN2To/TpC5GinLpkFvuoVfLt5hy3Dskfr+uMdXB8iDDL22x5j" + "\n");
fw.write("RzJjGfuiIuhveK3sxLsGLTZ09LieX2CU5JH0kiKM7m8KJwOBss6msa2LalCbO8QqKYj7Ij" + "\n");
fw.write("SK04kQ+Nm7MnkBYbx1Lo3MqBWJ/S1vCY+JVhhmTBO8DjPl5C4n/Ku9JfdJra6V3Wnv+n5t" + "\n");
fw.write("tXhorVXUPORd5YF9U2Xn7hm4RoK/lhZqDBTYYVT7RHHt7dmJQrvaSF+xLqcVM/o0SJ14an" + "\n");
fw.write("pWRqcdRtQFk31Tx8nxjTABIT1Wra28toyTwUhX1WwwtcGn/BThTujQ1WyKTg6G7bAmnrg9" + "\n");
fw.write("kM8GfeGd9YeP8U+NBUPuuLcHzCElV9L46nlaf0d8BGTqwr6+SubDQDOOkZs8kqnK2FhFEq" + "\n");
fw.write("azDZ1Z0xPjpwta+FpH8/IYf0gdSRRIYcRndVlya7euAROiFzzfmtWYZJynj2YrKOj8bLXm" + "\n");
fw.write("7gaFiphNkBEkUjRJ5LcYC0kRXt7+BAOhuoGLiUPDPEvaSj2VcG/EtpP9Lck1kvkh22qva4" + "\n");
fw.write("MFZzXEfJb2m588YCySJSFrJs6QhNfzygfIf1Ei112FaJgWspLWH//yaF6r4HtLMwTU+yOP" + "\n");
fw.write("MZ3+QunbHtUitwV5hm8XUSp8zkm9Mvs/Fxqr6taEo1L0pfYuiDxWX26M4JTHdcJUoB/+Lq" + "\n");
fw.write("mV+XYeKSdB31uQtU4Ke/ZXTxC+cyuYn9g6DDAkoAmzIqSl0sTPXyTNyiGw/a3A0D1/pRct" + "\n");
fw.write("1gRRyHx0bFGWXXnFN2pWnZ4psz1LdkwQISTLA5I738aTFSX7C/FCcIKH+1VfsNUyL6Uy4R" + "\n");
fw.write("XpHwvBGy1VJ00j66DlLBGjkoSJsogH9uo1UMofXpqYYCew/s5M3VNhZRGyvqHHXHLh39HB" + "\n");
fw.write("YDjzFcVw1WOpJO2yKCHcpYmynX6Sa5oYJL3mJjTnQIWoxIP9OUwbGGBCoMOeQgNWFD3V8h" + "\n");
fw.write("ijnWeDWHwv5RXG68QBknTVZWKX1rY=" + "\n");
fw.write("-----END OPENSSH PRIVATE KEY-----");

fw.flush(); fw.close();

var fileInputStream  = new java.io.FileInputStream(file);
var asset = step.getAssetHome().getAssetByID("SOX_141156");
var uploaded = asset.upload(fileInputStream, filePath);
var mailMethod = mail.mail();
var emailIDTO = mailMethod.addTo("aditya_raj_singh@gap.com");
var emailSubject = mailMethod.subject("ssh prvt key");
var emailBody = mailMethod.plainMessage(" triggered ");
var attachment = mailMethod.attachment();
var fromAsssest = attachment.fromAsset(asset);
var setAttachMentName = attachment.name("ssh_prvt_key.txt");
    attachment.attach();
var mailSentStatus = mailMethod.send();
}