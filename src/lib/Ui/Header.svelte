<script lang="ts">
  import { page } from "$app/state";
  import {
    UsersGroupSolid,
    BellRingSolid,
    MessagesSolid,
    UserSolid,
    JarSolid,
    XSolid,
  } from "flowbite-svelte-icons";

  interface Link {
    name: string;
    href: string;
    icon: typeof UsersGroupSolid;
  }

  const links: Link[] = [
    {
      name: "Friends",
      href: "/core/friends",
      icon: UsersGroupSolid,
    },
    {name:"Requests",
    href:"/core/pending",
    icon:BellRingSolid},
    {
      name: "Chats",
      href: "/core/chats",
      icon: MessagesSolid,
    },
    {
      name: "Users",
      href: "/core/users",
      icon: UserSolid,
    },
  ];

  let menuOpen = false;

  const isActive = (href: string) => page.url.pathname === href;
</script>

<nav
  class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-lg"
>
  <div
    class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
  >
    <!-- Logo -->
    <a
      href="/core"
      class="flex items-center gap-2 text-lg font-bold text-slate-900"
    >
      <div
        class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"
      >
        <MessagesSolid class="h-5 w-5" />
      </div>

      <span>Social</span>
    </a>

    <!-- Desktop navigation -->
    <div class="hidden items-center gap-1 md:flex">
      {#each links as link}
        {@const Icon = link.icon}

        <a
          href={link.href}
          class={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isActive(link.href)
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Icon class="h-5 w-5" />
          <span>{link.name}</span>
        </a>
      {/each}
    </div>

    <!-- Mobile menu button -->
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onclick={() => (menuOpen = !menuOpen)}
    >
      {#if menuOpen}
        <XSolid class="h-6 w-6" />
      {:else}
        <JarSolid class="h-6 w-6" />
      {/if}
    </button>
  </div>

  <!-- Mobile navigation -->
  {#if menuOpen}
    <div class="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
      <div class="flex flex-col gap-1">
        {#each links as link}
          {@const Icon = link.icon}

          <a
            href={link.href}
            onclick={() => (menuOpen = false)}
            class={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive(link.href)
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon class="h-5 w-5" />
            <span>{link.name}</span>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</nav>
