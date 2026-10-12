<script lang="ts">
  // Where the Remry Pro Payment Link sends buyers: /remry/thanks?session_id=…
  // The page is prerendered like the rest of the site; the key comes from /api/remry/license,
  // which builds it from the paid invoice the same way the webhook does, so it matches the email.
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";

  type License =
    | { ok: true; key: string; name: string; maskedEmail: string; expires: string }
    | { ok: false };

  const REMRY_REPO = "https://github.com/remry-ai/remry";

  let state: "loading" | "ready" | "missing" = "loading";
  let license: Extract<License, { ok: true }> | null = null;
  let copied = false;

  onMount(async () => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      state = "missing";
      return;
    }
    try {
      const res = await fetch(`/api/remry/license?session_id=${encodeURIComponent(sessionId)}`);
      const body = (await res.json()) as License;
      if (body.ok) {
        license = body;
        state = "ready";
      } else {
        state = "missing";
      }
    } catch {
      state = "missing";
    }
  });

  const copyKey = async () => {
    if (!license) return;
    await navigator.clipboard.writeText(license.key);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };
</script>

<svelte:head>
  <title>Thanks for buying Remry Pro</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<article>
  <header>
    <h2>Thanks for buying Remry Pro</h2>
  </header>

  {#if state === "loading"}
    <p aria-busy="true">Fetching your license key…</p>
  {:else if state === "ready" && license}
    <p>
      Here's your license key, {license.name}. It's good through
      <strong>{license.expires}</strong>, and we've also emailed it to
      {license.maskedEmail}.
    </p>
    <textarea readonly rows="5" class="key" on:focus={(e) => e.currentTarget.select()}
      >{license.key}</textarea
    >
    <button on:click={copyKey}>{copied ? "Copied" : "Copy key"}</button>

    <h3>Activate it</h3>
    <ul>
      <li>
        In Remry, open the notebook menu (the chevron beside the notebook name), choose
        <strong>License</strong> and paste the key.
      </li>
      <li>Or ask Claude to run <code>license.activate</code> with the key.</li>
    </ul>
    <p>
      When your subscription renews, a new key arrives by email. The key is checked on your
      computer; Remry never sends it anywhere.
    </p>
  {:else}
    <p>
      Your payment went through, but we couldn't show your key here. Check your email: it's on
      its way there, usually within a few minutes.
    </p>
    <p>
      Nothing after half an hour? Get in touch through the <a href={resolve("/contact")}>contact form</a>
      or <a href="{REMRY_REPO}/issues">open an issue</a>.
    </p>
  {/if}

  <footer>
    Need help installing Remry? See <a href={REMRY_REPO}>github.com/remry-ai/remry</a>.
  </footer>
</article>

<style lang="scss">
  .key {
    font-family: monospace;
    font-size: 0.8rem;
    word-break: break-all;
  }
</style>
