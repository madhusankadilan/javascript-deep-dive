/**
 * Unary Operator

 Its one job is to turn a value into a number, in as few characters as possible. It doesn’t change a number that’s already a number (+5 is just 5). So its whole purpose is type conversion.

1. Strings coming from the outside world. Anything from a URL, form input, localStorage, environment variable, or CSV is a string. You need a number before doing math or comparisons.

    js
const port = +process.env.PORT || 3000;
const limit = +req.query.limit;          // "20" → 20
const price = +input.value;               // "19.99" → 19.99

2. Avoiding the string-concatenation trap. + between two values adds numbers but joins strings, which causes classic bugs.

    js
const a = "10", b = "5";
a + b      // "105"  (bug)
+a + +b    // 15

3. Dates to timestamps. Handy for measuring time or comparing dates.

    js
const start = +new Date();   // same as Date.now()
const isLater = +dateA > +dateB;

4. Booleans to 1/0. Useful for counting or sorting.

    js
const doneCount = todos.reduce((n, t) => n + +t.done, 0);
items.sort((a, b) => +b.pinned - +a.pinned);   // pinned items first

5. Quick validation. Since bad input becomes NaN, you can check it.

    js
if (Number.isNaN(+userInput)) throw new Error("Not a number");



 “Unary” means the operator takes one operand, not that it’s limited to +. JavaScript has several unary operators. * and / aren’t among them, because multiplying or dividing only makes sense with two values (they’re binary operators).

 The unary ones:

 Operator	What it does	Example
 +x	convert to number	+"42" → 42
 -x	convert to number, then negate	-"42" → -42
 !x	convert to boolean, then flip	!0 → true
 ~x	bitwise NOT	~5 → -6
 ++x / x++	increment by 1	i++
 --x / x--	decrement by 1	i--
 typeof x	type as a string	typeof 42 → "number"
 delete x	remove an object property	delete obj.key
 void x	evaluate, return undefined	void 0
 await x	wait for a promise	await fetch(url)

 Unary - behaves like + but also flips the sign:

 js
 -"5"    // -5
 -true   // -1
 -"abc"  // NaN

 It means unary - does two steps, while unary + does only one:

 +x → convert x to a number. Done.
 -x → convert x to a number (same as +x), then make it negative (multiply by -1).
 -"5"
 // step 1: "5" → 5      (same conversion +"5" does)
 // step 2: 5 → -5       (flip the sign)
 // result: -5

 “Flip the sign” means positive becomes negative and negative becomes positive:

 js
 -"5"     // "5" → 5 → -5
 -"-5"    // "-5" → -5 → 5    (negative flipped to positive)
 -true    // true → 1 → -1
 -""      // "" → 0 → -0
 -"abc"   // "abc" → NaN → NaN (nothing to flip)

 Compare side by side:

 js
 +"8"   // 8
 -"8"   // -8

 And ! has a common trick, !!, which converts anything to a real boolean:

 js
 !!"hello"   // true
 !!""        // false
 !!user      // true if user exists

 Note that + and - are both unary and binary, depending on context: a + b (two operands) is addition, +a (one operand) is conversion. * and / only have the binary form, so *"42" is a syntax error.
 */


/*
── && || ?? RETURN VALUES, NOT BOOLEANS ────────────────
  "" || "guest" -> "guest"     count || 10 -> 10 when count is 0 (bug)
  count ?? 10 -> keeps 0, only replaces null/undefined
  {items.length && <List/>} renders a stray 0 in React



  || returns the first truthy value. It checks the left side: if truthy, return it; otherwise return the right side.

js
"Ann" || "guest"   // "Ann"    left is truthy → return left
"" || "guest"      // "guest"  left is falsy → return right
null || "guest"    // "guest"

That’s why || is used for defaults. The bug: 0 and "" are falsy, so || replaces them even when they’re valid values.

js
const count = 0;       // user really chose 0
count || 10            // 10  ← bug, the 0 is lost

?? replaces only null and undefined. It’s like ||, but it treats only null and undefined as “missing”. 0, "" and false are kept.

js
0 ?? 10           // 0
"" ?? "guest"     // ""
false ?? true     // false
null ?? 10        // 10
undefined ?? 10   // 10

To choose between them: use ?? when 0, "" or false are legitimate values (counts, prices, toggles, volume, page offset), and || when any empty value should get the default (an empty name becoming "guest").

js
const volume = settings.volume ?? 50;   // 0 = muted, keep it
const name = input.trim() || "guest";   // empty name → guest

&& returns the first falsy value, or the last value. If the left side is falsy, it returns the left side immediately; otherwise it returns the right side.

js
user && user.name    // user.name if user exists, else user (null)
0 && "anything"      // 0     left is falsy → return left
5 && "anything"      // "anything"

The React stray-0 bug comes straight from that rule:

jsx
{items.length && <List items={items} />}
When items.length is 3, it’s truthy, so the expression returns <List/> and the list renders.
When items.length is 0, it’s falsy, so the expression returns 0.

React ignores false, null, and undefined in JSX, but it renders numbers, so a literal 0 appears on the page.

The fix is to make the left side a real boolean:

jsx
{items.length > 0 && <List items={items} />}
{!!items.length && <List items={items} />}
{items.length ? <List items={items} /> : null}

items.length > 0 is the clearest of the three, and is what most teams use.


 / ─────────────────────────────────────────────────────────────
// && || ?? return VALUES, not booleans
// ─────────────────────────────────────────────────────────────
console.log("\n--- && || ?? ---");
log("8a", "" || "guest");      // I think:
log("8b", "Ana" || "guest");   // I think:
log("8c", 0 || 10);            // I think:
log("8d", 0 ?? 10);            // I think:
log("8e", null ?? 10);         // I think:
log("8f", "" ?? "default");    // I think:
log("8g", "Ana" && "admin");   // I think:
log("8h", 0 && "admin");       // I think:
log("8i", null || undefined);  // I think:   (|| returns the last value if all are falsy)

// Real world: user settings where 0 is a valid choice
const settings = { volume: 0, theme: "" };
log("8j", settings.volume || 50);       // I think:   (user muted, what plays?)
log("8k", settings.volume ?? 50);       // I think:   (the fix)
log("8l", settings.theme ?? "light");   // I think:   (is "" what you want here?)

 // Real world: React-style conditional render
const items = [];
const render = (list) => list.length && "<List />";
log("8m", render(items));      // I think:   (React would print this on screen!)
log("8n", items.length > 0 && "<List />");  // I think:   (the fix)

// Logical assignment
let config = { retries: 0 };
config.retries ||= 3;
log("8o", config.retries);     // I think:
config = { retries: 0 };
config.retries ??= 3;
log("8p", config.retries);     // I think:
 */