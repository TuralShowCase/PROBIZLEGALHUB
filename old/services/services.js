/**
 * SERVICES PAGE - JavaScript (services.js)
 * GSAP ScrollTrigger staggered reveals for service grid cards
 */

"use strict";

/* ==========================================
   PRIMARY SCRIPT INITIALIZATION
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. STAGGERED SERVICE CARD REVEALS
  // =========================================================================
  if (typeof gsap !== "undefined") {
    // Hero Content Reveal
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

    const serviceCards = document.querySelectorAll(".service-card-gsap");
    if (
      serviceCards.length > 0 &&
      typeof ScrollTrigger !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.from(serviceCards, {
        y: 60,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#services-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }
  }
});
