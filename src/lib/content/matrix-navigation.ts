export type MatrixNavSectionId = 'get-started' | 'squares' | 'circles';
export type MatrixNavKind = 'doc' | 'component';

export interface MatrixNavItem {
	id: string;
	title: string;
	href: string;
	description?: string;
	section: MatrixNavSectionId;
	kind: MatrixNavKind;
	placeholder?: boolean;
}

export interface MatrixNavSection {
	id: MatrixNavSectionId;
	title: string;
	items: MatrixNavItem[];
}

const getStartedItems: MatrixNavItem[] = [
	{
		id: 'get-started-introduction',
		title: 'Introduction',
		href: '/docs/introduction',
		description: 'Overview of the docs structure and what lives in the library.',
		section: 'get-started',
		kind: 'doc',
		placeholder: true
	},
	{
		id: 'get-started-setup',
		title: 'Setup',
		href: '/docs/setup',
		description: 'How to install the project and get the examples running locally.',
		section: 'get-started',
		kind: 'doc',
		placeholder: true
	},
	{
		id: 'get-started-usage',
		title: 'Usage',
		href: '/docs/usage',
		description: 'How to browse the loaders, copy code, and use the docs site.',
		section: 'get-started',
		kind: 'doc',
		placeholder: true
	}
];

export const squareItems: MatrixNavItem[] = [
	{
		id: 'square-1',
		title: 'Neon Drift',
		description: 'A square loader with a drifting neon pulse across a dot-matrix grid.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-1'
	},
	{
		id: 'square-2',
		title: 'Pulse Ladder',
		description: 'A square loader with a stepped pulse that climbs the grid like a ladder.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-2'
	},
	{
		id: 'square-3',
		title: 'Core Spiral',
		description: 'A square loader with a spiral pulse that tightens around the core.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-3'
	},
	{
		id: 'square-4',
		title: 'Twin Orbit',
		description: 'A square loader with paired highlights orbiting through the square grid.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-4'
	},
	{
		id: 'square-5',
		title: 'Prism Sweep',
		description: 'A square loader with a sweeping prism-like shimmer across the matrix.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-5'
	},
	{
		id: 'square-6',
		title: 'Flux Columns',
		description: 'A square loader with flowing column pulses that cycle through the grid.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-6'
	},
	{
		id: 'square-7',
		title: 'Block Drop',
		description: 'A square loader with a block-drop motion that lands in rhythmic steps.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-7'
	},
	{
		id: 'square-8',
		title: 'Strobe Stack',
		description: 'A square loader with stacked strobe flashes that pulse from row to row.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-8'
	},
	{
		id: 'square-9',
		title: 'Glyph Pulse',
		description: 'A square loader with crisp glyph-like beats that pulse through the matrix.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-9'
	},
	{
		id: 'square-10',
		title: 'CRT Glide',
		description: 'A square loader with a retro scanline glide inspired by CRT displays.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-10'
	},
	{
		id: 'square-11',
		title: 'Echo Ring',
		description: 'A square loader with ringed echoes that ripple outward from the center.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-11'
	},
	{
		id: 'square-12',
		title: 'Origin Wave',
		description: 'A square loader with a wave that expands cleanly from the origin point.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-12'
	},
	{
		id: 'square-13',
		title: 'Core Rotar',
		description: 'A square loader with a rotating core pulse and steady geometric rhythm.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-13'
	},
	{
		id: 'square-14',
		title: 'Prism Bloom',
		description: 'A square loader with a bright prism bloom that opens across the grid.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-14'
	},
	{
		id: 'square-15',
		title: 'Helix Glow',
		description: 'A square loader with a glowing helix-style twist through the square matrix.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-15'
	},
	{
		id: 'square-16',
		title: 'Helix Core',
		description: 'A square loader with a helix-like core pulse and layered depth.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-16'
	},
	{
		id: 'square-17',
		title: 'Half Helix',
		description: 'A square loader with a split helix motion that arcs through half the grid.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-17'
	},
	{
		id: 'square-18',
		title: 'Sound Bars',
		description: 'A square loader with equalizer-style bars pulsing like live sound levels.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-18'
	},
	{
		id: 'square-19',
		title: 'Lemniscate Pulse',
		description:
			'A square loader with twin heads tracing a lemniscate path and a soft pulse through the center.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-19'
	},
	{
		id: 'square-20',
		title: 'Mobius Ring',
		description:
			'A square loader with a perimeter ring, countertail motion, and Mobius-style twist cues at each corner.',
		section: 'squares',
		kind: 'component',
		href: '/components/squares/square-20'
	}
];

const circleItems: MatrixNavItem[] = [
	{
		id: 'circle-circle-1',
		title: 'Circle 1',
		href: '/components/circles/circle-1',
		description: 'Placeholder entry for the first circle loader.',
		section: 'circles',
		kind: 'component',
		placeholder: true
	},
	{
		id: 'circle-circle-2',
		title: 'Circle 2',
		href: '/components/circles/circle-2',
		description: 'Placeholder entry for the second circle loader.',
		section: 'circles',
		kind: 'component',
		placeholder: true
	}
];

export const navigationSections: MatrixNavSection[] = [
	{
		id: 'get-started',
		title: 'Get Started',
		items: getStartedItems
	},
	{
		id: 'squares',
		title: 'Squares',
		items: squareItems
	},
	{
		id: 'circles',
		title: 'Circles',
		items: circleItems
	}
];

export const navigationItems: MatrixNavItem[] = navigationSections.flatMap(
	(section) => section.items
);

const itemsByPath = new Map(
	navigationItems.map((item) => [normalizePath(item.href), item] as const)
);

function normalizePath(pathname: string) {
	const cleanPath = pathname.split('?')[0]?.split('#')[0] ?? '/';
	if (cleanPath === '/') {
		return cleanPath;
	}

	return cleanPath.replace(/\/+$/, '');
}

export function getItemByPath(pathname: string) {
	return itemsByPath.get(normalizePath(pathname)) ?? null;
}

export function getPrevNext(pathname: string) {
	const currentItem = getItemByPath(pathname);

	if (!currentItem) {
		return {
			prev: null,
			next: null
		};
	}

	const index = navigationItems.findIndex((item) => item.id === currentItem.id);

	return {
		prev: index > 0 ? navigationItems[index - 1] : null,
		next: index < navigationItems.length - 1 ? navigationItems[index + 1] : null
	};
}
