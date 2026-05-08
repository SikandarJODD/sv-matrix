import { defineConfig, distributed, repository } from 'jsrepo';

export default defineConfig({
	registry: {
		name: '@sv/loaders',
		version: '0.0.6',
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
			},
			{
				name: 'square-10',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-10.svelte',
						target: 'src/lib/components/loaders/square-10.svelte'
					}
				]
			},
			{
				name: 'square-11',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-11.svelte',
						target: 'src/lib/components/loaders/square-11.svelte'
					}
				]
			},
			{
				name: 'square-12',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-12.svelte',
						target: 'src/lib/components/loaders/square-12.svelte'
					}
				]
			},
			{
				name: 'square-13',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-13.svelte',
						target: 'src/lib/components/loaders/square-13.svelte'
					}
				]
			},
			{
				name: 'square-14',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-14.svelte',
						target: 'src/lib/components/loaders/square-14.svelte'
					}
				]
			},
			{
				name: 'square-15',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-15.svelte',
						target: 'src/lib/components/loaders/square-15.svelte'
					}
				]
			},
			{
				name: 'square-16',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-16.svelte',
						target: 'src/lib/components/loaders/square-16.svelte'
					}
				]
			},
			{
				name: 'square-17',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-17.svelte',
						target: 'src/lib/components/loaders/square-17.svelte'
					}
				]
			},
			{
				name: 'square-18',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-18.svelte',
						target: 'src/lib/components/loaders/square-18.svelte'
					}
				]
			},
			{
				name: 'square-19',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-19.svelte',
						target: 'src/lib/components/loaders/square-19.svelte'
					}
				]
			},
			{
				name: 'square-20',
				description: 'square dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/square/square-20.svelte',
						target: 'src/lib/components/loaders/square-20.svelte'
					}
				]
			},
			{
				name: 'circle-1',
				description: 'circle dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/circles/circle-1.svelte',
						target: 'src/lib/components/loaders/circle-1.svelte'
					}
				]
			},
			{
				name: 'circle-2',
				description: 'circle dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/circles/circle-2.svelte',
						target: 'src/lib/components/loaders/circle-2.svelte'
					}
				]
			},
			{
				name: 'circle-3',
				description: 'circle dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/circles/circle-3.svelte',
						target: 'src/lib/components/loaders/circle-3.svelte'
					}
				]
			},
			{
				name: 'circle-4',
				description: 'circle dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/circles/circle-4.svelte',
						target: 'src/lib/components/loaders/circle-4.svelte'
					}
				]
			},
			{
				name: 'circle-5',
				description: 'circle dot matrix loader',
				type: 'component',
				registryDependencies: ['dot-matrix'],
				files: [
					{
						path: 'src/lib/components/loaders/circles/circle-5.svelte',
						target: 'src/lib/components/loaders/circle-5.svelte'
					}
				]
			},
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
