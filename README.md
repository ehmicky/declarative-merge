<img src="https://raw.githubusercontent.com/ehmicky/design/main/declarative-merge/declarative-merge.svg" width="600"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/declarative-merge.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/declarative-merge)
[![Node](https://img.shields.io/node/v/declarative-merge.svg?logo=node.js)](https://www.npmjs.com/package/declarative-merge)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

Merge objects/arrays declaratively.

- Objects: [deeply](#deep-merge), [shallowly](#shallow-merge), or
  [both](#nesting)
- Arrays: items can be [updated](#update), [merged](#merge), [added](#add),
  [inserted](#insert), [appended](#append), [prepended](#prepend),
  [deleted](#delete-1) or [set](#set)

# Use cases

This is intended for cases where objects/arrays manipulation in JavaScript is
not available.

For example, a library where shared configuration files can be extended.

```yml
extend: my-shared-config

# Deep merge
log:
  verbosity: silent
  # Shallow merge
  provider:
    _merge: shallow
    name: redis
    type: local
  # Delete properties
  output:
    _merge: delete

rules:
  # Update arrays deeply
  1:
    level: silent
  # Append arrays
  '-0':
    name: appendedRule
```

Or a server receiving network patch requests.

```http
PATCH /pets/0
```

<!-- prettier-ignore -->
```json5
{
  // Deep merge
  "capabilities": { "play": true },
  // Shallow merge
  "title": { "name": "felix", "_merge": "shallow" },
  // Append arrays
  "toys": { "-0": "newToy" }
}
```

# Examples

## Objects

### Deep merge

```js
import declarativeMerge from 'declarative-merge'

declarativeMerge({ a: 1, b: { c: 2 }, d: 3 }, { a: 10, b: { e: 20 } })
// { a: 10, b: { c: 2, e: 20 }, d: 3 }
```

### Shallow merge

```js
declarativeMerge(
  { a: 1, b: { c: 2 }, d: 3 },
  { a: 10, b: { e: 20 }, _merge: 'shallow' },
)
// { a: 10, b: { e: 20 }, d: 3 }
```

### No merge

```js
declarativeMerge(
  { a: 1, b: { c: 2 }, d: 3 },
  { a: 10, b: { e: 20 }, _merge: 'set' },
)
// { a: 10, b: { e: 20 } }
```

### Nesting

```js
// `_merge` can be specified in nested objects
declarativeMerge(
  { a: 1, b: { c: 2 }, d: 3 },
  { a: 10, b: { e: 20, _merge: 'set' } },
)
// { a: 10, b: { e: 20 }, d: 3 }

declarativeMerge(
  { a: 1, b: { c: 2 }, d: 3 },
  { a: 10, b: { e: 20, _merge: 'deep' }, _merge: 'set' },
)
// { a: 10, b: { c: 2, e: 20 } }
```

### Delete

```js
declarativeMerge(
  { a: 1, b: { c: 2 }, d: 3 },
  { a: 10, b: { e: 20, _merge: 'delete' } },
)
// { a: 10, d: 3 }
```

## Arrays

### Update

```js
// By default, arrays override each other
declarativeMerge({ one: ['a', 'b', 'c'] }, { one: ['X', 'Y'] }) // { one: ['X', 'Y'] }

// They can be updated instead using an object where the keys are the array
// indices (before any updates).
declarativeMerge(
  { one: ['a', 'b', 'c'], two: 2 },
  { one: { 1: 'X' }, three: 3 },
)
// { one: ['a', 'X', 'c'], two: 2, three: 3 }

// This works on top-level arrays too
declarativeMerge(['a', 'b', 'c'], { 1: 'X', 2: 'Y' }) // ['a', 'X', 'Y']
```

### Merge

```js
// If the new array items are objects, they are merged
declarativeMerge(
  [{ id: 'a' }, { id: 'b', value: { name: 'Ann' } }, { id: 'c' }],
  { 1: { value: { color: 'red' } } },
)
// [{ id: 'a' }, { id: 'b', value: { name: 'Ann', color: 'red' } }, { id: 'c' }]

declarativeMerge(
  [{ id: 'a' }, { id: 'b', value: { name: 'Ann' } }, { id: 'c' }],
  { 1: { value: { color: 'red' }, _merge: 'shallow' } },
)
// [{ id: 'a' }, { id: 'b', value: { color: 'red' } }, { id: 'c' }]
```

### Indices

```js
declarativeMerge(['a', 'b', 'c'], { '*': 'X' }) // ['X', 'X', 'X']
declarativeMerge(['a', 'b', 'c'], { '-1': 'X' }) // ['a', 'b', 'X']
declarativeMerge(['a', 'b', 'c'], { 4: 'X' }) // ['a', 'b', 'c', undefined, 'X']
```

### Add

```js
// Array of items can be used
declarativeMerge(['a', 'b', 'c'], { 1: ['X', 'Y'] }) // ['a', 'X', 'Y', 'c']
declarativeMerge(['a', 'b', 'c'], { 1: ['X'] }) // ['a', 'X', 'c']
declarativeMerge(['a', 'b', 'c'], { 1: [['X']] }) // ['a', ['X'], 'c']
```

### Insert

```js
// If the key ends with +, items are prepended, not replaced
declarativeMerge(['a', 'b', 'c'], { '1+': 'X' }) // ['a', 'X', 'b', 'c']
```

### Append

```js
declarativeMerge(['a', 'b', 'c'], { '-0': 'X' }) // ['a', 'b', 'c', 'X']
declarativeMerge(['a', 'b', 'c'], { '-0': ['X', 'Y'] }) // ['a', 'b', 'c', 'X', 'Y']
```

### Prepend

```js
declarativeMerge(['a', 'b', 'c'], { '0+': ['X', 'Y'] }) // ['X', 'Y', 'a', 'b', 'c']
```

### Delete

```js
declarativeMerge(['a', 'b', 'c'], { 1: [] }) // ['a', 'c']
```

### Set

```js
declarativeMerge({}, { one: { 0: 'X', 2: 'Z' } }) // { one: ['X', undefined, 'Z'] }
declarativeMerge({ one: true }, { one: { 0: 'X', 2: 'Z' } }) // { one: ['X', undefined, 'Z'] }
```

# Install

```bash
npm install declarative-merge
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## declarativeMerge(firstValue, secondValue, options?)

`firstValue` `any`\
`secondValue` `any`\
`options` [`Options`](#options)\
_Return value_: `any`

Merge `firstValue` and `secondValue`.

### Merge mode

[Any object can change](#nesting) the merge mode using a `_merge` property with
value [`"deep"`](#deep-merge) (default), [`"shallow"`](#shallow-merge),
[`"set"`](#no-merge) or [`"delete"`](#delete).

Arrays [can be merged using objects](#arrays) where the keys are the
[array indices](#update). Items can be [updated](#update), [merged](#merge),
[added](#add), [inserted](#insert), [appended](#append), [prepended](#prepend),
[deleted](#delete-1) or [set](#set).

The `_merge` property and array updates objects can only be used in
`secondValue`. They are left as is in `firstValue`.

### Cloning

`firstValue` and `secondValue` are not modified. Plain objects and arrays are
deeply cloned.

[Inherited](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
and
[non-enumerable properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)
are ignored.

### Options

Options are an optional object.

#### key

_Type_: `string | symbol`\
_Default_: `"_merge"`

Name of the property used to specify the [merge mode](#merge-mode).

```js
declarativeMerge({ a: 1 }, { b: 2, _mergeMode: 'set' }, { key: '_mergeMode' }) // { b: 2 }
```

Symbols can be useful to prevent injections when the input is user-provided.

```js
const mergeMode = Symbol('mergeMode')
declarativeMerge({ a: 1 }, { b: 2, [mergeMode]: 'set' }, { key: mergeMode }) // { b: 2 }
```

# Related projects

- [`set-array`](https://github.com/ehmicky/set-array): underlying module to
  [merge arrays](#arrays)
- [`wild-wild-utils`](https://github.com/ehmicky/wild-wild-utils): apply
  `declarative-merge` on multiple properties at once using this module's
  [`merge()` method](https://github.com/ehmicky/wild-wild-utils#mergetarget-query-value-options)

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/declarative-merge/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/declarative-merge/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
