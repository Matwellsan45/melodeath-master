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

document.querySelector("#bandForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    band: document.querySelector("#band").value,
    album: document.querySelector("#album").value,
    year: document.querySelector("#year").value,
    genre: document.querySelector("#genre").value,
    country: document.querySelector("#country").value,
    label: document.querySelector("#label").value,
    format: document.querySelector("#format").value
  };

  const resposta = await fetch("/api/bandas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const dados = await resposta.json();
  alert(`Banda cadastrada: ${dados.band}`);
});
