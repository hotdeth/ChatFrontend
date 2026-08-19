<script lang="ts">
  let { data } = $props();
  import { enhance } from "$app/forms";
</script>

<div class="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-5xl">
    <!-- Header (Added to match Friends and Users pages) -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-black">Requests</h1>
      <p class="mt-2 text-sm text-gray-500">
        Review and manage your pending requests.
      </p>
    </div>

    {#if data.requests && data.requests.length > 0}
      <div class="flex flex-col gap-4">
        {#each data.requests as req}
          <div
            class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <!-- Left side: Avatar & Info -->
            <div class="flex min-w-0 items-center gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-black ring-1 ring-gray-200"
              >
                {req.sender.name.charAt(0).toUpperCase()}
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="truncate text-base font-bold text-black">
                    {req.sender.name}
                  </span>
                  <span class="truncate text-sm text-gray-500">
                    @{req.sender.username}
                  </span>
                </div>

                {#if req.message}
                  <p class="mt-1 line-clamp-2 text-sm text-gray-600">
                    {req.message}
                  </p>
                {/if}
              </div>
            </div>

            <!-- Right side: Action -->
            <form
              action="?/follow"
              method="POST"
              use:enhance
              class="mt-2 shrink-0 sm:mt-0"
            >
              <input type="hidden" value={req.id} name="req_id" />
              <button
                type="submit"
                class="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:w-auto"
              >
                Accept Request
              </button>
            </form>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Empty State -->
      <div
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center"
      >
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm text-black">
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 class="text-base font-bold text-black">No pending requests</h3>
        <p class="mt-2 max-w-sm text-sm text-gray-500">
          You're all caught up! When someone sends you a request, it will appear here.
        </p>
      </div>
    {/if}
  </div>
</div>
