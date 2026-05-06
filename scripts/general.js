/**
 * PROBIZ LEGAL HUB - SHARED JAVASCRIPT FRAMEWORK (general.js)
 * Centralized functionality shared across all pages.
 */

"use strict";

// =============================================================================
// 1. GLOBAL NAMESPACE
// =============================================================================
window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// 2. UI MODULE - Navbar Scroll, Progress Bar, Mobile CTA
// =============================================================================
PROBIZ.ui = (function () {
  const navbar = document.querySelector(".plh-nav");
  const progressBar = document.getElementById("scroll-progress");

  const init = () => {
    if (!navbar) {
      console.warn("PROBIZ UI: Navbar element not found.");
      return;
    }
    _bindScrollEvents();
  };

  const _bindScrollEvents = () => {
    let ticking = false;
    const _handleScroll = () => {
      const scrollY = window.scrollY;

      // Navbar scroll state
      if (scrollY > 50) {
        navbar.classList.add("nav-scrolled");
      } else {
        navbar.classList.remove("nav-scrolled");
      }

      // Scroll progress bar
      if (progressBar) {
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        if (height > 0) {
          const scrolled = (scrollY / height) * 100;
          progressBar.style.transform = `scaleX(${scrolled / 100})`;
        }
      }

      // Mobile CTA visibility
      const mobileCTA = document.querySelector(".mobile-whatsapp-sticky");
      if (mobileCTA) {
        if (scrollY > 50) {
          mobileCTA.classList.add("cta-visible");
        } else {
          mobileCTA.classList.remove("cta-visible");
        }
      }
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            _handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );
  };

  return { init };
})();

// =============================================================================
// 3. MOTION MODULE - Lenis Smooth Scroll, GSAP Setup, Magnetic Buttons
// =============================================================================
PROBIZ.motion = (function () {
  const isMobile = window.innerWidth < 992;

  const init = () => {
    _initLenis();
    _registerGSAP();

    if (!isMobile) {
      _magneticInteractions();
    }
  };

  /**
   * Initialize Lenis Smooth Scrolling (Desktop Only)
   */
  const _initLenis = () => {
    if (typeof Lenis === "undefined" || isMobile) {
      // Fallback for mobile - use native smooth scroll for anchors
      _handleAnchorClicks(null);
      return;
    }

    try {
      const lenis = new Lenis({
        lerp: 0.05,
        wheelMultiplier: 0.9,
        smoothWheel: true,
        wrapper: window,
        content: document.body,
      });

      // Expose globally so other modules can stop/start Lenis (e.g. modal pages)
      window.PROBIZ._lenis = lenis;

      if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
        const lenisRaf = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(lenisRaf);
        gsap.ticker.lagSmoothing(0);
        // Store ref for potential cleanup
        window.PROBIZ._lenisRafCallback = lenisRaf;
      }

      // Handle anchor link clicks with Lenis
      _handleAnchorClicks(lenis);
    } catch (e) {
      console.warn("PROBIZ Motion: Lenis initialization failed.", e);
    }
  };

  /**
   * Handle Anchor Link Clicks (for smooth scroll to footer/sections)
   */
  const _handleAnchorClicks = (lenis) => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        if (lenis) {
          // Use Lenis scrollTo for smooth scrolling
          lenis.scrollTo(target, { offset: 0, duration: 1.2 });
        } else {
          // Fallback for mobile - native smooth scroll
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  };

  /**
   * Register GSAP Plugins
   */
  const _registerGSAP = () => {
    if (typeof gsap === "undefined") {
      console.warn("PROBIZ Motion: GSAP not found.");
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Global defaults — page-specific JS should always set explicit duration/ease
    gsap.defaults({ ease: "power3.out", duration: 1.0 });
  };

  /**
   * Magnetic Button Hover Effect (Desktop Only)
   */
  const _magneticInteractions = () => {
    if (typeof gsap === "undefined") return;

    const buttons = document.querySelectorAll(
      ".btn-accent, .btn-outline-white",
    );
    buttons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
      });
    });
  };

  return { init };
})();

// =============================================================================
// 4. SCROLL REVEALS - Generic fade-up animations
// =============================================================================
PROBIZ.scrollReveals = (function () {
  const init = () => {
    const revealElements = document.querySelectorAll(".class-to-animate");

    // Reduced motion: make visible instantly, skip animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      // Fallback: make elements visible without animation
      revealElements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });
  };

  return { init };
})();

// =============================================================================
// 5. MOBILE MENU MODULE - Offcanvas & Drill-down
// =============================================================================
PROBIZ.mobileMenu = (function () {
  const init = () => {
    const toggleBtn = document.querySelector(".plh-menu-toggle");
    const offcanvasMenu = document.querySelector(".plh-offcanvas-menu");
    const sliderWrapper = document.querySelector(".menu-slider-wrapper");
    const servicesTrigger = document.getElementById("practiceDropdown");
    const backBtn = document.querySelector(".btn-sub-back");
    const navLinks = document.querySelectorAll(
      ".plh-offcanvas-menu .nav-link:not(.dropdown-toggle)",
    );
    const subLinks = document.querySelectorAll(".sub-panel .dropdown-item");

    if (!toggleBtn || !offcanvasMenu) return;

    let isOpen = false;

    // Toggle Offcanvas
    toggleBtn.addEventListener("click", () => {
      isOpen = !isOpen;
      document.body.classList.toggle("menu-open", isOpen);

      if (isOpen) {
        // Lock scroll
        document.body.style.overflow = "hidden";
      } else {
        // Unlock scroll
        document.body.style.overflow = "";

        // Reset slider to main panel if closed
        setTimeout(() => {
          if (sliderWrapper) sliderWrapper.style.transform = "translateX(0)";
        }, 600);
      }
    });

    // Drill-down logic -> Show Sub Panel
    if (servicesTrigger && sliderWrapper) {
      servicesTrigger.addEventListener("click", (e) => {
        // Only act on mobile (where drill-down is expected)
        if (window.innerWidth < 992) {
          e.preventDefault();
          sliderWrapper.style.transform = "translateX(-50%)";
        }
      });
    }

    // Drill-down logic -> Back to Main Panel
    if (backBtn && sliderWrapper) {
      backBtn.addEventListener("click", () => {
        sliderWrapper.style.transform = "translateX(0)";
      });
    }

    // Close menu when clicking a normal link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (isOpen) toggleBtn.click();
      });
    });

    // Close menu when clicking a sub link
    subLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (isOpen) toggleBtn.click();
      });
    });
  };

  return { init };
})();

// =============================================================================
// 6. FAQ ACCORDION MODULE - Premium toggle with smooth animation
// =============================================================================
PROBIZ.faq = (function () {
  const init = () => {
    document.querySelectorAll(".plh-faq").forEach((faqSection) => {
      faqSection.addEventListener("click", (e) => {
        const btn = e.target.closest(".plh-faq-question");
        if (!btn) return;

        const item = btn.closest(".plh-faq-item");
        if (!item) return;

        // Toggle current item (allow multiple open)
        item.classList.toggle("is-open");

        // Update aria-expanded
        const isOpen = item.classList.contains("is-open");
        btn.setAttribute("aria-expanded", isOpen);
      });
    });
  };

  return { init };
})();

// =============================================================================
// 7. INITIALIZATION
// =============================================================================

/* ==========================================
   PRIMARY SCRIPT INITIALIZATION
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
  PROBIZ.i18n.init();
  PROBIZ.ui.init();
  PROBIZ.motion.init();
  PROBIZ.scrollReveals.init();
  PROBIZ.mobileMenu.init();
  PROBIZ.faq.init();
});
