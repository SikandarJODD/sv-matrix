Square Five File Code:
```tsx
'use client';

import type { CSSProperties } from 'react';

import { DotMatrixBase } from './dotmatrix-core';
import { useDotMatrixPhases } from './dotmatrix-hooks';
import { diagonalSnakeNormFromIndex, diagonalSnakeOrderValue } from './dotmatrix-core';
import { usePrefersReducedMotion } from './dotmatrix-hooks';
import type { DotAnimationResolver, DotMatrixCommonProps } from './dotmatrix-core';

export type DotmSquare5Props = DotMatrixCommonProps;

const animationResolver: DotAnimationResolver = ({ isActive, index, reducedMotion, phase }) => {
	if (!isActive) {
		return { className: 'dmx-inactive' };
	}

	const order = diagonalSnakeOrderValue(index);
	const pathNorm = diagonalSnakeNormFromIndex(index);
	const style = { '--dmx-diagonal-snake-order': order } as CSSProperties;

	if (reducedMotion || phase === 'idle') {
		return {
			style: {
				...style,
				opacity: 0.16 + pathNorm * 0.78
			}
		};
	}

	return { className: 'dmx-diagonal-snake', style };
};

export function DotmSquare5({
	speed = 1,
	pattern = 'full',
	animated = true,
	hoverAnimated = false,
	...rest
}: DotmSquare5Props) {
	const reducedMotion = usePrefersReducedMotion();
	const {
		phase: matrixPhase,
		onMouseEnter,
		onMouseLeave
	} = useDotMatrixPhases({
		animated: Boolean(animated && !reducedMotion),
		hoverAnimated: Boolean(hoverAnimated && !reducedMotion),
		speed
	});

	return (
		<DotMatrixBase
			{...rest}
			speed={speed}
			pattern={pattern}
			animated={animated}
			phase={matrixPhase}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			reducedMotion={reducedMotion}
			animationResolver={animationResolver}
		/>
	);
}
```