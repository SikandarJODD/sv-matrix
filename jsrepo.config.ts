import { defineConfig, distributed, repository } from 'jsrepo';

export default defineConfig({
	registry: {
		name: '@sv/loaders',
		version: '0.0.3',
		description: 'A collection of loaders for Svelte projects',
		homepage: 'https://sv-matrix.vercel.app',
		repository: 'https://github.com/SikandarJODD/sv-matrix',
		bugs: 'https://github.com/SikandarJODD/sv-matrix/issues',
		authors: ['Sikandar JODD'],
		tags: ['svelte', 'loaders', 'components', 'hooks', 'css'],
		items: [
			{
				name: 'dot-matrix',
				description: 'base dot matrix loaders for all loaders',
				type: 'block',
				dependencies: ['clsx'],
				files: [
					{
						path: 'src/lib/components/dot-matrix',
						type: 'component',
						target: 'src/lib/components/dot-matrix'
					},
					{
						path: 'src/lib/hooks/dot-matrix',
						type: 'hook',
						target: 'src/lib/hooks/dot-matrix'
					},
					{
						path: 'src/lib/styles/dot-matrix.css',
						target: 'src/lib/styles/dot-matrix.css'
					}
				]
			},
			{
				name: 'square-1',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-1.svelte',
						target: 'src/lib/components/loaders/square-1.svelte'
					}
				]
			},
			{
				name: 'square-2',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-2.svelte',
						target: 'src/lib/components/loaders/square-2.svelte'
					}
				]
			},
			{
				name: 'square-3',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-3.svelte',
						target: 'src/lib/components/loaders/square-3.svelte'
					}
				]
			},
			{
				name: 'square-4',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-4.svelte',
						target: 'src/lib/components/loaders/square-4.svelte'
					}
				]
			},
			{
				name: 'square-5',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-5.svelte',
						target: 'src/lib/components/loaders/square-5.svelte'
					}
				]
			},
			{
				name: 'square-6',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-6.svelte',
						target: 'src/lib/components/loaders/square-6.svelte'
					}
				]
			},
			{
				name: 'square-7',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-7.svelte',
						target: 'src/lib/components/loaders/square-7.svelte'
					}
				]
			},
			{
				name: 'square-8',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-8.svelte',
						target: 'src/lib/components/loaders/square-8.svelte'
					}
				]
			},
			{
				name: 'square-9',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-9.svelte',
						target: 'src/lib/components/loaders/square-9.svelte'
					}
				]
			}
		],
		outputs: [distributed({ dir: './static/m' })],
		excludeDeps: ['svelte']
	},
	// configure where stuff comes from here
	registries: [],
	// configure where stuff goes here
	paths: {
		component: 'src/lib/components',
		hook: 'src/lib/hooks',
		block: 'src/lib/blocks',
		styles: 'src/lib/styles',
		loaders: 'src/lib/components/loaders'
	}
});
