#!/usr/bin/env node
// @ts-check

import { pathToFileURL } from "node:url";
import { createLoaderScaffold, parseLoaderArgs } from "./scaffold/create-loader-docs.mjs";
import {
	triangleCommonProps,
	triangleExamplePresets,
	triangleFamilyConfig,
	triangleForwardedProps,
	triangleUseCasePresets,
} from "./scaffold/families/triangle/presets.mjs";

const isCliEntrypoint =
	process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliEntrypoint) {
	const args = parseLoaderArgs(process.argv.slice(2));

	createTriangle(args).catch((error) => {
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
export async function createTriangle(args) {
	return createLoaderScaffold(args, {
		familyConfig: triangleFamilyConfig,
		examplePresets: triangleExamplePresets,
		useCasePresets: triangleUseCasePresets,
		commonProps: triangleCommonProps,
		forwardedProps: triangleForwardedProps,
	});
}
