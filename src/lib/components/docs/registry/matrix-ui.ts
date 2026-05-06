import * as square_data from '$lib/components/loaders/square/data';

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

let squareData: MatrixComponent[] = square_data.data.map((item) => ({
	id: item.id,
	name: item.name,
	href: `/components/squares/${item.id}`,
	desc: item.desc ?? '',
	category: 'squares' as MatrixComponentCategory
}));


export const components: MatrixComponent[] = [...squareData];

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
