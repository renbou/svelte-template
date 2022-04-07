<script lang="ts">
  import Hello from "@components/Hello.svelte";
  import "@styles/app.scss";

  let name: string;
</script>

<div class="box welcome">
  <h1 class="title is-2">Svelte test</h1>
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
  h1 {
    text-transform: uppercase;
  }

  .welcome {
    width: 50%;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  :global {
    #svelte-app {
      // background-color: app.$primary;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 0;
      flex-wrap: wrap;
    }
  }
</style>
