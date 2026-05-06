import type { ComponentDataItem } from '$lib/types/structure';

const squareModules = import.meta.glob<string>('./square-*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const squareDescriptions: Record<string, string> = {
	'square-1.svelte': 'The first square component example.',
	'square-2.svelte': 'A second square variation for the docs.'
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
