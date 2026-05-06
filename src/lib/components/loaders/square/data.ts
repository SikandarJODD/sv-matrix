import type { ComponentDataItem } from '$lib/types/structure';

const squareModules = import.meta.glob<string>('./square-*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const squareDescriptions: Record<string, string> = {
	// square-description-map:start
	'square-3.svelte': "Square 3 square loader component.",
	'square-4.svelte': "Square 4 square loader component.",
	'square-5.svelte': "Square 5 square loader component.",
	'square-6.svelte': "Square 6 square loader component.",
	'square-7.svelte': "Square 7 square loader component.",
	'square-8.svelte': "Square 8 square loader component.",
	'square-9.svelte': "Square 9 square loader component.",
	'square-10.svelte': "Square 10 square loader component.",
	'square-11.svelte': "Square 11 square loader component.",
	'square-12.svelte': "Square 12 square loader component."
// square-description-map:end
};

function getFileName(filePath: string) {
	return filePath.split('/').pop() ?? filePath;
}

// format : square-1.svelte -> square-1
function getFileId(fileName: string) {
	return fileName.replace(/\.svelte$/i, '');
}

function getComponentName(fileName: string) {
	return fileName
		.replace(/\.svelte$/i, '')
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

function getSortKey(fileName: string) {
	const match = fileName.match(/(\d+)/);
	return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

export const data: ComponentDataItem[] = Object.entries(squareModules)
	.map(([filePath, fileCode]) => {
		const fileName = getFileName(filePath);
		const id = getFileId(fileName);

		return {
			id,
			name: getComponentName(fileName),
			fileName,
			fileCode,
			...(squareDescriptions[fileName] ? { desc: squareDescriptions[fileName] } : {})
		};
	})
	.sort((left, right) => getSortKey(left.fileName) - getSortKey(right.fileName));

export default data;
