# Infratographer web UI

## Local development

Make sure you have npm (e.g. on Mac `brew install node`).

Install npm packages:

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
