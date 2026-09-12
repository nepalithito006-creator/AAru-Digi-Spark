// AAru Digi Spark
// Navigation and animations


document.addEventListener("DOMContentLoaded", () => {

  /* REVEAL ANIMATION */

  const revealElements =
    document.querySelectorAll(".reveal");


  const revealOnScroll = () => {

    revealElements.forEach((element) => {

      const elementTop =
        element.getBoundingClientRect().top;


      if (elementTop < window.innerHeight - 50) {

        element.classList.add("show");

      }

    });

  };


  revealOnScroll();


  window.addEventListener(
    "scroll",
    revealOnScroll
  );


  /* MOBILE MENU */

  const menuButton =
    document.querySelector(".menu");


  const nav =
    document.querySelector("nav");


  if (menuButton && nav) {

    menuButton.addEventListener(
      "click",
      () => {

        nav.classList.toggle("open");

      }
    );


    nav.querySelectorAll("a").forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          nav.classList.remove("open");

        }
      );

    });

  }

});