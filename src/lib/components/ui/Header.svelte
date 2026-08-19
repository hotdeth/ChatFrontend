<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import {
    UsersGroupSolid,
    BellRingSolid,
    MessagesSolid,
    UserSolid,
    JarSolid,
    XSolid,
    HomeSolid,
  } from "flowbite-svelte-icons";

  interface Link {
    name: string;
    href: string;
    icon: typeof UsersGroupSolid;
  }

  const links: Link[] = [
    {
      name: "Home",
      href: "/home",
      icon: HomeSolid,
    },
    {
      name: "Friends",
      href: "/home/friends",
      icon: UsersGroupSolid,
    },
    { name: "Requests", href: "/home/pending", icon: BellRingSolid },

    {
      name: "Users",
      href: "/home/users",
      icon: UserSolid,
    },
  ];

  let menuOpen = false;

  const isActive = (href: string) => page.url.pathname === href;
</script>

<nav
  class="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-md"
>
  <div
    class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
  >
    <!-- Logo -->
    <a
      href="/home"
      class="flex items-center gap-3 text-lg font-bold tracking-tight text-black"
    >
      <div
        class="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white shadow-sm"
      >
        <MessagesSolid class="h-5 w-5" />
      </div>

      <span>Social</span>
    </a>

    <!-- Desktop navigation -->
    <div class="hidden items-center gap-2 md:flex">
      {#each links as link}
        {@const Icon = link.icon}
        <a
          href={link.href}
          class={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive(link.href)
              ? "bg-gray-100 text-black border border-gray-200/50 shadow-sm"
              : "text-gray-500 hover:bg-gray-50 hover:text-black"
          }`}
        >
          <Icon class="h-4 w-4" />
          <span>{link.name}</span>
        </a>
      {/each}
    </div>

    <!-- Mobile menu button -->
    <button
      type="button"
      class="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
      aria-expanded={menuOpen}
      onclick={() => (menuOpen = !menuOpen)}
    >
      {#if menuOpen}
        <XSolid class="h-5 w-5" />
      {:else}
        <JarSolid class="h-5 w-5" />
      {/if}
    </button>
  </div>

  <!-- Mobile navigation -->
  {#if menuOpen}
    <div class="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
      <div class="flex flex-col gap-2">
        {#each links as link}
          {@const Icon = link.icon}

          <a
            href={link.href}
            onclick={() => (menuOpen = false)}
            class={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
              isActive(link.href)
                ? "bg-gray-100 text-black border border-gray-200/50 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-black"
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
