<slot />

<style>
	:global(:root) {
		--ink: #14161c;
		--ink-soft: #1c1f28;
		--ink-line: #2b2f3a;
		--parchment: #ede9df;
		--parchment-dim: #a8a398;
		--brass: #c9a227;
		--brass-bright: #e0bc4a;
		--teal: #3e6259;
		--rust: #b0453a;

		--font-display: 'Fraunces', serif;
		--font-body: 'IBM Plex Sans', sans-serif;
		--font-mono: 'IBM Plex Mono', monospace;
	}

	:global(html, body) {
		margin: 0;
		padding: 0;
		background: var(--ink);
		color: var(--parchment);
		font-family: var(--font-body);
		height: 100%;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(a) {
		color: inherit;
	}

	:global(button:focus-visible),
	:global(input:focus-visible),
	:global(a:focus-visible) {
		outline: 2px solid var(--brass);
		outline-offset: 2px;
	}

	:global(@media (prefers-reduced-motion: reduce)) {
		:global(*) {
			animation-duration: 0.001ms !important;
			transition-duration: 0.001ms !important;
		}
	}
</style>
