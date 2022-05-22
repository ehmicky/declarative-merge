# 2.0.0

## Breaking changes

- Empty objects in the second argument are considered as normal objects. Before,
  they were considered as noop [array update objects](README.md#arrays).
- If an [array update object](README.md#arrays) is used but the first argument's
  value is not an array (including `undefined`), the array update object is
  applied against an empty array. Before, it was set as is.

# 1.0.1

## Bug fixes

- Fix deep cloning: it was not being performed on arrays
