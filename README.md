# Svelte Dot Matrix Loaders

[![jsrepo downloads](https://jsrepo.com/badges/@sv/loaders/dm)](https://jsrepo.com/badges/@sv/loaders/dm) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/SikandarJODD/sv-matrix/blob/main/LICENSE) [![GitHub Sponsors](https://img.shields.io/github/sponsors/SikandarJODD?label=Sponsor&logo=githubsponsors&color=EA4AAA)](https://github.com/SikandarJODD)

A growing collection of dot-matrix loaders for Svelte.

It includes square, circle, hexagon, and triangle based loaders, all built on top of a shared `DotMatrix` foundation for consistent behavior and styling.

- Live: [Preview](https://sv-matrix.vercel.app)
- Docs: [Setup & Usage](https://sv-matrix.vercel.app/docs/setup)
- Loaders: [Browse Components](https://sv-matrix.vercel.app/components/squares/square-1)

## Installation

Each loader depends on the shared `DotMatrix` foundation.

### 1. Install the base dot-matrix component

This installs the shared `DotMatrix` component, hooks, helpers, and styles.

```bash
npx shadcn-svelte@latest add https://sv-matrix.vercel.app/r/dot-matrix.json
```

### 2. Install any matrix loader

Pick any loader family and install the component you want from the registry.

```bash
npx shadcn-svelte@latest add https://sv-matrix.vercel.app/r/square-1.json
```

Examples:

```bash
npx shadcn-svelte@latest add https://sv-matrix.vercel.app/r/square-4.json
npx shadcn-svelte@latest add https://sv-matrix.vercel.app/r/square-8.json
```

## Usage

Example with `square-1`:

```svelte
<script lang="ts">
  import Square1 from "$lib/components/loaders/square-1.svelte";
</script>

<Square1 size={37} dotSize={5} speed={1.1} />
```

## Credits

This project is inspired from the Original Dot Matrix Loaders by [Shawn](https://x.com/zzzzshawn/)
Original Dot Matrix: [Live Preview](https://dotmatrix.zzzzshawn.cloud)

## Goal

The goal of this project is to bring similar dot matrix loaders to the Svelte ecosystem.

## Support

GitHub Sponsor: https://github.com/sponsors/SikandarJODD

## License

This project is licensed under the [MIT](LICENSE) License
