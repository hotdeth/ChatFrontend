<script>
	export let eyebrow = '';
	export let title = '';
	export let unlocked = false;
</script>

<div class="shell">
	<aside class="brand">
		<div class="brand-inner">
			<span class="mark">AUTH</span>
			<svg
				class="keyhole"
				class:unlocked
				viewBox="0 0 200 240"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="100" cy="90" r="46" class="ring" />
				<path d="M100 130 L100 190" class="shaft" />
				<circle cx="100" cy="90" r="16" class="bore" />
				<path d="M92 100 L100 130 L108 100 Z" class="bore-tail" />
				<line x1="60" y1="60" x2="30" y2="30" class="beam beam-a" />
				<line x1="140" y1="60" x2="170" y2="30" class="beam beam-b" />
				<line x1="55" y1="90" x2="20" y2="90" class="beam beam-c" />
			</svg>
			<p class="tagline">Every session starts with the same two turns of the key.</p>
		</div>
	</aside>

	<main class="panel">
		<div class="panel-inner">
			{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
			<h1>{title}</h1>
			<slot />
		</div>
	</main>
</div>

<style>
	.shell {
		min-height: 100dvh;
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
	}

	.brand {
		background: var(--ink-soft);
		border-right: 1px solid var(--ink-line);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
	}

	.brand-inner {
		max-width: 320px;
		text-align: center;
	}

	.mark {
		font-family: var(--font-mono);
		letter-spacing: 0.4em;
		font-size: 0.75rem;
		color: var(--brass);
	}

	.keyhole {
		width: 100%;
		max-width: 200px;
		margin: 2rem auto;
		display: block;
		overflow: visible;
	}

	.ring {
		stroke: var(--ink-line);
		stroke-width: 3;
		transition: stroke 0.6s ease;
	}

	.bore,
	.bore-tail {
		fill: var(--brass);
		transition: fill 0.6s ease;
	}

	.shaft {
		stroke: var(--brass);
		stroke-width: 16;
		stroke-linecap: round;
		transition: stroke 0.6s ease;
	}

	.beam {
		stroke: var(--brass-bright);
		stroke-width: 2;
		opacity: 0;
		transition: opacity 0.6s ease 0.2s;
	}

	.keyhole.unlocked .ring {
		stroke: var(--teal);
	}

	.keyhole.unlocked .bore,
	.keyhole.unlocked .bore-tail {
		fill: var(--teal);
	}

	.keyhole.unlocked .shaft {
		stroke: var(--teal);
	}

	.keyhole.unlocked .beam {
		opacity: 1;
	}

	.tagline {
		font-family: var(--font-display);
		font-size: 1.1rem;
		font-style: italic;
		color: var(--parchment-dim);
		line-height: 1.5;
	}

	.panel {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.panel-inner {
		width: 100%;
		max-width: 380px;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.3em;
		color: var(--brass);
		text-transform: uppercase;
		margin: 0 0 0.5rem;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 2.2rem;
		font-weight: 500;
		margin: 0 0 2rem;
		color: var(--parchment);
	}

	@media (max-width: 760px) {
		.shell {
			grid-template-columns: 1fr;
		}
		.brand {
			border-right: none;
			border-bottom: 1px solid var(--ink-line);
			padding: 2rem 1.5rem;
		}
		.keyhole {
			max-width: 120px;
			margin: 1rem auto;
		}
	}
</style>
