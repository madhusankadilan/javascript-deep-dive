# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A public JavaScript repo that takes a learner from zero to interview-ready on the core of the language. It's used for learning, interview prep and teaching others.

It is deliberately **not** a complete theory reference: anyone can find full theory online. Each topic covers only the important, interview-relevant parts and leans on practical examples.

There's no package.json, dependencies, build, linter or test runner. `README.md` is a roadmap of planned practice projects (Beginner / Intermediate / Advanced), none of which exist yet.

## Organisation

- **One topic per file**, each holding both theory and practicals.
- Group files into **subfolders** once related topics need it (an earlier lesson used a numbered folder, `01-placing-js-code/`).
- The author draws a separate **Excalidraw mind map** per topic for quick reference. Keep theory blocks organised so they map cleanly onto a mind map: short headed sections, one rule per line. The author may also ask for a text "short note" tree summarising a file.

## How to help

- **Connect every topic to real-world scenarios.** The main goal is understanding *why* a rule matters in actual code, not just what it does.
  - Basic topics: a plain `console.log`-style example is fine.
  - As topics get more advanced, examples must come from realistic situations, such as form input, API responses, URL params, env vars, localStorage, React rendering, config objects, sorting data, or caching. The existing "Real world:" exercises in `coercion-notes.js` set the bar.
- **Interview focus:** call out the classic traps and "what does this print?" questions interviewers ask, and show the fix next to the bug.
- Don't pad files with exhaustive theory; cut anything that isn't important or practical.
- The repo is public and teaches others, so explanations must be accurate. Run the file to verify every claimed result.

## Running

```sh
node coercion-notes.js     # run a lesson file; prints every exercise's result
```

To check a single exercise, run the file and grep its label, e.g. `node coercion-notes.js | grep '^6r '`.

Not every file is runnable yet:
- `types.js` is a theory comment only.
- `operators.js` is a draft: the whole file, including its `log("8a", …)` exercises, is inside one block comment, and it has no `show`/`log` helpers. Running it prints nothing. To make it runnable, close the comment before the exercises and copy the helpers from `coercion-notes.js`.

## Lesson file structure

`coercion-notes.js` is the reference layout; new lesson files should follow it:

1. **Theory block** — one large `/** ... */` comment at the top. Sections are numbered; examples use `> expr // result  (why)`. In `coercion-notes.js`, sections 1–8 are grouped by operator (`+`, math ops, `< >`, `==`, `===`, boolean contexts, `String()`, `Number()`), and 9–11 cover other coercion sites, TypeErrors and `Symbol.toPrimitive`. Other sections refer back by number ("see section 1"), so renumbering sections means updating those references.
2. **Helpers** — `show` (quotes strings, suffixes BigInt with `n`), `log(label, value)`, and in `coercion-notes.js` `tryLog(label, () => expr)` for expressions that throw (prints `throws TypeError` instead of crashing).
3. **Exercises** — one block per theory section, each headed by a `// ───` banner and a `console.log("\n--- N. title ---")`, with lines like:
   ```js
   log("6r", ![]);                // I think:   (compare with 6d)
   ```

### Exercise conventions

- **Never fill in the `// I think:` comments** — they are left blank for the user to write their own predictions.
- Labels are `<section number><letter>`, running a, b, c… with no gaps and no doubled letters (`5gg`, `7aa`). Inserting an exercise means relabeling the ones after it in that section, and updating any hint that cites a moved label (e.g. `(yes, really compare to 4g)`, `(compare with 8n)`).
- Align `// I think:` to column 32 where the code fits; otherwise one space.
- Every example in the theory block should have a matching exercise, and vice versa. After editing, run the file and check that outputs agree with what the theory block claims.
- Group real-world exercises under a `// Real world: <situation>` comment, showing the bug first and then `(the fix)`.

## Commits

Prefix every commit message with `[JDD]`, e.g. `[JDD] Add coercion notes and exercises`.

## Notes

- `.idea/` is JetBrains config and is not committed.
- An earlier lesson, `01-placing-js-code/index.html` (script placement, `defer`/`async`, `DOMContentLoaded`), was added and then removed in git history.