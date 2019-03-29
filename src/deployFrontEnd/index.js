exports.handler = async message => {
  console.log(message);
  await cfnCR.sendSuccess('deployFrontEnd', {}, message);
  return {};

}
