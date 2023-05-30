# Infratographer web UI

## Running locally

Copy the provided example config and override the settings as needed:

```
cp .env.example .env.local
```

For example, you may need to use a different OIDC client id (currently this UI only supports Google oauth - you can configure your app by following the guide at https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

Also by default the UI will expect to find a local instance of the Infratographer Apollo federated API at `http://localhost:4000` - you can deploy that from https://github.com/nicolerenee/compose-stack.

Now build the docker image (`docker compose up`) and head over to `http://localhost:8080`.

## Local development

To make changes to the UI it's easier to just run it with npm.
If you don't have it yet, install npm (e.g. on Mac `brew install node`).

Install npm packages for the UI:

```
npm install
```

Copy the provided example config, which should work when connecting the UI to a local Infratographer GraphQL API:

```
cp .env.example .env.local
```

Start locally (with hot reloading):

```
npm run dev
```

Some other useful commands are listed below.

Run linter (will enforce style) - [ESLint](https://eslint.org/):

```
npm run lint
```

Compile and minify for production:

```
npm run build
```

Update all dependencies:

```
npm update
```
