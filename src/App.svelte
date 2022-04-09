<script lang="ts">
  // Styles are setup using a separate component instead of importing and letting
  // Vite handle them to leverage Svelte's unused css styles warnings and removal.
  import Hello from "@components/Hello.svelte";
  let name: string;
</script>

<div class="box welcome flex-centered">
  <h1 class="title is-2 is-uppercase">Svelte test</h1>
  <div class="field">
    <input
      class="input"
      type="text"
      bind:value={name}
      placeholder="Your name"
    />
  </div>
  <Hello {name} />
</div>

<style lang="scss">
  .welcome {
    width: 50%;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
</style>
