<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Kbd from "$lib/components/ui/kbd/index.js";
	import {
		navigationSections,
		type MatrixNavItem,
		type MatrixNavSection,
	} from "$lib/content/matrix-navigation";

	let open = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}

	const groups: MatrixNavSection[] = navigationSections;

	function isDocsItem(item: MatrixNavItem) {
		return item.kind === "doc";
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="text-sm text-muted-foreground">
	<Button
		variant="ghost"
		size="icon"
		class="flex items-center justify-center rounded-lg bg-secondary px-1.5 md:min-w-46 md:justify-between md:rounded-full md:pr-2.5  dark:bg-muted/60"
		onclick={() => (open = true)}
	>
		<span class="hidden pl-1 md:block"> Search... </span>
		<Kbd.Group class="hidden gap-1 md:flex">
			<!-- <Kbd.Root>⌘</Kbd.Root> -->
			<Kbd.Root>Ctrl</Kbd.Root>
			<Kbd.Root>K</Kbd.Root>
		</Kbd.Group>
		<span class="lg:hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="128"
				height="128"
				viewBox="0 0 24 24"
				fill="none"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				role="img"
				color="currentColor"
			>
				<path
					d="M18.5016 18.5L21 21M20 14.5C20 11.4624 17.5376 9 14.5 9C11.4624 9 9 11.4624 9 14.5C9 17.5376 11.4624 20 14.5 20C17.5376 20 20 17.5376 20 14.5Z"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
				<path
					d="M10 3H14M3 10V14M6.5 21C4.567 21 3 19.433 3 17.5M17.5 3C19.433 3 21 4.567 21 6.5M3 6.5C3 4.567 4.567 3 6.5 3"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</svg>
		</span>
	</Button>
</div>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search components, documentation..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		{#each groups as group (group.id)}
			<Command.Group heading={group.title}>
				{#each group.items as item (item.id)}
					<Command.LinkItem
						value={item.id}
						keywords={[item.title]}
						onclick={() => (open = false)}
						href={item.href}
					>
						{#if isDocsItem(item)}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								role="img"
								color="currentColor"
							>
								<path
									d="M17.5055 2.01874C12.8289 2.83455 12 7.5 12 7.5V22C12 22 12.8867 17.1272 18.0004 16.5588C18.5493 16.4978 19 16.0576 19 15.5058V3.39309C19 2.5654 18.3216 1.87638 17.5055 2.01874Z"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
								<path
									d="M5.33333 5.00001C7.79379 4.99657 10.1685 5.88709 12 7.5V22C10.1685 20.3871 7.79379 19.4966 5.33333 19.5C3.77132 19.5 2.99032 19.5 2.64526 19.2792C2.4381 19.1466 2.35346 19.0619 2.22086 18.8547C2 18.5097 2 17.8941 2 16.6629V8.40322C2 6.97543 2 6.26154 2.54874 5.68286C3.09748 5.10418 3.65923 5.07432 4.78272 5.0146C4.965 5.00491 5.14858 5.00001 5.33333 5.00001Z"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
								<path
									d="M12 22.001C13.8315 20.3881 16.2062 19.4976 18.6667 19.501C20.2287 19.501 21.0097 19.501 21.3547 19.2802C21.5619 19.1476 21.6465 19.0629 21.7791 18.8558C22 18.5107 22 17.8951 22 16.6639V8.40424C22 6.97645 22 6.26256 21.4513 5.68388C20.9025 5.1052 20.1235 5.05972 19 5"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
						{:else if item.id.includes("circle")}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								role="img"
								color="currentColor"
							>
								<circle opacity="0.2" cx="12" cy="12" r="10" fill="currentColor"
								></circle>
								<circle
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linejoin="round"
								></circle>
							</svg>
						{:else if item.id.includes("square")}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="size-4.5"
								viewBox="0 0 24 24"
								><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt --><g
									fill="none"
									stroke="#888888"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									><path
										fill="#888888"
										fill-opacity="0"
										d="M4 12v-7c0 -0.55 0.45 -1 1 -1h14c0.55 0 1 0.45 1 1v14c0 0.55 -0.45 1 -1 1h-14c-0.55 0 -1 -0.45 -1 -1Z"
										><animate
											fill="freeze"
											attributeName="fill-opacity"
											dur="0.15s"
											values="0;0.3"
											fill-opacity="0.2"
										/></path
									></g
								></svg
							>
						{:else if item.id.includes("triangle")}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								><!-- Icon from Myna UI Icons by Praveen Juge - https://github.com/praveenjuge/mynaui-icons/blob/main/LICENSE --><path
									fill="none"
									stroke="#888888"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M5.98 10.762C8.608 5.587 9.92 3 12 3s3.393 2.587 6.02 7.762l.327.644c2.182 4.3 3.274 6.45 2.287 8.022C19.648 21 17.208 21 12.327 21h-.654c-4.88 0-7.321 0-8.307-1.572s.105-3.722 2.287-8.022z"
								/></svg
							>
						{:else if item.id.includes("hex")}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="size-4.5"
								viewBox="0 0 24 24"
								><!-- Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE --><path
									fill="#888888"
									d="M16.05 19h-8.1l-4.04-7l4.04-7h8.1l4.04 7z"
									opacity=".3"
								/><path
									fill="#888888"
									d="M17.2 3H6.8l-5.2 9l5.2 9h10.4l5.2-9zm-1.15 16h-8.1l-4.04-7l4.04-7h8.09l4.04 7z"
								/></svg
							>
						{/if}
						{item.title}
					</Command.LinkItem>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
