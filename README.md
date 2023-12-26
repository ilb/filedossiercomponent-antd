# Filedossier frontend + components v2

## At the moment, only the FileContent component is available for use.

## Setup
```
npm install --save @ilb/filedossiercomponent
```

Import styles (without css-modules!!!)
```js
import '@ilb/filedossiercomponent/src/index.css';
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

This package is NOT transpiled, you need to use `next-transpile-modules`
```
  transpileModules: ['@ilb/filedossiercomponent'],
```

## Usage

## development

1. `npm i react react-dom antd @ant-design/icons`
2. `npm start`

0. 'npm i'
00. 'npm run dev'