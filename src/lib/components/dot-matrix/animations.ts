import { snakePathNormFromIndex } from "./geometry.js";
import type {
	DotAnimationContext,
	DotAnimationResolver,
	DotAnimationState,
	DotMatrixAnimation,
} from "./types.js";

type PathNormContext = Pick<DotAnimationContext, "row" | "col" | "index">;
type PathNormGetter = (ctx: PathNormContext) => number;

function createPathWaveResolver(getPathNorm: PathNormGetter): DotAnimationResolver {
	return ({ isActive, row, col, index, reducedMotion, phase }): DotAnimationState => {
		if (!isActive) {
			return { className: "dmx-inactive" };
		}

		const path = getPathNorm({ row, col, index });
		const style = { "--dmx-path": path };

		if (reducedMotion || phase === "idle") {
			return {
				style: {
					...style,
					opacity: 0.12 + path * 0.72,
				},
			};
		}

		return {
			className: "dmx-path",
			style,
		};
	};
}

const PATH_WAVE_RESOLVER = createPathWaveResolver(({ index }) => snakePathNormFromIndex(index));

export function getAnimationResolver(
	animation: DotMatrixAnimation
): DotAnimationResolver | undefined {
	if (animation === "path-wave") {
		return PATH_WAVE_RESOLVER;
	}

	return undefined;
}
