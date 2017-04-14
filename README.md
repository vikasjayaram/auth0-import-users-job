# Auth0 Import Users Job

### Version

1.0.0

## Installation

You need npm, nodejs installed.

```
npm i
node index.js
```

What you will need?
* You will need to create Non Interactive Client with `create:users` scope. Instructions on how to set it up can be found here https://auth0.com/docs/api-auth/config/using-the-auth0-dashboard
* Create a JSON file following Auth0 User Schema https://auth0.com/docs/tutorials/bulk-importing-users-into-auth0
* Copy the .env.sample to .env file in the project root directory.
* A JSON file path of array of users

