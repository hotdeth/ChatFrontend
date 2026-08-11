<script lang="ts">
  import { onMount } from "svelte";

  let { data } = $props();

  let socket: WebSocket;
  let message = $state("");
  let messages = $state<any[]>([]);
  let connected = $state(false);

  function sendMessage() {
    if (!message.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(
      JSON.stringify({
        receiver_id: data.userID,
        message: message.trim(),
      }),
    );

    message = "";
  }

  onMount(() => {
    const userId = 1 
    const token = data.token 
    socket = new WebSocket(`ws://localhost:8080/ws/${userId}&token=${token}`);

    socket.onopen = () => {
      connected = true;
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
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

<!-- باقي كود HTML (الـ UI) يبقى كما هو دون تغيير -->

<div class="flex min-h-screen flex-col bg-gray-100">
  <!-- Header -->
  <header class="flex items-center gap-3 border-b bg-white px-5 py-4">
    <a href="/" class="rounded-full p-2 text-gray-500 hover:bg-gray-100"> ← </a>

    <div
      class="flex h-11 w-11 items-center justify-center rounded-full
             bg-blue-600 font-semibold text-white"
    >
      <!-- {data.user.name?.charAt(0).toUpperCase()} -->
    </div>

    <div>
      <h1 class="font-semibold text-gray-900">
        <!-- {data.user.name} -->
      </h1>

      <p class="text-xs {connected ? 'text-green-500' : 'text-gray-400'}">
        {connected ? "Online" : "Connecting..."}
      </p>
    </div>
  </header>

  <!-- Messages -->
  <main class="flex-1 space-y-3 overflow-y-auto p-5">
    {#each messages as msg}
      <div
        class="flex {msg.sender_id === data.currentUser.public_id
          ? 'justify-end'
          : 'justify-start'}"
      >
        <div
          class="max-w-[75%] rounded-2xl px-4 py-2
            {msg.sender_id === data.currentUser.public_id
            ? 'rounded-br-md bg-blue-600 text-white'
            : 'rounded-bl-md bg-white text-gray-900 shadow-sm'}"
        >
          {msg.message}
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
