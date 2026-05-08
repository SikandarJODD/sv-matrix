<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { navs } from "./nav-links";
</script>

<div class="hidden w-full justify-center gap-6 md:flex">
	<ul class="flex items-center gap-px">
		{#each navs as nav}
			<li>
				<Button variant="ghost" class="md:px-4" href={nav.href}>
					{nav.name}
				</Button>
			</li>
		{/each}
	</ul>
</div>
