'use strict';

const dotenv = require('dotenv');
const prompt = require('prompt');
const util = require('util');

dotenv.load();

const impusr = require('./lib/import_user_job');

var properties = [
    {
      message: 'Enter the filepath to import users', 
      name: 'filepath',
      validator: /(\.[^\\]|.json+)$/,
      warning: 'The file must be a json',
      empty: false
    }
];

prompt.start();

prompt.get(properties, function (err, result) {
  if (err) { return onErr(err); }
  console.log('Command-line input received:');
  console.log('  Filepath: ' + result.filepath);
	impusr.importUsers(result.filepath.toString(), function (err, cb) {
    if (err) {
      console.log('==== Somethign went wrong ======');
		  console.log(err);
    } else {
      console.log('==== Job has been created ======');
      console.log(cb);  
    }
	});
});

function onErr(err) {
  console.log(err);
  return 1;
}
