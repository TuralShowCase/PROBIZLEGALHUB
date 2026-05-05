/**
 * ABOUT PAGE - UNIQUE JAVASCRIPT (about.js)
 * Page-specific GSAP animations. Shared code is in ../common/general.js
 *
 * Animation Architecture:
 * 1. Hero: Staggered fade-up (handled by .animate-fade-up)
 * 2. Manifesto: Image composition soft parallax + text reveal
 * 3. Pillars: ScrollTrigger.batch() for staggered card reveals
 */

"use strict";

// Ensure namespace exists
window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// ABOUT PAGE ANIMATIONS MODULE
// =============================================================================
PROBIZ.aboutAnimations = (function () {
  const init = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      // Graceful fallback: make all elements visible without animation
      document.querySelectorAll(".animate-fade-up").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      document.querySelectorAll(".pillar-card").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      return;
    }

    // Respect reduced motion preferences
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    _animateHero();
    if (!prefersReduced) _animateManifesto();
    _animatePillars();
  };

  // =========================================================================
  // HERO — Staggered fade-up with power3 easing
  // =========================================================================
  function _animateHero() {
    gsap.fromTo(
      ".animate-fade-up",
      { y: 40, autoAlpha: 0 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      },
    );
  }

  // =========================================================================
  // MANIFESTO — Soft parallax on image composition + detail image
  // The composition images drift subtly as user scrolls for depth
  // =========================================================================
  function _animateManifesto() {
    const section = document.querySelector("#manifesto");
    if (!section) return;

    // Soft parallax on the main image
    const mainImg = section.querySelector(".composition-main-img");
    if (mainImg) {
      gsap.to(mainImg, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // Detail image drifts slightly slower (creates depth)
    const detailImg = section.querySelector(".composition-detail-img");
    if (detailImg) {
      gsap.to(detailImg, {
        y: -15,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }
  }

  // =========================================================================
  // PILLARS — ScrollTrigger.batch() for staggered card reveals
  // Each card fades up with a slight stagger for a cascading premium effect
  // =========================================================================
  function _animatePillars() {
    const cards = document.querySelectorAll(".pillar-card");
    if (!cards.length) return;

    // Set initial state via GSAP (prevents flash of unstyled content)
    gsap.set(cards, { autoAlpha: 0, y: 50 });

    ScrollTrigger.batch(cards, {
      start: "top 88%",
      onEnter: (batch) => {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        });
      },
      once: true,
    });
  }

  return { init };
})();

// =============================================================================
// INITIALIZATION
// =============================================================================

/* ==========================================
   PRIMARY SCRIPT INITIALIZATION
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  PROBIZ.aboutAnimations.init();
});
