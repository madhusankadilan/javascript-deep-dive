/**
 * ── COERCION ───────────────────────────────────────────────
 * Coercion means converting a value from one type to another. There are 2 types:
 * 1. Explicit conversion: You convert on purpose:
 *     > Number("5") → 5
 *     > String(5) → "5"
 *     > Boolean("") → false
 * 2. Implicit conversion: JS silently converts the value for you because an operator needs a different type.
 *    JS only ever converts to 3 types: string, number, boolean.
 *
 * Sections 1–8 are grouped BY OPERATOR: find the operator you're reading, then follow its rules.
 * Sections 9–11 cover coercion outside those operators, when it throws, and how an object controls it.
 *
 * ── 1. +  (binary plus) ───────────────────────────────────
 *      > Step 1: Objects → primitive (valueOf, then toString; a Date tries toString first)
 *      > Step 2: Either side a string? → both become strings and join
 *      > Step 3: Otherwise (no string on either side) → both become numbers (Number() rules, section 8) and add
 *          > true + 1 = 2        (true → 1)
 *          > null + 1 = 1        (null → 0)
 *          > undefined + 1 = NaN (undefined → NaN)
 *        Step 1 runs before step 2, and arrays/objects usually become strings, so they join instead:
 *          > [5] + 1 = "51"      ([5] → "5", a string)
 *
 *      > Evaluated left to right, so a string "infects" only what comes after it
 *          > "5" + 2 = "52"
 *          > 1 + 2 + "3" = "33"
 *          > "1" + 2 + 3 = "123"
 *
 *      > Objects → primitive (this step is shared by EVERY operator that needs a primitive)
 *          > [] + [] = ""
 *          > [1,2] + [3] = "1,23"
 *          > {} + "" = "[object Object]"
 *
 *      When + gets an object (arrays are objects too), it can’t add objects directly. So it first turns each object into a primitive (a string or number), then does normal +.
 *      To do that conversion, JavaScript tries two methods in order:
 *          > valueOf(): if this returns a primitive, use it.
 *          > toString(): otherwise, use this.
 *
 *      For plain arrays and objects, valueOf() just returns the object itself (not a primitive), so it’s useless here and JavaScript falls back to toString().
 *      In practice, arrays and objects become strings.
 *
 *      Exceptions to the valueOf → toString order:
 *          > Template literals and String(x) want a string, so they try toString() first. (see section 7)
 *          > Date objects with + also try toString() first, so + with a Date joins as strings.
 *
 *      What toString() gives:
 *          > [].toString()        // ""          (empty array → empty string)
 *          > [1,2].toString()     // "1,2"       (items joined with commas)
 *          > [3].toString()       // "3"
 *          > ({}).toString()      // "[object Object]"
 *
 *      Once both sides are strings, + just glues them together:
 *          > [] + [] => "" + ""  →  ""
 *          > [1,2] + [3] => "1,2" + "3"  →  "1,23"
 *          > {} + "" => "[object Object]" + ""  →  "[object Object]"
 *
 *      Console gotcha: typing {} + "" at the START of a line in a browser console gives 0.
 *      There, {} is read as an empty code block, leaving +"" → 0.
 *      Inside an expression, like log("x", {} + ""), it's "[object Object]".
 *
 * ── 2. - * / % **  and unary + - ──────────────────────────
 *      > Always number; there is no string behaviour
 *      > Objects → primitive (valueOf, then toString, see section 1) → number
 *      > Anything invalid → NaN
 *          > "5" - 2 = 3
 *          > +"42" = 42
 *          > "abc" * 1 = NaN
 *
 * ── 3. < > <= >= ──────────────────────────────────────────
 *      > Objects first become primitives (valueOf, then toString, see section 1). Then the rules below apply.
 *        Plain objects all become "[object Object]", whatever properties they have, so comparing two is meaningless.
 *          > {} > {}                    // false  "[object Object]" > "[object Object]"
 *          > { name: "Dilan" } > {}     // false  properties are ignored by toString()
 *          > {} >= {}                   // true   equal strings
 *          > {} == {}                   // false  == never converts two objects; they're different objects
 *        Compare a property instead: a.age > b.age
 *      > At least one side is not a string → compare as numbers. Both sides are converted with the Number() rules in section 8, then compared normally.
 *          > 10 < 9        // false
 *          > "10" < 9      // false  "10" → 10, then 10 < 9
 *          > true > 0      // true   true → 1
 *          > null < 1      // true   null → 0
 *          > "abc" < 5     // false  "abc" → NaN, and any comparison with NaN is false
 *      > Both sides are strings → compare like a dictionary. No number conversion happens.
 *        JavaScript compares character by character, left to right, and stops at the first difference.
 *          > "10" < "9"
 *              // compare 1st characters: "1" vs "9"
 *              // "1" comes before "9" → true
 *              // it never looks at the "0"
 *          > "apple" < "banana"  // true
 *          > "100" < "25"        // true  ("1" < "2")
 *          > "Zebra" < "apple"   // true  (uppercase letters come before lowercase)
 *
 * ── 4. ==  != (loose equality) ────────────────────────────
 *      > If the types differ, == converts one or both sides first, then compares. (!= is the opposite result)
 *          > 5 == "5"      // true   "5" → 5, then 5 === 5
 *          > 0 == false    // true   false → 0, then 0 === 0
 *          > "" == 0       // true   "" → 0
 *      > Same type → behaves like ===
 *      > Roughly, == follows these rules when the types differ:
 *          > null and undefined equal each other and nothing else.
 *              > null == undefined   // true
 *                  if (x == null) { ... }
 *                  // same as
 *                  if (x === null || x === undefined) { ... }
 *              > null == 0           // false
 *              > null == ""          // false
 *              > undefined == false  // false
 *          > Boolean involved: convert the boolean to a number first (true → 1, false → 0).
 *          > String vs number: convert the string to a number.
 *          > Object vs primitive: convert the object to a primitive (the valueOf/toString step from section 1), then compare again.
 *          > Object vs object: no conversion. True only if both sides are the SAME object (same as ===).
 *          > NaN never equals anything, even itself. NaN means “not a valid number”, and JavaScript treats two invalid numbers as unequal.
 *              > NaN == NaN    // false
 *              > NaN === NaN   // false
 *              > Number.isNaN(NaN)        // true  ← use this
 *              > Number.isNaN(+"abc")     // true
 *
 * ── 5. ===  !==  Object.is (strict equality) ──────────────
 *      > === checks type and value, with no conversion. If the types differ, the answer is immediately false.
 *          > 5 === 5       // true
 *          > 5 === "5"     // false  (number vs string)
 *          > 0 === false   // false  (number vs boolean)
 *      > Objects: equal only if they are the same object
 *      > Object.is(a, b)
 *          > === gets these "wrong"
 *              NaN === NaN       // false
 *              0 === -0          // true
 *
 *          > Object.is gets them "right"
 *              Object.is(NaN, NaN)   // true
 *              Object.is(0, -0)      // false
 *
 *          > everything else: same as ===
 *              Object.is(5, 5)       // true
 *              Object.is(5, "5")     // false
 *              Object.is({}, {})     // false (different objects)
 *
 * ── 6. if  !  ? :  while  &&  || (boolean contexts) ───────
 *      > Test truthiness only; objects never call valueOf/toString
 *      > ! always returns a boolean: it converts the value to a boolean (truthy/falsy), then flips it
 *          > !"hello"    // false   "hello" is truthy → true → flipped to false
 *          > !""         // true    "" is falsy → false → flipped to true
 *          > !0          // true
 *          > ![]         // false   every object is truthy
 *          > !null       // true
 *        !! flips twice, so !!x gives x's truthiness as a boolean (same as Boolean(x)):
 *          > !!"hello"   // true
 *          > !!0         // false
 *          > !!null      // false
 *      > && and || only CHECK truthiness. They return one of the original values, not true/false:
 *          > "" || "default"   // "default"  ("" is falsy, so || returns the right side)
 *          > 0 && "x"          // 0          (0 is falsy, so && stops and returns it)
 *      > ?? is different: it only checks for null/undefined (no truthiness)
 *      > Only 8 falsy values:
 *          1. false
 *          2. 0
 *          3. -0
 *          4. 0n // BigInt zero
 *          5. "" // Empty string
 *          6. null
 *          7. undefined
 *          8. NaN
 *      > Everything else is truthy
 *      > Truthy traps: values that look empty or false
 *          1. Boolean("0")      // true  — non-empty string (has a character in it)
 *          2. Boolean("false")  // true  — non-empty string, the word doesn't matter
 *          3. Boolean(" ")      // true  — a space is still a character
 *          4. Boolean([])       // true  — every object is truthy, even empty ones
 *          5. Boolean({})       // true
 *
 * ── 7. `${x}`  String(x) ──────────────────────────────────
 *      > Always string; objects try toString first (the exception from section 1)
 *      These are the rules every string conversion uses (+ with a string, template literals, String()).
 *      > Primitives become their literal text:
 *          > String(123)        // "123"
 *          > String(true)       // "true"
 *          > String(null)       // "null"
 *          > String(undefined)  // "undefined"
 *          > String(NaN)        // "NaN"
 *      > -0 loses its sign:
 *          > String(-0)         // "0"
 *      > Very large or very small numbers use exponent notation:
 *          > String(1e21)       // "1e+21"
 *          > String(0.0000005)  // "5e-7"   (this is why parseInt(0.0000005) gives 5, see 8n)
 *      > Arrays: items joined with commas, nested arrays flatten, and null/undefined items become empty:
 *          > String([1, [2, 3]])        // "1,2,3"
 *          > String([null, undefined])  // ","
 *          > [null] + ""                // ""
 *      > Plain objects → "[object Object]"
 *      > BigInt → digits without the n:
 *          > String(10n)        // "10"
 *      > Symbol → only explicitly; implicit conversion throws (section 10):
 *          > String(Symbol("id"))  // "Symbol(id)"
 *
 * ── 8. Number(x) ──────────────────────────────────────────
 *      These are the rules every number conversion uses (sections 2, 3 and 4).
 *      > Strings: trim whitespace, then parse. An empty result is 0, and anything not a valid number is NaN.
 *          > Number("")      // 0    empty string → 0
 *          > Number(" ")     // 0    trimmed to "" → 0
 *          > Number("42")    // 42
 *          > Number("abc")   // NaN  not a number
 *      > null vs undefined: null means “intentionally empty”, which converts to 0. undefined means “no value at all”, which converts to NaN.
 *          > Number(null)       // 0
 *          > Number(undefined)  // NaN
 *      > Booleans: true is 1 and false is 0.
 *          > Number(true)    // 1
 *          > Number(false)   // 0
 *      > Arrays: convert to a string first (via toString, see section 1), then apply the string rule.
 *          > Number([])      // [] → "" → 0
 *          > Number([5])     // [5] → "5" → 5
 *          > Number([1,2])   // [1,2] → "1,2" → NaN (comma isn't valid in a number)
 *      > Plain objects: also string first, and that string is never a number.
 *          > Number({})      // {} → "[object Object]" → NaN
 *      > parseInt/parseFloat: read digits until they hit an invalid character
 *        (they convert their input to a string first)
 *
 * ── 9. Other places coercion happens ──────────────────────
 *      > Object property keys → always strings (only Symbols stay as they are)
 *          > obj[1] is the same as obj["1"]
 *          > obj[{}] uses the key "[object Object]", so every plain object used as a key is the SAME key
 *          > A Map keeps keys as they are: map.get(1) and map.get("1") are different
 *      > isNaN(x) converts to a number first; Number.isNaN(x) does not
 *          > isNaN("abc")         // true   "abc" → NaN
 *          > Number.isNaN("abc")  // false  it's a string, not NaN
 *          > isNaN("")            // false  "" → 0
 *      > Bitwise operators | & ^ ~ << >> >>> convert to a 32-bit integer (decimals are dropped)
 *          > "5.7" | 0     // 5
 *          > ~~"12.9"      // 12
 *          > "abc" | 0     // 0   (NaN becomes 0 here)
 *      > Assignment shortcuts follow their operator's rule
 *          > x += 1 is x = x + 1, so it joins if x is a string (section 1)
 *          > x++ and x-- always convert to a number (section 2)
 *      > switch compares with ===, so there's no conversion
 *          > switch ("1") { case 1: ... }   // never matches
 *      > Math functions convert their arguments to numbers
 *          > Math.max("5", 2)   // 5
 *          > Math.max("a", 2)   // NaN
 *      > Array sort() with no compare function converts items to strings (see 3r–3t)
 *
 * ── 10. When coercion throws (TypeError) ──────────────────
 *      > BigInt and Number never mix in math. Convert one side explicitly.
 *          > 1n + 1             // TypeError
 *          > 1n + BigInt(1)     // 2n
 *          > Number(1n) + 1     // 2
 *          > +1n                // TypeError (unary + isn't allowed on BigInt)
 *        Comparisons, == and string joins still work:
 *          > 1n < 2             // true
 *          > 1n == 1            // true
 *          > 1n === 1           // false  (different types)
 *          > 1n + "x"           // "1x"
 *      > Symbols never convert implicitly to a string or number
 *          > `${Symbol("id")}`     // TypeError
 *          > Symbol("id") + ""     // TypeError
 *          > String(Symbol("id"))  // "Symbol(id)"   explicit is fine
 *          > Boolean(Symbol("id")) // true           to boolean is fine
 *      > Objects with no usable valueOf/toString can't become primitives
 *          > Object.create(null) + ""   // TypeError (it has no valueOf or toString at all)
 *
 * ── 11. Symbol.toPrimitive (an object controls its own conversion) ──
 *      > If an object has a [Symbol.toPrimitive](hint) method, JS calls it INSTEAD of valueOf/toString.
 *      > The hint tells the method what the operator wants:
 *          > "number"  → - * / % < > and unary + -   (sections 2, 3)
 *          > "string"  → template literals, String()  (section 7)
 *          > "default" → + and ==                     (sections 1, 4)
 *      > Date defines this method and treats "default" like "string". That's the Date exception in section 1.
 *      > It must return a primitive; returning an object throws a TypeError.
 *
 * ── GOLDEN RULES ──────────────────────────────────────────
 *      > Use ===; the only accepted == is x == null
 *      > REAL-WORLD: input values, query params, env vars, and
 *        localStorage are ALWAYS strings. Convert at the boundary.
 *      > Convert explicitly; don't rely on implicit conversion
 */

const show = (v) =>
  typeof v === "string" ? `"${v}"` : typeof v === "bigint" ? `${v}n` : String(v);
const log = (label, v) => console.log(label.padEnd(4), show(v));
// For expressions that may throw: prints the error name instead of crashing the file
const tryLog = (label, fn) => {
  try { log(label, fn()); } catch (e) { console.log(label.padEnd(4), `throws ${e.name}`); }
};

// ─────────────────────────────────────────────────────────────
// 1. +  (binary plus)
// ─────────────────────────────────────────────────────────────
console.log("\n--- 1. + (binary plus) ---");
log("1a", "hello" + 2);        // I think:
log("1a", "5" + 2);            // I think:
log("1b", 2 + "5");            // I think:
log("1c", 1 + 2 + "3");        // I think:   (left to right!)
log("1d", "1" + 2 + 3);        // I think:
log("1e", "1" + (2 + 3));      // I think:   (parentheses change the order)
log("1f", true + "1");         // I think:
log("1g", null + "x");         // I think:
log("1gg", undefined + "y");         // I think:

// No string on either side → both become numbers and add
log("1h", true + 1);           // I think:
log("1i", null + 1);           // I think:
log("1j", undefined + 1);      // I think:

// Objects → primitive: what valueOf() and toString() return
log("1k", [].valueOf());       // I think:
log("1l", {}.valueOf());       // I think:
log("1m", [].toString());      // I think:
log("1n", [1, 2].toString());  // I think:
log("1o", {}.toString());      // I think:
log("1p", { name: "Dilan" }.toString()); // I think:

// Objects with +
log("1q", [] + []);            // I think:
log("1r", [1, 2] + [3]);       // I think:
log("1s", [] + {});            // I think:
log("1uu", [] + new Map());            // I think:
log("1uu", [] + new Set());            // I think:
log("1t", {} + "");            // I think:
log("1u", [5] + 1);            // I think:   (compare with 2j: [5] * 2)

const money = { valueOf() { return 42; }, toString() { return "forty-two"; } };
log("1v", money + 1);          // I think:   (valueOf wins for +)

// new Date(0) = Unix epoch (1970-01-01T00:00:00Z), i.e. 0 ms since epoch.
// Fixed value (not new Date()) so the output is the same on every run.
const epoch = new Date(0);
log("1w", typeof (epoch + 1)); // I think:   (Date is the exception: + prefers string)

const user = { name: "Ana" };
log("1x", "Hello " + user);    // I think:

// ─────────────────────────────────────────────────────────────
// 2. - * / % **  and unary + -  -> always number
// ─────────────────────────────────────────────────────────────
console.log("\n--- 2. math operators convert to number ---");
log("2a", "5" - 2);            // I think:
log("2b", "5" * "2");          // I think:
log("2c", "10" / "4");         // I think:
log("2d", "7" % 2);            // I think:
log("2e", +"42");              // I think:   (unary + = quick Number())
log("2f", +"");                // I think:
log("2g", "abc" * 1);          // I think:
log("2h", "5" - - "2");        // I think:   (minus, then unary minus)
log("2i", "3" + 4 - 1);        // I think:   (+ first, then -)
log("2j", [5] * 2);            // I think:   ([5] -> "5" -> 5)
log("2k", [1, 2] * 2);         // I think:
log("2l", epoch - 0);          // I think:

// ─────────────────────────────────────────────────────────────
// 3. < > <= >=
// ─────────────────────────────────────────────────────────────
console.log("\n--- 3. < > <= >= ---");
log("3a", "10" < "9");         // I think:   (both strings)
log("3b", "100" < "25");       // I think:   (both strings)
log("3c", "10" < 9);           // I think:   (one number)
log("3d", "abc" < 5);          // I think:   (one number)
log("3e", "a" < "b");          // I think:
log("3f", "apple" < "banana"); // I think:
log("3g", "Z" < "a");          // I think:   (uppercase codes come first)
log("3h", "Zebra" < "apple");  // I think:   (uppercase codes come first)
log("3i", undefined > 0);      // I think:
log("3j", true > 0);           // I think:
log("3k", null < 1);           // I think:
log("3l", null >= 0);          // I think:   (yes, really compare to 4g)
log("3m", 1 < 2 < 3);          // I think:
log("3n", 3 > 2 > 1);          // I think:   (left to right: true > 1)

// Objects with < >
log("3o", {} > {});            // I think:
log("3p", { name: "Dilan" } > {}); // I think:
log("3q", "abc" < {});         // I think:

// Real world: sorting prices that came from an API as strings
const prices = ["100", "25", "9"];
log("3r", [...prices].sort().join(", "));                   // I think:
log("3s", [...prices].sort((a, b) => a - b).join(", "));    // I think:   (the fix)
log("3t", [10, 9, 1].sort().join(", "));                    // I think:   (even numbers!)

// ─────────────────────────────────────────────────────────────
// 4. ==  != (loose equality)
// ─────────────────────────────────────────────────────────────
console.log("\n--- 4. == (loose equality) ---");
log("4a", 0 == "");            // I think:
log("4b", 0 == "0");           // I think:
log("4c", "" == "0");          // I think:   (not transitive!)
log("4d", false == "0");       // I think:
log("4e", false == "false");   // I think:
log("4f", null == undefined);  // I think:
log("4g", null == 0);          // I think:
log("4h", null == "");         // I think:
log("4i", NaN == NaN);         // I think:
log("4j", Number.isNaN(NaN));  // I think:
log("4k", Number.isNaN(+"abc")); // I think:
log("4l", [1] == 1);           // I think:
log("4m", [] == false);        // I think:

// Real world: the ONE accepted use of ==
const middleName = undefined;
log("4n", middleName == null ? "missing" : "present");  // I think:

// ─────────────────────────────────────────────────────────────
// 5. ===  !==  Object.is (strict equality)
// ─────────────────────────────────────────────────────────────
console.log("\n--- 5. === and Object.is ---");
log("5a", null === undefined); // I think:
log("5b", false === undefined); // I think:
log("5c", NaN === NaN);        // I think:
log("5d", 0 === -0);           // I think:
log("5e", Object.is(NaN, NaN)); // I think:
log("5f", Object.is(0, -0));   // I think:
log("5g", Object.is(5, 5));    // I think:
log("5h", Object.is(5, "5"));  // I think:
log("5i", Object.is({}, {}));  // I think:

// ─────────────────────────────────────────────────────────────
// 6. if  !  ? :  while  &&  || (boolean contexts)
// ─────────────────────────────────────────────────────────────
console.log("\n--- 6. truthy and falsy ---");
log("6a", Boolean("0"));       // I think:
log("6b", Boolean("false"));   // I think:
log("6c", Boolean(" "));       // I think:
log("6d", Boolean([]));        // I think:
log("6e", Boolean({}));        // I think:
log("6f", Boolean(NaN));       // I think:
log("6g", Boolean(-0));        // I think:

// Stand-in for document.querySelector(), which returns null when nothing matches
function findElement() { return null; }
log("6h", !!findElement());    // I think:

const ENABLE_BETA = "false";
log("6i", ENABLE_BETA ? "beta ON" : "beta OFF");             // I think:
log("6j", ENABLE_BETA === "true" ? "beta ON" : "beta OFF");  // I think:   (the fix)

const count = 0;
log("6k", count ? `badge: ${count}` : "no badge");           // I think:   (is that a bug?)

const results = [];
log("6l", results ? "show list" : "show 'no results'");      // I think:
log("6m", results.length ? "show list" : "show 'no results'");// I think:   (the fix)

// && and || check truthiness but return one of the ORIGINAL values, not true/false
log("6n", "" || "default");    // I think:
log("6o", 0 && "x");           // I think:

// ! converts to boolean, then flips. It always returns true or false.
log("6p", !"hello");           // I think:
log("6q", !"");                // I think:
log("6r", ![]);                // I think:   (compare with 6d)
log("6s", !!"hello");          // I think:   (!! = Boolean())
log("6t", !!0);                // I think:

// ─────────────────────────────────────────────────────────────
// 7. `${x}`  String(x)  -> always string, toString first
// ─────────────────────────────────────────────────────────────
console.log("\n--- 7. template literals and String() ---");
log("7a", `${[1, 2]}`);        // I think:   (template literals also convert to string)
log("7b", String({ a: 1 }));   // I think:
log("7c", `${money}`);         // I think:   (template literal prefers toString)

// To string, by type
log("7d", String(null));       // I think:
log("7e", String(undefined));  // I think:
log("7f", String(-0));         // I think:
log("7g", String(1e21));       // I think:
log("7h", String(0.0000005));  // I think:   (compare with 8n)
log("7i", String([1, [2, 3]])); // I think:
log("7j", String([null, undefined])); // I think:
log("7k", [null] + "");        // I think:
log("7l", String(10n));        // I think:
log("7m", String(Symbol("id"))); // I think:

// ─────────────────────────────────────────────────────────────
// 8. Number(x): the surprising ones
// ─────────────────────────────────────────────────────────────
console.log("\n--- 8. Number() ---");
log("8a", Number(""));         // I think:
log("8b", Number("  "));       // I think:
log("8c", Number("\n12\n"));   // I think:   (whitespace is trimmed)
log("8d", Number(null));       // I think:
log("8e", Number(undefined));  // I think:
log("8f", Number(false));      // I think:
log("8g", Number(true));       // I think:
log("8h", Number([]));         // I think:
log("8i", Number(["7"]));      // I think:
log("8j", Number([1, 2]));     // I think:
log("8k", Number({}));         // I think:
log("8l", Number("12px"));     // I think:
log("8m", parseInt("12px"));   // I think:
log("8n", parseInt(0.0000005));     // I think:   (a NUMBER, not a string; hint: 5e-7)
log("8o", parseFloat("3.14abc"));   // I think:

// Real world: an empty optional field silently becomes 0
const ageInput = "";
const age = Number(ageInput);
log("8p", age);                // I think:
log("8q", age >= 0 ? "valid age" : "invalid"); // I think:   (should it be valid?)

// ─────────────────────────────────────────────────────────────
// 9. Other places coercion happens
// ─────────────────────────────────────────────────────────────
console.log("\n--- 9. other places coercion happens ---");
// Property keys
const scores = {};
scores[1] = "one";
log("9a", typeof Object.keys(scores)[0]); // I think:
log("9b", scores["1"]);        // I think:

const cache = {};
const userA = { id: 1 };
const userB = { id: 2 };
cache[userA] = "A";
cache[userB] = "B";
log("9c", cache[userA]);       // I think:   (is that a bug?)
log("9d", Object.keys(cache).join(", ")); // I think:

const lookup = new Map([[1, "one"]]);
log("9e", lookup.get(1));      // I think:
log("9f", lookup.get("1"));    // I think:   (Map doesn't convert keys)

// isNaN vs Number.isNaN
log("9g", isNaN("abc"));       // I think:
log("9h", Number.isNaN("abc")); // I think:
log("9i", isNaN(""));          // I think:

// Bitwise operators
log("9j", "5.7" | 0);          // I think:
log("9k", ~~"12.9");           // I think:
log("9l", "abc" | 0);          // I think:

// Assignment shortcuts
let x = "5";
x++;
log("9m", x);                  // I think:
let y = "5";
y += 1;
log("9n", y);                  // I think:

// switch uses ===
function check(v) {
  switch (v) {
    case 1: return "matched 1";
    default: return "no match";
  }
}
log("9o", check("1"));         // I think:

// Math functions
log("9p", Math.max("5", 2));   // I think:
log("9q", Math.max("a", 2));   // I think:

// ─────────────────────────────────────────────────────────────
// 10. When coercion throws (TypeError)
// ─────────────────────────────────────────────────────────────
console.log("\n--- 10. when coercion throws ---");
tryLog("10a", () => 1n + 1);   // I think:
log("10b", 1n + BigInt(1));    // I think:
log("10c", Number(1n) + 1);    // I think:
log("10d", 1n < 2);            // I think:
log("10e", 1n == 1);           // I think:
log("10f", 1n === 1);          // I think:
tryLog("10g", () => +1n);      // I think:
log("10h", 1n + "x");          // I think:
tryLog("10i", () => `${Symbol("id")}`); // I think:
tryLog("10j", () => Symbol("id") + ""); // I think:
log("10k", String(Symbol("id"))); // I think:
log("10l", Boolean(Symbol("id"))); // I think:
tryLog("10m", () => Object.create(null) + ""); // I think:

// ─────────────────────────────────────────────────────────────
// 11. Symbol.toPrimitive
// ─────────────────────────────────────────────────────────────
console.log("\n--- 11. Symbol.toPrimitive ---");
const temperature = {
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return 25;
    if (hint === "string") return "25°C";
    return "25 degrees"; // hint === "default"
  },
};
log("11a", temperature * 2);   // I think:   (which hint?)
log("11b", `${temperature}`);  // I think:
log("11c", temperature + "");  // I think:
log("11d", temperature + 1);   // I think:
log("11e", temperature > 20);  // I think:
log("11f", temperature == "25 degrees"); // I think:

const broken = { [Symbol.toPrimitive]() { return {}; } };
tryLog("11g", () => broken + 1); // I think:

console.log({} + {});
console.log({} + ['hello']);
console.log({} + 1);
console.log(new Date(0) + 1);