import {
	FileTextIcon,
	GlobeIcon,
	LayersIcon,
	PlugIcon,
	ShieldIcon,
	UserPlusIcon,
	UsersIcon,
	StarIcon,
	HandshakeIcon,
	CodeIcon,
	RotateCcwIcon,
	LeafIcon,
	HandHelpingIcon,
	ChartArea
} from '@lucide/svelte';

import type { LinkItemType } from './types';

let navs: LinkItemType[] = [
	{
		name: 'Home',
		href: '/'
	},
	{
		name: 'Docs',
		href: '/docs'
	},
	{
		name: 'Components',
		href: '/components'
	}
];

export { navs };
