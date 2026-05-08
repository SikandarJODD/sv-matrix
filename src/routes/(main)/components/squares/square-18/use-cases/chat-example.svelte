<script lang="ts">
	import { onDestroy } from "svelte";
	import * as Chat from "$lib/components/ui/chat";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import Square18 from "$lib/components/loaders/square/square-18.svelte";

	type Message = {
		id: number;
		variant: "sent" | "received";
		author: string;
		avatar?: string;
		fallback: string;
		text: string;
	};

	const timeouts: number[] = [];

	let nextId = 3;
	let draft = $state("Any new projects coming up?");
	let isReplying = $state(false);
	let messages = $state<Message[]>([
		{
			id: 1,
			variant: "received",
			author: "User 2",
			avatar: "https://github.com/purohitdheeraj.png",
			fallback: "U2",
			text: "Hello Brother, how you doing?",
		},
		{
			id: 2,
			variant: "sent",
			author: "User 1",
			avatar: "https://github.com/SikandarJODD.png",
			fallback: "U1",
			text: "Good brother man, any plans for the weekend?",
		},
	]);

	onDestroy(() => {
		for (const timeout of timeouts) {
			window.clearTimeout(timeout);
		}
	});

	function schedule(callback: () => void, delay: number) {
		const timeout = window.setTimeout(callback, delay);
		timeouts.push(timeout);
	}

	function sendMessage() {
		const text = draft.trim();

		if (!text || isReplying) {
			return;
		}

		messages = [
			...messages,
			{
				id: nextId++,
				variant: "sent",
				author: "User 1",
				avatar: "https://github.com/SikandarJODD.png",
				fallback: "U1",
				text,
			},
		];
		draft = "";
		isReplying = true;

		schedule(() => {
			messages = [
				...messages,
				{
					id: nextId++,
					variant: "received",
					author: "User 2",
					avatar: "https://github.com/purohitdheeraj.png",
					fallback: "U2",
					text: "Yeep, working on Svelte YouTube Stuff, you?",
				},
			];
			isReplying = false;
		}, 2400);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		sendMessage();
	}
</script>

<div class="flex h-full w-full flex-col">
	<div class="flex h-100 flex-col bg-muted/10">
		<Chat.List class="h-full max-h-100 gap-3">
			{#each messages as message (message.id)}
				<Chat.Bubble variant={message.variant}>
					<Chat.BubbleAvatar size="sm">
						<Chat.BubbleAvatarImage src={message.avatar} alt={message.author} />
						<Chat.BubbleAvatarFallback>{message.fallback}</Chat.BubbleAvatarFallback>
					</Chat.BubbleAvatar>
					<Chat.BubbleMessage class="py-2.5">
						<p>{message.text}</p>
					</Chat.BubbleMessage>
				</Chat.Bubble>
			{/each}

			{#if isReplying}
				<Chat.Bubble variant="received">
					<Chat.BubbleAvatar size="sm">
						<Chat.BubbleAvatarFallback>U2</Chat.BubbleAvatarFallback>
					</Chat.BubbleAvatar>
					<Chat.BubbleMessage typing class="min-w-24 px-2 py-2">
						{#snippet typingIndicator()}
							<div class="flex items-center gap-2">
								<Square18 size={20} dotSize={2} speed={1.2} />
								<span class="text-sm text-muted-foreground">Typing...</span>
							</div>
						{/snippet}
					</Chat.BubbleMessage>
				</Chat.Bubble>
			{/if}
		</Chat.List>
	</div>

	<form class="flex w-full gap-2 bg-muted/10 p-4" onsubmit={handleSubmit}>
		<Input bind:value={draft} placeholder="Write a follow-up..." disabled={isReplying} />
		<Button type="submit" disabled={isReplying || !draft.trim()}>
			{#if isReplying}
				Sending
			{:else}
				Send
			{/if}
		</Button>
	</form>
</div>
