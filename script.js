// 🌙 Dark Mode Toggle
document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// 🎯 Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// 👋 Greeting in Console
window.onload = () => {
  console.log("Welcome to Aaru Digi Spark!");
};

// 🖼️ Project Card Tilt Effect
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});

// 🔔 Contact Button Interaction
const contactButton = document.querySelector("#contactBtn");
if (contactButton) {
  contactButton.addEventListener("click", () => {
    alert("Thanks for reaching out! I'll get back to you soon.");
  });
}
