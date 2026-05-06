<script lang="ts">
	import NavigationIndexPage from '$lib/components/docs/base/NavigationIndexPage.svelte';
	import { navigationSections } from '$lib/content/matrix-navigation';

	const componentSections = navigationSections.filter((section) => section.id !== 'get-started');
</script>

<NavigationIndexPage
	title="Components"
	description="Browse the component families available in the shared navigation registry."
	sections={componentSections}
/>
