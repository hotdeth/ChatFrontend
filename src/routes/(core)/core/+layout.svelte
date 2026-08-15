<script>
  import Header from "$lib/Ui/Header.svelte";

  let { children } = $props();
</script>

<div>
  <Header />

  {@render children()}
</div>
