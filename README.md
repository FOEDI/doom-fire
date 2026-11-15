# Doom Fire

An endless, low-resolution fire animation for DeskThing, inspired by the classic Doom (1993) fire effect and the fullscreen Canvas style of [LifeThing](https://github.com/acymbalski/LifeThing).

The flame is generated in real time: a hot bottom row feeds heat upward, while random cooling and horizontal drift create the flicker. No assets, network access, or external services are required.

## Run locally

```sh
npm install
npm run dev
```

## Test and package

```sh
npm test
npm run build
```

The build creates a DeskThing app package (`.zip`) in `dist/`. In DeskThing Server, open **Downloads → App → Upload App** and select the generated archive.