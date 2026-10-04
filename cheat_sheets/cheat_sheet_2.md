# Cheat sheet v2: packages and patterns used so far

Commands and flags change between versions. If something differs, check the official docs.

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
npx <tool>                  # run a tool without installing it globally
npx prettier --write .      # format every file in the folder
```

Reading npm errors: the line `GET https://registry.npmjs.org/<name>` shows the package name npm looked up. A 404 with a strange name means a typo.

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
| `parseInt("12abc")` | `12` (stops at first bad character) |
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

## Coming next (not used yet)

| Area | Install / command |
|---|---|
| Doom grammars | `M-x treesit-install-language-grammar` for javascript, typescript, tsx, json, css (needs git and a C compiler) |
| Doom TS server | `M-x lsp-install-server` then ts-ls (check Doom/lsp-mode docs) |
| TypeScript | `npm install -D typescript tsx @types/node`, then `npx tsc --init` |
| Fastify | `npm install fastify`, run with `npx tsx watch src/server.ts` |
| Docker + Postgres | `sudo pacman -S docker docker-compose`, `sudo systemctl enable --now docker.service`, `sudo usermod -aG docker $USER`, log out and back in |
