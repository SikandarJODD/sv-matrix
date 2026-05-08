<script lang="ts">
	import { onDestroy } from "svelte";
	import * as Chat from "$lib/components/ui/chat";
	import { Button } from "$lib/components/ui/button";
	import Circle2 from "$lib/components/loaders/circles/circle-2.svelte";
	import MicIcon from "@lucide/svelte/icons/mic";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	type Message = {
		id: number;
		variant: "sent" | "received";
		author: string;
		avatar: string;
		fallback: string;
		text: string;
	};

	const timeouts: number[] = [];

	let nextId = 1;
	let prompt = $state("Summarize the API rollout status for the team update.");
	let isThinking = $state(false);
	let messages = $state<Message[]>([]);

	onDestroy(() => {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}
	});

	function schedule(callback: () => void, delay: number) {
		const timeout = window.setTimeout(callback, delay);
		timeouts.push(timeout);
	}

	function generateReply() {
		const text = prompt.trim();

		if (!text || isThinking) {
			return;
		}

		messages = [
			...messages,
			{
				id: nextId++,
				variant: "sent",
				author: "You",
				avatar: "https://github.com/SikandarJODD.png",
				fallback: "YO",
				text,
			},
		];
		prompt = "";
		isThinking = true;

		schedule(() => {
			messages = [
				...messages,
				{
					id: nextId++,
					variant: "received",
					author: "AI Copilot",
					fallback: "AI",
					avatar: "",
					text: "Three endpoints are green, one background sync is still warming up, and no rollout blockers were detected.",
				},
			];
			isThinking = false;
		}, 3000);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		generateReply();
	}
</script>

<div class="flex h-full w-full flex-col">
	<div class="flex h-96 flex-col bg-muted/30">
		<Chat.List class="h-full max-h-96 gap-3">
			{#each messages as message (message.id)}
				<Chat.Bubble variant={message.variant}>
					<Chat.BubbleAvatar size="sm">
						<Chat.BubbleAvatarFallback>{message.fallback}</Chat.BubbleAvatarFallback>
					</Chat.BubbleAvatar>
					<Chat.BubbleMessage class="py-2.5">
						<p>{message.text}</p>
					</Chat.BubbleMessage>
				</Chat.Bubble>
			{/each}

			{#if isThinking}
				<Chat.Bubble variant="received">
					<Chat.BubbleAvatar size="sm">
						<Chat.BubbleAvatarFallback>AI</Chat.BubbleAvatarFallback>
					</Chat.BubbleAvatar>
					<Chat.BubbleMessage typing class="min-w-fit p-2">
						{#snippet typingIndicator()}
							<div class="flex items-center gap-2 text-xs text-muted-foreground">
								<Circle2 size={18} dotSize={2} speed={1.15} />
								<span>Generating....</span>
							</div>
						{/snippet}
					</Chat.BubbleMessage>
				</Chat.Bubble>
			{/if}
		</Chat.List>
	</div>

	<form class="flex w-full flex-col gap-2 bg-muted/30 p-4" onsubmit={handleSubmit}>
		<InputGroup.Root class="mx-auto max-w-lg rounded-xl">
			<InputGroup.Textarea
				bind:value={prompt}
				placeholder="Ask, Search or Chat..."
				class="placeholder:text-sm"
				disabled={isThinking}
				onkeydown={(event) => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault();
						generateReply();
					}
				}}
			/>
			<InputGroup.Addon align="block-end">
				<Tooltip.Provider>
					<Tooltip.Root delayDuration={0}>
						<Tooltip.Trigger class="border-none! bg-transparent! p-0!">
							<Button variant="ghost" size="icon-sm" class="z-50 rounded-full!">
								<MicIcon />
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>Record voice message</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
				<InputGroup.Text class="ml-auto text-xs font-normal"
					>Press Enter to send</InputGroup.Text
				>
				<Tooltip.Provider>
					<Tooltip.Root delayDuration={0}>
						<Tooltip.Trigger class="border-none! bg-transparent! p-0!">
							<Button
								type="submit"
								disabled={isThinking || !prompt.trim()}
								size="icon-sm"
								class="z-50 rounded-full!"
							>
								<ArrowRightIcon />
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>Send</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</InputGroup.Addon>
		</InputGroup.Root>
	</form>
</div>
