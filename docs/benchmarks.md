---
id: benchmarks
title: Benchmarks
sidebar_label: Benchmarks
---

All benchmarks are collected on a real project consisting of **1602 modules**,
resulting bundle size is **~5.8Mb** unzipped.  We have used 13" MacBook Pro 2015.


|                       |Fastpack|Fastpack+Babel|Webpack 4.6.0|Parcel 1.5.1
|-----------------------|:------:|:------------:|:-----:|:----:
|initial build          | **2.148s**  | 3.383s | 6.113s | 24.32s
|- persistent cache | **0.176s**  | 0.219s | N/A | 14.88s
|- watch mode   | **0.074s**  | 0.171s | 0.612s  | 0.354s


- all bundlers started 5 times and the best result was taken
- same for the watch mode: file was modified several times
- **Parcel** results may not be representative since we didn't manage to
  configure it specifically, so very likely it does more than we need.
- `.babelrc` used for last 3 configurations:
  ```JavaScript
    {
      "presets": ["next/babel"],
      "plugins": ["transform-flow-strip-types", "react-native-web"]
    }
  ```

## Fastpack

Here is the command line used to build, no additional configuration specified:

```Bash
$ fpack \
    ./ui/index.js \
    -o build \
    -w \
    --development \
    --node-modules "$(pwd)/node_modules" \
    --node-modules node_modules \
    --preprocess='^ui/.+\.js$' \
    --preprocess='^node_modules/components/[^/]+\.js$'
```

## Fastpack+Babel

It may be slower or faster depending on the [Babel](http://babeljs.io/)
configuration.

```Bash
$ fpack \
    ./ui/index.js \
    -o build \
    --development \
    -w \
    --node-modules "$(pwd)/node_modules" \
    --node-modules node_modules \
    --preprocess='^ui/.+\.js$:babel-loader?filename=.babelrc&sourceMap=false' \
    --preprocess='^node_modules/components/[^/]+\.js$:babel-loader?filename=.babelrc&sourceMap=false'
```

## Webpack

The command-line used:
```Bash
$ webpack --mode development --config webpack.config.js --watch
```

`webpack.config.js`:
```JavaScript
const path = require("path");
module.exports = {
  entry: "./ui/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "index_bundle_webpack.js"
  },
  resolve: {
    modules: [path.join(process.cwd(), 'node_modules'), './node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: require.resolve("babel-loader"),
      },
      {
        test: /^node_modules\/components\/[^\/]+\.js?$/,
        use: require.resolve("babel-loader"),
      }
    ]
  }
};
```

## Parcel

As stated above, we were unable to configure Parcel in order to emulate the same
behaviour as Webpack/Fastpack. So, very likely, Parcel simply does more than we
need it to do. On the other hand, we are feeling OK to take the
"zero-configuration" metaphor literally and just tweaked it to exclude
source maps and hot module reloading. Here is the command line used:

```Bash
$ parcel watch --no-hmr --no-source-maps ui/index.js
```
