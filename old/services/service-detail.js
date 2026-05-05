/**
 * SERVICE DETAIL PAGE - JavaScript (service-detail.js)
 * GSAP fade-up reveals for content and sidebar elements
 */

"use strict";

/* ==========================================
   PRIMARY SCRIPT INITIALIZATION
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== "undefined") {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Hero text reveal
    gsap.fromTo(
      ".animate-fade-up",
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      },
    );

    // Content paragraphs and lists reveal (skip for reduced motion)
    if (!prefersReduced) {
      const contentElements = document.querySelectorAll(
        ".service-content .class-to-animate",
      );
      contentElements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Sidebar reveal
      const sidebar = document.querySelector(".service-sidebar");
      if (sidebar) {
        gsap.fromTo(
          sidebar,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            delay: 0.3,
            scrollTrigger: {
              trigger: sidebar,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }
  }
});
