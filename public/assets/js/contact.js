document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.value,
      email: form.email.value,
      message: form.msg.value,
    };

    try {
      const res = await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed request");

      form.reset();
      alert("✅ Thanks! Your message was sent.");
    } catch (err) {
      console.error(err);
      alert("❌ Sorry, there was a problem sending your message.");
    }
  });
});
