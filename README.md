# node-api-dinos-secure

## Install Dependencies

Install the server dependencies with npm or yarn:

```bash
$ npm install
# or yarn install
```

## Serve

To start the server, run the following command from the root of the folder containing your `server.js` file:

```bash
$ node server
```

Alternatively, you could install [nodemon](https://nodemon.io/), which monitors the server for changes and restarts it automatically:

```bash
$ npm install -g nodemon
$ nodemon server
```

> **Note:** To install `nodemon` globally, you may need to use `sudo` (Mac/Linux) or run your command prompt as Administrator (Windows).

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

### GET `/api/dinosaur/:name`

This endpoint requires authentication. It returns a dinosaur object with the following type:

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

Delegated access is available with the `read:dino-details` scope for bearers of access tokens issued by the `ISSUER_BASE_URL` you specify in the `.env` file (rename `.env.sample` and add your configuration).

### POST `/api/fav`

This endpoint requires authentication. A post `body` must be sent with the request containing the name of the dinosaur that should be marked as a favorite.

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

Delegated access is available with the `write:dino-fav` scope for bearers of access tokens issued by the `ISSUER_BASE_URL` you specify in the `.env` file (rename `.env.sample` and add your configuration).
