# Svelte Dot Matrix Loaders

<p>
  <a href="https://jsrepo.com/badges/@sv/loaders/dm">
    <img src="https://jsrepo.com/badges/@sv/loaders/dm" alt="jsrepo downloads" />
  </a>
  <a href="https://github.com/SikandarJODD/sv-matrix/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
  </a>
  <a href="https://github.com/sponsors/SikandarJODD">
    <img src="https://img.shields.io/github/sponsors/SikandarJODD?label=Sponsor&logo=githubsponsors&color=EA4AAA" alt="GitHub Sponsors" />
  </a>
</p>

A growing collection of dot-matrix loaders for Svelte. `sv-matrix` gives you reusable square matrix animations built on top of a shared `DotMatrix` foundation, with registry installs, live previews, and component docs.

- Live: [Preview](https://sv-matrix.vercel.app)
- Docs: [Setup & Usage](https://sv-matrix.vercel.app/docs/setup)
- Components: [View Loaders](https://sv-matrix.vercel.app/components/squares/square-1)

## Installation

Each loader depends on the shared dot-matrix foundation.

### 1. Install the base dot-matrix component

This installs the shared `DotMatrix` component, hooks, helpers, and styles.

```bash
npx shadcn-svelte@latest add https://sv-matrix.vercel.app/r/dot-matrix.json
```

### 2. Install any matrix loader

Pick any loader you want from the registry.

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
	import Square1 from '$lib/components/loaders/square-1.svelte';
</script>

<Square1 size={37} dotSize={5} speed={1.1} color="#f59e0b" />
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
