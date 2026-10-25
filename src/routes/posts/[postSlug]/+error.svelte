<script lang="ts">
  import { page } from "$app/state";
</script>

<article>
  <h2>{page.error?.message || 'Whoops, something went wrong.'}</h2>
</article>
