<script lang="ts">
  import Hello from "@/components/Hello.svelte";
  let name: string;
</script>

<h1>Svelte test</h1>
<input bind:value={name} placeholder="Your name" />
<Hello {name} />
