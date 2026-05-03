import { MediaQuery } from "svelte/reactivity";

export function createReducedMotionQuery(fallback = false): MediaQuery {
	return new MediaQuery("(prefers-reduced-motion: reduce)", fallback);
}
