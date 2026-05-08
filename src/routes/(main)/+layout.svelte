<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import Toc from "$lib/components/docs/base/toc/toc.svelte";
	import DocsNavigation from "$lib/components/docs/navigation/DocsNavigation.svelte";
	import { getPrevNext } from "$lib/content/matrix-navigation";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { UseToc } from "$lib/hooks/use-toc.svelte";
	import { activeElement, PressedKeys } from "runed";
	import type { Snippet } from "svelte";

	let {
		children,
	}: {
		children: Snippet;
	} = $props();

	let toc = new UseToc();
	let keys = new PressedKeys();
	let metaKeyPressed = $derived(keys.has("meta"));
	let controlKeyPressed = $derived(keys.has("control"));
	let altKeyPressed = $derived(keys.has("alt"));
	let shiftKeyPressed = $derived(keys.has("shift"));

	let navigation = $derived.by(() => {
		let { prev, next } = getPrevNext(page.url.pathname);
		return {
			previous: prev ? { title: prev.title, href: prev.href, desc: prev.description } : null,
			next: next ? { title: next.title, href: next.href, desc: next.description } : null,
		};
	});

	function hasModifierKeyPressed() {
		return metaKeyPressed || controlKeyPressed || altKeyPressed || shiftKeyPressed;
	}

	function isKeyboardNavigationBlocked() {
		let element = activeElement.current;

		if (!(element instanceof HTMLElement)) {
			return false;
		}

		if (
			element.localName === "input" ||
			element.localName === "textarea" ||
			element.localName === "select"
		) {
			return true;
		}

		if (element.isContentEditable) {
			return true;
		}

		return Boolean(
			element.closest(
				[
					'[data-slot="dropdown-menu-content"]',
					'[data-slot="command"]',
					'[data-slot="command-input"]',
					'[data-slot="dialog-content"]',
					'[role="menu"]',
					'[role="dialog"]',
				].join(", ")
			)
		);
	}

	function getNavigationTarget(key: string) {
		if (hasModifierKeyPressed() || isKeyboardNavigationBlocked()) {
			return null;
		}

		if (key === "arrowleft") {
			return navigation.previous;
		}

		if (key === "arrowright") {
			return navigation.next;
		}

		return null;
	}

	function handleNavigationKeydown(event: KeyboardEvent) {
		if (event.repeat) {
			return;
		}

		let target = getNavigationTarget(event.key.toLowerCase());

		if (!target) {
			return;
		}

		event.preventDefault();
		void goto(target.href);
	}
</script>

<svelte:window onkeydown={handleNavigationKeydown} />

<Sidebar.Provider>
	<AppSidebar />
	<!-- <Sidebar.Inset> -->
	<div
		class="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-6 sm:px-6 lg:pr-4 lg:pl-8"
	>
		<!-- <aside class="sticky top-8 hidden w-44 shrink-0 lg:block">
  </aside> -->

		<main class="w-full sm:max-w-4xl" bind:this={toc.ref}>
			<!-- Main area -->
			{@render children()}

			<!-- Prev/Next Navigation -->
			<DocsNavigation previous={navigation.previous} next={navigation.next} />
		</main>

		<aside class="sticky top-24 hidden w-56 shrink-0 xl:block">
			<div>
				<h2 class="mb-2 text-sm font-medium">On this page</h2>
			</div>
			<Toc toc={toc.current}></Toc>
		</aside>
	</div>
	<!-- </Sidebar.Inset> -->
</Sidebar.Provider>
