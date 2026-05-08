<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import DocsSearchNavigation from "$lib/components/docs/navigation/DocsSearchNavigation.svelte";
	import { createScroll } from "$lib/hooks/use-scroll.svelte";
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";
	import DesktopNav from "./desktop-nav.svelte";
	import MobileNav from "./mobile-nav.svelte";
	import { getStars, GitHubButton } from "$lib/components/ui/github-button";
	import { page } from "$app/state";
	import { mode, toggleMode } from "mode-watcher";
	import { SunIcon, MoonIcon } from "@lucide/svelte";

	let scroll = createScroll(50);
	let stars = $state(0);
	const repo = { owner: "SikandarJODD", repo: "sv-matrix" };
	onMount(async () => {
		stars = await getStars({ ...repo, fallback: 0 });
	});
	let isMainRoute = $derived(page.url.href === page.url.origin + "/");
	// $inspect(isMainRoute, page.url.href, page.url.origin);
</script>

<header
	class={cn(
		"sticky top-0 z-50 w-full border-b border-transparent",
		scroll.scrolled &&
			"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50",
		!isMainRoute &&
			"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50"
	)}
>
	<nav class="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-0!">
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
		<div class="flex items-center gap-2 md:gap-4">
			<DocsSearchNavigation />
			<div class="hidden items-center gap-2 md:flex">
				<Button
					href="https://x.com/Sikandar_Bhide"
					target="_blank"
					variant="ghost"
					size="icon-sm"
					class="rounded-sm text-primary"
				>
					<svg fill="none" viewBox="0 0 1200 1227"
						><path
							fill="currentColor"
							d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
						/></svg
					>
				</Button>
				<GitHubButton class="rounded-sm border-none" size="sm" {repo} {stars} />
				<Button onclick={toggleMode} variant="outline" size="icon-sm">
					{#if mode.current === "dark"}
						<SunIcon
							class="size-4 animate-in duration-500 fill-mode-backwards fade-in"
						/>
					{:else}
						<MoonIcon
							class="size-4 animate-in duration-500 fill-mode-backwards fade-in"
						/>
					{/if}
				</Button>
			</div>
			<MobileNav />
		</div>
	</nav>
</header>
