const cfnCR = require('cfn-custom-resource');


exports.handler = async message => {
  console.log("======MESSAGE=====");
  console.log(message);
  console.log("======ENDMESSAGE=====");

  await cfnCR.sendSuccess('deployFrontEnd', {}, message);
  return {};

}
