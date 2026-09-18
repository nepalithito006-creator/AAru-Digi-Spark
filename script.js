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

// 👋 Animated Greeting on Page Load
window.onload = () => {
  console.log("Welcome to Aaru Digi Spark!"); // shows in console
  // Optional: alert popup
  // alert("Welcome to Aaru Digi Spark!");
};

// 🖼️ Project Card Hover Effects (JS version)
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseover', () => {
    card.style.transform = "scale(1.05)";
    card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
  });
  card.addEventListener('mouseout', () => {
    card.style.transform = "scale(1)";
    card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  });
});

// 🔔 Contact Button Interaction
const contactButton = document.querySelector("#contact button");
if (contactButton) {
  contactButton.addEventListener("click", () => {
    alert("Thanks for reaching out! I'll get back to you soon.");
  });
}
