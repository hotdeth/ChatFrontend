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

<div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
  <!-- Navbar -->
  <!-- Main Content -->
  <div
    class="mx-auto flex min-h-[calc(100vh-60px)] w-full max-w-2xl flex-col bg-white shadow-sm sm:border-x sm:border-slate-200"
  >
    <!-- Header -->
    <header class="pt-6 pb-2">
      <div class="px-5 mb-4">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Messages
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Connect and chat with {data.user.public_id}
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex px-5 border-b border-slate-200">
        <button
          type="button"
          onclick={() => (activeTab = "all")}
          class={`relative flex-1 pb-3 text-sm font-medium transition-colors
            ${
              activeTab === "all"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
        >
          <div class="flex items-center justify-center gap-2">
            All Users
            <span
              class={`rounded-full px-2 py-0.5 text-xs font-semibold transition-colors
                ${
                  activeTab === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
            >
              {data.users?.length ?? 0}
            </span>
          </div>
          {#if activeTab === "all"}
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-600"
            ></span>
          {/if}
        </button>

        <button
          type="button"
          onclick={() => (activeTab = "friends")}
          class={`relative flex-1 pb-3 text-sm font-medium transition-colors
            ${
              activeTab === "friends"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
        >
          <div class="flex items-center justify-center gap-2">
            Friends
            <span
              class={`rounded-full px-2 py-0.5 text-xs font-semibold transition-colors
                ${
                  activeTab === "friends"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
            >
              {data.friends?.length ?? 0}
            </span>
          </div>
          {#if activeTab === "friends"}
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-blue-600"
            ></span>
          {/if}
        </button>
      </div>
    </header>

    <!-- Users List -->
    <main class="flex-1 pb-10">
      {#if users.length}
        <div class="divide-y divide-slate-100">
          {#each users as user}
            <div
              class="group flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 transition-all hover:bg-slate-50"
            >
              <!-- User Info Section -->
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <!-- Avatar -->
                <div
                  class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-sm ring-2 ring-white transition-transform group-hover:scale-105"
                >
                  {getInitial(user.name)}
                </div>

                <!-- Details -->
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <h2 class="truncate font-semibold text-slate-900 text-base">
                      {user.name}
                    </h2>
                    {#if user.updated_at}
                      <span
                        class="shrink-0 text-[11px] font-medium text-slate-400 mt-0.5"
                      >
                        • {new Date(user.updated_at).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    {/if}
                  </div>
                  <p class="truncate text-sm text-slate-500">
                    @{user.username}
                  </p>
                </div>
              </div>

              <!-- Actions Section -->
              <div class="flex items-center gap-2 pl-18 sm:pl-0">
                <!-- إخفاء زر المتابعة إذا كنا في تبويب الأصدقاء -->
                {#if activeTab === "all"}
                  <form
                    action="?/follow"
                    method="POST"
                    use:enhance
                    class="flex-1 sm:flex-none"
                  >
                    <input type="hidden" name="receive_id" value={user.id} />
                    <button
                      onclick={(e) => e.stopPropagation()}
                      type="submit"
                      class="w-full flex items-center justify-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        ><path
                          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        /><circle cx="9" cy="7" r="4" /><line
                          x1="19"
                          x2="19"
                          y1="8"
                          y2="14"
                        /><line x1="22" x2="16" y1="11" y2="11" /></svg
                      >
                      Follow
                    </button>
                  </form>
                {/if}

                <a
                  href="/core/chat/{user.id}"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg
                  >
                  Message
                </a>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Empty state -->
        <div
          class="flex flex-col items-center justify-center px-6 py-24 text-center animate-in fade-in duration-500"
        >
          <div
            class="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 ring-8 ring-slate-50/50"
          >
            <svg
              class="h-10 w-10 text-slate-300"
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
          <h2 class="text-lg font-semibold text-slate-900">
            {activeTab === "friends" ? "No friends yet" : "No users found"}
          </h2>
          <p class="mt-2 text-sm text-slate-500 max-w-sm">
            {activeTab === "friends"
              ? "When you follow people and they follow back, they'll show up here."
              : "Looks like there are no users on the platform right now."}
          </p>
        </div>
      {/if}
    </main>
  </div>
</div>
