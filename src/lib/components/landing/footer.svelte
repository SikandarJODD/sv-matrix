<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { MoonIcon, SunIcon } from '@lucide/svelte';
	import { mode, toggleMode } from 'mode-watcher';
	import { FullWidthDivider } from '../ui/full-width-divider';
	import { DecorIcon } from '../ui/decor-icon';

	type FooterLink = {
		label: string;
		href: string;
		external?: boolean;
	};

	const projectLinks: FooterLink[] = [
		{ label: 'Home', href: '/' },
		{ label: 'Components', href: '/components/squares/square-1' },
		{ label: 'Setup', href: '/docs/setup' }
	];

	const resourceLinks: FooterLink[] = [
		{ label: 'Docs', href: '/docs' },
		{ label: 'GitHub', href: 'https://github.com/SikandarJODD/sv-matrix', external: true },
		{ label: 'X / Twitter', href: 'https://x.com/Sikandar_Bhide', external: true }
	];

	const socialLinks = [
		{
			id: 'x',
			label: 'X',
			href: 'https://x.com/Sikandar_Bhide'
		},
		{
			id: 'github',
			label: 'GitHub',
			href: 'https://github.com/SikandarJODD/sv-matrix'
		}
	] as const;

	const currentYear = new Date().getFullYear();
</script>

<div class="relative w-full overflow-clip bg-background pt-2">
	<div class="relative mx-auto w-full max-w-7xl">
		<footer class="relative">
			<FullWidthDivider position="top" class="bg-border/80" />
			<div class="container">
				<div class="relative border-x border-border/80">
					<DecorIcon class="size-3.5 bg-background opacity-80" position="top-left" />
					<DecorIcon class="size-3.5 bg-background opacity-80" position="top-right" />
					<DecorIcon
						class="size-3.5 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%-0.5px)] bg-background opacity-80"
						position="bottom-left"
					/>
					<DecorIcon
						class="size-3.5 translate-y-[calc(50%-0.5px)] bg-background opacity-80"
						position="bottom-right"
					/>

					<div class="grid gap-10 px-4 py-12 lg:grid-cols-5">
						<div class="col-span-4 flex flex-col gap-6">
							<div class="space-y-3">
								<a
									aria-label="Svelte Dot Matrix homepage"
									class="inline-flex w-fit rounded-md font-mono text-xl font-semibold tracking-tight transition-colors hover:text-foreground/80"
									href="/"
								>
									Svelte Dot Matrix
								</a>
								<p class="max-w-sm text-sm text-muted-foreground">Pixel Perfect Loaders</p>
							</div>

							<div class="flex flex-wrap items-center gap-2">
								<Button onclick={toggleMode} variant="outline" size="icon-sm">
									{#if mode.current === 'dark'}
										<SunIcon class="size-4" />
									{:else}
										<MoonIcon class="size-4" />
									{/if}
								</Button>

								{#each socialLinks as social (social.id)}
									<Button
										aria-label={social.label}
										href={social.href}
										rel="noreferrer"
										size="icon-sm"
										target="_blank"
										variant="ghost"
									>
										{#if social.id === 'x'}
											<!-- <XLogo class="size-4" /> -->
											<svg fill="none" class="size-4" viewBox="0 0 1200 1227"
												><path
													fill="currentColor"
													d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
												/></svg
											>
										{:else}
											<!-- <Github class="size-4" /> -->
											<svg viewBox="0 0 1024 1024" class="size-4" fill="none"
												><path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
													transform="scale(64)"
													fill="currentColor"
												/></svg
											>
										{/if}
									</Button>
								{/each}
							</div>
						</div>

						<div class="space-y-4">
							<h2
								class="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase"
							>
								Project
							</h2>

							<nav class="flex flex-col gap-3">
								{#each projectLinks as link (link.label)}
									<a
										class="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground"
										href={link.href}
									>
										{link.label}
									</a>
								{/each}
							</nav>
						</div>
					</div>
				</div>
			</div>
			<div class="relative container">
				<FullWidthDivider position="top" class="bg-border/80" />
				<div class="relative border-x">
					<p
						class="flex items-center justify-center py-3 text-center text-xs text-muted-foreground sm:text-xs"
					>
						&copy; {currentYear} Svelte Dot Matrix. Built by
						<a
							class="ml-2 inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-muted-foreground"
							href="https://x.com/Sikandar_Bhide"
							rel="noreferrer"
							target="_blank"
						>
							<img
								alt="Bhide Svelte avatar"
								class="size-5 rounded-full border border-border/80 object-cover"
								height="20"
								src="https://avatars.githubusercontent.com/u/93428946?v=4"
								width="20"
							/>
							Bhide Svelte
						</a>
					</p>
				</div>
			</div>
		</footer>
	</div>
</div>
