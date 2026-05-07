import type { CodeBlock } from '$lib/components/ui/code';
import type { Example } from '$lib/types/examples';
import type { SEO } from '$lib/types/seo';
import type { ComponentDataItem, PropsTable, SquareDocContent } from '$lib/types/structure';
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
import { data as square19Doc } from '../../routes/(main)/components/squares/square-19/data';
import { data as square20Doc } from '../../routes/(main)/components/squares/square-20/data';
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

export type SquareCatalogEntry = {
	id: string;
	title: string;
	description: string;
};

export const squareCatalog = [
	{
		id: 'square-1',
		title: 'Neon Drift',
		description: 'A square loader with a drifting neon pulse across a dot-matrix grid.'
	},
	{
		id: 'square-2',
		title: 'Pulse Ladder',
		description: 'A square loader with a stepped pulse that climbs the grid like a ladder.'
	},
	{
		id: 'square-3',
		title: 'Core Spiral',
		description: 'A square loader with a spiral pulse that tightens around the core.'
	},
	{
		id: 'square-4',
		title: 'Twin Orbit',
		description: 'A square loader with paired highlights orbiting through the square grid.'
	},
	{
		id: 'square-5',
		title: 'Prism Sweep',
		description: 'A square loader with a sweeping prism-like shimmer across the matrix.'
	},
	{
		id: 'square-6',
		title: 'Flux Columns',
		description: 'A square loader with flowing column pulses that cycle through the grid.'
	},
	{
		id: 'square-7',
		title: 'Block Drop',
		description: 'A square loader with a block-drop motion that lands in rhythmic steps.'
	},
	{
		id: 'square-8',
		title: 'Strobe Stack',
		description: 'A square loader with stacked strobe flashes that pulse from row to row.'
	},
	{
		id: 'square-9',
		title: 'Glyph Pulse',
		description: 'A square loader with crisp glyph-like beats that pulse through the matrix.'
	},
	{
		id: 'square-10',
		title: 'CRT Glide',
		description: 'A square loader with a retro scanline glide inspired by CRT displays.'
	},
	{
		id: 'square-11',
		title: 'Echo Ring',
		description: 'A square loader with ringed echoes that ripple outward from the center.'
	},
	{
		id: 'square-12',
		title: 'Origin Wave',
		description: 'A square loader with a wave that expands cleanly from the origin point.'
	},
	{
		id: 'square-13',
		title: 'Core Rotar',
		description: 'A square loader with a rotating core pulse and steady geometric rhythm.'
	},
	{
		id: 'square-14',
		title: 'Prism Bloom',
		description: 'A square loader with a bright prism bloom that opens across the grid.'
	},
	{
		id: 'square-15',
		title: 'Helix Glow',
		description: 'A square loader with a glowing helix-style twist through the square matrix.'
	},
	{
		id: 'square-16',
		title: 'Helix Core',
		description: 'A square loader with a helix-like core pulse and layered depth.'
	},
	{
		id: 'square-17',
		title: 'Half Helix',
		description: 'A square loader with a split helix motion that arcs through half the grid.'
	},
	{
		id: 'square-18',
		title: 'Sound Bars',
		description: 'A square loader with equalizer-style bars pulsing like live sound levels.'
	},
	{
		id: 'square-19',
		title: 'Lemniscate Pulse',
		description:
			'A square loader with twin heads tracing a lemniscate path and a soft pulse through the center.'
	},
	{
		id: 'square-20',
		title: 'Mobius Ring',
		description:
			'A square loader with a perimeter ring, countertail motion, and Mobius-style twist cues at each corner.'
	}
] satisfies SquareCatalogEntry[];

const squareModules = import.meta.glob<string>('../components/loaders/square/square-*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
});

const squareComponents = import.meta.glob<Component>(
	'../components/loaders/square/square-*.svelte',
	{
		eager: true,
		import: 'default'
	}
);

const squareCatalogById = new Map(squareCatalog.map((entry) => [entry.id, entry] as const));

const componentById = new Map(
	Object.entries(squareComponents).map(([filePath, component]) => [
		filePath
			.split('/')
			.pop()
			?.replace(/\.svelte$/i, '') ?? filePath,
		component
	])
);

const richSquareDocs: Record<string, SquareDocContent> = {
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
	'square-18': square18Doc,
	'square-19': square19Doc,
	'square-20': square20Doc
	// square-doc-map:end
};

function getFileName(filePath: string) {
	return filePath.split('/').pop() ?? filePath;
}

function getFileId(fileName: string) {
	return fileName.replace(/\.svelte$/i, '');
}

function getSortKey(fileName: string) {
	const match = fileName.match(/(\d+)/);
	return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function getSquareCatalogEntry(id: string) {
	return squareCatalogById.get(id) ?? null;
}

function createSquareSeo(entry: SquareCatalogEntry): SEO {
	const squareNumberLabel = entry.id.replace(/^square-/, 'Square ');

	return {
		title: `${entry.title} Loader`,
		description: entry.description,
		keywords: ['Svelte', entry.title, 'Loader', 'Square', entry.id, squareNumberLabel]
	};
}

function createFolderStructure(fileName: string) {
	return ['src/', '  lib/', '    components/', '      loaders/', `        square/${fileName}`].join(
		'\n'
	);
}

export const squareSourceItems: ComponentDataItem[] = Object.entries(squareModules)
	.map(([filePath, fileCode]) => {
		const fileName = getFileName(filePath);
		const id = getFileId(fileName);
		const entry = getSquareCatalogEntry(id);

		if (!entry) {
			throw new Error(`Missing square catalog entry for ${id}.`);
		}

		return {
			id,
			name: entry.title,
			fileName,
			fileCode,
			desc: entry.description
		};
	})
	.sort((left, right) => getSortKey(left.fileName) - getSortKey(right.fileName));

function createDefaultSquarePageData(id: string): SquarePageData | null {
	const sourceItem = squareSourceItems.find((item) => item.id === id);
	const preview = componentById.get(id);
	const catalogEntry = getSquareCatalogEntry(id);

	if (!sourceItem || !preview || !catalogEntry) {
		return null;
	}

	const codeBlock: CodeBlock = {
		filename: sourceItem.fileName,
		filecode: sourceItem.fileCode,
		lang: 'svelte'
	};

	return {
		id: sourceItem.id,
		title: catalogEntry.title,
		description: catalogEntry.description,
		seo: createSquareSeo(catalogEntry),
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
