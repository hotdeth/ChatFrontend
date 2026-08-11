<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { token } from '$lib/stores/auth.js';

	let tokenValue = '';

	const unsub = token.subscribe((v) => (tokenValue = v));

	onMount(() => {
		if (!tokenValue) goto('/login');
		return unsub;
	});

	function signOut() {
		token.clear();
		goto('/login');
	}
</script>

<svelte:head>
	<title>Dashboard · Auth</title>
</svelte:head>

<div class="wrap">
	<div class="card">
		<p class="eyebrow">Door open</p>
		<h1>You're in.</h1>
		<p class="desc">The access token below came back from <code>/auth/login</code>.</p>
		<pre class="token">{tokenValue}</pre>
		<button on:click={signOut}>Sign out</button>
	</div>
</div>

<style>
	.wrap {
		min-height: 100dvh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.card {
		max-width: 480px;
		width: 100%;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.3em;
		color: var(--teal);
		text-transform: uppercase;
		margin: 0 0 0.5rem;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 2.4rem;
		font-weight: 500;
		margin: 0 0 0.75rem;
	}

	.desc {
		color: var(--parchment-dim);
		margin: 0 0 1.5rem;
	}

	code {
		font-family: var(--font-mono);
		background: var(--ink-soft);
		padding: 0.1rem 0.35rem;
		border-radius: 3px;
	}

	.token {
		background: var(--ink-soft);
		border: 1px solid var(--ink-line);
		border-radius: 6px;
		padding: 1rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--brass-bright);
		white-space: pre-wrap;
		word-break: break-all;
		margin: 0 0 1.5rem;
	}

	button {
		background: transparent;
		color: var(--parchment);
		border: 1px solid var(--ink-line);
		border-radius: 4px;
		padding: 0.7rem 1.2rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		cursor: pointer;
		transition: border-color 0.2s ease;
	}

	button:hover {
		border-color: var(--brass);
	}
</style>
