// Simple script for responsive navbar toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.createElement("div");
    menuToggle.textContent = "☰";
    menuToggle.classList.add("menu-toggle");

    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav-links");

    navbar.insertBefore(menuToggle, navLinks);

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });
});
