<script lang="ts">
  import { PUBLIC_BASE_URL_WS } from "$env/static/public";
  import { onMount, tick } from "svelte";

  let { data } = $props();

  let socket: WebSocket;
  let message = $state("");
  let connected = $state(false);
  let messagesContainer: HTMLElement;

  const currentUserId = String(data.user.id);
  const receiverId = String(data.userID);

  function formatTime(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async function scrollToBottom() {
    await tick();
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function normalizeMessage(msg: any) {
    let parsedData = msg.message;
    if (typeof parsedData === "string") {
      try {
        parsedData = JSON.parse(parsedData);
      } catch {
        parsedData = { sdp: parsedData };
      }
    }

    return {
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender: String(msg.sender_id),
      receiver: String(String(msg.sender_id) === currentUserId ? receiverId : currentUserId),
      data: parsedData,
      is_read: msg.is_read,
      created_at: msg.created_at,
      edited_at: msg.edited_at,
      deleted_at: msg.deleted_at,
    };
  }

  let messages = $state<any[]>(
    Array.isArray(data.messages) ? data.messages.map(normalizeMessage) : [],
  );

  function sendMessage() {
    if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const text = message.trim();
    const now = new Date().toISOString(); // إضافة وقت محلي للرسالة المرسلة

    const outgoingMessage = {
      type: "offer",
      sender: currentUserId,
      receiver: receiverId,
      data: { sdp: text },
      created_at: now,
    };

    messages = [...messages, outgoingMessage];
    socket.send(JSON.stringify(outgoingMessage));
    
    message = "";
    scrollToBottom(); // النزول لأسفل بعد الإرسال
  }

  onMount(() => {
    scrollToBottom(); // النزول لأسفل عند فتح المحادثة
    const token = data.token;

    socket = new WebSocket(
      `ws://${PUBLIC_BASE_URL_WS}/ws?id=${currentUserId}&token=${token}`,
    );

    socket.onopen = () => {
      connected = true;
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        if (String(parsedData.sender) === currentUserId) return;
        
        // إذا لم يكن السيرفر يرسل الوقت، نضع وقت الاستلام
        if (!parsedData.created_at) {
            parsedData.created_at = new Date().toISOString();
        }

        messages = [...messages, parsedData];
        scrollToBottom(); // النزول لأسفل عند الاستقبال
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => { connected = false; };

    return () => { socket?.close(); };
  });
</script>

<div class="flex h-screen flex-col bg-slate-50/50 sm:bg-gray-100">
  <div class="mx-auto flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-2xl sm:border-x border-gray-200">
    
    <header class="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md">
      <a href="/" class="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </a>

      <div class="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-sm">
        {data.user?.name?.charAt(0)?.toUpperCase() || "U"}
        <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white {connected ? 'bg-green-500' : 'bg-gray-400'}"></div>
      </div>

      <div class="flex-1 min-w-0">
        <h1 class="truncate text-base font-bold text-gray-900">
          {data.user?.name || "User"}
        </h1>
        <p class="truncate text-xs font-medium {connected ? 'text-green-600' : 'text-gray-500'}">
          {connected ? "Online" : "Connecting..."}
        </p>
      </div>
    </header>

    <main 
      bind:this={messagesContainer}
      class="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
    >
      {#if messages.length === 0}
        <div class="flex h-full items-center justify-center">
          <p class="rounded-xl bg-gray-200/50 px-4 py-2 text-sm text-gray-500 backdrop-blur-sm">No messages yet. Say hello!</p>
        </div>
      {/if}

      {#each messages as msg}
        {@const isMine = String(msg.sender) === currentUserId}

        <div class="flex w-full {isMine ? 'justify-end' : 'justify-start'}">
          <div
            class="relative flex max-w-[85%] flex-col gap-1 sm:max-w-[75%]"
          >
            <div
              class="px-4 py-2.5 text-[15px] shadow-sm
              {isMine 
                ? 'rounded-2xl rounded-tr-sm bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' 
                : 'rounded-2xl rounded-tl-sm border border-gray-100 bg-white text-gray-800'}"
            >
              <p class="break-words leading-relaxed">{msg.data?.sdp || ""}</p>
              
              <span 
                class="mt-1 block text-right text-[10px] font-medium tracking-wide
                {isMine ? 'text-blue-100' : 'text-gray-400'}"
              >
                {formatTime(msg.created_at)}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </main>

    <footer class="sticky bottom-0 border-t border-gray-200 bg-white/90 p-3 backdrop-blur-lg sm:p-4">
      <form
        onsubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        class="flex items-end gap-2"
      >
        <div class="relative flex-1">
          <input
            bind:value={message}
            type="text"
            placeholder="Type your message..."
            disabled={!connected}
            class="w-full rounded-3xl border border-gray-300 bg-gray-50/50 px-5 py-3.5 pr-12 text-sm text-gray-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={!connected || !message.trim()}
          class="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-all hover:bg-indigo-600 hover:shadow-lg active:scale-95 disabled:pointer-events-none disabled:bg-gray-300 disabled:shadow-none"
        >
          <svg 
            class="h-5 w-5 -translate-y-[1px] translate-x-[1px] transition-transform group-hover:scale-110 group-active:translate-x-1 group-active:-translate-y-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </footer>

  </div>
</div>
