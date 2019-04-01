const { execFile } = require('child_process');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path');
const mime = require('mime-types');
const cfnCR = require('cfn-custom-resource');

const AWS = require('aws-sdk');
var glob = require('glob');

const s3 = new AWS.S3();

exports.handler = async message => {
  console.log("======MESSAGE=====");
  console.log(message);
  console.log("======ENDMESSAGE=====");

  try {

    const tmpDir = `/tmp/front-end${process.pid}`;

    const npm = 'npm';
    await spawnPromise('rm', ['-rf', tmpDir]);
    await spawnPromise('cp', ['-R', 'xdam_saas_fe/', tmpDir]);
    await spawnPromise(
      npm,
      ['--production',
        '--no-progress',
        '--loglevel=error',
        '--cache', path.join('/tmp', 'npm'),
        '--userconfig', path.join('/tmp', 'npmrc'),
        'install'
      ],
      {cwd: tmpDir}
    );
    await spawnPromise(
      npm,
      ['--production',
        '--no-progress',
        '--loglevel=error',
        '--cache', path.join('/tmp', 'npm'),
        '--userconfig', path.join('/tmp', 'npmrc'),
        'run', 'build'
      ],
      {cwd: tmpDir}
    );

    /*
    const tmpDir = `/tmp/front-end${process.pid}`;
    await spawnPromise('rm', ['-rf', tmpDir]);
    await spawnPromise('cp', ['-R', 'xdam_saas_fe/', tmpDir]);


    await spawnPromise(
      'npm',
      ['--production',
      '--no-progress',
      '--loglevel=error',
      '--cache', path.join('/tmp', 'npm'),
      '--userconfig', path.join('/tmp', 'npmrc'),
        'install'
      ],
      {cwd: tmpDir}
    );

    console.log("======LS ONE=====");

    await spawnPromise('ls', [`${tmpDir}/node_modules/.bin`]);

    console.log("======LS TWO=====");

    await spawnPromise('ls', [`${tmpDir}`]);

    console.log("======PWD=====");

    await spawnPromise('pwd', []);


    //await spawnPromise('./node_modules/.bin/ember', ['-v']);

    //await spawnPromise('npx', [ '--cache', path.join('/tmp'), 'ember','build'], {cwd: tmpDir});



    await spawnPromise(
      'npm',
      ['--production',
        '--no-progress',
        '--loglevel=error',
        '--cache', path.join('/tmp', 'npm'),
        '--userconfig', path.join('/tmp', 'npmrc'),
        'run', 'build'
      ],
      {cwd: tmpDir}
    );
    */


  } catch (error) {
    console.log('Error during DeployFrontEnd');
    console.log(error);
    await cfnCR.sendFailure(error.message, message);
    return {};
  } finally {
    await cfnCR.sendSuccess('deployFrontEnd', {}, message);
    return {};
  }

}


function spawnPromise (command, args, options) {
  console.log(`Running \`${command} '${args.join("' '")}'\`...`);

  options = options || {};

  if (!options.env) {
    options.env = {};
  }

  Object.assign(options.env, process.env);

  return new Promise((resolve, reject) => {
    execFile(command, args, options, (err, stdout, stderr) => {
      console.log('STDOUT:');
      console.log(stdout);
      console.log('STDERR:');
      console.log(stderr);

      if (err) {
        err.stdout = stdout;
        err.stderr = stderr;

        reject(err);
      } else {
        resolve({stdout: stdout, stderr: stderr});
      }
    });
  });
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



/*
  const tmpDir = `/tmp/front-end${process.pid}`;

    const npm = 'npm';
    await spawnPromise('rm', ['-rf', tmpDir]);
    await spawnPromise('cp', ['-R', 'react-front-end/', tmpDir]);
    await spawnPromise(
      npm,
      ['--production',
        '--no-progress',
        '--loglevel=error',
        '--cache', path.join('/tmp', 'npm'),
        '--userconfig', path.join('/tmp', 'npmrc'),
        'install'
      ],
      {cwd: tmpDir}
    );
    await spawnPromise(
      npm,
      ['--production',
        '--no-progress',
        '--loglevel=error',
        '--cache', path.join('/tmp', 'npm'),
        '--userconfig', path.join('/tmp', 'npmrc'),
        'run', 'build'
      ],
      {cwd: tmpDir}
    );
    */



