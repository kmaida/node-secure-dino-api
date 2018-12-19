# node-api-dinos-secure

Node.js OAuth 2.0 API with public and secure endpoints and delegated authorization.

## Install Dependencies

Install the server dependencies with npm or yarn:

```bash
$ npm install
# or yarn install
```

## Serve

To start the server, run the following command from the root of the folder containing your `server.js` file:

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
    pronunciation: string
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

Delegated access is available with the `write:dino-fav` scope for access tokens issued by the `ISSUER_BASE_URL` you specify in the `.env` file (rename `.env.sample` and add your configuration).

### GET `/api/secure/admin`

This endpoint requires authorization with an access token. A simple JSON object is returned confirming the user is an admin.

```
{
  message: 'Congratulations, you are an Admin!'
}
```

Delegated access is available with the `read:admin` scope for access tokens issued by the `ISSUER_BASE_URL` you specify in the `.env` file (rename `.env.sample` and add your configuration).

A user role of `'admin'` is also required in an array of roles contained in a custom claim in the access token. You can add custom claims to your Auth0 tokens using [Auth0 Rules](https://manage.auth0.com/#/rules/create). You should set the [collision-resistant namespace](https://openid.net/specs/openid-connect-core-1_0.html#AdditionalClaims) for your rule in the `.env` file.

## License

[MIT](LICENSE)
