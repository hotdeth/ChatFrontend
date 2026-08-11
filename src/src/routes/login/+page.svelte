<script>
	import AuthShell from '$lib/AuthShell.svelte';
	import { login } from '$lib/api.js';
	import { token } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let loading = false;
	let error = '';
	let unlocked = false;

	async function handleSubmit() {
		error = '';
		loading = true;
		try {
			const data = await login(username, password);
			token.setToken(data.access_token);
			unlocked = true;
			setTimeout(() => goto('/dashboard'), 500);
		} catch (err) {
			error = err.message || 'Could not sign in. Check your username and password.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign in · Auth</title>
</svelte:head>

<AuthShell eyebrow="Access" title="Sign in" {unlocked}>
	<form on:submit|preventDefault={handleSubmit}>
		<label>
			<span>Username</span>
			<input type="text" name="username" autocomplete="username" bind:value={username} required />
		</label>

		<label>
			<span>Password</span>
			<input
				type="password"
				name="password"
				autocomplete="current-password"
				bind:value={password}
				required
			/>
		</label>

		{#if error}
			<p class="error" role="alert">{error}</p>
		{/if}

		<button type="submit" disabled={loading}>
			{loading ? 'Turning the key…' : 'Sign in'}
		</button>
	</form>

	<p class="switch">No account yet? <a href="/register">Register one</a></p>
</AuthShell>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label span {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--parchment-dim);
	}

	input {
		background: var(--ink-soft);
		border: 1px solid var(--ink-line);
		border-radius: 4px;
		padding: 0.75rem 0.85rem;
		color: var(--parchment);
		font-family: var(--font-body);
		font-size: 1rem;
	}

	input:focus {
		border-color: var(--brass);
	}

	button {
		margin-top: 0.5rem;
		background: var(--brass);
		color: var(--ink);
		border: none;
		border-radius: 4px;
		padding: 0.85rem 1rem;
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	button:hover:not(:disabled) {
		background: var(--brass-bright);
	}

	button:disabled {
		opacity: 0.7;
		cursor: default;
	}

	.error {
		background: rgba(176, 69, 58, 0.15);
		border: 1px solid var(--rust);
		color: #f2b8b0;
		border-radius: 4px;
		padding: 0.6rem 0.75rem;
		font-size: 0.85rem;
		margin: 0;
	}

	.switch {
		margin-top: 2rem;
		font-size: 0.9rem;
		color: var(--parchment-dim);
	}

	.switch a {
		color: var(--brass);
		text-decoration: underline;
	}
</style>
