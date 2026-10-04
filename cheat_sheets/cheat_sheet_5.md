# Cheat sheet v5: packages and patterns used so far

Commands and flags change between versions. If something differs, check the official docs.

Quick jump: Tooling | Doom | React | React Native | TypeScript 3A | TypeScript 3B | React + TypeScript 3C | Fastify 4A | Reading tsc errors | Coming next

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
npm pkg set type=module     # edit package.json so .js/.ts files use ESM (import/export)
npx <tool>                  # run a tool from this project's node_modules (or fetch it)
npx prettier --write .      # format every file in the folder
```

`npm` vs `npx`: `npm` has its own commands (`install`, `init`, `run`). `npx` runs a tool. `npm tsc` is wrong; `npx tsc` is right.

Reading npm output:
- The line `GET https://registry.npmjs.org/<name>` shows the package name npm looked up. A 404 with a strange name means a typo.
- `npm notice run ...` lines before an `npx` command are harmless noise. They also show the project name npm is working in, which is a handy clue when you are in the wrong folder.
- Blocked install scripts (newer npm): `npm install-scripts ls` lists them, `npm install-scripts approve <pkg>` allows one. Approved so far in ts-basics: `esbuild` (used by `tsx`). Same command if fastify-basics blocks it. Details: `npm help install-scripts`.

Shell helpers:
- `cp a b` copies file `a` to `b` and leaves `a` alone.
- `grep -n "text" file` prints each line containing "text", with its line number. No output means the text is not in that file.
- `mkdir -p path` makes a folder and any missing parents.

**Wrong folder checklist** (happened in 3C and 4A): look at the prompt for the folder name, and at the `npm notice run <name>` line. Project folders: `react-basics`, `expo-basics`, `ts-basics`, `fastify-basics`. Never run course commands inside `TCGHub-Frontend`. Also check the file is **saved** before testing.

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
- A red underline in Doom is the same error `npx tsc` prints, but only if you are looking at the right file and the LSP is running.

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
`keyboardType="numeric"` only changes the keys on screen. The value is still a string.

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
| `npx tsc --noEmit` | Same check with the "write no files" flag spelled out (harmless if the config already sets it; the Expo template does) |
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

## React + TypeScript (3C), in expo-basics

Type-check from inside `expo-basics`: `npx tsc --noEmit` (the template already sets `noEmit`; the wrong folder prints nothing misleadingly).

### Props and children

```tsx
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
	title: string;          // required
	subtitle?: string;      // optional, inside it is string | undefined
	children: ReactNode;    // anything React can draw: text, elements, arrays, nothing
};

export function Card({ title, subtitle, children }: Props) {
	return (
		<View style={styles.card}>
			<Text style={styles.title}>{title}</Text>
			{subtitle !== undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
			{children}
		</View>
	);
}
```

- The type goes after the closing brace of the destructured props: `{ title }: Props`.
- `import type` exists only for type-checking.
- Use `subtitle !== undefined &&`, not `subtitle &&`: an empty string `""` would be a stray string outside `<Text>`, which crashes in React Native.
- A missing required prop and a wrong prop type are errors in the component call: `<Card />` and `title={5}`.

### useState with a type

```tsx
const [picked, setPicked] = useState<number | null>(null);   // null now, a number later
// useState(null) alone: tsc decides the type is just null, so setPicked(7) is an error

{picked === null ? "nothing yet" : picked * 2}   // narrowing: in the : branch picked is a number
```

The type describes every value the state can ever hold, not just the first one. It changes nothing at runtime.

### Handlers and refs

```tsx
const handleChange = (value: string): void => {
	setText(value);
};
<TextInput onChangeText={handleChange} />      // onChangeText expects (text: string) => void

const inputRef = useRef<TextInput>(null);      // .current is null before the first render
<TextInput ref={inputRef} />
<Pressable onPress={() => inputRef.current?.focus()}>   // ?. is the guard
```

### Typing fetch results

```tsx
type Todo = { id: number; title: string; completed: boolean };

async function loadTodo(id: number): Promise<Todo> {
	const res = await fetch("https://jsonplaceholder.typicode.com/todos/" + id);
	const data: unknown = await res.json();   // res.json() returns any; take it as unknown
	if (
		typeof data === "object" &&
		data !== null &&
		"title" in data &&
		typeof data.title === "string"
	) {
		return data as Todo;                  // honest catch: this only checked title, not id or completed
	}
	throw new Error("bad todo");
}

const [todo, setTodo] = useState<Todo | null>(null);
loadTodo(1).then(setTodo);                    // .then(fn) is the callback form of await
```

- `res.json()` gives `any`, so `return data` compiles unchecked. `Promise<Todo>` is a promise, not a check.
- In real code, test every field you rely on, or use schema validation (later in Fastify).

## Fastify (4A), in fastify-basics

### Setup (~/Documents/react/fastify-basics)

```bash
mkdir -p ~/Documents/react/fastify-basics/src
cd ~/Documents/react/fastify-basics
npm init -y
npm pkg set type=module
npm install fastify
npm install -D typescript tsx @types/node
```

`tsconfig.json`:

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "NodeNext",
		"moduleResolution": "NodeNext",
		"strict": true,
		"noEmit": true,
		"skipLibCheck": true,
		"types": ["node"]
	},
	"include": ["src"]
}
```

### Running and testing

| Command | What it does |
|---|---|
| `npx tsx src/server.ts` | Runs the server once, no type checking. `Ctrl+C` stops it |
| `npx tsx watch src/server.ts` | Runs the server and restarts it every time you **save** the file |
| `npx tsc` | Type-checks (run inside `fastify-basics`) |
| `curl http://localhost:3000/` | GET from a second terminal |
| `curl "http://localhost:3000/items?limit=5"` | Quote URLs with `?`, the shell may treat `?` as a wildcard |
| `curl -i -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Ada"}'` | `-X` method, `-H` header, `-d` body, `-i` also prints the status line |
| `curl -i -X DELETE http://localhost:3000/users/5` | DELETE with the status line |
| `curl --max-time 3 <url>` | Gives up after 3 seconds |

Two servers cannot use port 3000 at once: stop the old one (`Ctrl+C`) before starting another. A 404 JSON for a route you just wrote usually means an unsaved file, an old server, or the wrong folder.

### server.ts pattern

```ts
import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/", async () => {
	return { hello: "world" };           // async + return a value: Fastify sends it as JSON
});

app.get("/users/:id", async (request) => {
	const { id } = request.params as { id: string };   // params are always strings; as = "trust me"
	return { id };
});

app.post("/users", async (request, reply) => {
	const body = request.body as { name: string };      // "trust me" again, validation comes in 4B
	reply.status(201);                                  // 201 created
	return { created: body.name };
});

app.get("/items", async (request) => {
	const { limit } = request.query as { limit?: string };   // query values are strings, may be missing
	const num = Number(limit);
	const usable = limit !== undefined && limit.trim() !== "" && !Number.isNaN(num);
	return { limit, usable, doubled: usable ? num * 2 : null };
});

app.put("/users/:id", async (request) => { /* update */ });
app.delete("/users/:id", async (request, reply) => {
	reply.status(204);                                  // 204 done, nothing to send back
	return;
});

await app.listen({ port: 3000, host: "0.0.0.0" });      // top-level await works in ESM
```

| Idea | Meaning |
|---|---|
| `Fastify({ logger: true })` | Creates the server and prints a log line per request |
| `host: "0.0.0.0"` | Listen on all network interfaces, so other devices (like your phone) can connect |
| `host: "127.0.0.1"` | Only this computer can connect |
| route params (`:id`), query (`?limit=5`) | Always strings; convert and guard like `TextInput` |
| `request.body` | JSON body; typed with `as` for now, real validation in 4B |
| `201` / `204` / `404` | created / done with nothing to send back / not found |

### return vs reply.send

```ts
// style 1: async handler, RETURN the value
app.get("/a", async () => { return { style: "return" }; });

// style 2: normal (not async) handler, CALL reply.send
app.get("/b", (request, reply) => { reply.send({ style: "send" }); });

// the trap: async handler that does neither (on this Fastify version it still answered 200;
// behaviour varies by version, check the Fastify docs)
app.get("/c", async () => { console.log("handler ran, returned nothing"); });
```

Stick to one style per handler.

## Reading a tsc error

Example: `src/shapes.ts:19:13 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.`

| Part | Meaning |
|---|---|
| `src/shapes.ts:19:13` | file, line, column |
| `TS2345` | error code you can search |
| The first words of the message | tell you the kind of mistake |
| `~~~` under the code | exact piece that is wrong |
| Indented lines and "declared here" lines | clues pointing at the type that set the rule |

| First words | Cause |
|---|---|
| `Type 'X' is not assignable to type 'Y'` | wrong value assigned to a variable, prop or returned from a function |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | wrong value passed into a function call, including setters like `setPicked("7")` (this includes passing the wrong kind of function) |
| `Property 'p' is missing in type ...` | a required prop or property was left out (the "declared here" line points at the type) |
| `No overload matches this call` | the component or function has several allowed ways to be called; read the LAST indented lines for the real clue, e.g. `Type '(value: number) => void' is not assignable to type '(text: string) => void'` |
| `Object literal may only specify known properties` | an extra property in an object literal that the type does not list |
| `'x' is possibly 'undefined'` / `'x' is possibly 'null'` | missing guard (use `?.`, `??` or a check) |
| `'x' is of type 'unknown'` | narrow it first (`typeof`) |
| `Property 'p' does not exist on type 'never'` | assignment narrowing trap or an impossible branch |
| `Property 'p' does not exist on type 'Promise<...>'` | forgot `await` |
| `Function lacks ending return statement and return type does not include 'undefined'` | a case is missing, or a path returns nothing |
| `Cannot find package 'x'` (Node error, not tsc) | the package is not installed in the folder you are in: check the folder and `npm install` |

When the file has several errors, tsc prints all of them. Read the line number to be sure which error belongs to which drill.

Exact wording can differ between TypeScript versions. If a message looks different, search the `TS` code or read the first words.

## Coming next (not used yet)

| Area | Install / command |
|---|---|
| 4B: Fastify validation and structure | JSON schema on routes (params, query, body, response), TypeBox type provider, plugins and `register` with a prefix, hooks (`onRequest`, `preHandler`, `onSend`), CORS. Check the Fastify docs for the current package names and versions |
| 4C: Docker + Postgres | `sudo pacman -S docker docker-compose`, `sudo systemctl enable --now docker.service`, `sudo usermod -aG docker $USER`, log out and back in. Then Docker Compose Postgres with a persistent volume, `@fastify/postgres` with `pg`, parameterised queries, `setErrorHandler`, dotenv |
