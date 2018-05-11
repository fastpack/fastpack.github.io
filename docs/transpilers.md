---
id: transpilers
title: Transpilers
sidebar_label: Transpilers
---

Fastpack implements four basic transpilers to convert non-standard language
features and make the code work in the evergreen browsers. The idea behind
implementing them was to make mininum required conversion as fast as possible
without the dependency on the external tools.

By default, none of the files are transpiled. You need to explicitely use the
[--preprocess](configuration.md#preprocess) argument to specify which files
should be converted.

It is enough to just specify the PCRE regular expression there like this:
```Bash
$ fpack --preprocess='^ui/.+\.js$'
```

Or, alternatively, use the complete form:
```Bash
$ fpack --preprocess='^ui/.+\.js$:builtin'
```

The `builtin` is the name of the preprocessor including all 4 of the
transpilers. It does not accept any additional options, as well as, it is
impossible to apply some of the transpilers, but not others.

If you need more granular control over the code conversion, take a look at
[babel-loader integration](webpack-loaders.md#babel-loader). 


## Strip Flow types
```JavaScript
export function getIteratorFn(maybeIterable: ?any): ?() => ?Iterator<*> {
return null;
}
// =>
export function getIteratorFn(maybeIterable) { return null; }
```

## Convert JSX tags
```JavaScript
<div className="x" {...props} width={100} />;
// =>
React.createElement("div", Object.assign({}, {"className": "x"}, props, {"width": 100}));
```
Currently, we only assume React and ignore the **@jsx** pragma.

## Object spread/rest operators
```JavaScript
({ x, ...y, a, ...b, c, inner: {some, ...rest} });
var {a, ...b} = {a: 1, b: 2, c: 3};
// =>
Object.assign({}, {x}, y, {a}, b, {c, inner: Object.assign({}, {some}, rest)});
var __fpack__8 = {a: 1, b: 2, c: 3},
  {a} = __fpack__8,
  b = $__fpack__.omitProps(__fpack__8, ["a"]);
```

## Class properties and decorators
```JavaScript
@cls
class C6 extends C5 {
  prop_int = 1;
  static static_prop;

  @m
  method() {}

  constructor() {
    before_super1();
    before_super2();
    super();
    after_super_and_props();
  }
}
// =>
let C6 = $__fpack__.defineClass(class C6 extends C5 {
    constructor() {
      before_super1();
      before_super2();
      super();
      Object.defineProperty(this, "prop_int", {"configurable": true, "enumerable": true, "writable": true, "value": 1});
      after_super_and_props();
    }
  }, [
  {"name": "static_prop", "value": void 0}],
  [cls],
  [{"method": "method", "decorators": [m]}]);
```
