# TCGHub Stack Demo

This project consists of two expo go, and fastify servers.
React via Vite hosts a basic front end in react-basics.
Expo-basics is react native, fastify and ts-basics are typescript.
Expo is frontend, fastify is DB APIs and TS backend.

## Live Reload

All servers should be capable of live reload after installing the packages. Please tell me if something needs to be added. The edit the pages in the app/server/website and watch the app/server/website reload live!
It can be a bit buggy but with a few restarts of the app/server/website enjoy watching your code run on the fly.

## Installation

The package.json in each directory contains that directories required installs.
Install with:

``` sh
npm install
npm pkg set type=module
```

Then lint with tsc, and run with tsx:

``` sh
npx tsc # Lint Project
npx tsx <filename># Execution
```

## Expo

From expo-basics install required packages, then run `npx expo start`.

A QR Code should appear, which you can scan from the Expo Go Mobile app available on the App and Play Stores. A free Expo Go account is required on iOS, and I recommend logging in via password, not Google to prevent needed to set a password after account creation. Devices must be connected to the same wifi.

Edit the pages in expo-basics/src/app.

## Fastify

From fastify install required packages, then run `npx tsx fastify/src/server.ts`.

Fastify will host a server which can be pinged from command line, and is set to display logs.
Fastify can also be pinged from a browser, and these links can be pinged through links in Expo and Vite.

## Vite

From reast-basics install required packages, then run `npm run dev`.

Connect from a browser to view the webpage.

Edit react-basics/src/App.jsx.
