import type { CodeBlock } from '$lib/components/ui/code';
import { data as squareSourceItems } from '$lib/components/loaders/square/data';
import type { Example } from '$lib/types/examples';
import type { SEO } from '$lib/types/seo';
import type { ComponentDoc, PropsTable } from '$lib/types/structure';
import type { Component } from 'svelte';
// square-doc-imports:start
import { data as square1Doc } from '../../routes/(main)/components/squares/square-1/data';
import { data as square2Doc } from '../../routes/(main)/components/squares/square-2/data';
import { data as square3Doc } from '../../routes/(main)/components/squares/square-3/data';
import { data as square4Doc } from '../../routes/(main)/components/squares/square-4/data';
import { data as square5Doc } from '../../routes/(main)/components/squares/square-5/data';
import { data as square6Doc } from '../../routes/(main)/components/squares/square-6/data';
import { data as square7Doc } from '../../routes/(main)/components/squares/square-7/data';
import { data as square8Doc } from '../../routes/(main)/components/squares/square-8/data';
import { data as square9Doc } from '../../routes/(main)/components/squares/square-9/data';
import { data as square10Doc } from '../../routes/(main)/components/squares/square-10/data';
import { data as square11Doc } from '../../routes/(main)/components/squares/square-11/data';
import { data as square12Doc } from '../../routes/(main)/components/squares/square-12/data';
import { data as square13Doc } from '../../routes/(main)/components/squares/square-13/data';
import { data as square14Doc } from '../../routes/(main)/components/squares/square-14/data';
import { data as square15Doc } from '../../routes/(main)/components/squares/square-15/data';
import { data as square16Doc } from '../../routes/(main)/components/squares/square-16/data';
import { data as square17Doc } from '../../routes/(main)/components/squares/square-17/data';
import { data as square18Doc } from '../../routes/(main)/components/squares/square-18/data';
// square-doc-imports:end

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
	useCases?: Example[];
	propsTables?: PropsTable[];
};

const squareComponents = import.meta.glob<Component>(
	'../components/loaders/square/square-*.svelte',
	{
		eager: true,
		import: 'default'
	}
);

const componentById = new Map(
	Object.entries(squareComponents).map(([filePath, component]) => [
		filePath
			.split('/')
			.pop()
			?.replace(/\.svelte$/i, '') ?? filePath,
		component
	])
);

const richSquareDocs: Record<string, ComponentDoc> = {
	// square-doc-map:start
	'square-1': square1Doc,
	'square-2': square2Doc,
	'square-3': square3Doc,
	'square-4': square4Doc,
	'square-5': square5Doc,
	'square-6': square6Doc,
	'square-7': square7Doc,
	'square-8': square8Doc,
	'square-9': square9Doc,
	'square-10': square10Doc,
	'square-11': square11Doc,
	'square-12': square12Doc,
	'square-13': square13Doc,
	'square-14': square14Doc,
	'square-15': square15Doc,
	'square-16': square16Doc,
	'square-17': square17Doc,
	'square-18': square18Doc
// square-doc-map:end
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
		useCases: richDoc.useCases,
		propsTables: richDoc.props
	};
}
