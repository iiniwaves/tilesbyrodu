/* ==========================================================================
   Tiles by Rudu — Cookie Consent
   One shared engine powers: the first-visit banner, the "Manage Preferences"
   modal (injected on any page via a "Cookie Settings" footer link), and the
   standalone cookie-settings.html page. Preferences are stored in
   localStorage — this is a real deployed site, not a sandboxed artifact, so
   localStorage is the correct and standard place for consent state to live.
   ========================================================================== */

(function () {

  const STORAGE_KEY = "tbr-cookie-consent";

  const CATEGORIES = [
    {
      id: "necessary",
      name: "Strictly Necessary",
      description: "Required for the site to work — basic navigation, security, and remembering things like your mobile menu state. These can't be switched off.",
      required: true,
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Helps us understand how visitors use the site (pages viewed, time on site) so we can improve it. No data is sold or shared with advertisers.",
      required: false,
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Used to measure how well our ads and WhatsApp enquiry campaigns are performing, and to avoid showing you repetitive ads.",
      required: false,
    },
  ];

  /* -------------------- Storage helpers -------------------- */

  function getStoredConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(prefs) {
    const payload = Object.assign({}, prefs, {
      necessary: true,
      savedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) — consent simply
      // won't persist between visits, which is an acceptable fallback.
    }
    document.dispatchEvent(
      new CustomEvent("cookieConsentChanged", { detail: payload })
    );
    return payload;
  }

  function defaultPrefs(allOn) {
    const prefs = {};
    CATEGORIES.forEach((cat) => {
      prefs[cat.id] = cat.required ? true : !!allOn;
    });
    return prefs;
  }

  /* -------------------- Banner -------------------- */

  function injectBanner() {
    if (document.querySelector(".cookie-banner")) return;

    const el = document.createElement("div");
    el.className = "cookie-banner";
    el.innerHTML = `
      <div class="cookie-banner-inner">
        <div class="cookie-banner-copy">
          <strong>We use cookies</strong>
          <p>We use cookies to run this site and, with your permission, to understand traffic and measure our WhatsApp enquiry campaigns. Read our <a href="privacy-policy.html">Privacy Policy</a>.</p>
        </div>
        <div class="cookie-banner-actions">
          <button type="button" class="btn btn-outline btn-sm" data-cookie-action="manage">Manage Preferences</button>
          <button type="button" class="btn btn-outline btn-sm" data-cookie-action="reject">Reject Non-Essential</button>
          <button type="button" class="btn btn-primary btn-sm" data-cookie-action="accept">Accept All</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("visible"));

    el.querySelector('[data-cookie-action="accept"]').addEventListener("click", () => {
      saveConsent(defaultPrefs(true));
      hideBanner();
    });
    el.querySelector('[data-cookie-action="reject"]').addEventListener("click", () => {
      saveConsent(defaultPrefs(false));
      hideBanner();
    });
    el.querySelector('[data-cookie-action="manage"]').addEventListener("click", () => {
      openSettings();
    });
  }

  function hideBanner() {
    const el = document.querySelector(".cookie-banner");
    if (!el) return;
    el.classList.remove("visible");
    window.setTimeout(() => el.remove(), 420);
  }

  /* -------------------- Modal -------------------- */

  function injectModal() {
    if (document.querySelector(".cookie-modal")) return;

    const el = document.createElement("div");
    el.className = "cookie-modal";
    el.innerHTML = `
      <div class="cookie-modal-backdrop" data-cookie-action="close"></div>
      <div class="cookie-modal-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title">
        <div class="cookie-modal-head">
          <h3 id="cookie-modal-title">Cookie Preferences</h3>
          <button type="button" class="cookie-modal-close" data-cookie-action="close" aria-label="Close">&times;</button>
        </div>
        <p class="cookie-modal-intro">Choose which categories of cookies you're comfortable with. You can change this any time from the "Cookie Settings" link in the footer.</p>
        <div class="cookie-toggle-list" data-cookie-toggles></div>
        <div class="cookie-modal-actions">
          <button type="button" class="btn btn-outline btn-sm" data-cookie-action="reject-modal">Reject Non-Essential</button>
          <button type="button" class="btn btn-primary btn-sm" data-cookie-action="save-modal">Save Preferences</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);

    renderToggles(el.querySelector("[data-cookie-toggles]"));

    el.querySelectorAll('[data-cookie-action="close"]').forEach((btn) =>
      btn.addEventListener("click", closeSettings)
    );
    el.querySelector('[data-cookie-action="reject-modal"]').addEventListener("click", () => {
      saveConsent(defaultPrefs(false));
      renderToggles(el.querySelector("[data-cookie-toggles]"));
      closeSettings();
      hideBanner();
    });
    el.querySelector('[data-cookie-action="save-modal"]').addEventListener("click", () => {
      const prefs = readToggles(el);
      saveConsent(prefs);
      closeSettings();
      hideBanner();
    });
  }

  function openSettings() {
    injectModal();
    const modal = document.querySelector(".cookie-modal");
    renderToggles(modal.querySelector("[data-cookie-toggles]"));
    requestAnimationFrame(() => modal.classList.add("visible"));
    document.body.style.overflow = "hidden";
  }

  function closeSettings() {
    const modal = document.querySelector(".cookie-modal");
    if (!modal) return;
    modal.classList.remove("visible");
    document.body.style.overflow = "";
  }

  /* -------------------- Toggle rendering (shared by modal + standalone page) -------------------- */

  function renderToggles(container) {
    if (!container) return;
    const saved = getStoredConsent() || defaultPrefs(false);

    container.innerHTML = CATEGORIES.map((cat) => `
      <div class="cookie-toggle-row">
        <div class="cookie-toggle-copy">
          <h4>${cat.name}${cat.required ? ' <span class="cookie-toggle-required">Always Active</span>' : ""}</h4>
          <p>${cat.description}</p>
        </div>
        <label class="cookie-switch">
          <input
            type="checkbox"
            data-cookie-id="${cat.id}"
            ${saved[cat.id] || cat.required ? "checked" : ""}
            ${cat.required ? "disabled" : ""}
          >
          <span class="cookie-switch-track"><span class="cookie-switch-thumb"></span></span>
        </label>
      </div>
    `).join("");
  }

  function readToggles(scope) {
    const prefs = {};
    (scope || document).querySelectorAll("[data-cookie-id]").forEach((input) => {
      prefs[input.dataset.cookieId] = input.checked;
    });
    return prefs;
  }

  /* -------------------- Public API -------------------- */

  window.CookieConsent = {
    categories: CATEGORIES,
    getPreferences: () => getStoredConsent() || defaultPrefs(false),
    hasChoice: () => !!getStoredConsent(),
    save: saveConsent,
    acceptAll: () => saveConsent(defaultPrefs(true)),
    rejectNonEssential: () => saveConsent(defaultPrefs(false)),
    openSettings,
    closeSettings,
    renderToggles,
    readToggles,
  };

  document.addEventListener("DOMContentLoaded", () => {

    // Wire up any "Cookie Settings" links already in the page (footer, etc.)
    document.querySelectorAll(".open-cookie-settings").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        openSettings();
      });
    });

    // Only show the first-visit banner if no choice has been saved yet —
    // and never on the standalone settings page itself, since the person
    // is already exactly where the banner would send them.
    const onSettingsPage = /cookie-settings\.html$/.test(window.location.pathname);
    if (!getStoredConsent() && !onSettingsPage) {
      injectBanner();
    }

  });

})();
