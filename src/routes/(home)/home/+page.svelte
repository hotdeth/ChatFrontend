<script lang="ts">
  import { enhance } from "$app/forms";

  let { data } = $props();
</script>

<svelte:head>
  <title>Home · Test Environment</title>
  <meta
    name="description"
    content="Development and testing environment"
  />
</svelte:head>

<div class="min-h-screen bg-white text-gray-950">
  <main class="mx-auto w-full max-w-6xl px-6 py-6">
    <!-- Navbar -->
    <header
      class="flex items-center justify-between border-b border-gray-200 py-5"
    >
      <div>
        <h1 class="text-sm font-semibold tracking-tight">
          Test Environment
        </h1>

        <p class="mt-0.5 text-xs text-gray-500">
          Development workspace
        </p>
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

    <!-- Hero -->
    <section class="py-28 text-center sm:py-36">
      <div
        class="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-gray-900"></span>
        System online
      </div>

      <h2
        class="mx-auto max-w-4xl text-5xl font-bold tracking-[-0.04em] text-gray-950 sm:text-7xl"
      >
        Welcome to your
        <span class="block text-gray-400">
          test environment.
        </span>
      </h2>

      <p
        class="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-500"
      >
        A clean environment for testing your frontend, backend,
        authentication, sessions, and API functionality.
      </p>

      <!-- Feature cards -->
      <div
        class="mx-auto mt-14 grid max-w-4xl gap-4 text-left md:grid-cols-3"
      >
        <div
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 3.75h4.5l1.5 3h2.25a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V8.25A1.5 1.5 0 0 1 6 6.75h2.25l1.5-3Z"
              />
              <circle cx="12" cy="13.5" r="3.25" />
            </svg>
          </div>

          <h3 class="font-semibold text-gray-950">
            Test Mode
          </h3>

          <p class="mt-2 text-sm leading-6 text-gray-500">
            Frontend and backend testing environment.
          </p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              class="h-5 w-5"
            >
              <rect
                width="18"
                height="11"
                x="3"
                y="10"
                rx="2"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 10V7a5 5 0 0 1 10 0v3"
              />
              <circle cx="12" cy="15" r="1" />
            </svg>
          </div>

          <h3 class="font-semibold text-gray-950">
            Authentication
          </h3>

          <p class="mt-2 text-sm leading-6 text-gray-500">
            Your authenticated session is currently active.
          </p>
        </div>

        <div
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m13.5 3-9 10.5h6L10.5 21l9-10.5h-6L13.5 3Z"
              />
            </svg>
          </div>

          <h3 class="font-semibold text-gray-950">
            Ready
          </h3>

          <p class="mt-2 text-sm leading-6 text-gray-500">
            Everything is ready for application testing.
          </p>
        </div>
      </div>
    </section>

    <!-- Backend status -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
    >
      <div class="flex items-start justify-between p-7">
        <div>
          <p
            class="text-[10px] font-bold tracking-[0.2em] text-gray-400"
          >
            DEVELOPMENT
          </p>

          <h3 class="mt-2 text-xl font-semibold tracking-tight">
            Backend connection
          </h3>

          <p class="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Your protected home route is working correctly. Use this
            page to test authentication and backend functionality.
          </p>
        </div>

        <span
          class="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-500"
        >
          TEST
        </span>
      </div>

      <!-- Terminal -->
      <div class="border-t border-gray-200 bg-gray-950">
        <div class="flex gap-1.5 border-b border-white/10 px-4 py-3">
          <span class="h-2 w-2 rounded-full bg-white/20"></span>
          <span class="h-2 w-2 rounded-full bg-white/20"></span>
          <span class="h-2 w-2 rounded-full bg-white/20"></span>
        </div>

        <div
          class="space-y-2 p-6 font-mono text-xs leading-6 text-gray-400"
        >
          <div>
            <span class="text-white">$</span>
            authentication.status
          </div>

          <div class="pl-5 text-gray-300">
            authenticated
          </div>

          <div>
            <span class="text-white">$</span>
            session.status
          </div>

          <div class="pl-5 text-gray-300">
            active
          </div>

          <div>
            <span class="text-white">$</span>
            environment
          </div>

          <div class="pl-5 text-gray-300">
            development
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="flex justify-center gap-2 py-8 text-xs text-gray-400"
    >
      <span>Test Environment</span>
      <span>•</span>
      <span>SvelteKit</span>
    </footer>
  </main>
</div>
