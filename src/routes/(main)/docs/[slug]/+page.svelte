<script lang="ts">
	import PlaceholderDocPage from '$lib/components/docs/base/PlaceholderDocPage.svelte';
	import { getPlaceholderPageContent } from '$lib/content/matrix-placeholder-content';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let content = $derived(getPlaceholderPageContent(data.item));
</script>

<PlaceholderDocPage item={data.item} {content} />
