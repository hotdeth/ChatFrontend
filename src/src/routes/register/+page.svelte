<script>
	import AuthShell from '$lib/AuthShell.svelte';
	import { register } from '$lib/api.js';
	import { goto } from '$app/navigation';

	let username = '';
	let name = '';
	let password = '';
	let loading = false;
	let error = '';
	let success = false;

	async function handleSubmit() {
		error = '';
		loading = true;
		try {
			await register(username, name, password);
			success = true;
			setTimeout(() => goto('/login'), 900);
		} catch (err) {
			error = err.message || 'Could not create the account. Try a different username.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Register · Auth</title>
</svelte:head>

<AuthShell eyebrow="New account" title="Cut a new key" unlocked={success}>
	<form on:submit|preventDefault={handleSubmit}>
		<label>
			<span>Full name</span>
			<input type="text" name="name" autocomplete="name" bind:value={name} required />
		</label>

		<label>
			<span>Username</span>
			<input type="text" name="username" autocomplete="username" bind:value={username} required />
		</label>

		<label>
			<span>Password</span>
			<input
				type="password"
				name="password"
				autocomplete="new-password"
				bind:value={password}
				required
			/>
		</label>

		{#if error}
			<p class="error" role="alert">{error}</p>
		{/if}

		{#if success}
			<p class="success">Account created. Taking you to sign in…</p>
		{/if}

		<button type="submit" disabled={loading}>
			{loading ? 'Cutting the key…' : 'Register'}
		</button>
	</form>

	<p class="switch">Already have an account? <a href="/login">Sign in</a></p>
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

	.success {
		background: rgba(62, 98, 89, 0.2);
		border: 1px solid var(--teal);
		color: #b9d6cd;
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
