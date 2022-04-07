<script lang="ts">
  import { greet } from "@lib/greet";

  export let name: string = "world";
</script>

<div class="content"><h2>{greet(name)}</h2></div>
