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
export const triangleCommonProps = [
	{
		name: "size",
		type: "number",
		description: "Overall triangle matrix span in pixels before any optional wrapper scaling.",
	},
	{
		name: "dotSize",
		type: "number",
		description: "Pixel size for each individual dot in the 7x7 triangle matrix.",
	},
	{
		name: "speed",
		type: "number",
		description: "Animation speed multiplier. Values above 1 run faster.",
	},
	{
		name: "pattern",
		type: '"diamond" | "full" | "outline" | "rose" | "cross" | "rings"',
		description:
			"Accepted for API consistency with other loaders. Triangle loaders render their fixed triangle mask.",
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

export const triangleFamilyConfig = {
	familyId: "triangle",
	familyLabel: "Triangle",
	componentDir: "src/lib/components/loaders/triangle",
	componentImportDir: "$lib/components/loaders/triangle",
	docsDir: "src/routes/(main)/components/triangles",
	templateDir: "scripts/scaffold/families/square/shared",
	idPattern: /^triangle-\d+$/,
	category: "loaders",
	navItemsExportName: "triangleItems",
	runtimeDefaultFallbacks: {
		size: "30",
		dotSize: "4",
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

export const triangleExamplePresets = squareExamplePresets;
export const triangleUseCasePresets = squareUseCasePresets;
export const triangleForwardedProps = squareForwardedProps;
