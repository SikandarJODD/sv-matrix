<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { createScroll } from '$lib/hooks/use-scroll.svelte';
	import { cn } from '$lib/utils';
	import DesktopNav from './desktop-nav.svelte';
	import MobileNav from './mobile-nav.svelte';

	let scroll = createScroll(50);
</script>

<header
	class={cn(
		'sticky top-0 z-50 w-full border-b border-transparent',
		scroll.scrolled &&
			'border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50'
	)}
>
	<nav class="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-4 md:px-0">
		<div class="flex w-full items-center gap-5">
			<a class="rotate-120 fill-black/90 dark:fill-white/80" href="/">
				<!-- <Logo class="h-4" /> -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-6">
					<path
						d="M17.525 31.24v-1.52h3.04v-1.53h3.05v-1.52h3.05v-1.53h1.52v-1.52h1.53V8.38h-1.53V6.86h-1.52v1.52h-3.05v1.53h-3.05v1.52h-3.04v1.52h-3.05v1.53H16v15.24h-1.52v1.52Zm6.09-18.29h3.05v1.53h-3.05Zm-4.57 9.15H22.1v3.04h-3.05Zm4.57-16.76h3.05v1.52h-3.05Zm-3.05-1.53h3.05v1.53h-3.05Zm-3.04-1.52h3.04v1.52h-3.04Zm-3.05 4.57h3.05v3.05h-3.05Zm0-6.1h3.05v1.53h-3.05Zm-3.05 27.43h3.05v1.53h-3.05Z"
					/>
					<path
						d="M11.425 11.43h3.05v1.52h-3.05Zm0-9.14h3.05v1.52h-3.05Zm0 19.81h3.05v3.04h-3.05Zm0-6.1h3.05v3.05h-3.05Zm-3.05 10.67h3.05v1.52h-3.05Zm0-16.76h3.05v1.52h-3.05Zm0-6.1h3.05v1.53h-3.05Zm-3.04 21.33h3.04v1.53h-3.04Zm0-16.76h3.04v1.53h-3.04Zm0-3.04h3.04v1.52h-3.04Zm0 13.71h3.04v3.05h-3.04Zm0-6.1h3.04V16h-3.04Zm-1.53 10.67h1.53v1.52h-1.53Zm0-16.76h1.53v1.52h-1.53Zm-1.52 1.52h1.52v15.24h-1.52Z"
					/>
				</svg>
			</a>
			<DesktopNav />
		</div>
		<div class="hidden items-center gap-2 md:flex">
			<Button variant="outline">Sign In</Button>
			<Button>Get Started</Button>
		</div>
		<MobileNav />
	</nav>
</header>
