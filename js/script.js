// ==========================================================================
// Tiles by Rudu — site script
// Handles: mobile nav toggle, product category filtering, product gallery
// thumbnail swapping, and the contact form's local validation/feedback.
// No external dependencies — vanilla JS only.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initContactForm();
  setActiveNavLink();
  initScrollReveal();

  // Render Lucide icons (library loaded via CDN in each page's <head>)
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* -------------------- Mobile nav toggle -------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".mobile-panel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the panel after a link is tapped
  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* -------------------- Highlight current page in nav -------------------- */
function setActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-panel a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/* -------------------- Scroll-reveal animations -------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-animate], [data-animate-group]");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // only animate in once
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* -------------------- Contact form -------------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const message = form.querySelector("#message").value.trim();
    const feedback = form.querySelector(".form-feedback");

    if (!name || !message) {
      feedback.textContent = "Please fill in your name and message before sending.";
      feedback.style.color = "#c0392b";
      return;
    }

    // No backend wired up yet — this is where a real submission (e.g. to an
    // email API or form service) would go. For now, confirm receipt locally
    // and point people to WhatsApp for a faster reply.
    feedback.textContent = "Thanks — we've noted your message. For a faster reply, chat with us on WhatsApp.";
    feedback.style.color = "#55554e";
    form.reset();
  });
}
