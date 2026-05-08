<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Portal, PortalBackdrop } from "$lib/components/ui/portal";
	import { cn } from "$lib/utils";
	import { MenuIcon, MoonIcon, SunIcon, XIcon } from "@lucide/svelte";
	import LinkItem from "./link-item.svelte";
	import { navigationItems } from "$lib/content/matrix-navigation";
	import { getStars, GitHubButton } from "$lib/components/ui/github-button";
	import { onMount } from "svelte";
	import { mode, toggleMode } from "mode-watcher";

	let open = $state(false);
	let stars = $state(0);
	const repo = { owner: "SikandarJODD", repo: "sv-matrix" };
	onMount(async () => {
		stars = await getStars({ ...repo, fallback: 0 });
	});
</script>

<div class="flex items-center gap-2 md:hidden">
	<Button
		aria-controls="mobile-menu"
		aria-expanded={open}
		aria-label="Toggle menu"
		class="md:hidden"
		onclick={() => (open = !open)}
		size="icon"
		variant="outline"
	>
		<div class={cn("transition-all", open ? "scale-100 opacity-100" : "scale-0 opacity-0")}>
			<XIcon />
		</div>
		<div
			class={cn(
				"absolute transition-all",
				open ? "scale-0 opacity-0" : "scale-100 opacity-100"
			)}
		>
			<MenuIcon />
		</div>
	</Button>
	{#if open}
		<Portal class="top-14">
			<PortalBackdrop
				class="bg-background blur-none backdrop-blur-none supports-backdrop-filter:bg-background"
			/>
			<div
				class={cn(
					"relative size-full overflow-y-auto p-4",
					"ease-out data-[slot=open]:animate-in data-[slot=open]:zoom-in-97"
				)}
				data-slot={open ? "open" : "closed"}
			>
				<div class="flex w-full flex-col gap-y-4">
					<div>
						<div class="text-sm text-muted-foreground">Get Started</div>
						{#each navigationItems.filter((n) => n.section === "get-started") as item}
							<a
								href={item.href}
								class={cn(
									"flex items-center gap-x-2 rounded-lg py-1.5 active:bg-muted dark:active:bg-muted/50"
								)}
							>
								<div class="flex flex-col items-start justify-center">
									<span class="font-medium">{item.title}</span>
								</div>
							</a>
						{/each}
					</div>
					<div>
						<div class="text-sm text-muted-foreground">Square Loaders</div>
						{#each navigationItems.filter((n) => n.section === "squares") as item}
							<a
								href={item.href}
								class={cn(
									"flex items-center gap-x-2 rounded-lg py-1.5 active:bg-muted dark:active:bg-muted/50"
								)}
							>
								<div class="flex flex-col items-start justify-center">
									<span class="font-medium">{item.title}</span>
								</div>
							</a>
						{/each}
					</div>
					<div>
						<div class="text-sm text-muted-foreground">Circle Loaders</div>
						{#each navigationItems.filter((n) => n.section === "circles") as item}
							<a
								href={item.href}
								class={cn(
									"flex items-center gap-x-2 rounded-lg py-1.5 active:bg-muted dark:active:bg-muted/50"
								)}
							>
								<div class="flex flex-col items-start justify-center">
									<span class="font-medium">{item.title}</span>
								</div>
							</a>
						{/each}
					</div>
					<div>
						<div class="text-sm text-muted-foreground">Hex Loaders</div>
						{#each navigationItems.filter((n) => n.section === "hex") as item}
							<a
								href={item.href}
								class={cn(
									"flex items-center gap-x-2 rounded-lg py-1.5 active:bg-muted dark:active:bg-muted/50"
								)}
							>
								<div class="flex flex-col items-start justify-center">
									<span class="font-medium">{item.title}</span>
								</div>
							</a>
						{/each}
					</div>
				</div>
				<div
					class="fixed right-4 bottom-4 mt-5 flex animate-in items-center justify-end gap-2 delay-200 duration-400 fade-in-5 fill-mode-backwards"
				>
					<Button
						href="https://x.com/Sikandar_Bhide"
						target="_blank"
						variant="ghost"
						size="icon"
						class="rounded-sm text-primary"
					>
						<svg fill="none" viewBox="0 0 1200 1227"
							><path
								fill="currentColor"
								d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
							/></svg
						>
					</Button>
					<GitHubButton class="rounded-sm" size="sm" {repo} {stars} />
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
			</div>
		</Portal>
	{/if}
</div>
