<script lang="ts">
  import { ui } from "$lib/store";

  let reqState = {
    success: false,
    errorMessage: "",
  };

  const sendContactUsEmail = async (event: SubmitEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);
    const payload = {
      from: formData.get("from") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      topic: formData.get("topic") as string,
    };
    fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("contact-us api response", res);

        reqState.success = true;
        setTimeout(() => {
          reqState.success = false;
        }, 3000);
      })
      .finally(() => {
        setTimeout(() => {
          reqState = {
            success: false,
            errorMessage: "",
          };
        }, 3000);
      });
  };
</script>

<dialog open>
  <article>
    <header>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span
        role="button"
        tabindex="0"
        class="close"
        on:click|preventDefault={() => {
          $ui.popup.id = null;
        }}
      />
    </header>
    <form method="POST" on:submit|preventDefault={sendContactUsEmail}>
      <h2>Get in touch</h2>
      <fieldset>
        <select name="topic">
          <option value="sales">Work with me</option>
          <option value="support">Support something I've built</option>
          <option value="connect">Just want to connect</option>
        </select>
      </fieldset>
      <fieldset>
        <input type="email" name="from" placeholder="Your email address" />
      </fieldset>
      <fieldset>
        <input name="subject" placeholder="Subject" />
      </fieldset>
      <fieldset>
        <textarea name="message" placeholder="Your message here" />
      </fieldset>
      <div>
        {#if reqState.success}
          <div class="notice-success">
            <i class="feather-check-circle" /> Sent! You'll receive a response in
            the next couple days.
          </div>
        {:else if reqState.errorMessage}
          <div class="notice-error">
            <i class="feather-alert-triangle" />
            {reqState.errorMessage}
          </div>
        {:else}
          <button class="primary" type="submit">
            <i class="feather-send" /> Send</button
          >
        {/if}
      </div>
    </form>
  </article>
</dialog>

<style lang="scss">
  section {
    @media (min-width: 700px) {
      min-width: 400px;
    }
    @media (max-width: 700px) {
      width: 90vw;
    }
  }
  form {
    --pico-spacing: 0.5rem;

    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  label {
    font-weight: 600;
    padding: 8px 0;
  }
  input:read-only {
    background-color: #f8f8f8;
  }
  textarea {
    resize: vertical;
    min-height: 200px;
  }
  .notice-success {
    color: var(--primary);
  }
  .notice-error {
    color: tomato;
  }
  input,
  textarea,
  select,
  option {
    height: auto;
    padding: calc(0.5 * var(--pico-form-element-spacing-vertical))
      calc(0.5 * var(--pico-form-element-spacing-horizontal));
  }
</style>
