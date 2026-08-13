<script lang="ts">
  import { PUBLIC_BASE_URL_WS } from "$env/static/public";
  import { onMount } from "svelte";

  let { data } = $props();

  let socket: WebSocket;
  let message = $state("");
  let messages = $state<any[]>([]);
  let connected = $state(false);

  // المستخدم الحالي
  const currentUserId = String(data.user.id);

  // الطرف الآخر
  const receiverId = String(data.userID);

  function sendMessage() {
    if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const text = message.trim();

    const outgoingMessage = {
      type: "offer",
      sender: currentUserId,
      receiver: receiverId,
      data: {
        sdp: text,
      },
    };

    // أظهر الرسالة مباشرة عند المرسل
    messages = [...messages, outgoingMessage];

    // أرسلها للسيرفر
    socket.send(JSON.stringify(outgoingMessage));

    message = "";
  }

  onMount(() => {
    const token = data.token;

    socket = new WebSocket(
      `ws://${PUBLIC_BASE_URL_WS}/ws?id=${currentUserId}&token=${token}`,
    );

    socket.onopen = () => {
      connected = true;
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);

        console.log("Received:", parsedData);

        // إذا كان السيرفر يعيد لنا رسالتنا مرة أخرى
        // لا نضيفها مرة ثانية
        if (String(parsedData.sender) === currentUserId) {
          return;
        }

        messages = [...messages, parsedData];
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      connected = false;
      console.log("WebSocket disconnected");
    };

    return () => {
      socket?.close();
    };
  });
</script>

<div class="flex min-h-screen flex-col bg-gray-100">
  <!-- Header -->
  <header class="flex items-center gap-3 border-b bg-white px-5 py-4">
    <a href="/" class="rounded-full p-2 text-gray-500 hover:bg-gray-100"> ← </a>

    <div
      class="flex h-11 w-11 items-center justify-center rounded-full
             bg-blue-600 font-semibold text-white"
    >
      {data.user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>

    <div>
      <h1 class="font-semibold text-gray-900">
        {data.user?.name || "User"}
      </h1>

      <p
        class:text-green-500={connected}
        class:text-gray-400={!connected}
        class="text-xs"
      >
        {connected ? "Online" : "Connecting..."}
      </p>
    </div>
  </header>

  <!-- Messages -->
  <main class="flex-1 space-y-3 overflow-y-auto p-5">
    {#each messages as msg}
      {@const isMine = String(msg.sender) === currentUserId}

      <div class:flex-row-reverse={isMine} class="flex">
        <div
          class:max-w-[75%]={true}
          class:rounded-br-md={isMine}
          class:rounded-bl-md={!isMine}
          class:bg-blue-600={isMine}
          class:text-white={isMine}
          class:bg-white={!isMine}
          class:text-gray-900={!isMine}
          class:shadow-sm={!isMine}
          class="rounded-2xl px-4 py-2"
        >
          {msg.data?.sdp || msg.message || ""}
        </div>
      </div>
    {/each}
  </main>

  <!-- Message input -->
  <footer class="border-t bg-white p-4">
    <form
      onsubmit={(event) => {
        event.preventDefault();
        sendMessage();
      }}
      class="flex gap-3"
    >
      <input
        bind:value={message}
        type="text"
        placeholder="Write a message..."
        disabled={!connected}
        class="flex-1 rounded-full border border-gray-300 px-5 py-3
               outline-none transition
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
               disabled:bg-gray-100"
      />

      <button
        type="submit"
        disabled={!connected || !message.trim()}
        class="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white
               transition hover:bg-blue-700
               disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Send
      </button>
    </form>
  </footer>
</div>
