// =====================================
// OG Developer Website - script.js
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("OG Developer Website Loaded!");

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // Button click animation
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {
        button.addEventListener("click", function () {

            this.style.transform = "scale(0.95)";

            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 150);

        });
    });

    // Card hover animation
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-8px)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
        });

    });

});
