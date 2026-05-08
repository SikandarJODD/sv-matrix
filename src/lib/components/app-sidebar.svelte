<script lang="ts">
	import { page } from "$app/state";
	import { navigationSections } from "$lib/content/matrix-navigation";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { watch } from "runed";
	import { tick, type ComponentProps } from "svelte";

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	let contentRef = $state<HTMLElement | null>(null);
	let pathname = $derived(page.url.pathname);

	watch(
		() => pathname,
		() => {
			let activeItem = contentRef?.querySelector<HTMLElement>(
				'[data-sidebar="menu-button"][data-active="true"]'
			);

			activeItem?.scrollIntoView({
				block: "nearest",
				inline: "nearest",
				behavior: "smooth",
			});
		}
	);
</script>

<Sidebar.Root class="pt-14 pb-2" {...restProps} bind:ref>
	<Sidebar.Content class="bg-background" bind:ref={contentRef}>
		{#each navigationSections as group (group.id)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.id)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={pathname === item.href}
									class="scroll-mt-10"
								>
									{#snippet child({ props })}
										<a href={item.href} {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<!-- <Sidebar.Rail /> -->
</Sidebar.Root>
