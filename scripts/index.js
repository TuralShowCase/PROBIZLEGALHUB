/**
 * INDEX PAGE - UNIQUE JAVASCRIPT (index.js)
 * Page-specific functionality only. Shared code is in ../common/general.js
 */

"use strict";

// Ensure namespace exists
window.PROBIZ = window.PROBIZ || {};

// =============================================================================
// 1. HERO CAROUSEL MODULE
// =============================================================================
PROBIZ.heroCarousel = (function () {
  let heroSliderInterval;
  let isAnimating = false; // Prevent rapid clicking

  const init = () => {
    const heroSection = document.querySelector(".hero");
    if (!heroSection || typeof gsap === "undefined") return;

    const slides = document.querySelectorAll(".hero-slide");
    const prevBtn = document.querySelector("#prevSlide");
    const nextBtn = document.querySelector("#nextSlide");
    const dots = document.querySelectorAll(".slider-dot");

    if (slides.length === 0) return;

    // Reduced motion: show first slide, skip carousel
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(slides, { autoAlpha: 0 });
      gsap.set(slides[0], { autoAlpha: 1 });
      return;
    }

    let current = 0;
    const total = slides.length;

    const changeSlide = (direction) => {
      if (isAnimating) return; // Stop if already animating
      isAnimating = true;

      const timeline = gsap.timeline({
        onComplete: () => {
          isAnimating = false; // Release lock
        },
      });

      const currentSlide = slides[current];
      const nextIndex =
        direction === "next"
          ? (current + 1) % total
          : (current - 1 + total) % total;
      const nextSlide = slides[nextIndex];

      // SMOOTH "FADE OVER" TRANSITION
      // 1. Ensure next slide is on top (zIndex 2) but transparent
      // 2. Current slide stays visible (zIndex 1)
      // 3. Fade next slide IN. No "dip" to background color.
      gsap.set(currentSlide, { zIndex: 1 });
      gsap.set(nextSlide, { zIndex: 2, autoAlpha: 0 });

      timeline
        .to(nextSlide, {
          autoAlpha: 1,
          duration: 1.5, // Slow, smooth change
          ease: "power2.inOut",
        })
        .set(currentSlide, { zIndex: 0, autoAlpha: 0 }); // Hide old slide after new one is fully visible

      // Animate content inside the new slide
      const content = nextSlide.querySelectorAll("h1, p, .slide-btns");
      if (content.length > 0) {
        timeline.fromTo(
          content,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            duration: 1.0,
            ease: "power2.out",
          },
          "-=1.0", // Start content animation while bg is still fading
        );
      }

      current = nextIndex;

      // Sync pagination dots
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });

      // Announce slide change for screen readers
      const announcer = document.getElementById("heroSlideAnnounce");
      if (announcer) announcer.textContent = `Slayd ${current + 1} / ${total}`;
    };

    // Initialize first slide
    gsap.set(slides, { autoAlpha: 0 });
    gsap.set(slides[0], { autoAlpha: 1 });

    // Auto-play
    heroSliderInterval = setInterval(() => changeSlide("next"), 8000);

    // Pause when tab is not visible (LE-4)

    /* ==========================================
   PRIMARY SCRIPT INITIALIZATION
   ========================================== */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(heroSliderInterval);
      } else {
        heroSliderInterval = setInterval(() => changeSlide("next"), 8000);
      }
    });

    // Controls
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        clearInterval(heroSliderInterval);
        changeSlide("prev");
        heroSliderInterval = setInterval(() => changeSlide("next"), 8000);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        clearInterval(heroSliderInterval);
        changeSlide("next");
        heroSliderInterval = setInterval(() => changeSlide("next"), 8000);
      });
    }

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    heroSection.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    heroSection.addEventListener("touchend", (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      // Only trigger if horizontal swipe dominates and is long enough
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        clearInterval(heroSliderInterval);
        changeSlide(deltaX < 0 ? "next" : "prev");
        heroSliderInterval = setInterval(() => changeSlide("next"), 8000);
      }
    }, { passive: true });

    // Dot click handlers
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetSlide = parseInt(dot.getAttribute("data-slide"));
        if (targetSlide === current || isAnimating) return;

        clearInterval(heroSliderInterval);

        // Animation logic for manual dot jump
        const timeline = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
          },
        });
        isAnimating = true;

        const currentSlide = slides[current];
        const nextSlide = slides[targetSlide];

        gsap.set(currentSlide, { zIndex: 1 });
        gsap.set(nextSlide, { zIndex: 2, autoAlpha: 0 });

        timeline
          .to(nextSlide, { autoAlpha: 1, duration: 1.5, ease: "power2.inOut" })
          .set(currentSlide, { zIndex: 0, autoAlpha: 0 });

        const content = nextSlide.querySelectorAll("h1, p, .slide-btns");
        if (content.length > 0) {
          timeline.fromTo(
            content,
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.1,
              duration: 1.0,
              ease: "power2.out",
            },
            "-=1.0",
          );
        }

        current = targetSlide;
        dots.forEach((d, i) => d.classList.toggle("active", i === current));

        heroSliderInterval = setInterval(() => changeSlide("next"), 6500);
      });
    });
  };

  return { init };
})();

// =============================================================================
// 2. PROTOCOL PINNING MODULE (STACKED CARDS ON SCROLL)
// =============================================================================
PROBIZ.processPinning = (function () {
  const init = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    // Respect reduced motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pinContainer = document.querySelector(".protocol-pin-container");
    const cards = gsap.utils.toArray(".protocol-stack-card");

    if (!pinContainer || cards.length === 0) return;

    // Use matchMedia for robust responsive handling
    let mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
      },
      (context) => {
        let { isMobile } = context.conditions;

        // Clean up any inline transforms from previous resizes/refreshes
        gsap.set(cards, { clearProps: "y,transform", autoAlpha: 1 });

        // Create Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinContainer,
            start: "top top",
            end: isMobile ? "+=600%" : "+=500%",
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          const targetY = i * (isMobile ? 15 : 20);
          const scale = 1 - i * 0.03;

          tl.fromTo(
            card,
            {
              y: () => window.innerHeight * (isMobile ? 1.1 : 1.5),
            },
            {
              y: targetY,
              scale: scale,
              duration: 1,
              ease: "power2.out",
            },
            i === 0 ? 0 : "-=0.2",
          );
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      },
    );
  };

  return { init };
})();

// =============================================================================
// 3. TESTIMONIALS MARQUEE MODULE
// =============================================================================
PROBIZ.testimonials = (function () {
  const init = () => {
    if (typeof gsap === "undefined") return;

    const tracks = document.querySelectorAll(".marquee-track-right");

    tracks.forEach((track) => {
      const originalContent = track.innerHTML;
      track.innerHTML =
        originalContent + originalContent + originalContent + originalContent; // 4x total

      // Hybrid Approach: Calculate the exact width of ONE set (1/4th of total)
      // and pass it to CSS. This allows the CSS track to be 'width: auto' (not huge)
      // while still animating the correct distance.
      const setMarqueeDistance = () => {
        const totalWidth = track.scrollWidth;
        const oneSetWidth = totalWidth / 4;
        track.style.setProperty("--marquee-end", `-${oneSetWidth}px`);
      };

      // Calculate immediately and on resize (throttled)
      setMarqueeDistance();
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setMarqueeDistance, 150);
      });
    });
  };

  return { init };
})();

// =============================================================================
// 4. ATTORNEY CARD REVEALS MODULE
// =============================================================================
PROBIZ.attorneyReveals = (function () {
  const init = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    // Reduced motion: show cards instantly
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const attorneyCards = document.querySelectorAll(".attorney-card-gsap");
    if (attorneyCards.length === 0) return;

    gsap.from(attorneyCards, {
      y: 50,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: attorneyCards[0],
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  };

  return { init };
})();

// =============================================================================
// 5. INITIALIZATION
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  PROBIZ.heroCarousel.init();
  PROBIZ.processPinning.init();
  PROBIZ.testimonials.init();
  PROBIZ.attorneyReveals.init();
});

// Refresh ScrollTrigger on window load to ensure accurate calculations
// specially for pinned elements with images
window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
});
