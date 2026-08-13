<script lang="ts">
  let { data } = $props();
  import { enhance } from "$app/forms";
  let activeTab = $state<"all" | "friends">("all");

  const getInitial = (name: string) => {
    return name?.trim().charAt(0).toUpperCase() || "?";
  };

  const users = $derived(
    activeTab === "all" ? (data.users ?? []) : (data.friends ?? []),
  );
</script>

<div class="min-h-screen bg-gray-100">
  <a href="/">Home</a>
  <a href="/core/pending">requests</a>

  <div
    class="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-white shadow-sm"
  >
    <!-- Header -->
    <header class="border-b border-gray-200">
      <div class="px-5 py-4">
        <h1 class="text-xl font-bold text-gray-900">
          Messages for {data.user.public_id}
        </h1>

        <p class="mt-1 text-sm text-gray-500">
          Connect and chat with your friends
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex px-5">
        <button
          type="button"
          onclick={() => (activeTab = "all")}
          class={`relative flex-1 py-3 text-sm font-semibold transition
            ${
              activeTab === "all"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          All

          <span
            class={`ml-1 rounded-full px-2 py-0.5 text-xs
              ${
                activeTab === "all"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
          >
            {data.users?.length ?? 0}
          </span>

          {#if activeTab === "all"}
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600"
            ></span>
          {/if}
        </button>

        <button
          type="button"
          onclick={() => (activeTab = "friends")}
          class={`relative flex-1 py-3 text-sm font-semibold transition
            ${
              activeTab === "friends"
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Friends

          <span
            class={`ml-1 rounded-full px-2 py-0.5 text-xs
              ${
                activeTab === "friends"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
          >
            {data.friends?.length ?? 0}
          </span>

          {#if activeTab === "friends"}
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600"
            ></span>
          {/if}
        </button>
      </div>
    </header>

    <!-- Users -->
    <main class="flex-1">
      {#if users.length}
        <div class="divide-y divide-gray-100">
          {#each users as user}
            <div
              class="group flex items-center gap-4 px-5 py-4 transition
                     hover:bg-gray-50 active:bg-gray-100"
            >
              <!-- Avatar -->
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center
                       rounded-full bg-blue-600 text-lg font-semibold text-white
                       shadow-sm transition group-hover:bg-blue-700"
              >
                {getInitial(user.name)}
              </div>

              <!-- User information -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-3">
                  <h2 class="truncate font-semibold text-gray-900">
                    {user.name}
                  </h2>

                  {#if user.updated_at}
                    <span class="shrink-0 text-xs text-gray-400">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </span>
                  {/if}
                </div>

                <p class="mt-1 truncate text-sm text-gray-500">
                  @{user.username}
                </p>
              </div>
              <div>
                <form action="?/follow" method="POST" use:enhance>
                  <input type="hidden" name="receive_id" value={user.id} />
                  <button
                    onclick={(e) => e.stopPropagation()}
                    type="submit"
                    class="bg-blue-600 rounded text-white px-2">follow</button
                  >
                </form>
                <a
                  href="/core/chat/{user.id}"
                  type="submit"
                  class="bg-blue-600 rounded text-white px-2">Message</a
                >
              </div>

              <!-- Arrow -->
            </div>
          {/each}
        </div>
      {:else}
        <!-- Empty state -->
        <div
          class="flex flex-col items-center justify-center px-6 py-20 text-center"
        >
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center
                   rounded-full bg-gray-100"
          >
            <svg
              class="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          <h2 class="text-lg font-semibold text-gray-900">
            {activeTab === "friends" ? "No friends yet" : "No users found"}
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            {activeTab === "friends"
              ? "Your friends will appear here."
              : "There are no users to display."}
          </p>
        </div>
      {/if}
    </main>
  </div>
</div>
