<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

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
    fetch("/contact", {
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
      <a href="/" class="close" on:click|preventDefault={() => goto("/")} />
    </header>
    <section>
      <form method="POST" on:submit|preventDefault={sendContactUsEmail}>
        <h2>Get in contact</h2>
        <fieldset>
          <label for="topic">What is the nature of your enquiry?</label>
          <select name="topic">
            <option value="feedback">Thoughts or comments</option>
            <option value="support">Need help with something</option>
            <option value="sales">Let's connect</option>
          </select>
        </fieldset>
        <fieldset>
          <label for="from">Your email</label>
          <input type="email" name="from" placeholder="Your email address" />account
        </fieldset>
        <fieldset>
          <label for="subject">Subject</label>
          <input name="subject" placeholder="What are you enquiring about?" />
        </fieldset>
        <fieldset>
          <label for="message">Message</label>
          <textarea name="message" placeholder="Add any details here" />
        </fieldset>
        <div>
          {#if reqState.success}
            <div class="notice-success">
              <i class="feather-check-circle" /> Sent! You'll receive a response
              in the next couple days.
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
    </section>
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
  }
  .notice-success {
    color: var(--primary);
  }
  .notice-error {
    color: tomato;
  }
</style>
