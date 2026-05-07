#!/usr/bin/env node
// @ts-check

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSquare } from './create-square.mjs';
import { squareFamilyConfig } from './scaffold/families/square/presets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const args = parseArgs(process.argv.slice(2));

main().catch((error) => {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});

async function main() {
	if (args.start === undefined || args.end === undefined) {
		throw new Error('Usage: pnpm create:squares 2 5 [--force] [--examples glow,pattern-look]');
	}

	if (args.start < 1 || args.end < 1) {
		throw new Error('Range values must be positive integers.');
	}

	if (args.start > args.end) {
		throw new Error(`Invalid range: start ${args.start} is greater than end ${args.end}.`);
	}

	const numbers = Array.from(
		{ length: args.end - args.start + 1 },
		(_, index) => args.start + index
	);
	await preflightRange(numbers, args.force);

	for (const number of numbers) {
		const id = `square-${number}`;
		await createSquare({
			id,
			title: `Square ${number}`,
			force: args.force,
			examples: args.examples,
			useCases: args.useCases
		});
	}

	console.log(`Created square docs for range square-${args.start} through square-${args.end}`);
}

/**
 * @param {string[]} argv
 */
function parseArgs(argv) {
	/** @type {{ start?: number; end?: number; force: boolean; examples?: string[]; useCases?: string[] }} */
	const parsed = {
		force: false
	};

	const positionals = [];

	for (let index = 0; index < argv.length; index += 1) {
		const part = argv[index];

		if (part === '--force') {
			parsed.force = true;
			continue;
		}

		if (!part.startsWith('--')) {
			positionals.push(part);
			continue;
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

	if (positionals[0] !== undefined) {
		parsed.start = parseRangeNumber(positionals[0], 'start');
	}

	if (positionals[1] !== undefined) {
		parsed.end = parseRangeNumber(positionals[1], 'end');
	}

	if (positionals.length > 2) {
		throw new Error(`Unexpected extra positional arguments: ${positionals.slice(2).join(', ')}`);
	}

	return parsed;
}

function parseRangeNumber(value, label) {
	if (!/^\d+$/.test(value)) {
		throw new Error(`Invalid ${label} value "${value}". Expected an integer like 2.`);
	}

	return Number(value);
}

function splitCsv(value) {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

async function preflightRange(numbers, force) {
	const errors = [];

	for (const number of numbers) {
		const id = `square-${number}`;
		const componentPath = path.join(repoRoot, squareFamilyConfig.componentDir, `${id}.svelte`);
		const docsDirPath = path.join(repoRoot, squareFamilyConfig.docsDir, id);

		try {
			await fs.access(componentPath);
		} catch {
			errors.push(`Missing component source: ${path.relative(repoRoot, componentPath)}`);
		}

		if (force) {
			continue;
		}

		try {
			const entries = await fs.readdir(docsDirPath);
			if (entries.length > 0) {
				errors.push(
					`Docs directory already exists and is not empty: ${path.relative(repoRoot, docsDirPath)}`
				);
			}
		} catch (error) {
			if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') {
				throw error;
			}
		}
	}

	if (errors.length > 0) {
		throw new Error(`Range preflight failed:\n- ${errors.join('\n- ')}`);
	}
}
