document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("#fale-conosco-btn");
  const form = document.querySelector("#contact-form");

  if (btn && form) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      form.classList.toggle("visible");
    });
  }
});
