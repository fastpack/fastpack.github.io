---
id: configuration
title: Configuration
sidebar_label: Configuration
---

## Overview

Currently Fastpack only accepts the configuration as command-line arguments.
The reason for it is simplicity and ease-of-use. We are thinking on some other
possible options (JSON/YAML/TOML configuration, guessing the proper
configuration), but all of those seem to be either clunky or too magical.
Moreover, you can easily emulate the "configuration file" using the simple
Shell scripting:

```
$ cat ./build.sh

#!/bin/bash
fpack \
    ./ui/index.js \
    -o build \
    -w \
    --dev \
    --nm "$(pwd)/node_modules" \
    --nm node_modules \
    --preprocess='^ui/.+\.js$' \
    --preprocess='^node_modules/components/.+\.js$'
```

Overall, we try to maintain the strict policy of adding new configuration
parameters - only add them if it is unavoidable. We have given up on the "zero
configuration" idea, but still trying to  preserve the simplisity as much as we
can.

**Please note**, fastpack is under heavy development now and these APIs are not
anywhere close to be absolutely stable. Very likely, there will be breaking
changes and additions in future releases.

## Parameters

### project directory

The working directory `fpack` binary was executed from. Typically, this will be
the root of your project containing the `package.json`, other configuration
files, and the source code. You cannot require/import the module outside of the
project directory. This is done for security reasons, so that
`require('../../etc/passwd')` is impossible. If you really need to access some
outside files, create the symlink inside and use it in `require()` or `import`
statements.


### entry points

The list of positional arguments to the `fpack` binary. For example:
```Bash
$ fpack '.' ui/index.js some-module
```
Defaults to `['.']`. `'.'` resolves in a following way:
- if `package.json` exists in the project directory, then following values will
  be used this order (first non-empty): `"module"`, `"main"`;
- if nothing of the above worked - use `index.js`.

There is one little trick `fpack` accounts for considering the entry point.
These 2 forms are considered identical, when specifying the entry point:
`./lib/index.js` and `lib/index.js`. This is done in order to simplify
command-line usage and Tab-completion.

### --development

By default `fpack` runs in **production** mode:
- `process.env.NODE_ENV` is replaced with the `"production"` string;
- all conditionals using `process.env.NODE_ENV` patched in a way that only
  "production" branch remains in the code;
- bundle is built in a *flat* way, removing the module structure, appying
  tree-shaking, and pre-optimizing for minification (much like Rollup does).
- [persistent cache](persistent-cache.md) is not used.

In **development** mode:
- `process.env.NODE_ENV` is replaced with the `"development"` string;
- all conditionals using `process.env.NODE_ENV` patched in a way that only
  "development" branch remains in the code;
- bundle is built in a *scoped* way, i.e. the Object containing all the modules
  and dependencies between those;
- **development** bundles are easier and faster to build;
- [watching](#watch) the filesystem only takes effect when executed in
  **development** mode.

### --output

Output directory. Defaults to `./bundle`. Shortcut: `-o`.

### --watch

Watch the filesystem and rebuild on file change. Has no effect without
`--development` flag. Shortcut: `-w`.

### --target

Build target. Defaults to `app`. Possible values:
- *app*: application target. No additional code generated.
- *esm*: EcmaScript modules target. One `export` statement is generated listing
  all the symbols from the first entry point
- *cjs*: CommonJS target. `module.exports = require('first entry point');`
  statement is added to the end of the bundle.

### --preprocess

Preprocess the file before adding it to the bundle. Can be added multiple
times. Has the following form: `PATTERN:PROCESSOR?OPTIONS[!...]`:
- `PATTERN` is the PCRE regular expression which will be applied to filename to
  check if processor should be applied to it.
- `PATTERN` is applied to a filename **excluding** the
  [project-directory](#project-directory). For example
  `/my/project/lib/index.js` will match the regexp `^lib.+js$`, but not
  `^/my.+js$`.
- `PROCESSOR` is one of `builtin` or [Webpack loader](webpack-loaders.md).
- `builtin` provides the set of JavaScript [transpilers](transpilers.md):
  stripping Flow types, object spread & rest operators, class properties
  (including statics), class/method decorators, and React-assumed JSX
  conversion.
- `builtin` could be omitted, i.e. `\.js$` and `\.js$:builtin` are equal.
- Webpack loader may accept some options in a form `'x=y&a=b`.
- You can apply several preprocessors to one file separating them using the
  `!`. In this case preprocessors are applied left to right.

Here is an example of packing the
[create-react-app](https://github.com/facebook/create-react-app)-based
application in **development** mode:
```Bash
fpack src/index.js \
    --development \
    --preprocess='^src.+\.js$' \
    --preprocess='\.svg$:url-loader' \
    --preprocess='\.css$:style-loader!css-loader?importLoaders=1!postcss-loader?path=postcss.config.js'
```

And **production**:
```Bash
fpack src/index.js \
    --preprocess='^src.+\.js$:babel-loader?filename=.babelrc' \
    --preprocess='\.svg$:file-loader?name=static/media/[name].[hash:8].[ext]&publicPath=http://localhost:4321/pack-cra/prod/' \
    --preprocess='\.css$:style-loader!css-loader?importLoaders=1!postcss-loader?path=postcss.config.js'
```

### --postprocess

Postprocess the content of a bundle through the external shell `COMMAND`.  The
content of the bundle will be sent to STDIN and STDOUT output will be
collected. If multiple commands are specified they will be applied in the order
of appearance. **Note**, this parameter is very likely to change its form, once
`fpack` is able to produce chunked bundles.

### --node-modules

Provide the list of 'node_modules' locations. Defaults to `[node_modules]`. If
absolute path is specified, it is taken as is, otherwise every parent directory
is searched up to the [project-directory](#project-directory).
Shortcut: `--nm`.

### --no-cache

Do not use [persistent cache](persistent-cache.md). Has no effect in the
**production** mode since persistent cache is not used anyway.

### --debug
Print debugging output.

### --version
Display version and exit.

### --help
Display help message.
