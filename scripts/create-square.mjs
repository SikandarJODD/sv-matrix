#!/usr/bin/env node
// @ts-check

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
	squareCommonProps,
	squareExamplePresets,
	squareFamilyConfig,
	squareForwardedProps,
	squareUseCasePresets
} from './scaffold/families/square/presets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const isCliEntrypoint =
	process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliEntrypoint) {
	const args = parseArgs(process.argv.slice(2));

	createSquare(args).catch((error) => {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	});
}

/**
 * @param {{
 *   id?: string;
 *   title?: string;
 *   description?: string;
 *   registryTitle?: string;
 *   registryDescription?: string;
 *   examples?: string[];
 *   useCases?: string[];
 *   force?: boolean;
 * }} args
 */
export async function createSquare(args) {
	if (!args.id) {
		throw new Error('Missing required argument: --id square-2');
	}

	if (!args.title) {
		throw new Error('Missing required argument: --title "Square 2"');
	}

	if (!/^square-\d+$/.test(args.id)) {
		throw new Error(`Invalid square id "${args.id}". Expected format square-<number>.`);
	}

	const componentFileName = `${args.id}.svelte`;
	const componentFilePath = resolveRepoPath(squareFamilyConfig.componentDir, componentFileName);
	const docsDirPath = resolveRepoPath(squareFamilyConfig.docsDir, args.id);
	const richDocsFilePath = resolveRepoPath(squareFamilyConfig.richDocsFile);
	const registryFilePath = resolveRepoPath(squareFamilyConfig.registryFile);
	const templateRootPath = resolveRepoPath(squareFamilyConfig.templateDir);

	await assertComponentExists(componentFilePath, componentFileName);
	await assertTargetDirectorySafe(docsDirPath, args.force);

	const componentSource = await fs.readFile(componentFilePath, 'utf8');
	const componentImportName = pascalFromKebab(args.id);
	const propsTypeName = extractPropsTypeName(componentSource, componentImportName);
	const runtimeDefaults = extractRuntimeDefaults(componentSource);
	const richDescription = args.description ?? `${args.title} square loader component.`;
	const registryTitle = args.registryTitle ?? `${args.title} Loader`;
	const registryDescription = args.registryDescription ?? richDescription;

	const selectedExamples = resolvePresetSelection(
		args.examples,
		squareFamilyConfig.defaultExamples,
		squareExamplePresets,
		'example'
	);
	const selectedUseCases = resolvePresetSelection(
		args.useCases,
		squareFamilyConfig.defaultUseCases,
		squareUseCasePresets,
		'use-case'
	);

	const manifest = {
		id: args.id,
		title: args.title,
		description: richDescription,
		registryTitle,
		registryDescription,
		componentFileName,
		componentImportName,
		componentImportPath: `$lib/components/loaders/square/${componentFileName}`,
		propsTypeName,
		runtimeDefaults,
		examples: selectedExamples,
		useCases: selectedUseCases
	};

	await fs.mkdir(path.join(docsDirPath, 'examples'), { recursive: true });
	await fs.mkdir(path.join(docsDirPath, 'use-cases'), { recursive: true });
	await fs.mkdir(path.join(docsDirPath, 'llms.txt'), { recursive: true });

	await writeFile(
		path.join(docsDirPath, 'examples', 'preview.svelte'),
		await renderTemplateFile(
			path.join(templateRootPath, 'examples', 'preview.svelte.template'),
			manifest
		)
	);

	for (const preset of manifest.examples) {
		await writeFile(
			path.join(docsDirPath, 'examples', preset.fileName),
			await renderTemplateFile(path.join(templateRootPath, preset.templateFile), manifest)
		);
	}

	for (const preset of manifest.useCases) {
		await writeFile(
			path.join(docsDirPath, 'use-cases', preset.fileName),
			await renderTemplateFile(path.join(templateRootPath, preset.templateFile), manifest)
		);
	}

	await writeFile(path.join(docsDirPath, 'docs.md'), renderDocsMarkdown(manifest));
	await writeFile(path.join(docsDirPath, 'llms.txt', '+server.ts'), renderLlmsRoute());
	await writeFile(path.join(docsDirPath, 'data.ts'), renderDataFile(manifest));

	await upsertSquareCatalogEntry(richDocsFilePath, manifest);
	await upsertRichDocsRegistration(richDocsFilePath, manifest.id);
	await upsertRegistryEntry(registryFilePath, manifest);

	console.log(`Created square docs scaffold for ${manifest.id}`);
	console.log(`Docs folder: ${path.relative(repoRoot, docsDirPath)}`);
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
	/** @type {{ id?: string; title?: string; description?: string; registryTitle?: string; registryDescription?: string; examples?: string[]; useCases?: string[]; force: boolean; }} */
	const parsed = {
		force: false
	};

	for (let index = 0; index < argv.length; index += 1) {
		const part = argv[index];

		if (part === '--force') {
			parsed.force = true;
			continue;
		}

		if (!part.startsWith('--')) {
			throw new Error(`Unexpected argument "${part}".`);
		}

		const [flag, inlineValue] = part.split('=', 2);
		const value = inlineValue ?? argv[index + 1];

		if (!value || value.startsWith('--')) {
			throw new Error(`Missing value for ${flag}.`);
		}

		if (!inlineValue) {
			index += 1;
		}

		switch (flag) {
			case '--id':
				parsed.id = value;
				break;
			case '--title':
				parsed.title = value;
				break;
			case '--description':
				parsed.description = value;
				break;
			case '--registry-title':
				parsed.registryTitle = value;
				break;
			case '--registry-description':
				parsed.registryDescription = value;
				break;
			case '--examples':
				parsed.examples = splitCsv(value);
				break;
			case '--use-cases':
				parsed.useCases = splitCsv(value);
				break;
			default:
				throw new Error(`Unknown argument "${flag}".`);
		}
	}

	return parsed;
}

function splitCsv(value) {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function resolveRepoPath(...segments) {
	return path.join(repoRoot, ...segments);
}

async function assertComponentExists(componentFilePath, componentFileName) {
	try {
		await fs.access(componentFilePath);
	} catch {
		throw new Error(
			`Component source "${componentFileName}" does not exist in ${squareFamilyConfig.componentDir}.`
		);
	}
}

async function assertTargetDirectorySafe(targetDirPath, force) {
	try {
		const existingEntries = await fs.readdir(targetDirPath);
		if (existingEntries.length > 0 && !force) {
			throw new Error(
				`Target docs directory already exists and is not empty: ${path.relative(repoRoot, targetDirPath)}. Use --force to overwrite generated files.`
			);
		}
	} catch (error) {
		if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') {
			throw error;
		}
	}
}

function pascalFromKebab(value) {
	return value
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function extractPropsTypeName(componentSource, componentImportName) {
	const aliasMatch = componentSource.match(/export type\s+(\w+)\s*=\s*DotMatrixCommonProps\s*;/);
	if (aliasMatch?.[1]) {
		return aliasMatch[1];
	}

	return `${componentImportName}Props`;
}

function extractRuntimeDefaults(componentSource) {
	const propsBlockMatch = componentSource.match(
		/let\s*\{([\s\S]*?)\}\s*:\s*\w+\s*=\s*\$props\(\);/m
	);
	if (!propsBlockMatch?.[1]) {
		throw new Error('Unable to parse runtime defaults from the component $props() block.');
	}

	const propsBlock = propsBlockMatch[1];
	return {
		size: extractDefaultValue(propsBlock, 'size'),
		dotSize: extractDefaultValue(propsBlock, 'dotSize'),
		speed: extractDefaultValue(propsBlock, 'speed'),
		pattern: normalizeDocsDefault(extractDefaultValue(propsBlock, 'pattern')),
		animated: extractDefaultValue(propsBlock, 'animated'),
		hoverAnimated: extractDefaultValue(propsBlock, 'hoverAnimated')
	};
}

function extractDefaultValue(propsBlock, name) {
	const match = propsBlock.match(new RegExp(`\\b${name}\\s*=\\s*([^,\\n]+)`));
	if (!match?.[1]) {
		throw new Error(`Unable to find a runtime default for "${name}" in the component file.`);
	}

	return match[1].trim();
}

function normalizeDocsDefault(value) {
	if (value.startsWith("'") && value.endsWith("'")) {
		return `"${value.slice(1, -1)}"`;
	}

	return value;
}

function resolvePresetSelection(selectedKeys, defaultKeys, presets, label) {
	const keys = selectedKeys?.length ? selectedKeys : defaultKeys;
	const presetMap = new Map(presets.map((preset) => [preset.key, preset]));

	return keys.map((key) => {
		const preset = presetMap.get(key);
		if (!preset) {
			throw new Error(`Unknown ${label} preset "${key}".`);
		}

		return preset;
	});
}

async function renderTemplateFile(templatePath, manifest) {
	const template = await fs.readFile(templatePath, 'utf8');
	return renderTokens(template, manifest);
}

function renderTokens(template, manifest) {
	return template
		.replaceAll('{{COMPONENT_IMPORT_NAME}}', manifest.componentImportName)
		.replaceAll('{{COMPONENT_IMPORT_PATH}}', manifest.componentImportPath);
}

async function writeFile(filePath, content) {
	await fs.writeFile(filePath, content, 'utf8');
}

function renderDocsMarkdown(manifest) {
	return `## ${manifest.id.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())} (${manifest.title}) Loader

## Installation

npm

\`\`\`bash
npx shadcn-svelte@latest add https://sv-matrix.vercel.app/r/${manifest.id}.json
\`\`\`

pnpm

\`\`\`bash
pnpm dlx shadcn-svelte@latest add https://sv-matrix.vercel.app/r/${manifest.id}.json
\`\`\`

yarn

\`\`\`bash
npx shadcn-svelte@latest add http://localhost:5173/r/${manifest.id}.json
\`\`\`

bun

\`\`\`bash
bun x shadcn-svelte@latest add http://localhost:5173/r/${manifest.id}.json
\`\`\`

## Usage

\`\`\`svelte
<script lang="ts">
	import ${manifest.componentImportName} from '${manifest.componentImportPath}';
</script>

<${manifest.componentImportName} />
\`\`\`
`;
}

function renderLlmsRoute() {
	return `import type { RequestHandler } from './$types';
import docs from '../docs.md?raw';

export const prerender = true;
export const GET: RequestHandler = async () => {
	return new Response(docs, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
`;
}

function renderDataFile(manifest) {
	const exampleImports = manifest.examples
		.map(
			(preset) =>
				`import ${preset.importName} from './examples/${preset.fileName}';
import ${preset.importName}Raw from './examples/${preset.fileName}?raw';`
		)
		.join('\n');

	const useCaseImports = manifest.useCases
		.map(
			(preset) =>
				`import ${preset.importName} from './use-cases/${preset.fileName}';
import ${preset.importName}Raw from './use-cases/${preset.fileName}?raw';`
		)
		.join('\n');

	const exampleEntries = manifest.examples
		.map(
			(preset) => `	{
		name: ${JSON.stringify(preset.displayName)},
		preview: ${preset.importName},
		code: {
			filename: ${JSON.stringify(preset.fileName)},
			filecode: ${preset.importName}Raw,
			lang: 'svelte'
		}
	}`
		)
		.join(',\n');

	const useCaseEntries = manifest.useCases
		.map(
			(preset) => `	{
		name: ${JSON.stringify(preset.displayName)},
		preview: ${preset.importName},${preset.previewClass ? `\n\t\tpreviewClass: ${JSON.stringify(preset.previewClass)},` : ''}
		code: {
			filename: ${JSON.stringify(preset.fileName)},
			filecode: ${preset.importName}Raw,
			lang: 'svelte'
		}
	}`
		)
		.join(',\n');

	const primaryPropRows = squareCommonProps
		.map((row) => renderPropRow(row, manifest.runtimeDefaults[row.name] ?? row.defaultValue))
		.join(',\n');

	const forwardedPropRows = squareForwardedProps
		.map((row) => renderPropRow(row, row.defaultValue))
		.join(',\n');

	return `import type {
	InstallComponentDocs,
	PropsTable,
	SquareDocContent
} from '$lib/types/structure';
import type { Example } from '$lib/types/examples';
import Preview from './examples/preview.svelte';
import PreviewCode from './examples/preview.svelte?raw';
${exampleImports ? `${exampleImports}\n` : ''}${useCaseImports ? `${useCaseImports}\n` : ''}import ${manifest.componentImportName}Raw from '${manifest.componentImportPath}?raw';

const examples: Example[] = [
${exampleEntries}
];

const useCases: Example[] = [
${useCaseEntries}
];

const props: PropsTable[] = [
	{
		name: ${JSON.stringify(manifest.propsTypeName)},
		desc: ${JSON.stringify(
			`Primary loader props. Defaults shown here are the effective defaults applied by ${manifest.componentFileName}.`
		)},
		props: [
${primaryPropRows}
		]
	},
	{
		name: 'Forwarded HTMLDivElement Props',
		desc: 'Common root-level attributes forwarded through \`...restProps\`.',
		props: [
${forwardedPropRows}
		]
	}
];

const installBlock: InstallComponentDocs = {
	installCode: [
		{
			filename: ${JSON.stringify(manifest.componentFileName)},
			filecode: ${manifest.componentImportName}Raw,
			lang: 'svelte',
			isExpand: true
		}
	],
	folderStructure: ${JSON.stringify(`src/
  lib/
    components/
      loaders/
        square/
          ${manifest.componentFileName}`)}
};

export const data: SquareDocContent = {
	id: ${JSON.stringify(manifest.id)},
	installBlock,
	preview: Preview,
	previewCode: {
		filename: 'preview.svelte',
		filecode: PreviewCode,
		lang: 'svelte'
	},
	examples,
	useCases,
	props
};
`;
}

function renderPropRow(row, defaultValue) {
	const rowLines = [
		`\t\t\t{\n\t\t\t\tname: ${JSON.stringify(row.name)},`,
		`\t\t\t\ttype: ${JSON.stringify(row.type)},`
	];

	if (defaultValue !== undefined) {
		rowLines.push(`\t\t\t\tdefault: ${JSON.stringify(defaultValue)},`);
	}

	rowLines.push(`\t\t\t\tdescription: ${JSON.stringify(row.description)}\n\t\t\t}`);
	return rowLines.join('\n');
}

async function upsertRichDocsRegistration(filePath, id) {
	const source = await fs.readFile(filePath, 'utf8');
	const currentIds = Array.from(new Set(findGeneratedSquareIds(source, 'square-doc-map')));
	if (!currentIds.includes(id)) {
		currentIds.push(id);
	}

	const sortedIds = currentIds.sort(compareSquareIds);
	const importBlock = sortedIds
		.map(
			(squareId) =>
				`import { data as ${getRichDocImportName(squareId)} } from '../../routes/(main)/components/squares/${squareId}/data';`
		)
		.join('\n');
	const mapBlock = sortedIds
		.map((squareId) => `\t'${squareId}': ${getRichDocImportName(squareId)}`)
		.join(',\n');

	let nextSource = replaceMarkedBlock(source, 'square-doc-imports', importBlock);
	nextSource = replaceMarkedBlock(nextSource, 'square-doc-map', mapBlock);
	await fs.writeFile(filePath, nextSource, 'utf8');
}

async function upsertSquareCatalogEntry(filePath, manifest) {
	const source = await fs.readFile(filePath, 'utf8');
	const currentEntries = parseSquareCatalogEntries(source);

	currentEntries.set(manifest.id, {
		id: manifest.id,
		title: manifest.title,
		description: manifest.description
	});

	const sortedIds = Array.from(currentEntries.keys()).sort(compareSquareIds);
	const entryBlock = sortedIds
		.map((squareId) => {
			const entry = currentEntries.get(squareId);
			if (!entry) {
				throw new Error(`Missing square catalog entry data for ${squareId}.`);
			}

			return `\t{
\t\tid: ${quoteTsString(entry.id)},
\t\ttitle: ${quoteTsString(entry.title)},
\t\tdescription: ${quoteTsString(entry.description)}
\t}`;
		})
		.join(',\n');

	const nextSource = source.replace(
		/export const squareCatalog = \[[\s\S]*?\] satisfies SquareCatalogEntry\[];/,
		`export const squareCatalog = [\n${entryBlock}\n] satisfies SquareCatalogEntry[];`
	);

	await fs.writeFile(filePath, nextSource, 'utf8');
}

function getRichDocImportName(id) {
	return `${pascalFromKebab(id).charAt(0).toLowerCase()}${pascalFromKebab(id).slice(1)}Doc`;
}

function findGeneratedSquareIds(source, markerName) {
	const block = getMarkedBlock(source, markerName);
	return Array.from(block.matchAll(/square-(\d+)/g)).map((match) => `square-${match[1]}`);
}

function getMarkedBlock(source, markerName) {
	const startMarker = `// ${markerName}:start`;
	const endMarker = `// ${markerName}:end`;
	const startIndex = source.indexOf(startMarker);
	const endIndex = source.indexOf(endMarker);

	if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
		throw new Error(`Missing marker block ${markerName}.`);
	}

	const blockStart = source.indexOf('\n', startIndex) + 1;
	return source.slice(blockStart, endIndex).trim();
}

function parseSquareCatalogEntries(source) {
	const match = source.match(
		/export const squareCatalog = \[\n(?<entries>[\s\S]*?)\n\] satisfies SquareCatalogEntry\[];/
	);

	if (!match?.groups?.entries) {
		throw new Error('Unable to locate squareCatalog in squares.ts.');
	}

	const entries = Array.from(
		match.groups.entries.matchAll(
			/\{\s*id:\s*(?<id>'(?:\\'|[^'])*')\s*,\s*title:\s*(?<title>'(?:\\'|[^'])*')\s*,\s*description:\s*(?<description>'(?:\\'|[^'])*')\s*\}/g
		)
	);

	return new Map(
		entries.map((entry) => {
			const id = parseSingleQuotedString(entry.groups?.id ?? "''");
			return [
				id,
				{
					id,
					title: parseSingleQuotedString(entry.groups?.title ?? "''"),
					description: parseSingleQuotedString(entry.groups?.description ?? "''")
				}
			];
		})
	);
}

function replaceMarkedBlock(source, markerName, body) {
	const startMarker = `// ${markerName}:start`;
	const endMarker = `// ${markerName}:end`;
	const startIndex = source.indexOf(startMarker);
	const endIndex = source.indexOf(endMarker);

	if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
		throw new Error(`Missing marker block ${markerName}.`);
	}

	const blockStart = source.indexOf('\n', startIndex) + 1;
	const markerLineStart = source.lastIndexOf('\n', endIndex) + 1;
	const markerIndent = source.slice(markerLineStart, endIndex);
	return `${source.slice(0, blockStart)}${body}\n${markerIndent}${source.slice(endIndex)}`;
}

async function upsertRegistryEntry(filePath, manifest) {
	const source = await fs.readFile(filePath, 'utf8');
	/** @type {{ $schema: string; name: string; homepage: string; items: Array<Record<string, unknown>> }} */
	const registry = JSON.parse(source);
	const itemName = manifest.id;
	const nextItem = {
		name: itemName,
		title: manifest.registryTitle,
		description: manifest.registryDescription,
		type: 'registry:block',
		registryDependencies: [],
		files: [
			{
				path: `./src/lib/components/loaders/square/${manifest.componentFileName}`,
				type: 'registry:component',
				target: `loaders/${manifest.componentFileName}`
			}
		]
	};

	const existingIndex = registry.items.findIndex((item) => item.name === itemName);
	if (existingIndex >= 0) {
		registry.items[existingIndex] = nextItem;
	} else {
		registry.items.push(nextItem);
	}

	registry.items.sort((left, right) => compareRegistryNames(String(left.name), String(right.name)));
	await fs.writeFile(filePath, `${JSON.stringify(registry, null, '\t')}\n`, 'utf8');
}

function compareRegistryNames(left, right) {
	if (left === right) {
		return 0;
	}

	if (left === 'dot-matrix') {
		return -1;
	}

	if (right === 'dot-matrix') {
		return 1;
	}

	return compareSquareIds(left, right);
}

function compareSquareIds(left, right) {
	return getSquareNumber(left) - getSquareNumber(right);
}

function getSquareNumber(id) {
	const match = id.match(/square-(\d+)/);
	return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function quoteTsString(value) {
	return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function parseSingleQuotedString(value) {
	return value.slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}
