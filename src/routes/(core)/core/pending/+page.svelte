<script>
  let { data } = $props();
  import { enhance } from "$app/forms";
</script>
<a href="/">Home</a>
<a href="/core/pending">requests</a>


{#if data.requests}
  <div class="flex w-full flex-col gap-3">
    {#each data.requests as req}
      <div
        class="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4"
      >
        <div class="flex min-w-0 items-center gap-3">
          <!-- Avatar -->
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white"
          >
            {req.sender.name.charAt(0).toUpperCase()}
          </div>

          <!-- User info -->
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-900">
                {req.sender.name}
              </span>

              <span class="text-sm text-gray-500">
                @{req.sender.username}
              </span>
            </div>

            <p class="mt-1 truncate text-sm text-gray-600">
              {req.message}
            </p>
          </div>
        </div>

        <!-- Follow button -->
        <form action="?/follow" method="POST" use:enhance>
          <input type="hidden" value={req.id} name="req_id" />
          <button
            type="submit"
            class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            Follow
          </button>
        </form>
      </div>
    {/each}
  </div>
{:else}
  no data
{/if}
