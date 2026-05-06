import type { CodeBlock } from '$lib/components/ui/code';
import { data as squareSourceItems } from '$lib/components/loaders/square/data';
import type { Example } from '$lib/types/examples';
import type { SEO } from '$lib/types/seo';
import type { ComponentDoc, PropsTable } from '$lib/types/structure';
import type { Component } from 'svelte';
import { data as squareOneDoc } from '../../routes/(main)/components/squares/square-1/data';

export type SquarePageData = {
	id: string;
	title: string;
	description?: string;
	seo: SEO;
	preview?: Component;
	previewCode?: CodeBlock | CodeBlock[];
	installCodeBlocks?: CodeBlock | CodeBlock[];
	installPackages?: string[];
	installFolderStructure?: string;
	installTailwindCode?: CodeBlock;
	examples?: Example[];
	propsTables?: PropsTable[];
};

const squareComponents = import.meta.glob<Component>('../components/loaders/square/square-*.svelte', {
	eager: true,
	import: 'default'
});

const componentById = new Map(
	Object.entries(squareComponents).map(([filePath, component]) => [
		filePath.split('/').pop()?.replace(/\.svelte$/i, '') ?? filePath,
		component
	])
);

const richSquareDocs: Record<string, ComponentDoc> = {
	'square-1': squareOneDoc
};

function getDefaultDescription(title: string, fallback?: string) {
	return fallback ?? `${title} square loader component.`;
}

function createDefaultSeo(title: string, description: string): SEO {
	return {
		title: `${title} Loader`,
		description,
		keywords: ['Svelte', 'Loader', 'Square', title]
	};
}

function createFolderStructure(fileName: string) {
	return ['src/', '  lib/', '    components/', '      loaders/', `        square/${fileName}`].join(
		'\n'
	);
}

function createDefaultSquarePageData(id: string): SquarePageData | null {
	const sourceItem = squareSourceItems.find((item) => item.id === id);
	const preview = componentById.get(id);

	if (!sourceItem || !preview) {
		return null;
	}

	const description = getDefaultDescription(sourceItem.name, sourceItem.desc);
	const codeBlock: CodeBlock = {
		filename: sourceItem.fileName,
		filecode: sourceItem.fileCode,
		lang: 'svelte'
	};

	return {
		id: sourceItem.id,
		title: sourceItem.name,
		description,
		seo: createDefaultSeo(sourceItem.name, description),
		preview,
		previewCode: codeBlock,
		installCodeBlocks: codeBlock,
		installFolderStructure: createFolderStructure(sourceItem.fileName),
		installPackages: []
	};
}

export function getSquarePageData(id: string): SquarePageData | null {
	const defaultPage = createDefaultSquarePageData(id);
	const richDoc = richSquareDocs[id];

	if (!defaultPage) {
		return null;
	}

	if (!richDoc) {
		return defaultPage;
	}

	return {
		...defaultPage,
		title: richDoc.title,
		description: richDoc.description ?? defaultPage.description,
		seo: richDoc.seo,
		preview: richDoc.preview ?? defaultPage.preview,
		previewCode: richDoc.previewCode ?? defaultPage.previewCode,
		installCodeBlocks: richDoc.installBlock?.installCode ?? defaultPage.installCodeBlocks,
		installPackages: richDoc.installBlock?.packages ?? defaultPage.installPackages,
		installFolderStructure:
			richDoc.installBlock?.folderStructure ?? defaultPage.installFolderStructure,
		installTailwindCode: richDoc.installBlock?.tailwind ?? defaultPage.installTailwindCode,
		examples: richDoc.examples,
		propsTables: richDoc.props
	};
}
