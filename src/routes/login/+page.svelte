<script>
  import { enhance } from "$app/forms";
  import { GenerateKeyPair } from "$lib/Crypt.js";
  import { onMount } from "svelte";
  let { form } = $props();

</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Welcome back</h1>

        <p class="mt-2 text-sm text-gray-500">Login to your account</p>
      </div>

      <form action="?/login" method="POST" use:enhance class="space-y-5">
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            name="username"
            required
            autocomplete="username"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3
                   text-gray-900 placeholder-gray-400 outline-none
                   transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            name="password"
            required
            autocomplete="current-password"
            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3
                   text-gray-900 placeholder-gray-400 outline-none
                   transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <button
          type="submit"
          class="w-full rounded-lg bg-blue-600 px-4 py-3
                 text-sm font-semibold text-white
                 transition hover:bg-blue-700
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 active:bg-blue-800"
        >
          Login
        </button>
      </form>
      {#if form?.error}
        {form.error}
      {/if}
      <p class="mt-6 text-center text-sm text-gray-500">
        Don't have an account?
        <a
          href="/signup"
          class="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign up
        </a>
      </p>
    </div>
  </div>
</div>
