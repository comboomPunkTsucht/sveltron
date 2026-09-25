<script lang="ts">
  import { APP_NAME } from "../../../config";
  interface PageData {
    title: string;
    description: string;
  }

  const { title, description }: PageData = $props();
</script>

<svelte:head>
  <title>{APP_NAME} - {title}</title>
  <meta name="description" content={description} />
</svelte:head>
