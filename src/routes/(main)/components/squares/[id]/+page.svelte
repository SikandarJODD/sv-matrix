<script lang="ts">
	import ComponentDocPage from '$lib/components/docs/base/ComponentDocPage.svelte';
	import { getSquarePageData } from '$lib/content/squares';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let squarePage = $derived.by(() => {
		const pageData = getSquarePageData(data.id);

		if (!pageData) {
			throw new Error(`Unknown square page: ${data.id}`);
		}

		return pageData;
	});
</script>

<ComponentDocPage
	id={squarePage.id}
	title={squarePage.title}
	description={squarePage.description}
	seo={squarePage.seo}
	preview={squarePage.preview}
	previewCode={squarePage.previewCode}
	installCodeBlocks={squarePage.installCodeBlocks}
	installPackages={squarePage.installPackages}
	installFolderStructure={squarePage.installFolderStructure}
	installTailwindCode={squarePage.installTailwindCode}
	examples={squarePage.examples}
	useCases={squarePage.useCases}
	propsTables={squarePage.propsTables}
/>
