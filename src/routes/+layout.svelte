<script lang="ts">
  import NavBar from "$lib/components/NavBar.svelte";
  import "./layout.css";

  import { onMount } from "svelte";

  let { children } = $props();

  onMount(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.on("main-process-message", (_event, message) => {
        console.log("Nachricht vom Main-Prozess:", message);
      });
    }
  });
</script>

<div class="app">
  <NavBar />
  <main>{@render children()}</main>

  <footer>
    <p>
      visit
      <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a>
      to learn about SvelteKit
    </p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  footer a {
    font-weight: bold;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
