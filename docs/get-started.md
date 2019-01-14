---
id: get-started
title: Get Started
sidebar_label: Get Started
---

## What is it?

Fastpack is a lightweight JavaScript bundler, providing functionality similar
to [Webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/) or
[Rollup](https://rollupjs.org/). The main feature, which makes it unique is its
speed. It is truly fast, see [benchmarks](benchmarks.html)! Please note, that
Fastpack is at the **early pre-alpha** stage, lacking a lot of features other
bundlers provide. Use at your own risk! Feel free to [report a
bug](https://github.com/fastpack/fastpack/issues) or
[contribute](contribute.html) in some other way!

## Installation

```Bash
$ npm install -g fpack
```
Or
```Bash
$ yarn global add fpack
```

If everything worked well, you should be able to run:
```Bash
$ fpack --help
```

Fastpack relies on [watchman](https://facebook.github.io/watchman/) to track
the filesystem changes. If you plan to use fastpack for development, refer to
[this page](https://facebook.github.io/watchman/docs/install.html) for
installing `watchman` for your OS.

If you are planning to use the integration with Webpack loaders, you need to
have Node version 8 or above.

## In a nutshell

Fastpack currently can:
- quickly build bundle in development and production modes;
- apply [tree
  shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) when
  used in production mode;
- utilize the persistent cache to speed up the building when restarted;
- watch for file changes and rebuild;
- [transpile](transpilers.md) minimum required of non-standard features to
  work in evergreen browsers (React JSX, strip Flow, object spread & class
  properties/decorators);
- interoperate with the most common [Webpack loaders](webpack-loaders.md) to
  include CSS and static files;
- accept certain configuration parameters as command-line arguments;

Fastpack lacks (yet!):
- splitting bundle into multiple chunks (e.g. `import()` expressions);
- source maps support;
- development server / hot module reloading;
- Windows support (currently works on MacOS & Linux only);
- easy JavaScript integration;

Most of the lacking features listed above are in a plan though. See
[roadmap](roadmap.md) and don't hesitate to [contibute](contribute.md) -
working with Ocaml is so much fun!

## Example

Here is an example of the `fpack` usage:
```bash
$ fpack ./ui/index.js \
    -o build \
    -w \
    --dev \
    --nm "$(pwd)/node_modules" \
    --nm node_modules \
    --preprocess='^ui/.+\.js$' \
    --preprocess='^node_modules/components/[^/]+\.js$'

Packed in 2.148s. Bundle: 5.87Mb. Modules: 1602. Cache: empty. Mode: development.
Watching file changes (Ctrl+C to stop)

$ fpack ./ui/index.js \
    -o build \
    -w \
    --dev \
    --nm "$(pwd)/node_modules" \
    --nm node_modules \
    --preprocess='^ui/.+\.js$' \
    --preprocess='^node_modules/components/[^/]+\.js$'

Packed in 0.176s. Bundle: 5.87Mb. Modules: 1602. Cache: used. Mode: development.
Watching file changes (Ctrl+C to stop)
```
As you can see `fpack` only accepts configuration as command-line arguments.
The second run is ~10 times faster than the first because of the persistent
cache. Rough flag meanings are:
- `./ui/index.js` denotes the entry point, this is the only positional
  argument;
- `-o` specifies the name of the output directory, the bundle file will be
  named `build/index.js`;
- `-w` watch mode;
- `--nm` specifies the paths for resolving the package dependencies;
- `--preprocess` specifies the filename patterns to be
  [transpiled](transpilers.html).

See detailed description of the configuration parameters [here](configuration.html).


## Thank you!

Fastpack would not be possible without prior work performed in following projects:

- [OCaml](http://ocaml.org/): I cannot describe the pleasure working with this
  language, you should try it yourself!
- [Flow](https://flow.org/): We used their parser/AST code as the base.
- [Esy](https://esy.sh/): `package.json`-driven virtual environment for OCaml.
  Helps a lot to install/update dependencies, make releases and keep
  the environment sane.
- All of these great libraries: [Lwt](https://ocsigen.org/lwt/),
  [Cmdliner](http://erratique.ch/software/cmdliner),
  [Containers](https://c-cube.github.io/ocaml-containers/), and [many
  more](https://github.com/fastpack/fastpack/blob/master/package.json#L38).

