<script lang="ts">
  import { greet } from "@/lib/greet";

  export let name: string;
</script>

<h2>{greet(name)}</h2>
