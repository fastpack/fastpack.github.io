---
id: webpack-loaders
title: Webpack Loaders
sidebar_label: Webpack Loaders
---

Fastpack could integrate Webpack loaders to support custom file formats, use
Babel for transpiling and, actually, for any other reason you may have :) You
can specify the desired behavior using the
[--preprocess](configuration.md#preprocess) argument. Here is a quick example,
which should look familiar:
```Bash
fpack src/index.js \
    --preprocess='^src.+\.js$:babel-loader?filename=.babelrc' \
    --preprocess='\.svg$:file-loader?name=static/media/[name].[hash:8].[ext]&publicPath=http://example.com/' \
    --preprocess='\.css$:style-loader!css-loader?importLoaders=1!postcss-loader?path=postcss.config.js'
```

There are couple of limitations though:
- The project's `package.json` should list `loader-runner` as the dependency.
- Fastpack ignores the `cacheable` flag of the loader result. No matter what,
  the result will be cached, so consider using **deterministic** loaders only.
- Options are limited to query string format only. This means that `Function`
  values are not supported.
- Your favourite loader may not work. [Let us
  know!](https://github.com/fastpack/fastpack/issues)

## babel-loader

The Fastpack specifics is to pass the config location in the `filename` option.
When integrated with Webpack this seems to happen automatically. Otherwise,
we've found the integration to be working perfectly fine.

## file-loader

Fastpack does not define the `__webpack_public_path__` variable. So, you cannot
rely on it when using the `file-loader`. Specify it manually in the
`publicPath`, like this:
```Bash
fpack src/index.js \
    --preprocess='\.svg$:file-loader?publicPath=http://example.com/' \
```

## ts-loader

`ts-loader` seems to be doing some smart things and accounts for Webpack
internals. We got it working, but it may be slow. The other thing to mention
here is the fact, that Fastpack does not support guessing other file extensions
except of `.js` and `.json`. So, you will need to use `./module.ts` requests
when importing modules or specifying entry points.

## Other tested loaders

Following loaders were tested and used (with the limitations above):
- `url-loader`
- `raw-loader`
- `style-loader`
- `css-loader`
- `postcss-loader`
