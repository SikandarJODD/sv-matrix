export type BadgeType = 'New' | 'Updated' | 'Beta';

export type MatrixCategory = 'docs' | 'squares' | 'triangles' | 'circles' | 'hexagons';

export type MatrixComponentCategory = Exclude<MatrixCategory, 'docs'>;

export interface MatrixNavigationItem {
	id: string;
	name: string;
	href: string;
	badge?: BadgeType;
	desc?: string;
	category: MatrixCategory;
}

export interface MatrixComponent extends MatrixNavigationItem {
	category: MatrixComponentCategory;
}

export interface MatrixSearchGroup {
	category: MatrixCategory;
	heading: string;
	items: MatrixNavigationItem[];
}

export const categoryHeadings: Record<MatrixCategory, string> = {
	docs: 'Docs',
	squares: 'Squares',
	triangles: 'Triangles',
	circles: 'Circles',
	hexagons: 'Hexagons'
};

export const docs: MatrixNavigationItem[] = [
	{
		id: 'getting-started',
		name: 'Getting Started',
		href: '/components/getting-started',
		desc: 'Start here to understand the component docs.',
		category: 'docs'
	},
	{
		id: 'installation',
		name: 'Installation',
		href: '/components/installation',
		desc: 'Set up the project and start using the components.',
		category: 'docs'
	}
];

export const components: MatrixComponent[] = [
	{
		id: 'square-1',
		name: 'Square 1',
		href: '/components/square-1',
		desc: 'The first square component example.',
		category: 'squares'
	},
	{
		id: 'square-2',
		name: 'Square 2',
		href: '/components/square-2',
		desc: 'A second square variation for the docs.',
		category: 'squares'
	},
	{
		id: 'triangle-1',
		name: 'Triangle 1',
		href: '/components/triangle-1',
		desc: 'The first triangle component example.',
		category: 'triangles'
	},
	{
		id: 'triangle-2',
		name: 'Triangle 2',
		href: '/components/triangle-2',
		desc: 'A second triangle variation for the docs.',
		category: 'triangles'
	},
	{
		id: 'circle-1',
		name: 'Circle 1',
		href: '/components/circle-1',
		desc: 'The first circle component example.',
		category: 'circles'
	},
	{
		id: 'circle-2',
		name: 'Circle 2',
		href: '/components/circle-2',
		desc: 'A second circle variation for the docs.',
		category: 'circles'
	},
	{
		id: 'hexagon-1',
		name: 'Hexagon 1',
		href: '/components/hexagon-1',
		desc: 'The first hexagon component example.',
		category: 'hexagons'
	},
	{
		id: 'hexagon-2',
		name: 'Hexagon 2',
		href: '/components/hexagon-2',
		desc: 'A second hexagon variation for the docs.',
		category: 'hexagons'
	}
];

export const componentCategoryOrder: MatrixComponentCategory[] = [
	'squares',
	'triangles',
	'circles',
	'hexagons'
];

export const searchNavigationGroups: MatrixSearchGroup[] = [
	{
		category: 'docs',
		heading: categoryHeadings.docs,
		items: docs
	},
	...componentCategoryOrder.map((category) => ({
		category,
		heading: categoryHeadings[category],
		items: components.filter((component) => component.category === category)
	}))
];

/**
 * Get prev/next components for navigation
 */
export function getPrevNext(currentId: string) {
	const index = components.findIndex((component) => component.id === currentId);
	return {
		prev: index > 0 ? components[index - 1] : null,
		next: index < components.length - 1 ? components[index + 1] : null
	};
}

/**
 * Get component by ID
 */
export function getComponentById(id: string) {
	return components.find((component) => component.id === id) ?? null;
}
