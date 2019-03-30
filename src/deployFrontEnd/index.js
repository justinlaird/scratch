const cfnCR = require('cfn-custom-resource');


exports.handler = async message => {
  console.log("======MESSAGE=====");
  console.log(message);
  console.log("======ENDMESSAGE=====");

  await cfnCR.sendSuccess('deployFrontEnd', {}, message);
  return {};

}


//example test invocation
//sam local generate-event cloudformation create-request | sam local invoke DeployFrontEnd

/*
exports.handler({
  "RequestType": "Create",
  "ResponseURL": "https://cloudformation-custom-resource-response-uswest2.s3-us-west-2.amazonaws.com",
  "StackId": "arn:aws:cloudformation:us-east-1:123456789012:stack/MyStack/guid",
  "RequestId": "unique id for this create request",
  "ResourceType": "Custom::TestResource",
  "LogicalResourceId": "MyTestResource",
  "ResourceProperties": {
    "StackName": "MyStack",
    "List": [
      "1",
      "2",
      "3"
    ]
  }
});
*/
