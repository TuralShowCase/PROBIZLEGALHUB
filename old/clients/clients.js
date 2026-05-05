/**
 * PROBIZ LEGAL HUB - CLIENTS SHOWCASE PAGE JS (clients.js)
 * Page-specific GSAP animations for the client showcase page.
 * Depends on: gsap, ScrollTrigger (loaded via CDN), general.js (PROBIZ namespace)
 */

"use strict";

// =============================================================================
// 1. HERO ENTRANCE ANIMATION
// Subtle fade-up + stagger for hero text elements on page load
// =============================================================================
PROBIZ.clientsHero = (function () {
  const init = () => {
    if (typeof gsap === "undefined") return;

    // Reduced motion: skip hero entrance animation, content stays visible naturally
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".clients-hero .breadcrumb",
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
    )
      .fromTo(
        ".clients-hero h1",
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1 },
        "-=0.5",
      )
      .fromTo(
        ".clients-hero .lead",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9 },
        "-=0.6",
      );
  };

  return { init };
})();

// =============================================================================
// 3. LOGO GRID STAGGER REVEAL
// Reveals client logos one by one as user scrolls into the grid
// =============================================================================
PROBIZ.logoGridReveal = (function () {
  const init = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    const items = document.querySelectorAll(".client-grid-item");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { y: 50, autoAlpha: 0, scale: 0.95 },
      {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".client-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  };

  return { init };
})();

// =============================================================================
// 4. TESTIMONIAL CARDS STAGGER
// Reveals testimonial cards with a smooth stagger
// =============================================================================
PROBIZ.testimonialsReveal = (function () {
  const init = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    const cards = document.querySelectorAll(".testimonial-card");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { y: 60, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".clients-testimonials-section",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  };

  return { init };
})();

// =============================================================================
// 5. CTA SECTION REVEAL
// =============================================================================
PROBIZ.ctaReveal = (function () {
  const init = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    const cta = document.querySelector(".clients-cta");
    if (!cta) return;

    gsap.fromTo(
      cta.querySelectorAll(".class-to-animate"),
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: cta,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  };

  return { init };
})();

// =============================================================================
// 6. INITIALIZATION
// =============================================================================

/* ==========================================
   PRIMARY SCRIPT INITIALIZATION
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  PROBIZ.clientsHero.init();

  // Skip scroll-triggered animations for reduced motion
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    PROBIZ.logoGridReveal.init();
    PROBIZ.testimonialsReveal.init();
    PROBIZ.ctaReveal.init();
  }
});
