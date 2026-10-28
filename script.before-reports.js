
/* =====================================================
   WASTE2WORTH — INTERACTION & MOTION ENGINE
   Add below your existing JavaScript.
===================================================== */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. Reveal sections as they enter the viewport
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("is-visible"));
  }

  // 2. Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mainNav.classList.toggle("is-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("is-open");
        menuToggle.focus();
      }
    });
  }

  // 3. Cursor-following ambient glow
  const cursorAura = document.querySelector(".cursor-aura");

  if (cursorAura && !reduceMotion &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let pointerFrame = null;

    window.addEventListener("pointermove", event => {
      if (pointerFrame) cancelAnimationFrame(pointerFrame);

      pointerFrame = requestAnimationFrame(() => {
        cursorAura.style.setProperty("--mx", `${event.clientX}px`);
        cursorAura.style.setProperty("--my", `${event.clientY}px`);
        pointerFrame = null;
      });
    }, { passive: true });
  }

  // 4. Reading progress indicator
  const progress = document.getElementById("scrollProgress");
  let scrollFrame = null;

  function updateScrollProgress() {
    if (!progress) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;

    progress.style.width = `${Math.min(100, percentage)}%`;
  }

  window.addEventListener("scroll", () => {
    if (scrollFrame) return;

    scrollFrame = requestAnimationFrame(() => {
      updateScrollProgress();
      scrollFrame = null;
    });
  }, { passive: true });

  updateScrollProgress();

  // 5. Animated description character counter
  const description = document.getElementById("description");
  const descriptionCount = document.getElementById("descriptionCount");

  function updateDescriptionCount() {
    if (!description || !descriptionCount) return;

    descriptionCount.textContent =
      `${description.value.length} / 1000`;
  }

  if (description && descriptionCount) {
    description.addEventListener("input", updateDescriptionCount);
    updateDescriptionCount();
  }

  // 6. Subtle magnetic-style movement on large-screen buttons
  if (!reduceMotion &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(button => {
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        button.style.transform =
          `translate(${x * 0.055}px, ${y * 0.055}px)`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });
  }

  // 7. Animate dashboard values when their numbers change
  // Your original script remains responsible for the actual values.
  const metricIds = [
    "totalReports",
    "resolvedReports",
    "wasteTotal",
    "recyclingReports"
  ];

  function animateMetric(element) {
    if (!element || reduceMotion) return;

    const raw = element.textContent.trim();
    const target = Number(raw.replace(/,/g, ""));

    if (!Number.isFinite(target)) return;

    if (element._metricTimer) {
      cancelAnimationFrame(element._metricTimer);
    }

    const start = performance.now();
    const duration = 550;

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      element.textContent = Number.isInteger(target)
        ? Math.round(current).toLocaleString()
        : current.toLocaleString(undefined, {
            maximumFractionDigits: 1
          });

      if (progress < 1) {
        element._metricTimer = requestAnimationFrame(frame);
      } else {
        element.textContent = raw;
        element._metricTimer = null;
      }
    }

    element._metricTimer = requestAnimationFrame(frame);
  }

  if ("MutationObserver" in window && !reduceMotion) {
    metricIds.forEach(id => {
      const element = document.getElementById(id);
      if (!element) return;

      const metricObserver = new MutationObserver(() => {
        animateMetric(element);
      });

      metricObserver.observe(element, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }

  // 8. Smooth anchor navigation for browsers supporting it
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", targetId);
    });
  });

  console.log("Waste2Worth interactive experience initialized.");
})();

/* ==========================================
   WASTE2WORTH — EXTRA INTERACTIONS
   ADD TO THE BOTTOM OF script.js
========================================== */

(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // A. Reveal existing sections as you scroll
  const revealTargets = document.querySelectorAll(
    "section, .report-card, .stat-card, .impact-card, .feature-card"
  );

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(element => {
      // Avoid hiding elements that already have their own reveal behavior.
      if (!element.classList.contains("reveal")) {
        element.classList.add("reveal");
      }
      observer.observe(element);
    });
  }

  // B. Create a gentle 3D tilt on cards
  const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (canHover && !reducedMotion) {
    document.querySelectorAll(
      ".report-card, .stat-card, .impact-card, .feature-card"
    ).forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;

        card.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // C. Make selected buttons gently follow the cursor
  if (canHover && !reducedMotion) {
    document.querySelectorAll(
      ".hero button, .hero a, .magnetic"
    ).forEach(button => {
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);

        button.style.translate =
          `${dx * 0.06}px ${dy * 0.06}px`;
      });

      button.addEventListener("pointerleave", () => {
        button.style.translate = "";
      });
    });
  }

  // D. Add a soft ripple when clicking buttons
  document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", event => {
      if (reducedMotion) return;

      const rect = button.getBoundingClientRect();
      const ripple = document.createElement("span");

      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size / 2}px;
        top: ${event.clientY - rect.top - size / 2}px;
        border-radius: 50%;
        background: rgba(100, 255, 160, 0.25);
        transform: scale(0);
        animation: w2w-ripple 550ms ease-out forwards;
        pointer-events: none;
      `;

      if (getComputedStyle(button).position === "static") {
        button.style.position = "relative";
      }

      button.style.overflow = "hidden";
      button.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 600);
    });
  });

  // E. Add the ripple animation once
  if (!document.getElementById("w2wMotionStyles")) {
    const style = document.createElement("style");
    style.id = "w2wMotionStyles";
    style.textContent = `
      @keyframes w2w-ripple {
        to {
          transform: scale(2.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  console.log("Waste2Worth premium effects enabled.");
})();
const SUPABASE_PUBLISHABLE_KEY =
  "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";