// @ts-check

import {
	squareCommonProps,
	squareExamplePresets,
	squareForwardedProps,
	squareUseCasePresets
} from '../square/presets.mjs';

export const circleFamilyConfig = {
	familyId: 'circle',
	familyLabel: 'Circle',
	componentDir: 'src/lib/components/loaders/circles',
	componentImportDir: '$lib/components/loaders/circles',
	docsDir: 'src/routes/(main)/components/circles',
	templateDir: 'scripts/scaffold/families/square/shared',
	idPattern: /^circle-\d+$/,
	category: 'loaders',
	runtimeDefaultFallbacks: {
		size: '24',
		dotSize: '3',
		speed: '1',
		pattern: "'diamond'"
	},
	registryFiles: [
		{
			path: 'registry.json',
			registryDependencies: []
		},
		{
			path: 'loaders.json',
			registryDependencies: ['local:dot-matrix']
		}
	],
	defaultExamples: ['glow', 'opacity-speed', 'fixed-gap-box', 'pattern-look'],
	defaultUseCases: [
		'chat',
		'ai-chat',
		'api-fetch',
		'form-submit',
		'file-upload',
		'server-action',
		'payment-processing'
	]
};

export const circleExamplePresets = squareExamplePresets;
export const circleUseCasePresets = squareUseCasePresets;
export const circleCommonProps = squareCommonProps;
export const circleForwardedProps = squareForwardedProps;
