<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { activeElement, PressedKeys } from 'runed';
	import { ModeWatcher, toggleMode } from 'mode-watcher';

	let { children } = $props();
	let keys = new PressedKeys();

	keys.onKeys(['d'], () => {
		if (
			activeElement.current?.localName === 'input' ||
			activeElement.current?.localName === 'textarea'
		)
			return;
		toggleMode();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher defaultMode="dark" />

<nav class="mx-auto flex max-w-xl items-center justify-center">
	<ul class="flex items-center gap-4">
		<li><a href="/">Home</a></li>
		<li><a href="/dot-matrix">Dot Matrix</a></li>
	</ul>
</nav>

{@render children()}
