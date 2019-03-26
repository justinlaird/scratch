const cfnCR = require('cfn-custom-resource');

exports.handler = async message => {
  console.log(message);
  console.log("Mr Magic Lambda");
  await cfnCR.sendSuccess('UpdaateMySQL completed', {}, message);
  return {};
}
