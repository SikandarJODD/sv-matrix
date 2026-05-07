# Svelte Dot Matrix Loaders

<p>
  <img src="https://gitviews.com/user/SikandarJODD/repos.svg?style=flat&label-color=%23555&color=blue" alt="Views" />
  <a href="https://github.com/sponsors/SikandarJODD">
    <img src="https://img.shields.io/github/sponsors/SikandarJODD?label=Sponsor&logo=githubsponsors&color=EA4AAA" alt="GitHub Sponsors" /></a>
  <a href="https://github.com/SikandarJODD/sv-matrix/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
  </a>
</p>

A growing collection of dot-matrix loaders for Svelte. `sv-matrix` gives you reusable square matrix animations built on top of a shared `DotMatrix` foundation, with registry installs, live previews, and component docs.

- Live: https://sv-matrix.vercel.app
- Docs: https://sv-matrix.vercel.app/docs
- Components: https://sv-matrix.vercel.app/components

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

## Support

GitHub Sponsor: https://github.com/sponsors/SikandarJODD

## License

MIT
