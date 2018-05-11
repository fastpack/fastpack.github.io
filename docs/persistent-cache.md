---
id: persistent-cache
title: Persistent Cache
sidebar_label: Persistent Cache
---

Fastpack stores some valuable data about the project structure, filesystem and
loaded modules in the persistent cache. This permits to improve the building
speed after the restart. The cache files reside in the `<project
directory>/node_modules/.cache/fpack` or `<project directory>/.cache/fpack` if
`<project directory>/node_modules` does not exist.

Persistent cache is used in **development** mode only. If you want to disable
cache for some reason - use the [--no-cache](configuration.md#no-cache) flag.
Alternatively, you may delete the cache directory entirely.

Fastpack uses the
[Marshal](https://caml.inria.fr/pub/docs/manual-ocaml/libref/Marshal.html)
module to save/load the cache. Don't try to edit produced files manually, since
it may follow to *Segmentation fault* errors.
