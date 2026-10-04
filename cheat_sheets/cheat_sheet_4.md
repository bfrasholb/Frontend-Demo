# Cheat sheet v4: packages and patterns used so far

Commands and flags change between versions. If something differs, check the official docs.

Quick jump: Tooling | Doom | React | React Native | TypeScript 3A | TypeScript 3B | Reading tsc errors | Coming next

## System and tooling (Arch)

| Tool | What it's for | Install (Arch) |
|---|---|---|
| node | JavaScript runtime that runs your code outside the browser | `sudo pacman -S nodejs` |
| npm | Package manager that installs libraries from the npm registry | `sudo pacman -S npm` |
| fnm (only if Node breaks) | Switches Node versions | `sudo pacman -S fnm` (check it exists in your repos), then `fnm install --lts` and `fnm use lts-latest` |
| git | Version control, also needed to fetch tree-sitter grammars | `sudo pacman -S git` |
| gcc (base-devel) | Compiles tree-sitter grammars from Doom | `sudo pacman -S base-devel` |
| Prettier | Auto-formats code (run on save via Doom's `format +onsave`) | `npm install --save-dev prettier` in `~/Documents/react` |

```bash
node -v                     # check Node version
npm -v                      # check npm version
npm install                 # install everything listed in package.json
npm install <pkg>           # add a library to the current project
npm install -D <pkg>        # add a dev-only tool (formatters, type checkers)
npx <tool>                  # run a tool from this project's node_modules (or fetch it)
npx prettier --write .      # format every file in the folder
```

`npm` vs `npx`: `npm` has its own commands (`install`, `init`, `run`). `npx` runs a tool. `npm tsc` is wrong; `npx tsc` is right.

Reading npm output:
- The line `GET https://registry.npmjs.org/<name>` shows the package name npm looked up. A 404 with a strange name means a typo.
- `npm notice run ...` lines before an `npx` command are harmless noise.
- Blocked install scripts (newer npm): `npm install-scripts ls` lists them, `npm install-scripts approve <pkg>` allows one. Approved so far in ts-basics: `esbuild` (used by `tsx`). Details: `npm help install-scripts`.

## Doom Emacs

| Task | How |
|---|---|
| Install a tree-sitter grammar | `M-x treesit-install-language-grammar` (done: javascript, typescript, tsx, json, css) |
| Check tree-sitter is available | `M-: (treesit-available-p)` returns `t` |
| Check grammars | `M-: (mapcar #'treesit-language-available-p '(javascript typescript tsx json css))` returns `(t t t t t)` |
| Install the TS language server | `M-x lsp-install-server`, choose ts-ls (done) |
| Check the current major mode | `M-: major-mode` (expect `typescript-ts-mode` in `.ts`) |
| Check LSP is running | `M-: lsp-mode` returns `t` |
| Open private config | `SPC f P` |
| Messages buffer | `SPC h e` |
| List diagnostics | `SPC c x` |

- `SPC c k` is a web lookup of the keyword, NOT type info. Hover/type popups come from the LSP once the server has fully started.
- Type errors only show once the LSP server is fully started. If markers or hover are missing, check `M-: lsp-mode`.

## JavaScript / React (web, Vite)

| Package | What it's for | Install |
|---|---|---|
| vite | Dev server and bundler for the web playground | created by the command below |
| react | Components, JSX, hooks (`useState`, `useEffect`, `useRef`) | included in the Vite template |
| react-dom | Draws React components into the browser page | included in the Vite template |

```bash
cd ~/Documents/react
npm create vite@latest react-basics -- --template react   # how the playground was made
cd react-basics
npm install
npm run dev        # start dev server (open the URL it prints, usually http://localhost:5173)
npm run build      # production build into dist/
```

```jsx
import { useState, useEffect, useRef } from "react"
```

| Hook | Use |
|---|---|
| `useState(initial)` | Value plus setter; setter triggers a render |
| `useEffect(fn, [deps])` | Run code after render; return a function to clean up |
| `useRef(null)` | A box with `.current` that does not trigger renders; also holds DOM elements via `ref={...}` |

Hooks go at the top of the component, never inside JSX or conditions.
Dev tools: press F12 in the browser, read the Console tab for red errors.

## React Native (Expo)

| Package / app | What it's for | Install |
|---|---|---|
| create-expo-app | Generates a new Expo project | `npx create-expo-app@latest expo-basics` (no install needed) |
| expo | Toolchain and dev server (Metro bundler) | included in the project |
| react-native | `View`, `Text`, `Image`, `TextInput`, `Pressable`, `ScrollView`, `FlatList`, `StyleSheet`, `Platform`, `useWindowDimensions` | included in the project |
| react-native-safe-area-context | `SafeAreaView` keeps content clear of notches and system bars | check `package.json` first; if missing: `npx expo install react-native-safe-area-context` |
| expo-router | File-based navigation (screens are files in `app/`) | included in the template |
| Expo Go | Phone app that runs your project while you develop | Google Play Store (Android) |

```bash
cd ~/Documents
npx create-expo-app@latest expo-basics
cd expo-basics
npx expo start             # shows a QR code; scan it inside Expo Go on Android
npx expo start -c          # same, but clears the cache (try this for weird stale behaviour)
npx expo install <pkg>     # add a library at a version compatible with your Expo version
```

In the `npx expo start` terminal: `r` reloads, `a` opens an Android emulator/device, `m` toggles the menu, `Ctrl+C` stops it.

### Imports used so far

```tsx
import {
	View, Text, Image, TextInput, Pressable, ScrollView,
	FlatList, StyleSheet, Platform, useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useLocalSearchParams } from "expo-router";
```

### Web to React Native

| Web | React Native |
|---|---|
| `div` | `View` |
| `span`, `p`, `h1` | `Text` (all text must be inside it, even no stray spaces between elements) |
| `img src` | `Image source={{ uri: ... }}` (needs width and height) |
| `input onChange` | `TextInput onChangeText` (gives the string directly) |
| `button onClick` | `Pressable onPress` |
| `<a href>` | `Link href="/path"` |
| `overflow: scroll` / long lists | `FlatList` (never inside a `ScrollView`) |
| `margin: 0 auto` | `alignSelf: "center"` |

### Styling rules
- `StyleSheet.create({ ... })`, camelCase, no units, no cascade.
- Every View is flexbox, default `flexDirection: "column"`. `justifyContent` is the main axis, `alignItems` the cross axis.
- Style arrays: later entries win. `[styles.card, isWide && styles.cardWide]`.
- Always set text and background colours explicitly (dark-mode template). Hex needs `#`.
- Invalid styles fail silently: read the Expo terminal for warnings.
- `Platform.OS`, `Platform.select({ android: {...}, default: {...} })`.

### FlatList pattern

```tsx
const DATA = Array.from({ length: 30 }, (_, i) => ({
	id: String(i),
	title: "Item " + (i + 1),
})); // _ = unused (undefined), i = 0..29; ({ }) returns an object

<FlatList
	data={DATA}
	keyExtractor={(item) => item.id}
	ListEmptyComponent={<Text style={{ color: "#fff" }}>Nothing here yet</Text>}
	renderItem={({ item }) => (
		<View><Text>{item.title}</Text></View>
	)}
/>
```

### Text to number (TextInput always gives a string)

| Expression | Result |
|---|---|
| `Number("42")` | `42` |
| `Number("1.5")` | `1.5` (one number type, `3.0` prints as `3`) |
| `Number("")` | `0` (not NaN!) |
| `Number("   ")` | `0` |
| `Number("12abc")` | `NaN` |
| `parseInt("12abc", 10)` | `12` (stops at first bad character; `10` is the base) |
| `num === NaN` | always `false` |
| `Number.isNaN(num)` | the correct NaN check |

Safe guard (empty AND NaN):

```tsx
const num = Number(text);
const usable = !(text.trim() === "" || Number.isNaN(num));
```

JSX prints strings and numbers but not booleans: wrap with `String(...)` to show `true`/`false`.

### Expo Router

| Idea | Code |
|---|---|
| A file is a route | `app/list.tsx` is `/list` |
| Declare it in this template's tab bar | `components/app-tabs.tsx`: `<NativeTabs.Trigger name="list">` (name = file name without `.tsx`) |
| Link | `<Link href="/list" style={{ color: "royalblue" }}>Go to list</Link>` |
| Navigate from code | `router.push({ pathname: "/list", params: { n: "5" } })` |
| Read params | `const { n } = useLocalSearchParams();` (strings, may be `undefined`; convert and guard) |
| Tabs vs stack | Tabs sit side by side so there is no back arrow; a stack pushes screens and gives one (stretch list) |

### Fixes you may need

```bash
# Metro "ENOSPC" file-watcher error:
echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/40-inotify.conf
sudo sysctl --system

# Phone cannot reach the dev server: firewall may block port 8081. Allow it
# (the command depends on your firewall, e.g. ufw: sudo ufw allow 8081)
```

Stale behaviour: press `r` in the Expo terminal, or `npx expo start -c`. Config changes (app.json) need Expo Go fully closed and reopened.

Optional, not set up (Android emulator):

```bash
yay -S android-studio                      # AUR
sudo pacman -S android-tools               # adb
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
ls /dev/kvm                                # emulator needs KVM
```

## TypeScript (3A): basics

### Setup (ts-basics, ~/Documents/react/ts-basics)

```bash
mkdir -p ~/Documents/react/ts-basics/src
cd ~/Documents/react/ts-basics
npm init -y                                  # creates package.json
npm install -D typescript tsx @types/node    # checker, runner, Node types
npx tsc --init                               # creates tsconfig.json (once per project)
```

| Command | What it does |
|---|---|
| `npx tsx src/file.ts` | Runs the file. Erases types, does NO type checking, so a file with type errors still runs |
| `npx tsc` | Type-checks every file in the config and prints errors; prints nothing if clean. Writes no files because of `noEmit` |
| `npx tsc --init` | Creates `tsconfig.json` |
| `npm install -D <pkg>` | Installs a dev-only tool |

`tsconfig.json` lines that matter: `"strict": true` (turns on the strict checks) and `"noEmit": true` (check only, write no `.js` files).

Running a file does not mean it type-checks.

### Primitive types and inference

```ts
const userName: string = "Ada";
let age: number = 30;
let isAdmin: boolean = false;
let nothing: null = null;
let notSet: undefined = undefined;

let x = 5;      // type number (let can change, so it widens)
const y = 5;    // type 5 (const keeps the literal type)
```

### Arrays, objects, optional

```ts
const scores: number[] = [90, 85, 70];       // same as Array<number>
type User = { id: number; name: string; email?: string };  // email: string | undefined
```

### type vs interface

```ts
interface Shape { name: string }
interface Circle extends Shape { radius: number }   // interface extends
type Labelled = { x: number } & { label: string };  // type combines with &

type UserId = number;                                // alias for a primitive (type only)
type Status = "loading" | "done" | "error";          // union of literals (type only)
type Id = number | string;                           // union (type only)
```

Object shape: either works. Union, literal or primitive alias: `type` only.

### any vs unknown

```ts
let a: any = "hello";     // checker off for this value; mistakes slip to runtime
let u: unknown = "hello"; // must narrow before use
if (typeof u === "string") {
	console.log(u.toUpperCase());   // fine inside the check
}
```

### Assertions and narrowing

```ts
const text = raw as string;   // as: "trust me", changes only what tsc believes, converts NOTHING
input!.length                 // !: "not null/undefined, trust me", no runtime check
input?.length                 // ?.: gives undefined instead of crashing
input?.length ?? 0            // ??: use the right side if the left is null or undefined

function show(value: string | number) {
	if (typeof value === "string") {
		value.toUpperCase();   // string here
	} else {
		value.toFixed(2);      // number here
	}
}
```

`as` and `!` crash at runtime if you are wrong. Prefer a `typeof` check, `?.`, or `??`.

Real conversion (changes the value): `String(42)`, `Number("42")`, `parseInt("12abc", 10)`.

### Safe conversion and JSON.parse

```ts
function toNumber(text: string): number | undefined {
	if (text.trim() === "" || Number.isNaN(Number(text))) {
		return undefined;
	}
	return Number(text);
}
// toNumber("42") -> 42, toNumber("") -> undefined, toNumber("abc") -> undefined

const checked: unknown = JSON.parse(json);   // JSON.parse returns any; take it as unknown
if (
	typeof checked === "object" &&
	checked !== null &&
	"name" in checked &&
	typeof checked.name === "string"
) {
	console.log(checked.name.toUpperCase());
} else {
	console.log("bad data");
}
```

`JSON.parse(json) as { ... }` is the same "trust me" trick: bad data crashes later.

### Narrowing trap: never

```ts
const input: string | undefined = undefined;  // tsc narrows input to just undefined
input?.length;   // error: property 'length' does not exist on type 'never'

function getInput(): string | undefined { return undefined; }
const input2 = getInput();   // stays string | undefined, so input2?.length is fine
```

## TypeScript (3B): functions, unions, generics, utility types, async

### Parameters, returns, arrows

```ts
// declaration: types on parameters and on the return (after the parentheses)
function add(a: number, b: number): number {
	return a + b;
}

// arrow function stored in a const
const double = (n: number): number => n * 2;

// anonymous arrow passed inline (n is inferred from the array)
const doubled = [1, 2, 3].map((n) => n * 2);
```

### Optional, default and rest parameters

```ts
// optional: must come after required ones; inside it is string | undefined
function greet(name: string, title?: string): string {
	if (title === undefined) {
		return "Hello " + name;
	}
	return "Hello " + title + " " + name;
}

// default: type inferred from the default value
function repeat(text: string, times = 2): string {
	return text.repeat(times);
}

// rest: extra arguments collected into an array; sum() is 0
function sum(...nums: number[]): number {
	let total = 0;
	for (const n of nums) {
		total += n;
	}
	return total;
}
```

Trap seen: `add("2", 3)` prints `23` under tsx (string joining) but `npx tsc` reports an "Argument of type" error.

### Function types, callbacks, void

```ts
type Op = (a: number, b: number) => number;     // (parameter types) => return type
const plus: Op = (a, b) => a + b;               // a and b inferred from Op

function apply(a: number, b: number, op: Op): number {
	return op(a, b);                            // op is a callback
}
apply(10, 4, (a, b) => a - b);                  // anonymous function, types from Op

function logTwice(message: string): void {      // void: returns nothing useful
	console.log(message);
	console.log(message);
}

function repeatTask(times: number, task: (i: number) => void): void {
	for (let i = 0; i < times; i++) {
		task(i);
	}
}

type Transform = (text: string) => string;
function applyAll(items: string[], fn: Transform): string[] {
	return items.map((item) => fn(item));       // USE the fn parameter!
}
applyAll(["a", "b"], (s) => s.toUpperCase());   // [ 'A', 'B' ]
```

### Unions, literals, discriminated unions

```ts
type Status = "loading" | "done" | "error";

type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Rect = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Square | Rect;

function area(shape: Shape): number {
	switch (shape.kind) {
		case "circle":
			return Math.PI * shape.radius * shape.radius;   // shape is Circle
		case "square":
			return shape.side * shape.side;                  // shape is Square
		case "rectangle":
			return shape.width * shape.height;               // shape is Rect
	}
}
```

- `kind` is the shared property that tells tsc which shape you have. Checking it narrows the type.
- Every case needs `return` (or `break`). Without it the case falls through into the next one and narrowing is lost.
- Add a new member to the union and forget its case: tsc reports on `area` that the function lacks an ending return statement and the return type does not include `undefined` (TS2366). tsc points at every function that forgot the new case.
- The name you pick (`"rect"` or `"rectangle"`) only has to be the same in the type and in the `case`.

### Generics

```ts
// without generics: any, the type is lost, tsc stays quiet, tsx crashes at runtime
function firstAny(items: any[]): any {
	return items[0];
}

// with generics: T is filled in from the argument
function first<T>(items: T[]): T | undefined {
	return items[0];
}
const a = first([10, 20, 30]);   // number | undefined
a?.toFixed(1);                   // guard needed, otherwise "possibly undefined"

type Box<T> = { value: T };      // a generic type
const numBox: Box<number> = { value: 5 };
```

### Utility types

```ts
type User = { id: number; name: string; email: string };

Partial<User>                    // every property optional
Pick<User, "id" | "name">        // keep only these properties
Omit<User, "email">              // everything except these

function updateUser(user: User, changes: Partial<User>): User {
	return { ...user, ...changes };
}
```

`Partial` makes properties optional but does not let new ones in. An extra property in an object literal gives "Object literal may only specify known properties".

### Async and Promise

```ts
function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadUser(id: number): Promise<User> {   // async always returns a Promise
	await wait(100);
	return { id, name: "User " + id };                 // return a plain object
}

async function main(): Promise<void> {
	const user = await loadUser(1);   // await unwraps Promise<User> into User
	const p = loadUser(2);            // no await: p is Promise<User>, so p.name is an error
}
```

- Without `await`, the variable's TYPE is `Promise<User>`, so `user.name` is a type error.
- Changing the return type to `Promise<string>` makes the returned object an error ("Type ... is not assignable to type 'string'"), and breaks `user.name` in the callers too.

## Reading a tsc error

Example: `src/shapes.ts:19:13 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`

| Part | Meaning |
|---|---|
| `src/shapes.ts:19:13` | file, line, column |
| `TS2345` | error code you can search |
| The first words of the message | tell you the kind of mistake |
| `~~~` under the code | exact piece that is wrong |

| First words | Cause |
|---|---|
| `Type 'X' is not assignable to type 'Y'` | wrong value assigned to a variable or returned from a function |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | wrong value passed into a function call (this includes passing the wrong kind of function) |
| `Object literal may only specify known properties` | an extra property in an object literal that the type does not list |
| `'x' is possibly 'undefined'` | missing guard (use `?.`, `??` or a check) |
| `'x' is of type 'unknown'` | narrow it first (`typeof`) |
| `Property 'p' does not exist on type 'never'` | assignment narrowing trap or an impossible branch |
| `Property 'p' does not exist on type 'Promise<...>'` | forgot `await` |
| `Function lacks ending return statement and return type does not include 'undefined'` | a case is missing, or a path returns nothing |

Exact wording can differ between TypeScript versions. If a message looks different, search the `TS` code or read the first words.

## Coming next (not used yet)

| Area | Install / command |
|---|---|
| 3C: React + TypeScript (in expo-basics) | Typing props (`type Props = {...}`), `children: ReactNode`, `useState<T>`, event types, `useRef`, typing fetch results. Type-check with `npx tsc --noEmit` in expo-basics (check whether the template already sets it). |
| Fastify | `npm install fastify`, run with `npx tsx watch src/server.ts` |
| Docker + Postgres | `sudo pacman -S docker docker-compose`, `sudo systemctl enable --now docker.service`, `sudo usermod -aG docker $USER`, log out and back in |
