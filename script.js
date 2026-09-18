// Year in footer
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Dark mode toggle
  const toggle = document.getElementById("darkToggle");
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.body.classList.add("light");

  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
    toggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
  });
  if (toggle) toggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";

  // Card tilt
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      card.style.transform = `rotateX(${((y - cy) / cy) * 6}deg) rotateY(${((x - cx) / cx) * 6}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Contact form (demo)
  const form = document.querySelector(".form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks! We'll get back to you shortly.");
    form.reset();
  });
});
