<script lang="ts">
	import Hero from '$lib/components/landing/hero.svelte';
	import { JsonLd, MetaTags } from 'svelte-meta-tags';

	const siteName = 'Svelte Dot Matrix';
	const siteUrl = 'https://sv-matrix.vercel.app';
	const canonical = `${siteUrl}/`;
	const githubUrl = 'https://github.com/SikandarJODD/sv-matrix';
	const twitterUrl = 'https://x.com/Sikandar_Bhide';
	const twitterHandle = '@Sikandar_Bhide';
	const title = siteName;
	const description =
		'55+ free and open-source dot-matrix loaders for Svelte, built with TypeScript and Tailwind CSS. Browse the registry, preview animations, and install reusable loaders.';
	const keywords = [
		'svelte loaders',
		'dot matrix loaders',
		'svelte animations',
		'tailwind css loaders',
		'typescript loaders',
		'shared component registry'
	];

	const jsonLd = {
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${siteUrl}/#website`,
				url: siteUrl,
				name: siteName,
				description,
				inLanguage: 'en',
				publisher: {
					'@id': `${siteUrl}/#person`
				}
			},
			{
				'@type': 'CollectionPage',
				'@id': `${canonical}#webpage`,
				url: canonical,
				name: title,
				description,
				isPartOf: {
					'@id': `${siteUrl}/#website`
				},
				about: {
					'@id': `${siteUrl}/#software`
				}
			},
			{
				'@type': 'SoftwareSourceCode',
				'@id': `${siteUrl}/#software`,
				name: 'sv-matrix',
				description,
				url: siteUrl,
				codeRepository: githubUrl,
				license: `${githubUrl}/blob/main/LICENSE`,
				programmingLanguage: ['Svelte', 'TypeScript'],
				runtimePlatform: 'Web Browser',
				author: {
					'@id': `${siteUrl}/#person`
				}
			},
			{
				'@type': 'Person',
				'@id': `${siteUrl}/#person`,
				name: 'Sikandar Bhide',
				url: siteUrl,
				sameAs: [twitterUrl, githubUrl]
			}
		]
	};
</script>

<MetaTags
	{title}
	titleTemplate="%s | Loaders"
	{description}
	{canonical}
	{keywords}
	openGraph={{
		type: 'website',
		url: canonical,
		title,
		description,
		siteName,
		locale: 'en_US'
	}}
	twitter={{
		cardType: 'summary',
		site: twitterHandle,
		creator: twitterHandle,
		title,
		description
	}}
	additionalLinkTags={[
		{ rel: 'me', href: twitterUrl },
		{ rel: 'me', href: githubUrl }
	]}
	additionalMetaTags={[
		{ name: 'author', content: 'Sikandar Bhide' },
		{ name: 'application-name', content: 'sv-matrix' }
	]}
/>

<JsonLd schema={jsonLd} />

<Hero />
