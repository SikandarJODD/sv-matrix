// @ts-check

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

/**
 * @typedef {{
 *   familyId: string;
 *   familyLabel: string;
 *   componentDir: string;
 *   componentImportDir: string;
 *   docsDir: string;
 *   templateDir: string;
 *   defaultExamples: string[];
 *   defaultUseCases: string[];
 *   idPattern: RegExp;
 *   registryFiles?: Array<{ path: string; registryDependencies?: string[] }>;
 *   runtimeDefaultFallbacks?: Record<string, string>;
 *   category?: string;
 *   navItemsExportName?: string;
 * }} FamilyConfig
 */

/**
 * @typedef {{
 *   key: string;
 *   fileName: string;
 *   displayName: string;
 *   importName: string;
 *   templateFile: string;
 *   previewClass?: string;
 * }} DocPreset
 */

/**
 * @typedef {{
 *   name: string;
 *   type: string;
 *   description: string;
 *   defaultValue?: string;
 * }} PropRow
 */

/**
 * @param {string[]} argv
 */
export function parseLoaderArgs(argv) {
	/** @type {{ id?: string; title?: string; description?: string; registryTitle?: string; registryDescription?: string; examples?: string[]; useCases?: string[]; force: boolean; }} */
	const parsed = {
		force: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const part = argv[index];

		if (part === "--force") {
			parsed.force = true;
			continue;
		}

		if (!part.startsWith("--")) {
			throw new Error(`Unexpected argument "${part}".`);
		}

		const [flag, inlineValue] = part.split("=", 2);
		const value = inlineValue ?? argv[index + 1];

		if (!value || value.startsWith("--")) {
			throw new Error(`Missing value for ${flag}.`);
		}

		if (!inlineValue) {
			index += 1;
		}

		switch (flag) {
			case "--id":
				parsed.id = value;
				break;
			case "--title":
				parsed.title = value;
				break;
			case "--description":
				parsed.description = value;
				break;
			case "--registry-title":
				parsed.registryTitle = value;
				break;
			case "--registry-description":
				parsed.registryDescription = value;
				break;
			case "--examples":
				parsed.examples = splitCsv(value);
				break;
			case "--use-cases":
				parsed.useCases = splitCsv(value);
				break;
			default:
				throw new Error(`Unknown argument "${flag}".`);
		}
	}

	return parsed;
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
 * @param {{
 *   familyConfig: FamilyConfig;
 *   examplePresets: readonly DocPreset[];
 *   useCasePresets: readonly DocPreset[];
 *   commonProps: readonly PropRow[];
 *   forwardedProps: readonly PropRow[];
 * }} options
 */
export async function createLoaderScaffold(args, options) {
	const { familyConfig, examplePresets, useCasePresets, commonProps, forwardedProps } = options;

	if (!args.id) {
		throw new Error(`Missing required argument: --id ${familyConfig.familyId}-2`);
	}

	if (!args.title) {
		throw new Error(`Missing required argument: --title "${familyConfig.familyLabel} 2"`);
	}

	if (!familyConfig.idPattern.test(args.id)) {
		throw new Error(
			`Invalid ${familyConfig.familyId} id "${args.id}". Expected format ${familyConfig.familyId}-<number>.`
		);
	}

	const componentFileName = `${args.id}.svelte`;
	const componentFilePath = resolveRepoPath(familyConfig.componentDir, componentFileName);
	const docsDirPath = resolveRepoPath(familyConfig.docsDir, args.id);
	const templateRootPath = resolveRepoPath(familyConfig.templateDir);

	await assertComponentExists(componentFilePath, componentFileName, familyConfig);
	await assertTargetDirectorySafe(docsDirPath, Boolean(args.force));

	const componentSource = await fs.readFile(componentFilePath, "utf8");
	const componentImportName = pascalFromKebab(args.id);
	const propsTypeName = extractPropsTypeName(componentSource, componentImportName);
	const runtimeDefaults = extractRuntimeDefaults(
		componentSource,
		familyConfig.runtimeDefaultFallbacks ?? {}
	);
	const description = args.description ?? `${args.title} loader component.`;
	const registryTitle = args.registryTitle ?? `${args.title} Loader`;
	const registryDescription = args.registryDescription ?? description;

	const selectedExamples = resolvePresetSelection(
		args.examples,
		familyConfig.defaultExamples,
		examplePresets,
		"example"
	);
	const selectedUseCases = resolvePresetSelection(
		args.useCases,
		familyConfig.defaultUseCases,
		useCasePresets,
		"use-case"
	);

	const manifest = {
		id: args.id,
		title: args.title,
		description,
		registryTitle,
		registryDescription,
		componentFileName,
		componentImportName,
		componentImportPath: `${familyConfig.componentImportDir}/${componentFileName}`,
		propsTypeName,
		runtimeDefaults,
		examples: selectedExamples,
		useCases: selectedUseCases,
		familyConfig,
	};

	await fs.mkdir(path.join(docsDirPath, "examples"), { recursive: true });
	await fs.mkdir(path.join(docsDirPath, "use-cases"), { recursive: true });
	await fs.mkdir(path.join(docsDirPath, "llms.txt"), { recursive: true });

	await writeFile(path.join(docsDirPath, "+page.svelte"), renderPageFile());

	await writeFile(
		path.join(docsDirPath, "examples", "preview.svelte"),
		await renderTemplateFile(
			path.join(templateRootPath, "examples", "preview.svelte.template"),
			manifest
		)
	);

	for (const preset of manifest.examples) {
		await writeFile(
			path.join(docsDirPath, "examples", preset.fileName),
			await renderTemplateFile(path.join(templateRootPath, preset.templateFile), manifest)
		);
	}

	for (const preset of manifest.useCases) {
		await writeFile(
			path.join(docsDirPath, "use-cases", preset.fileName),
			await renderTemplateFile(path.join(templateRootPath, preset.templateFile), manifest)
		);
	}

	await writeFile(path.join(docsDirPath, "docs.md"), renderDocsMarkdown(manifest));
	await writeFile(path.join(docsDirPath, "llms.txt", "+server.ts"), renderLlmsRoute());
	await writeFile(
		path.join(docsDirPath, "data.ts"),
		renderDataFile(manifest, commonProps, forwardedProps)
	);

	for (const registryFile of familyConfig.registryFiles ?? []) {
		await upsertRegistryEntry(resolveRepoPath(registryFile.path), manifest, registryFile);
	}

	console.log(`Created ${familyConfig.familyId} docs scaffold for ${manifest.id}`);
	console.log(`Docs folder: ${path.relative(repoRoot, docsDirPath)}`);
}

function splitCsv(value) {
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
}

function resolveRepoPath(...segments) {
	return path.join(repoRoot, ...segments);
}

async function assertComponentExists(componentFilePath, componentFileName, familyConfig) {
	try {
		await fs.access(componentFilePath);
	} catch {
		throw new Error(
			`Component source "${componentFileName}" does not exist in ${familyConfig.componentDir}.`
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
		if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
			throw error;
		}
	}
}

function pascalFromKebab(value) {
	return value
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

function extractPropsTypeName(componentSource, componentImportName) {
	const aliasMatch = componentSource.match(/export type\s+(\w+)\s*=\s*DotMatrixCommonProps\s*;/);
	if (aliasMatch?.[1]) {
		return aliasMatch[1];
	}

	return `${componentImportName}Props`;
}

function extractRuntimeDefaults(componentSource, fallbackValues) {
	const propsBlockMatch = componentSource.match(
		/let\s*\{([\s\S]*?)\}\s*:\s*\w+\s*=\s*\$props\(\);/m
	);
	if (!propsBlockMatch?.[1]) {
		throw new Error("Unable to parse runtime defaults from the component $props() block.");
	}

	const propsBlock = propsBlockMatch[1];
	return {
		size: normalizeDocsDefault(extractDefaultValue(propsBlock, "size") ?? fallbackValues.size),
		dotSize: normalizeDocsDefault(
			extractDefaultValue(propsBlock, "dotSize") ?? fallbackValues.dotSize
		),
		speed: normalizeDocsDefault(
			extractDefaultValue(propsBlock, "speed") ?? fallbackValues.speed
		),
		pattern: normalizeDocsDefault(
			extractDefaultValue(propsBlock, "pattern") ?? fallbackValues.pattern
		),
		animated: normalizeDocsDefault(
			extractDefaultValue(propsBlock, "animated") ?? fallbackValues.animated
		),
		hoverAnimated: normalizeDocsDefault(
			extractDefaultValue(propsBlock, "hoverAnimated") ?? fallbackValues.hoverAnimated
		),
	};
}

function extractDefaultValue(propsBlock, name) {
	const match = propsBlock.match(new RegExp(`\\b${name}\\s*=\\s*([^,\\n]+)`));
	return match?.[1]?.trim();
}

function normalizeDocsDefault(value) {
	if (!value) {
		return value;
	}

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
	const template = await fs.readFile(templatePath, "utf8");
	return renderTokens(template, manifest);
}

function renderTokens(template, manifest) {
	return template
		.replaceAll("{{COMPONENT_IMPORT_NAME}}", manifest.componentImportName)
		.replaceAll("{{COMPONENT_IMPORT_PATH}}", manifest.componentImportPath);
}

async function writeFile(filePath, content) {
	await fs.writeFile(filePath, content, "utf8");
}

function renderPageFile() {
	return `<script lang="ts">
	import ComponentDocPage from '$lib/components/docs/base/ComponentDocPage.svelte';
	import { data } from './data';
</script>

<ComponentDocPage
	id={data.id}
	title={data.title}
	description={data.description}
	seo={data.seo}
	preview={data.preview}
	previewCode={data.previewCode}
	installCodeBlocks={data.installBlock?.installCode}
	installFolderStructure={data.installBlock?.folderStructure}
	installTailwindCode={data.installBlock?.tailwind}
	examples={data.examples}
	useCases={data.useCases}
	propsTables={data.props}
/>
`;
}

function renderDocsMarkdown(manifest) {
	return `## ${manifest.id.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())} (${manifest.title}) Loader

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

function renderDataFile(manifest, commonProps, forwardedProps) {
	const navItemsExportName = manifest.familyConfig.navItemsExportName;
	const exampleImports = manifest.examples
		.map(
			(preset) =>
				`import ${preset.importName} from './examples/${preset.fileName}';
import ${preset.importName}Raw from './examples/${preset.fileName}?raw';`
		)
		.join("\n");

	const useCaseImports = manifest.useCases
		.map(
			(preset) =>
				`import ${preset.importName} from './use-cases/${preset.fileName}';
import ${preset.importName}Raw from './use-cases/${preset.fileName}?raw';`
		)
		.join("\n");

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
		.join(",\n");

	const useCaseEntries = manifest.useCases
		.map(
			(preset) => `	{
		name: ${JSON.stringify(preset.displayName)},
		preview: ${preset.importName},${preset.previewClass ? `\n\t\tpreviewClass: ${JSON.stringify(preset.previewClass)},` : ""}
		code: {
			filename: ${JSON.stringify(preset.fileName)},
			filecode: ${preset.importName}Raw,
			lang: 'svelte'
		}
	}`
		)
		.join(",\n");

	const primaryPropRows = commonProps
		.map((row) => renderPropRow(row, manifest.runtimeDefaults[row.name] ?? row.defaultValue))
		.join(",\n");

	const forwardedPropRows = forwardedProps
		.map((row) => renderPropRow(row, row.defaultValue))
		.join(",\n");

	const componentFolderName = manifest.familyConfig.componentDir.split("/").pop() ?? "loaders";
	const familyKeyword = `${manifest.familyConfig.familyId} loader`;
	const navImport =
		navItemsExportName != null
			? `import { ${navItemsExportName} } from '$lib/content/matrix-navigation';\n`
			: "";
	const metaLookup =
		navItemsExportName != null
			? `const navItem = ${navItemsExportName}.find((item) => item.id === ${JSON.stringify(manifest.id)});

if (!navItem) {
	throw new Error(${JSON.stringify(`Missing navigation metadata for ${manifest.id}.`)});
}

const meta: ComponentMeta = {
	id: navItem.id,
	title: navItem.title,
	description: navItem.description,
	category: navItem.section
};

`
			: `const meta: ComponentMeta = {
	id: ${JSON.stringify(manifest.id)},
	title: ${JSON.stringify(manifest.title)},
	description: ${JSON.stringify(manifest.description)},
	category: ${JSON.stringify(manifest.familyConfig.category ?? "loaders")}
};

`;

	return `import type { InstallComponentDocs, PropsTable, ComponentMeta, ComponentDoc } from '$lib/types/structure';
import type { Example } from '$lib/types/examples';
import type { SEO } from '$lib/types/seo';
import Preview from './examples/preview.svelte';
import PreviewCode from './examples/preview.svelte?raw';
${exampleImports ? `${exampleImports}\n` : ""}${useCaseImports ? `${useCaseImports}\n` : ""}import ${manifest.componentImportName}Raw from '${manifest.componentImportPath}?raw';
${navImport}

${metaLookup}const examples: Example[] = [
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
	folderStructure:
		${JSON.stringify(`src/\n  lib/\n    components/\n      loaders/\n        ${componentFolderName}/\n          ${manifest.componentFileName}`)}
};

const seo: SEO = {
	title: meta.title,
	description: meta.description || '',
	keywords: ['svelte loader', ${JSON.stringify(familyKeyword)}, 'dot matrix', 'svelte component']
};

export const data: ComponentDoc = {
	...meta,
	seo,
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
		`\t\t\t\ttype: ${JSON.stringify(row.type)},`,
	];

	if (defaultValue !== undefined) {
		rowLines.push(`\t\t\t\tdefault: ${JSON.stringify(defaultValue)},`);
	}

	rowLines.push(`\t\t\t\tdescription: ${JSON.stringify(row.description)}\n\t\t\t}`);
	return rowLines.join("\n");
}

async function upsertRegistryEntry(filePath, manifest, registryFile) {
	const source = await fs.readFile(filePath, "utf8");
	/** @type {{ $schema: string; name: string; homepage: string; items: Array<Record<string, unknown>> }} */
	const registry = JSON.parse(source);
	const itemName = manifest.id;
	const nextItem = {
		name: itemName,
		title: manifest.registryTitle,
		description: manifest.registryDescription,
		type: "registry:block",
		registryDependencies: registryFile.registryDependencies ?? [],
		files: [
			{
				path: `./${manifest.familyConfig.componentDir}/${manifest.componentFileName}`,
				type: "registry:component",
				target: `loaders/${manifest.componentFileName}`,
			},
		],
	};

	const existingIndex = registry.items.findIndex((item) => item.name === itemName);
	if (existingIndex >= 0) {
		registry.items[existingIndex] = nextItem;
	} else {
		registry.items.push(nextItem);
	}

	registry.items.sort((left, right) =>
		compareRegistryNames(String(left.name), String(right.name))
	);
	await fs.writeFile(filePath, `${JSON.stringify(registry, null, "\t")}\n`, "utf8");
}

function compareRegistryNames(left, right) {
	if (left === right) {
		return 0;
	}

	if (left === "dot-matrix") {
		return -1;
	}

	if (right === "dot-matrix") {
		return 1;
	}

	return compareLoaderIds(left, right);
}

function compareLoaderIds(left, right) {
	const leftMatch = left.match(/^([a-z]+)-(\d+)$/);
	const rightMatch = right.match(/^([a-z]+)-(\d+)$/);

	if (!leftMatch || !rightMatch) {
		return left.localeCompare(right);
	}

	if (leftMatch[1] !== rightMatch[1]) {
		return leftMatch[1].localeCompare(rightMatch[1]);
	}

	return Number(leftMatch[2]) - Number(rightMatch[2]);
}
