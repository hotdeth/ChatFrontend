<script lang="ts">
  import { enhance } from "$app/forms";

  let { data } = $props();
</script>

<svelte:head>
  <title>Home · Test Environment</title>
  <meta name="description" content="Development and testing environment" />
</svelte:head>

<div class="min-h-screen bg-white text-gray-950">
  <main class="mx-auto w-full max-w-6xl px-6 py-6">
    <!-- Navbar -->
    <header
      class="flex items-center justify-between border-b border-gray-200 py-5"
    >
      <div>
        <h1 class="text-sm font-semibold tracking-tight">Test Environment</h1>

        <p class="mt-0.5 text-xs text-gray-500">Development workspace</p>
      </div>

      <form action="?/logout" method="POST" use:enhance>
        <button
          type="submit"
          class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 12h9m0 0-3.75-3.75M21 12l-3.75 3.75"
            />
          </svg>

          Logout
        </button>
      </form>
    </header>
<p  class="text-center  mt-10"> Chaty <span class="text-blue-700">By</span></p>
    <h1 class="text-center mb-20 italic text-4xl">By Ridha KaREm</h1>
  </main>
</div>
