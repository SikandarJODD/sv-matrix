import { data as squareSourceItems } from '$lib/components/loaders/square/data';

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

const squareItems: MatrixNavItem[] = squareSourceItems.map((item) => ({
	id: `square-${item.id}`,
	title: item.name,
	href: `/components/squares/${item.id}`,
	description: item.desc ?? `${item.name} square loader component.`,
	section: 'squares',
	kind: 'component'
}));

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

export const navigationItems: MatrixNavItem[] = navigationSections.flatMap((section) => section.items);

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
