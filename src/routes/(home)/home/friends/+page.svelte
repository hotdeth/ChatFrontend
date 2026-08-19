<script lang="ts">
  import { Avatar } from "flowbite-svelte";

  interface User {
    id: number;
    username: string;
    name: string;
    private_id: string;
    public_id: string;
    created_at: string;
    updated_at: string;
  }

  let { data }: { data: { friends: User[] } } = $props();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
</script>

<div class="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-5xl">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight text-black">Friends</h1>
      <p class="mt-2 text-sm text-gray-500">
        Discover and connect with your friends.
      </p>
    </div>

    <!-- Horizontal List Layout -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {#each data.friends as user}
        <div
          class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
        >
          <!-- Left side: Avatar & Info -->
          <div class="flex items-center gap-4">
            <Avatar
              size="md"
              rounded
              placeholder={getInitials(user.name)}
              class="bg-gray-100 text-sm font-bold text-black ring-1 ring-gray-200"
            />

            <div>
              <h2 class="text-base font-bold text-black">
                {user.name}
              </h2>
              <p class="text-sm text-gray-500">
                @{user.username}
              </p>
            </div>
          </div>

          <!-- Right side: Date & Action -->
          <div class="flex items-center gap-6">
            <div class="hidden text-right sm:block">
              <span
                class="block text-xs font-medium text-gray-400 uppercase tracking-wider"
                >Joined</span
              >
              <span class="block text-sm font-medium text-gray-900">
                {formatDate(user.created_at)}
              </span>
            </div>

            <a
              href={`/home/chat/${user.id}`}
              class="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
            >
              Chat
            </a>
          </div>
        </div>
      {/each}
    </div>

    <!-- Empty State -->
    {#if !data.friends || data.friends.length === 0}
      <div
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center"
      >
        <h3 class="text-base font-bold text-black">No friends found</h3>
        <p class="mt-2 text-sm text-gray-500">
          There are currently no friends to display in your list.
        </p>
      </div>
    {/if}
  </div>
</div>
