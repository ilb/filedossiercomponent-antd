# Filedossier frontend + components v2

## Setup
```
npm install --save @ilb/filedossiercomponent
```

Import styles (without css-modules!!!)
```js
import '@ilb/filedossiercomponent/styles/index.css';
```

Include privilegedAPI.js script in your app
```js
  // Nextjs example
  import Head from 'next/head';
  ...
  <Head>
    <script key="privilegedAPI" type="text/javascript" src="/privilegedAPI/web/scripts/privilegedAPI.js"></script>
  </Head>
```

WARNING!!! This package is already transpiled, you don't need to use `next-transpile-modules`
```
  // DO NOT DO THIS !!!
  transpileModules: ['@ilb/filedossiercomponent'],
```

## Usage

## development

1. `npm i react react-dom semantic-ui-react`
2. npm start