# Cheat sheet: packages used so far

Commands and flags change between versions. If something differs, check the official docs.

## System and tooling (Arch)

| Tool | What it's for | Install (Arch) |
|---|---|---|
| node | JavaScript runtime that runs your code outside the browser | `sudo pacman -S nodejs` |
| npm | Package manager that installs libraries from the npm registry | `sudo pacman -S npm` |
| fnm (only if Node breaks) | Switches Node versions | `sudo pacman -S fnm` (check it exists in your repos), then `fnm install --lts` and `fnm use lts-latest` |
| git (if not installed) | Version control | `sudo pacman -S git` |
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

Imports you have used:

```jsx
import { useState, useEffect, useRef } from "react"
```

| Hook | Use |
|---|---|
| `useState(initial)` | Value plus setter; setter triggers a render |
| `useEffect(fn, [deps])` | Run code after render; return a function to clean up |
| `useRef(null)` | A box with `.current` that does not trigger renders; also holds DOM elements via `ref={...}` |

Dev tools: press F12 in the browser, read the Console tab for red errors.

## React Native (Expo)

| Package / app | What it's for | Install |
|---|---|---|
| create-expo-app | Generates a new Expo project | `npx create-expo-app@latest expo-basics` (no install needed) |
| expo | Toolchain and dev server (Metro bundler) for React Native | included in the project |
| react-native | `View`, `Text`, `Image`, `TextInput`, `Pressable`, `ScrollView` | included in the project |
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

Imports you have used:

```jsx
import { View, Text, Image, TextInput, Pressable, ScrollView } from "react-native"
```

| Web | React Native |
|---|---|
| `div` | `View` |
| `span`, `p`, `h1` | `Text` (all text must be inside it) |
| `img src` | `Image source={{ uri: ... }}` |
| `input onChange` | `TextInput onChangeText` |
| `button onClick` | `Pressable onPress` |

Fixes you may need:

```bash
# Metro "ENOSPC" file-watcher error:
echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/40-inotify.conf
sudo sysctl --system

# Phone cannot reach the dev server: firewall may block port 8081. Allow it
# (the command depends on your firewall, e.g. ufw: sudo ufw allow 8081)
```

Optional, not set up (Android emulator):

```bash
yay -S android-studio                      # AUR
sudo pacman -S android-tools               # adb
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
ls /dev/kvm                                # emulator needs KVM
```

## Coming later (not used yet)

| Area | Install / command |
|---|---|
| TypeScript | `npm install -D typescript tsx @types/node`, then `npx tsc --init` |
| Fastify | `npm install fastify`, run with `npx tsx watch src/server.ts` |
| Docker + Postgres | `sudo pacman -S docker docker-compose`, `sudo systemctl enable --now docker.service`, `sudo usermod -aG docker $USER`, log out and back in |
| Doom (at TypeScript time) | `M-x treesit-install-language-grammar` (javascript, typescript, tsx, json, css), `M-x lsp-install-server` then ts-ls |
