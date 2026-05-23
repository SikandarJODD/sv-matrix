export type MatrixNavSectionId = "get-started" | "squares" | "circles" | "triangles" | "hex";
export type MatrixNavKind = "doc" | "component";

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
		id: "get-started-introduction",
		title: "Introduction",
		href: "/docs/introduction",
		description: "Overview of the docs structure and what lives in the library.",
		section: "get-started",
		kind: "doc",
		placeholder: true,
	},
	{
		id: "get-started-setup",
		title: "Setup",
		href: "/docs/setup",
		description: "How to install the project and get the examples running locally.",
		section: "get-started",
		kind: "doc",
		placeholder: true,
	},
];

export const squareItems: MatrixNavItem[] = [
	{
		id: "square-1",
		title: "Neon Drift",
		description: "A square loader with a drifting neon pulse across a dot-matrix grid.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-1",
	},
	{
		id: "square-2",
		title: "Pulse Ladder",
		description: "A square loader with a stepped pulse that climbs the grid like a ladder.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-2",
	},
	{
		id: "square-3",
		title: "Core Spiral",
		description: "A square loader with a spiral pulse that tightens around the core.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-3",
	},
	{
		id: "square-4",
		title: "Twin Orbit",
		description: "A square loader with paired highlights orbiting through the square grid.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-4",
	},
	{
		id: "square-5",
		title: "Prism Sweep",
		description: "A square loader with a sweeping prism-like shimmer across the matrix.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-5",
	},
	{
		id: "square-6",
		title: "Flux Columns",
		description: "A square loader with flowing column pulses that cycle through the grid.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-6",
	},
	{
		id: "square-7",
		title: "Block Drop",
		description: "A square loader with a block-drop motion that lands in rhythmic steps.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-7",
	},
	{
		id: "square-8",
		title: "Strobe Stack",
		description: "A square loader with stacked strobe flashes that pulse from row to row.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-8",
	},
	{
		id: "square-9",
		title: "Glyph Pulse",
		description: "A square loader with crisp glyph-like beats that pulse through the matrix.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-9",
	},
	{
		id: "square-10",
		title: "CRT Glide",
		description: "A square loader with a retro scanline glide inspired by CRT displays.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-10",
	},
	{
		id: "square-11",
		title: "Echo Ring",
		description: "A square loader with ringed echoes that ripple outward from the center.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-11",
	},
	{
		id: "square-12",
		title: "Origin Wave",
		description: "A square loader with a wave that expands cleanly from the origin point.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-12",
	},
	{
		id: "square-13",
		title: "Core Rotar",
		description: "A square loader with a rotating core pulse and steady geometric rhythm.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-13",
	},
	{
		id: "square-14",
		title: "Prism Bloom",
		description: "A square loader with a bright prism bloom that opens across the grid.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-14",
	},
	{
		id: "square-15",
		title: "Helix Glow",
		description: "A square loader with a glowing helix-style twist through the square matrix.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-15",
	},
	{
		id: "square-16",
		title: "Helix Core",
		description: "A square loader with a helix-like core pulse and layered depth.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-16",
	},
	{
		id: "square-17",
		title: "Half Helix",
		description: "A square loader with a split helix motion that arcs through half the grid.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-17",
	},
	{
		id: "square-18",
		title: "Sound Bars",
		description: "A square loader with equalizer-style bars pulsing like live sound levels.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-18",
	},
	{
		id: "square-19",
		title: "Lemniscate Pulse",
		description:
			"A square loader with twin heads tracing a lemniscate path and a soft pulse through the center.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-19",
	},
	{
		id: "square-20",
		title: "Mobius Ring",
		description:
			"A square loader with a perimeter ring, countertail motion, and Mobius-style twist cues at each corner.",
		section: "squares",
		kind: "component",
		href: "/components/squares/square-20",
	},
];

export const circleItems: MatrixNavItem[] = [
	{
		id: "circle-1",
		title: "Halo Drift",
		href: "/components/circles/circle-1",
		description: "A circular loader with a helix-style strand orbiting the ring.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-2",
		title: "Tri Orbit",
		href: "/components/circles/circle-2",
		description: "A circular loader with a sweeping ring and a lit center core.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-3",
		title: "Plasma Veil",
		href: "/components/circles/circle-3",
		description: "A circular loader with twin comet heads tracing the outer ring.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-4",
		title: "Radar Arc",
		href: "/components/circles/circle-4",
		description: "A circular loader with a radial sweep that crosses the circle.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-5",
		title: "Nova Wheel",
		href: "/components/circles/circle-5",
		description: "A circular loader with a pinwheel-style pulse through the matrix.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-6",
		title: "Phase Orb",
		href: "/components/circles/circle-6",
		description: "Circle 6 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-7",
		title: "Gate Shift",
		href: "/components/circles/circle-7",
		description: "Circle 7 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-8",
		title: "Heart Pulse",
		href: "/components/circles/circle-8",
		description: "Circle 8 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-9",
		title: "Star Compass",
		href: "/components/circles/circle-9",
		description: "Circle 9 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-10",
		title: "Binary Bloom",
		href: "/components/circles/circle-10",
		description: "Circle 10 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-11",
		title: "Lunar Breathe",
		href: "/components/circles/circle-11",
		description: "Circle 11 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-12",
		title: "Arc Beacon",
		href: "/components/circles/circle-12",
		description: "Circle 12 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-13",
		title: "Twin Helix",
		href: "/components/circles/circle-13",
		description: "Circle 13 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-14",
		title: "Rung Shift",
		href: "/components/circles/circle-14",
		description: "Circle 14 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-15",
		title: "Glyph Cluster",
		href: "/components/circles/circle-15",
		description: "Circle 15 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-16",
		title: "Rail Scan",
		href: "/components/circles/circle-16",
		description: "Circle 16 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-17",
		title: "Checker Shift",
		href: "/components/circles/circle-17",
		description: "Circle 17 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-18",
		title: "Pulse Pair",
		href: "/components/circles/circle-18",
		description: "Circle 18 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-19",
		title: "Orbit Cell",
		href: "/components/circles/circle-19",
		description: "Circle 19 loader component.",
		section: "circles",
		kind: "component",
	},
	{
		id: "circle-20",
		title: "Glyph Cycle",
		href: "/components/circles/circle-20",
		description: "Circle 20 loader component.",
		section: "circles",
		kind: "component",
	},
];

export const triangleItems: MatrixNavItem[] = [
	{
		id: "triangle-1",
		title: "Core Spokes",
		href: "/components/triangles/triangle-1",
		description: "Triangle 1 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-2",
		title: "Altitude Wave",
		href: "/components/triangles/triangle-2",
		description: "Triangle 2 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-3",
		title: "Corner Bounce",
		href: "/components/triangles/triangle-3",
		description: "Triangle 3 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-4",
		title: "Vertex Chase",
		href: "/components/triangles/triangle-4",
		description: "Triangle 4 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-5",
		title: "Row Sweep",
		href: "/components/triangles/triangle-5",
		description: "Triangle 5 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-6",
		title: "Braille Beat",
		href: "/components/triangles/triangle-6",
		description: "Triangle 6 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-7",
		title: "Oblique Weave",
		href: "/components/triangles/triangle-7",
		description: "Triangle 7 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-8",
		title: "Wing Metronome",
		href: "/components/triangles/triangle-8",
		description: "Triangle 8 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-9",
		title: "Corona Tier",
		href: "/components/triangles/triangle-9",
		description: "Triangle 9 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-10",
		title: "Column Rake",
		href: "/components/triangles/triangle-10",
		description: "Triangle 10 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-11",
		title: "Shelf Descent",
		href: "/components/triangles/triangle-11",
		description: "Triangle 11 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-12",
		title: "Skew Drift",
		href: "/components/triangles/triangle-12",
		description: "Triangle 12 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-13",
		title: "Serpent Zip",
		href: "/components/triangles/triangle-13",
		description: "Triangle 13 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-14",
		title: "Pillar Sweep",
		href: "/components/triangles/triangle-14",
		description: "Triangle 14 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-15",
		title: "Tripod Handoff",
		href: "/components/triangles/triangle-15",
		description: "Triangle 15 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-16",
		title: "Updraft",
		href: "/components/triangles/triangle-16",
		description: "Triangle 16 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-17",
		title: "Infinity Trace",
		href: "/components/triangles/triangle-17",
		description: "Triangle 17 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-18",
		title: "Hollow Shell",
		href: "/components/triangles/triangle-18",
		description: "Triangle 18 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-19",
		title: "Pivot Ray",
		href: "/components/triangles/triangle-19",
		description: "Triangle 19 loader component.",
		section: "triangles",
		kind: "component",
	},
	{
		id: "triangle-20",
		title: "Twin Perimeter",
		href: "/components/triangles/triangle-20",
		description: "Triangle 20 loader component.",
		section: "triangles",
		kind: "component",
	},
];

export const hexItems: MatrixNavItem[] = [
	{
		id: "hex-1",
		title: "Hex Orbit",
		href: "/components/hex/hex-1",
		description: "Hex 1 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-2",
		title: "Prism Bloom",
		href: "/components/hex/hex-2",
		description: "Hex 2 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-3",
		title: "Honey Gate",
		href: "/components/hex/hex-3",
		description: "Hex 3 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-4",
		title: "Vertex Relay",
		href: "/components/hex/hex-4",
		description: "Hex 4 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-5",
		title: "Spiral Lattice",
		href: "/components/hex/hex-5",
		description: "Hex 5 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-6",
		title: "Chevron March",
		href: "/components/hex/hex-6",
		description: "Hex 6 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-7",
		title: "Hourglass Flip",
		href: "/components/hex/hex-7",
		description: "Hex 7 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-8",
		title: "Glyph Flip",
		href: "/components/hex/hex-8",
		description: "Hex 8 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-9",
		title: "Petal Shimmer",
		href: "/components/hex/hex-9",
		description: "Hex 9 loader component.",
		section: "hex",
		kind: "component",
	},
	{
		id: "hex-10",
		title: "Liquid Vortex",
		href: "/components/hex/hex-10",
		description: "Hex 10 loader component.",
		section: "hex",
		kind: "component",
	},
];

export const navigationSections: MatrixNavSection[] = [
	{
		id: "get-started",
		title: "Get Started",
		items: getStartedItems,
	},
	{
		id: "squares",
		title: "Squares",
		items: squareItems,
	},
	{
		id: "circles",
		title: "Circles",
		items: circleItems,
	},
	{
		id: "triangles",
		title: "Triangles",
		items: triangleItems,
	},
	{
		id: "hex",
		title: "Hex",
		items: hexItems,
	},
];

export const navigationItems: MatrixNavItem[] = navigationSections.flatMap(
	(section) => section.items
);

const itemsByPath = new Map(
	navigationItems.map((item) => [normalizePath(item.href), item] as const)
);

function normalizePath(pathname: string) {
	const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? "/";
	if (cleanPath === "/") {
		return cleanPath;
	}

	return cleanPath.replace(/\/+$/, "");
}

export function getItemByPath(pathname: string) {
	return itemsByPath.get(normalizePath(pathname)) ?? null;
}

export function getPrevNext(pathname: string) {
	const currentItem = getItemByPath(pathname);

	if (!currentItem) {
		return {
			prev: null,
			next: null,
		};
	}

	const index = navigationItems.findIndex((item) => item.id === currentItem.id);

	return {
		prev: index > 0 ? navigationItems[index - 1] : null,
		next: index < navigationItems.length - 1 ? navigationItems[index + 1] : null,
	};
}
