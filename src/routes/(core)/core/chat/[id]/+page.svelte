<script lang="ts">
  import { PUBLIC_BASE_URL_WS } from "$env/static/public";
  import { onMount } from "svelte";

  let { data } = $props();

  let socket: WebSocket | null = null;

  let peerConnection: RTCPeerConnection | null = null;
  let dataChannel: RTCDataChannel | null = null;

  let message = $state("");
  let messages = $state<any[]>([]);

  let connected = $state(false);
  let peerConnected = $state(false);

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectAttempts = 0;

  const currentUserId = String(data.user.id);
  const receiverId = String(data.userID);

  /**
   * -------------------------------------------------------
   * Configuration
   * -------------------------------------------------------
   */

  const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  /**
   * -------------------------------------------------------
   * Helpers
   * -------------------------------------------------------
   */

  function addMessage(msg: any) {
    messages = [...messages, msg];
  }

  function isWebSocketOpen() {
    return socket?.readyState === WebSocket.OPEN;
  }

  function isDataChannelOpen() {
    return dataChannel?.readyState === "open";
  }

  /**
   * -------------------------------------------------------
   * Signal Server
   * -------------------------------------------------------
   */

  function sendSignal(payload: any) {
    if (!isWebSocketOpen()) {
      console.warn("Signal server is not connected");
      return false;
    }

    socket!.send(JSON.stringify(payload));

    return true;
  }

  /**
   * -------------------------------------------------------
   * WebRTC
   * -------------------------------------------------------
   */

  function createPeerConnection() {
    if (peerConnection) {
      return peerConnection;
    }

    console.log("Creating RTCPeerConnection");

    peerConnection = new RTCPeerConnection(ICE_SERVERS);

    /**
     * ICE Candidate
     *
     * These must go through the Signal Server.
     */
    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      sendSignal({
        type: "ice-candidate",
        sender: currentUserId,
        receiver: receiverId,
        data: {
          candidate: event.candidate,
        },
      });
    };

    /**
     * Remote DataChannel
     *
     * This happens on the receiver side.
     */
    peerConnection.ondatachannel = (event) => {
      console.log("Remote DataChannel received");

      setupDataChannel(event.channel);
    };

    /**
     * Connection state
     */
    peerConnection.onconnectionstatechange = () => {
      if (!peerConnection) {
        return;
      }

      console.log("WebRTC connection state:", peerConnection.connectionState);

      switch (peerConnection.connectionState) {
        case "connected":
          peerConnected = true;
          break;

        case "disconnected":
          peerConnected = false;
          break;

        case "failed":
          peerConnected = false;

          console.warn("WebRTC connection failed");

          /*
           * Important:
           *
           * Do NOT close the WebSocket.
           *
           * If the Signal Server is available,
           * we can attempt to create another connection.
           */
          break;

        case "closed":
          peerConnected = false;
          break;
      }
    };

    /**
     * ICE connection state
     */
    peerConnection.oniceconnectionstatechange = () => {
      if (!peerConnection) {
        return;
      }

      console.log("ICE state:", peerConnection.iceConnectionState);
    };

    return peerConnection;
  }

  /**
   * Create DataChannel
   *
   * Only the initiator creates the DataChannel.
   * The other side receives it through ondatachannel.
   */
  function createDataChannel() {
    if (!peerConnection) {
      createPeerConnection();
    }

    if (dataChannel) {
      return dataChannel;
    }

    console.log("Creating DataChannel");

    dataChannel = peerConnection!.createDataChannel("messages", {
      ordered: true,
    });

    setupDataChannel(dataChannel);

    return dataChannel;
  }

  /**
   * Setup DataChannel
   */
  function setupDataChannel(channel: RTCDataChannel) {
    dataChannel = channel;

    channel.onopen = () => {
      console.log("P2P DataChannel connected");

      peerConnected = true;
    };

    channel.onclose = () => {
      console.log("P2P DataChannel closed");

      peerConnected = false;
    };

    channel.onerror = (error) => {
      console.error("P2P DataChannel error:", error);
    };

    channel.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        console.log("P2P message received:", parsed);

        addMessage(parsed);
      } catch (error) {
        console.error("Invalid P2P message:", error);
      }
    };
  }

  /**
   * -------------------------------------------------------
   * WebRTC Offer
   * -------------------------------------------------------
   */

  async function createOffer() {
    try {
      if (!isWebSocketOpen()) {
        console.warn("Cannot create offer without signaling");

        return;
      }

      const pc = createPeerConnection();

      createDataChannel();

      /*
       * Avoid creating a new offer when
       * WebRTC is already connected.
       */
      if (
        pc.connectionState === "connected" ||
        pc.connectionState === "connecting"
      ) {
        return;
      }

      console.log("Creating WebRTC offer");

      const offer = await pc.createOffer();

      await pc.setLocalDescription(offer);

      sendSignal({
        type: "offer",
        sender: currentUserId,
        receiver: receiverId,
        data: {
          type: offer.type,
          sdp: offer.sdp,
        },
      });

      console.log("Offer sent");
    } catch (error) {
      console.error("Failed to create offer:", error);
    }
  }

  /**
   * -------------------------------------------------------
   * Receive Offer
   * -------------------------------------------------------
   */

  async function handleOffer(parsedData: any) {
    try {
      console.log("Offer received");

      const pc = createPeerConnection();

      await pc.setRemoteDescription(
        new RTCSessionDescription({
          type: parsedData.data.type,
          sdp: parsedData.data.sdp,
        }),
      );

      const answer = await pc.createAnswer();

      await pc.setLocalDescription(answer);

      sendSignal({
        type: "answer",
        sender: currentUserId,
        receiver: parsedData.sender,
        data: {
          type: answer.type,
          sdp: answer.sdp,
        },
      });

      console.log("Answer sent");
    } catch (error) {
      console.error("Failed to handle offer:", error);
    }
  }

  /**
   * -------------------------------------------------------
   * Receive Answer
   * -------------------------------------------------------
   */

  async function handleAnswer(parsedData: any) {
    try {
      if (!peerConnection) {
        console.warn("Received answer without peer connection");

        return;
      }

      console.log("Answer received");

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({
          type: parsedData.data.type,
          sdp: parsedData.data.sdp,
        }),
      );

      console.log("Remote answer applied");
    } catch (error) {
      console.error("Failed to handle answer:", error);
    }
  }

  /**
   * -------------------------------------------------------
   * Receive ICE Candidate
   * -------------------------------------------------------
   */

  async function handleIceCandidate(parsedData: any) {
    try {
      const pc = createPeerConnection();

      /*
       * If remote description isn't ready yet,
       * ICE candidates can fail to apply.
       *
       * The simple solution here is to wait.
       */
      if (!pc.remoteDescription) {
        console.warn(
          "Remote description not ready yet. ICE candidate skipped.",
        );

        return;
      }

      await pc.addIceCandidate(new RTCIceCandidate(parsedData.data.candidate));

      console.log("ICE candidate added");
    } catch (error) {
      console.error("Failed to add ICE candidate:", error);
    }
  }

  /**
   * -------------------------------------------------------
   * Determine who starts the connection
   * -------------------------------------------------------
   *
   * Both clients receive the same IDs.
   *
   * Only the client with the smaller ID
   * creates the initial offer.
   *
   * This prevents both sides from creating
   * an offer at the same time.
   */
  function shouldInitiate() {
    return currentUserId < receiverId;
  }

  /**
   * -------------------------------------------------------
   * Send Message
   * -------------------------------------------------------
   */

  function sendMessage() {
    const text = message.trim();

    if (!text) {
      return;
    }

    const outgoingMessage = {
      type: "message",
      sender: currentUserId,
      receiver: receiverId,
      data: {
        text,
      },
    };

    /**
     * P2P is preferred.
     */
    if (isDataChannelOpen()) {
      try {
        dataChannel!.send(JSON.stringify(outgoingMessage));

        addMessage(outgoingMessage);

        message = "";

        return;
      } catch (error) {
        console.error("P2P send failed:", error);
      }
    }

    /**
     * Fallback to Signal Server.
     */
    if (isWebSocketOpen()) {
      socket!.send(JSON.stringify(outgoingMessage));

      addMessage(outgoingMessage);

      message = "";

      return;
    }

    console.warn("No connection available");
  }

  /**
   * -------------------------------------------------------
   * WebSocket message handler
   * -------------------------------------------------------
   */

  async function handleSocketMessage(event: MessageEvent) {
    try {
      const parsedData = JSON.parse(event.data);

      console.log("Signal Server received:", parsedData);

      /**
       * Ignore our own messages if the backend
       * broadcasts them back.
       */
      if (String(parsedData.sender) === currentUserId) {
        return;
      }

      switch (parsedData.type) {
        case "offer":
          await handleOffer(parsedData);
          break;

        case "answer":
          await handleAnswer(parsedData);
          break;

        case "ice-candidate":
          await handleIceCandidate(parsedData);
          break;

        case "message":
          /*
           * If P2P isn't active, backend acts
           * as a fallback chat channel.
           */
          if (!isDataChannelOpen()) {
            addMessage(parsedData);
          }

          break;

        default:
          console.log("Unknown signal type:", parsedData.type);
      }
    } catch (error) {
      console.error("Invalid WebSocket message:", error);
    }
  }

  /**
   * -------------------------------------------------------
   * Connect WebSocket
   * -------------------------------------------------------
   */

  function connectWebSocket() {
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    const token = data.token;

    /*
     * Use wss in production.
     *
     * If PUBLIC_BASE_URL_WS already contains ws://
     * or wss://, don't duplicate it.
     */
    let wsUrl = PUBLIC_BASE_URL_WS;

    if (!wsUrl.startsWith("ws://") && !wsUrl.startsWith("wss://")) {
      const protocol = location.protocol === "https:" ? "wss://" : "ws://";

      wsUrl = `${protocol}${wsUrl}`;
    }

    const url = `${wsUrl}/ws?id=${encodeURIComponent(
      currentUserId,
    )}&token=${encodeURIComponent(token)}`;

    console.log("Connecting to Signal Server:", url);

    socket = new WebSocket(url);

    socket.onopen = async () => {
      connected = true;

      reconnectAttempts = 0;

      console.log("Signal Server connected");

      /**
       * If P2P isn't already connected,
       * initiate WebRTC from one side.
       */
      if (!peerConnected && shouldInitiate()) {
        await createOffer();
      }
    };

    socket.onmessage = handleSocketMessage;

    socket.onerror = (error) => {
      console.error("Signal Server error:", error);
    };

    socket.onclose = () => {
      connected = false;

      console.log("Signal Server disconnected");

      /*
       * IMPORTANT:
       *
       * Do NOT close peerConnection here.
       *
       * WebRTC can continue working even though
       * the backend is completely disconnected.
       */

      scheduleReconnect();
    };
  }

  /**
   * -------------------------------------------------------
   * Reconnect Signal Server
   * -------------------------------------------------------
   */

  function scheduleReconnect() {
    if (reconnectTimer) {
      return;
    }

    const delay = Math.min(1000 * 2 ** reconnectAttempts, 10000);

    reconnectAttempts++;

    console.log(`Reconnecting in ${delay}ms`);

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;

      connectWebSocket();
    }, delay);
  }

  /**
   * -------------------------------------------------------
   * Lifecycle
   * -------------------------------------------------------
   */

  onMount(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      socket?.close();

      dataChannel?.close();

      peerConnection?.close();

      socket = null;
      dataChannel = null;
      peerConnection = null;
    };
  });
</script>

<div class="flex min-h-screen flex-col bg-gray-100">
  <!-- Header -->

  <header class="flex items-center gap-3 border-b bg-white px-5 py-4">
    <a href="/" class="rounded-full p-2 text-gray-500 hover:bg-gray-100"> ← </a>

    <div
      class="flex h-11 w-11 items-center justify-center
             rounded-full bg-blue-600 font-semibold text-white"
    >
      {data.user?.name?.charAt(0)?.toUpperCase() || "U"}
    </div>

    <div>
      <h1 class="font-semibold text-gray-900">
        {data.user?.name || "User"}
      </h1>

      <div class="flex items-center gap-2">
        <span
          class:text-green-500={peerConnected}
          class:text-blue-500={!peerConnected && connected}
          class:text-gray-400={!peerConnected && !connected}
          class="text-xs"
        >
          {#if peerConnected}
            P2P Connected
          {:else if connected}
            Signal Server
          {:else}
            Connecting...
          {/if}
        </span>

        {#if peerConnected}
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
        {:else if connected}
          <span class="h-2 w-2 rounded-full bg-blue-500"></span>
        {:else}
          <span class="h-2 w-2 rounded-full bg-gray-400"></span>
        {/if}
      </div>
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
          {msg.data?.text || msg.data?.sdp || msg.message || ""}
        </div>
      </div>
    {/each}
  </main>

  <!-- Input -->

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
        disabled={!connected && !peerConnected}
        class="flex-1 rounded-full border
               border-gray-300 px-5 py-3
               outline-none transition
               focus:border-blue-500
               focus:ring-2
               focus:ring-blue-500/20
               disabled:bg-gray-100"
      />

      <button
        type="submit"
        disabled={(!connected && !peerConnected) || !message.trim()}
        class="rounded-full bg-blue-600
               px-6 py-3 font-semibold
               text-white transition
               hover:bg-blue-700
               disabled:cursor-not-allowed
               disabled:bg-gray-300"
      >
        Send
      </button>
    </form>
  </footer>
</div>
