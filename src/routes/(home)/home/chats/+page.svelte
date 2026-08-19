<script lang="ts">
  import { UserSolid } from "flowbite-svelte-icons";

  let { data } = $props();

  function formatTime(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  let chats = $derived(
    (data.chats || []).sort(
      (a, b) =>
        new Date(b.last_message_at).getTime() -
        new Date(a.last_message_at).getTime(),
    ),
  );
</script>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold tracking-tight text-black">Messages</h1>
  </div>

  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
  >
    {#if chats.length === 0}
      <div
        class="flex flex-col items-center justify-center p-12 text-center text-gray-500"
      >
        <UserSolid class="mb-3 h-8 w-8 text-gray-300" />
        <p class="text-sm font-medium text-black">No messages yet</p>
        <p class="text-xs">Start a conversation with your friends.</p>
      </div>
    {:else}
      <div class="flex flex-col divide-y divide-gray-100">
        {#each chats as chat}
          <a
            href={`/home/chat/${chat.user.id}`}
            class="flex items-center gap-4 p-4 transition-colors duration-200 hover:bg-gray-50"
          >
            <!-- صورة المستخدم (الحرف الأول) -->
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600"
            >
              {chat.user.name.charAt(0).toUpperCase()}
            </div>

            <!-- معلومات المحادثة -->
            <div class="flex min-w-0 flex-1 flex-col">
              <div class="flex items-center justify-between">
                <p class="truncate text-sm font-semibold text-black">
                  {chat.user.name}
                  <span class="ml-1 text-xs font-normal text-gray-500">
                    @{chat.user.username}
                  </span>
                </p>
                <span class="text-xs text-gray-400">
                  {formatTime(chat.last_message_at)}
                </span>
              </div>

              <!-- السطر السفلي: يظهر فقط عدد الرسائل غير المقروءة (إن وجدت) ومحاذاة لليمين -->
              <div class="mt-0.5 flex items-center justify-end gap-2 h-5">
                {#if chat.unread_count > 0}
                  <div
                    class="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-bold text-white"
                  >
                    {chat.unread_count}
                  </div>
                {/if}
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
