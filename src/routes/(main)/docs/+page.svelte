<script lang="ts">
	import NavigationIndexPage from '$lib/components/docs/base/NavigationIndexPage.svelte';
	import { navigationSections } from '$lib/content/matrix-navigation';

	const docsSections = navigationSections.filter((section) => section.id === 'get-started');
</script>

<NavigationIndexPage
	title="Docs"
	description="Browse the shared docs navigation. Start with the Get Started pages, then move into the component families."
	sections={docsSections}
/>
