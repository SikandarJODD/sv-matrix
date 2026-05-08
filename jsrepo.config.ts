import { defineConfig, distributed, repository } from "jsrepo";

export default defineConfig({
	registry: {
		name: "@sv/loaders",
		version: "0.1.0",
		description: "A collection of loaders for Svelte projects",
		homepage: "https://sv-matrix.vercel.app",
		repository: "https://github.com/SikandarJODD/sv-matrix",
		bugs: "https://github.com/SikandarJODD/sv-matrix/issues",
		authors: ["Sikandar JODD"],
		tags: ["svelte", "loaders", "components", "hooks", "css"],
		items: [
			{
				name: "dot-matrix",
				description: "base dot matrix loaders for all loaders",
				type: "block",
				dependencies: ["clsx"],
				files: [
					{
						path: "src/lib/components/dot-matrix",
						type: "component",
						target: "src/lib/components/dot-matrix",
					},
					{
						path: "src/lib/hooks/dot-matrix",
						type: "hook",
						target: "src/lib/hooks/dot-matrix",
					},
					{
						path: "src/lib/styles/dot-matrix.css",
						target: "src/lib/styles/dot-matrix.css",
					},
				],
			},
			{
				name: "hex-base",
				description: "hex dot matrix base and shared geometry helpers",
				type: "block",
				dependencies: ["clsx"],
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-base.svelte",
						target: "src/lib/components/loaders/hex/hex-base.svelte",
					},
					{
						path: "src/lib/components/loaders/hex/shared.ts",
						target: "src/lib/components/loaders/hex/shared-hex.ts",
					},
				],
			},
			{
				name: "triangle-base",
				description: "triangle dot matrix shared geometry helpers",
				type: "block",
				files: [
					{
						path: "src/lib/components/loaders/triangle/shared.ts",
						target: "src/lib/components/loaders/triangle/shared-triangle.ts",
					},
				],
			},
			{
				name: "hex-1",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-1.svelte",
						target: "src/lib/components/loaders/hex-1.svelte",
					},
				],
			},
			{
				name: "hex-2",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-2.svelte",
						target: "src/lib/components/loaders/hex-2.svelte",
					},
				],
			},
			{
				name: "hex-3",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-3.svelte",
						target: "src/lib/components/loaders/hex-3.svelte",
					},
				],
			},
			{
				name: "hex-4",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-4.svelte",
						target: "src/lib/components/loaders/hex-4.svelte",
					},
				],
			},
			{
				name: "hex-5",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-5.svelte",
						target: "src/lib/components/loaders/hex-5.svelte",
					},
				],
			},
			{
				name: "hex-6",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-6.svelte",
						target: "src/lib/components/loaders/hex-6.svelte",
					},
				],
			},
			{
				name: "hex-7",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-7.svelte",
						target: "src/lib/components/loaders/hex-7.svelte",
					},
				],
			},
			{
				name: "hex-8",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-8.svelte",
						target: "src/lib/components/loaders/hex-8.svelte",
					},
				],
			},
			{
				name: "hex-9",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-9.svelte",
						target: "src/lib/components/loaders/hex-9.svelte",
					},
				],
			},
			{
				name: "hex-10",
				description: "hex dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "hex-base"],
				files: [
					{
						path: "src/lib/components/loaders/hex/hex-10.svelte",
						target: "src/lib/components/loaders/hex-10.svelte",
					},
				],
			},
			{
				name: "triangle-1",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-1.svelte",
						target: "src/lib/components/loaders/triangle-1.svelte",
					},
				],
			},
			{
				name: "triangle-2",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-2.svelte",
						target: "src/lib/components/loaders/triangle-2.svelte",
					},
				],
			},
			{
				name: "triangle-3",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-3.svelte",
						target: "src/lib/components/loaders/triangle-3.svelte",
					},
				],
			},
			{
				name: "triangle-4",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-4.svelte",
						target: "src/lib/components/loaders/triangle-4.svelte",
					},
				],
			},
			{
				name: "triangle-5",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-5.svelte",
						target: "src/lib/components/loaders/triangle-5.svelte",
					},
				],
			},
			{
				name: "triangle-6",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-6.svelte",
						target: "src/lib/components/loaders/triangle-6.svelte",
					},
				],
			},
			{
				name: "triangle-7",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-7.svelte",
						target: "src/lib/components/loaders/triangle-7.svelte",
					},
				],
			},
			{
				name: "triangle-8",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-8.svelte",
						target: "src/lib/components/loaders/triangle-8.svelte",
					},
				],
			},
			{
				name: "triangle-9",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-9.svelte",
						target: "src/lib/components/loaders/triangle-9.svelte",
					},
				],
			},
			{
				name: "triangle-10",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-10.svelte",
						target: "src/lib/components/loaders/triangle-10.svelte",
					},
				],
			},
			{
				name: "triangle-11",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-11.svelte",
						target: "src/lib/components/loaders/triangle-11.svelte",
					},
				],
			},
			{
				name: "triangle-12",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-12.svelte",
						target: "src/lib/components/loaders/triangle-12.svelte",
					},
				],
			},
			{
				name: "triangle-13",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-13.svelte",
						target: "src/lib/components/loaders/triangle-13.svelte",
					},
				],
			},
			{
				name: "triangle-14",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-14.svelte",
						target: "src/lib/components/loaders/triangle-14.svelte",
					},
				],
			},
			{
				name: "triangle-15",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-15.svelte",
						target: "src/lib/components/loaders/triangle-15.svelte",
					},
				],
			},
			{
				name: "triangle-16",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-16.svelte",
						target: "src/lib/components/loaders/triangle-16.svelte",
					},
				],
			},
			{
				name: "triangle-17",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-17.svelte",
						target: "src/lib/components/loaders/triangle-17.svelte",
					},
				],
			},
			{
				name: "triangle-18",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-18.svelte",
						target: "src/lib/components/loaders/triangle-18.svelte",
					},
				],
			},
			{
				name: "triangle-19",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-19.svelte",
						target: "src/lib/components/loaders/triangle-19.svelte",
					},
				],
			},
			{
				name: "triangle-20",
				description: "triangle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix", "triangle-base"],
				files: [
					{
						path: "src/lib/components/loaders/triangle/triangle-20.svelte",
						target: "src/lib/components/loaders/triangle-20.svelte",
					},
				],
			},
			{
				name: "square-1",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-1.svelte",
						target: "src/lib/components/loaders/square-1.svelte",
					},
				],
			},
			{
				name: "square-2",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-2.svelte",
						target: "src/lib/components/loaders/square-2.svelte",
					},
				],
			},
			{
				name: "square-3",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-3.svelte",
						target: "src/lib/components/loaders/square-3.svelte",
					},
				],
			},
			{
				name: "square-4",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-4.svelte",
						target: "src/lib/components/loaders/square-4.svelte",
					},
				],
			},
			{
				name: "square-5",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-5.svelte",
						target: "src/lib/components/loaders/square-5.svelte",
					},
				],
			},
			{
				name: "square-6",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-6.svelte",
						target: "src/lib/components/loaders/square-6.svelte",
					},
				],
			},
			{
				name: "square-7",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-7.svelte",
						target: "src/lib/components/loaders/square-7.svelte",
					},
				],
			},
			{
				name: "square-8",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-8.svelte",
						target: "src/lib/components/loaders/square-8.svelte",
					},
				],
			},
			{
				name: "square-9",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-9.svelte",
						target: "src/lib/components/loaders/square-9.svelte",
					},
				],
			},
			{
				name: "square-10",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-10.svelte",
						target: "src/lib/components/loaders/square-10.svelte",
					},
				],
			},
			{
				name: "square-11",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-11.svelte",
						target: "src/lib/components/loaders/square-11.svelte",
					},
				],
			},
			{
				name: "square-12",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-12.svelte",
						target: "src/lib/components/loaders/square-12.svelte",
					},
				],
			},
			{
				name: "square-13",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-13.svelte",
						target: "src/lib/components/loaders/square-13.svelte",
					},
				],
			},
			{
				name: "square-14",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-14.svelte",
						target: "src/lib/components/loaders/square-14.svelte",
					},
				],
			},
			{
				name: "square-15",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-15.svelte",
						target: "src/lib/components/loaders/square-15.svelte",
					},
				],
			},
			{
				name: "square-16",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-16.svelte",
						target: "src/lib/components/loaders/square-16.svelte",
					},
				],
			},
			{
				name: "square-17",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-17.svelte",
						target: "src/lib/components/loaders/square-17.svelte",
					},
				],
			},
			{
				name: "square-18",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-18.svelte",
						target: "src/lib/components/loaders/square-18.svelte",
					},
				],
			},
			{
				name: "square-19",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-19.svelte",
						target: "src/lib/components/loaders/square-19.svelte",
					},
				],
			},
			{
				name: "square-20",
				description: "square dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/square/square-20.svelte",
						target: "src/lib/components/loaders/square-20.svelte",
					},
				],
			},
			{
				name: "circle-1",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-1.svelte",
						target: "src/lib/components/loaders/circle-1.svelte",
					},
				],
			},
			{
				name: "circle-2",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-2.svelte",
						target: "src/lib/components/loaders/circle-2.svelte",
					},
				],
			},
			{
				name: "circle-3",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-3.svelte",
						target: "src/lib/components/loaders/circle-3.svelte",
					},
				],
			},
			{
				name: "circle-4",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-4.svelte",
						target: "src/lib/components/loaders/circle-4.svelte",
					},
				],
			},
			{
				name: "circle-5",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-5.svelte",
						target: "src/lib/components/loaders/circle-5.svelte",
					},
				],
			},
			{
				name: "circle-6",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-6.svelte",
						target: "src/lib/components/loaders/circle-6.svelte",
					},
				],
			},
			{
				name: "circle-7",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-7.svelte",
						target: "src/lib/components/loaders/circle-7.svelte",
					},
				],
			},
			{
				name: "circle-8",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-8.svelte",
						target: "src/lib/components/loaders/circle-8.svelte",
					},
				],
			},
			{
				name: "circle-9",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-9.svelte",
						target: "src/lib/components/loaders/circle-9.svelte",
					},
				],
			},
			{
				name: "circle-10",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-10.svelte",
						target: "src/lib/components/loaders/circle-10.svelte",
					},
				],
			},
			{
				name: "circle-11",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-11.svelte",
						target: "src/lib/components/loaders/circle-11.svelte",
					},
				],
			},
			{
				name: "circle-12",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-12.svelte",
						target: "src/lib/components/loaders/circle-12.svelte",
					},
				],
			},
			{
				name: "circle-13",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-13.svelte",
						target: "src/lib/components/loaders/circle-13.svelte",
					},
				],
			},
			{
				name: "circle-14",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-14.svelte",
						target: "src/lib/components/loaders/circle-14.svelte",
					},
				],
			},
			{
				name: "circle-15",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-15.svelte",
						target: "src/lib/components/loaders/circle-15.svelte",
					},
				],
			},
			{
				name: "circle-16",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-16.svelte",
						target: "src/lib/components/loaders/circle-16.svelte",
					},
				],
			},
			{
				name: "circle-17",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-17.svelte",
						target: "src/lib/components/loaders/circle-17.svelte",
					},
				],
			},
			{
				name: "circle-18",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-18.svelte",
						target: "src/lib/components/loaders/circle-18.svelte",
					},
				],
			},
			{
				name: "circle-19",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-19.svelte",
						target: "src/lib/components/loaders/circle-19.svelte",
					},
				],
			},
			{
				name: "circle-20",
				description: "circle dot matrix loader",
				type: "component",
				registryDependencies: ["dot-matrix"],
				files: [
					{
						path: "src/lib/components/loaders/circles/circle-20.svelte",
						target: "src/lib/components/loaders/circle-20.svelte",
					},
				],
			},
		],
		outputs: [distributed({ dir: "./static/m" })],
		excludeDeps: ["svelte"],
	},
	// configure where stuff comes from here
	registries: [],
	// configure where stuff goes here
	paths: {
		component: "src/lib/components",
		hook: "src/lib/hooks",
		block: "src/lib/blocks",
		styles: "src/lib/styles",
		loaders: "src/lib/components/loaders",
	},
});
