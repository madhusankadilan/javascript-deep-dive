/**
 * 7 primitive types: string, number, bigint, boolean, undefined, null, and symbol
 * Everything else is an object, including arrays, functions, and dates.
 * Primitives are immutable and copied by value.
 * Objects live in the heap, and a variable holds only a reference to them.
 * JS always passes arguments by value.
 * For an object, that value is the reference, so a function can change the object's properties but cannot replace the caller's variable.
 * This is sometimes called "call by sharing."
 * typeof quirks: typeof null is "object" (a bug from 1995 kept for compatibility).
 * typeof of an array is "object", so use Array.isArray. typeof of a function is "function".
 */