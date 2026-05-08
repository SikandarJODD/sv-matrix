#!/usr/bin/env node
// @ts-check

import { pathToFileURL } from 'node:url';
import { createLoaderScaffold, parseLoaderArgs } from './scaffold/create-loader-docs.mjs';
import {
	circleCommonProps,
	circleExamplePresets,
	circleFamilyConfig,
	circleForwardedProps,
	circleUseCasePresets
} from './scaffold/families/circle/presets.mjs';

const isCliEntrypoint =
	process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliEntrypoint) {
	const args = parseLoaderArgs(process.argv.slice(2));

	createCircle(args).catch((error) => {
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
export async function createCircle(args) {
	return createLoaderScaffold(args, {
		familyConfig: circleFamilyConfig,
		examplePresets: circleExamplePresets,
		useCasePresets: circleUseCasePresets,
		commonProps: circleCommonProps,
		forwardedProps: circleForwardedProps
	});
}
