# node-secure-dino-api

Node.js OAuth 2.0 API with public and secure endpoints and delegated authorization. Instructions are available below for setting up this API using [Auth0](https://auth0.com) as the authorization server for issuing access tokens.

## Prerequisites

* [Node.js with npm](http://nodejs.org), Node >= 6.9.0, npm >= 3
* [Free Auth0 account](https://auth0.com/signup)

## Install Dependencies

Install the server dependencies with npm or yarn:

```bash
$ npm install
# or yarn install
```

## Auth0 Setup

### API

1. Go to the [**Auth0 Dashboard - APIs**](https://manage.auth0.com/#/apis) section and click the "+ Create API" button.
2. Give your API a name like `Secure Dino API` and enter an identifier. The identifier will be the _audience_ claim for access tokens to call this API. The identifier should be `https://secure-dino-api`.
3. Go to the **Scopes** tab of your API's settings. Add `read:dino-details` and `write:dino-fav` as scopes.

### User Roles Rule

1. Go to the [**Auth0 Dashboard - Rules**](https://manage.auth0.com/#/rules) section and [create a new Rule](https://manage.auth0.com/#/rules/create). Choose the _Empty Rule_ template.
2. Give your rule a name. `Set user roles and add to tokens` would be appropriate.
3. Enter the following code in the Rule editor, replacing `{YOUR_FULL_EMAIL_HERE}` with your own email address:

```js
function (user, context, callback) {
  // Make sure the user has verified their email address
  if (!user.email || !user.email_verified) {
    return callback(new UnauthorizedError('Please verify your email before logging in.'));
  }
  user.app_metadata = user.app_metadata || {};
  var addRolesToUser = function(user, cb) {
    if (user.email && user.email === 'yi.mihi@gmail.com') {
      cb(null, ['editor']);
    } else {
      cb(null, []);
    }
  };

  addRolesToUser(user, function(err, roles) {
    if (err) {
      callback(err);
    } else {
      user.app_metadata.roles = roles;
      auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
        .then(function(){
          var namespace = 'https://secure-dino-api/roles';
          var userRoles = user.app_metadata.roles;
          context.idToken[namespace] = userRoles;
          context.accessToken[namespace] = userRoles;
          callback(null, user, context);
        })
        .catch(function(err){
          callback(err);
        });
    }
  });
}
```

## Node API Configuration

1. Open the `.env.sample` file.
2. Replace the `ISSUER_BASE_URL` value with your Auth0 domain with `https://` in front of it (e.g., `https://{your-tenant}.auth0.com`).
3. Enter the API identifier as the `ALLOWED_AUDIENCES` value. This should be `https://secure-dino-api` (as specified in the Auth0 setup above).
4. Replace the `ROLES_CLAIM_NAMESPACE` value with your collision-resistant custom JWT roles claim namespace. If you copied the rule code from the section above, this will be `https://secure-dino-api/roles`.
5. Remove the `.sample` extension to activate the file.

## Serve

To start the server locally, run the following command from the root of the folder containing your `server.js` file:

```bash
$ npm start
# nodemon server
```

## Usage

There are several endpoints available:

### GET `/api/dinosaurs`

This endpoint is _public_. It returns an array of objects with the following type:

```js
[
  {
    name: string,
    pronunciation: string,
    favorite?: boolean
  },
  {...}
]
```

### GET `/api/secure/dinosaur/:name`

This endpoint requires authorization with an access token. It returns a dinosaur object with the following type:

```js
{
  name: string;
  pronunciation: string;
  meaningOfName: string;
  diet: string;
  length: string;
  period: string;
  mya: string;
  info: string;
  favorite?: boolean;
}
```

Delegated access is available with the `read:dino-details` scope for access tokens issued by the `ISSUER_BASE_URL` you specify in the `.env` file (rename `.env.sample` and add your configuration).

### POST `/api/secure/fav`

This endpoint requires authorization with an access token. A post `body` must be sent with the request containing the name of the dinosaur that should be marked as a favorite.

The dinosaur favorite property will be toggled and the dinosaur's full details will be returned:

```js
{
  name: string;
  pronunciation: string;
  meaningOfName: string;
  diet: string;
  length: string;
  period: string;
  mya: string;
  info: string;
  favorite?: boolean;
}
```

The dinosaur simplified listing will also be updated to reflect favoriting activity. Changes will persist in the local user's instance until the local Node server is restarted. (Data is not stored anywhere outside of the JavaScript implementation, so it will not persist for multiple users or across sessions.)

Delegated access is available with the `write:dino-fav` scope for access tokens issued by the `ISSUER_BASE_URL` you specify in the `.env` file (rename `.env.sample` and add your configuration).

A user role of `'editor'` is also required in an array of roles contained in a custom claim in the access token. ([Instructions for doing so are here](#user-roles-rule).) You can add custom claims to your Auth0 tokens using [Auth0 Rules](https://manage.auth0.com/#/rules/create). You should set the [collision-resistant namespace](https://openid.net/specs/openid-connect-core-1_0.html#AdditionalClaims) for your rule in the `.env` file.

## License

[MIT](LICENSE)
