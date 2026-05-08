import { defineConfig, distributed, repository } from 'jsrepo';

export default defineConfig({
	registry: {
		name: '@sv/loaders',
		version: '0.0.2',
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
		styles: 'src/lib/styles'
	}
});
