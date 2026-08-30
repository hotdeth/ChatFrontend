<script lang="ts">
  import { onMount } from "svelte";
  import { UserSolid } from "flowbite-svelte-icons";
  import {
    deriveSharedKey,
    decryptMessage,
    getPrivateKey,
    importPublicKey,
  } from "$lib/Crypt.js";

  let { data } = $props();

  let chats = $state<any[]>([]);
  let isLoading = $state(true);

  function formatTime(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  onMount(async () => {
    try {
      const myPrivateKey = await getPrivateKey();

      if (!myPrivateKey) {
        console.error("Private key not found!");
        isLoading = false;
        return;
      }

      const rawChats = data.chats || [];
      const processedChats = [];

      for (let chat of rawChats) {
        let decryptedText = "Encrypted message...";

        try {
          const parsedMsg = JSON.parse(chat.last_message);
          
          if (parsedMsg.ciphertext) {
            const importedKey = await importPublicKey(chat.user.public_key || chat.user.public_id);
            const shared = await deriveSharedKey(myPrivateKey, importedKey);
            
            decryptedText = await decryptMessage(parsedMsg.ciphertext, shared);
          }
        } catch (e) {
          console.error(`Failed to decrypt last message for chat ${chat.id}`, e);
          decryptedText = "[Encrypted message]";
        }

        processedChats.push({
          ...chat,
          decrypted_last_message: decryptedText,
        });
      }

      chats = processedChats.sort((a, b) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );
    } catch (err) {
      console.error("Error setting up encryption for chat list:", err);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-2xl font-bold tracking-tight text-black">Messages</h1>
  </div>

  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
    {#if isLoading}
      <div class="flex items-center justify-center p-8 text-sm text-gray-500">
        Decrypting messages...
      </div>
    {:else if chats.length === 0}
      <div class="flex flex-col items-center justify-center p-12 text-center text-gray-500">
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
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600"
            >
              {chat.user.name.charAt(0).toUpperCase()}
            </div>

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

              <div class="mt-0.5 flex items-center justify-between gap-2">
                <p class="truncate text-sm text-gray-500">
                  {chat.decrypted_last_message}
                </p>

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
