<script lang="ts">
  import { Card, Avatar, Button } from "flowbite-svelte";

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

<div class="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
  <div class="mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Users</h1>

      <p class="mt-1 text-sm text-slate-500">
        Discover and connect with other users.
      </p>
    </div>

    <!-- Users -->
    <div
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {#each data.friends as user}
        <Card
          class="overflow-hidden border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <!-- Cover -->
          <div class="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          <!-- Profile -->
          <div class="px-5 pb-5">
            <div class="-mt-10 mb-4 flex justify-center">
              <Avatar
                size="lg"
                rounded
                placeholder={getInitials(user.name)}
                class="border-4 border-white bg-blue-100 text-blue-700"
              />
            </div>

            <div class="text-center">
              <h2 class="text-lg font-bold text-slate-900">
                {user.name}
              </h2>

              <p class="text-sm text-slate-500">
                @{user.username}
              </p>
            </div>

            <div class="my-5 border-t border-slate-100"></div>

            <div
              class="flex items-center justify-between text-xs text-slate-500"
            >
              <span>Joined</span>
              <span class="font-medium text-slate-700">
                {formatDate(user.created_at)}
              </span>
            </div>

            <Button
              href={`/core/chat/${user.id}`}
              color="blue"
              class="mt-5 w-full"
            >
              Chat
            </Button>
          </div>
        </Card>
      {/each}
    </div>

    {#if !data.friends || data.friends.length === 0}
      <div
        class="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center"
      >
        <p class="font-medium text-slate-700">No users found</p>

        <p class="mt-1 text-sm text-slate-500">
          There are no users to display.
        </p>
      </div>
    {/if}
  </div>
</div>
