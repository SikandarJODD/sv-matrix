// @ts-check

import {
	squareExamplePresets,
	squareForwardedProps,
	squareUseCasePresets,
} from "../square/presets.mjs";

/**
 * @typedef {{
 *   name: string;
 *   type: string;
 *   description: string;
 *   defaultValue?: string;
 * }} PropRow
 */

/** @type {readonly PropRow[]} */
export const hexCommonProps = [
	{
		name: "size",
		type: "number",
		description: "Overall hex matrix span in pixels before any optional wrapper scaling.",
	},
	{
		name: "dotSize",
		type: "number",
		description: "Pixel size for each individual dot in the hex matrix.",
	},
	{
		name: "speed",
		type: "number",
		description: "Animation speed multiplier. Values above 1 run faster.",
	},
	{
		name: "pattern",
		type: '"diamond" | "full" | "outline" | "rose" | "cross" | "rings"',
		description: "Chooses which cells in the hex matrix are active.",
	},
	{
		name: "animated",
		type: "boolean",
		description: "Enables the default loading animation when reduced motion is not active.",
	},
	{
		name: "hoverAnimated",
		type: "boolean",
		description: "Switches animation control to hover interactions instead of always running.",
	},
	{
		name: "color",
		type: "string",
		defaultValue: '"currentColor"',
		description: "Sets the root CSS color used by active dots.",
	},
	{
		name: "muted",
		type: "boolean",
		defaultValue: "false",
		description: "Applies the muted dot-matrix visual treatment.",
	},
	{
		name: "bloom",
		type: "boolean",
		defaultValue: "false",
		description: "Adds glow to brighter active dots after opacity remapping.",
	},
	{
		name: "halo",
		type: "number",
		defaultValue: "0",
		description: "Applies a uniform halo intensity from 0 to 1 across active dots.",
	},
	{
		name: "dotClass",
		type: "string",
		description: "Extra class name applied to each rendered dot.",
	},
	{
		name: "opacityBase",
		type: "number",
		description: "Overrides the low-end opacity remap target.",
	},
	{
		name: "opacityMid",
		type: "number",
		description: "Overrides the mid-point opacity remap target.",
	},
	{
		name: "opacityPeak",
		type: "number",
		description: "Overrides the peak opacity remap target before full opacity.",
	},
	{
		name: "cellPadding",
		type: "number",
		description:
			"Explicit gap between dots. When omitted, layout derives spacing from size and dotSize.",
	},
	{
		name: "boxSize",
		type: "number",
		description: "Wraps the matrix in a fixed square box and scales the matrix to fit.",
	},
	{
		name: "minSize",
		type: "number",
		description: "Minimum outer size for the rendered root or wrapper.",
	},
];

export const hexFamilyConfig = {
	familyId: "hex",
	familyLabel: "Hex",
	componentDir: "src/lib/components/loaders/hex",
	componentImportDir: "$lib/components/loaders/hex",
	docsDir: "src/routes/(main)/components/hex",
	templateDir: "scripts/scaffold/families/square/shared",
	idPattern: /^hex-\d+$/,
	category: "loaders",
	navItemsExportName: "hexItems",
	runtimeDefaultFallbacks: {
		size: "34",
		dotSize: "5",
		speed: "1",
		pattern: "'full'",
	},
	defaultExamples: ["glow", "opacity-speed", "fixed-gap-box", "pattern-look"],
	defaultUseCases: [
		"chat",
		"ai-chat",
		"api-fetch",
		"form-submit",
		"file-upload",
		"server-action",
		"payment-processing",
	],
};

export const hexExamplePresets = squareExamplePresets;
export const hexUseCasePresets = squareUseCasePresets;
export const hexForwardedProps = squareForwardedProps;
