<script>
  let { data } = $props();
  import { enhance } from "$app/forms";
</script>

<div class="mx-auto min-h-screen max-w-2xl bg-gray-50 pb-12">
  <main class="px-4 pt-6 sm:px-6">
    {#if data.requests && data.requests.length > 0}
      <div class="flex w-full flex-col gap-4">
        {#each data.requests as req}
          <div
            class="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex min-w-0 items-center gap-4">
              <div
                class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-inner"
              >
                {req.sender.name.charAt(0).toUpperCase()}
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="truncate font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                    {req.sender.name}
                  </span>
                  <span class="truncate text-sm font-medium text-gray-500">
                    @{req.sender.username}
                  </span>
                </div>

                <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-600">
                  {req.message}
                </p>
              </div>
            </div>

            <form action="?/follow" method="POST" use:enhance class="mt-2 shrink-0 sm:mt-0">
              <input type="hidden" value={req.id} name="req_id" />
              <button
                type="submit"
                class="w-full rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow active:scale-95 sm:w-auto"
              >
                Follow
              </button>
            </form>
          </div>
        {/each}
      </div>
    {:else}
      <div class="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">No pending requests</h3>
        <p class="mt-2 max-w-sm text-sm text-gray-500">
          You're all caught up! When someone sends you a request, it will appear here.
        </p>
      </div>
    {/if}
  </main>
</div>
