"use strict";

const moment     = require('moment');
const request    = require('request');
const async      = require('async');
const fs         = require('fs');

let accessToken = null;
let lastLogin = null;
let context = {};

context.data = {};

/*
* Import users workflow
*/

exports.importUsers = function (filepath, cb) {
  context.data.ACCOUNT_NAME = process.env.ACCOUNT_NAME;
  context.data.CLIENT_ID = process.env.AUTH0_CLIENT_ID;
  context.data.CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
  context.filepath = filepath;
  console.log(filepath);
  async.waterfall([
    async.apply(getAuth0AccessToken, context),
    importUserJob
  ], function (err, user) {
    return cb(err, user);
  });
};


/*
* Request a Auth0 access token every 30 minutes
*/

function getAuth0AccessToken(context, cb) {
   if (!accessToken || !lastLogin || moment(new Date()).diff(lastLogin, 'minutes') > 30) {
     const options = {
       url: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/oauth/token',
       json: {
         audience: 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/api/v2/',
         grant_type: 'client_credentials',
         client_id: context.data.CLIENT_ID,
         client_secret: context.data.CLIENT_SECRET
       }
     };

     return request.post(options, function(err, response, body){
       if (err) return cb(err);
       else {
         lastLogin = moment();
         accessToken = body.access_token;
         console.log(accessToken);
         return cb(null, context, accessToken);
       }
     });
   } else {
     return cb(null, context, accessToken);
   }
 };

/*
* Create a Import Users Job
*  {
*    "connection_id": "con_XXXX",
*    "send_completion_email": "true | false",
*    "users": 'fs.createReadStream(filename.json)'
*  }
* https://auth0.com/docs/api/management/v2#!/Jobs/post_users_imports
*/

function importUserJob(context, token, cb) {
  var options = {
    headers: {
      authorization: 'Bearer ' + token
    },
    formData: {
      'connection_id': process.env.DB_CONNECTION_ID,
      'send_completion_email': 'true',
      'users': fs.createReadStream(context.filepath)
    },
    json: true
  };
  var url = 'https://' + context.data.ACCOUNT_NAME + '.auth0.com/api/v2/jobs/users-imports';
  request.post(url, options, function (err, response, body) {
    console.log(body);
  });
}
