// ===============================
// MJ Web Pro - script.js (complet)
// ===============================

if (typeof window.SITE === "undefined") {
  console.error("SITE est undefined : vérifie que content.js est chargé AVANT script.js");
}

// Helpers
const $ = (id) => document.getElementById(id);

function setText(id, value){
  const el = $(id);
  if (el && typeof value !== "undefined") el.textContent = value;
}

function setHref(id, value){
  const el = $(id);
  if (el && value) el.href = value;
}

// Year
const yearEl = $("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Brand + hero
if (window.SITE) {
  setText("brandName", SITE.brand);
  setText("brandName2", SITE.brand);
  setText("brandInline", SITE.brand);
  setText("brandSub", SITE.brandSub);

  setText("headline", SITE.headline);
  setText("subtitle", SITE.subtitle);

  const ctaBtn = $("ctaBtn");
  const ctaBtn2 = $("ctaBtn2");
  if (ctaBtn) { ctaBtn.textContent = SITE.ctaText; ctaBtn.href = SITE.ctaLink; }
  if (ctaBtn2) { ctaBtn2.textContent = SITE.ctaText; ctaBtn2.href = SITE.ctaLink; }

  // Trust
  const trustRow = $("trustRow");
  if (trustRow) {
    trustRow.innerHTML = (SITE.trust || []).map(t => `
      <div class="trust-item">
        <span class="check" aria-hidden="true">✓</span>
        <span>${t}</span>
      </div>
    `).join("");
  }

  // Services sub
  setText("servicesSub", SITE.servicesSub || "");

  // Services cards -> paiement (si tu as paiement.html)
  const servicesGrid = $("servicesGrid");
  if (servicesGrid) {
    servicesGrid.innerHTML = (SITE.services || []).map(s => {
      const url = `paiement.html?service=${encodeURIComponent(s.title)}&price=${encodeURIComponent(s.price || "")}`;
      return `
        <a class="card service-card" href="${url}" data-tag="${(s.tag || "").replace(/"/g,'')}">
          <div class="tag">${s.tag || ""}</div>
          <div class="card-title">${s.title}</div>
          <div class="card-desc">${s.desc || ""}</div>
        </a>
      `;
    }).join("");
  }

  // Process
  const processGrid = $("processGrid");
  if (processGrid) {
    processGrid.innerHTML = (SITE.process || []).map(p => `
      <div class="card process-card">
        <div class="step">${p.step}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.desc}</div>
      </div>
    `).join("");
  }

  // Pricing
  const pricingGrid = $("pricingGrid");
  if (pricingGrid) {
    pricingGrid.innerHTML = (SITE.pricing || []).map(plan => `
      <div class="card price-card">
        <div class="price-title">${plan.title}</div>
        <div class="price-value">€${plan.price}</div>
        <div class="price-sub">${plan.note || ""}</div>
        <ul class="bullets">
          ${(plan.bullets || []).map(b => `
            <li><span class="bcheck" aria-hidden="true">✓</span><span>${b}</span></li>
          `).join("")}
        </ul>
      </div>
    `).join("");
  }

  // Contact (sans téléphone)
  setText("contactTitle", SITE.contact.title);
  setText("contactDesc", SITE.contact.desc);

  setText("contactEmail", SITE.contact.email);
  setHref("contactEmailCard", `mailto:${SITE.contact.email}`);

  setHref("contactInstaCard", SITE.contact.instagram);
}

// -------------------------------
// Menu mobile
// -------------------------------
const burger = $("burger");
const mobileNav = $("mobileNav");

function closeMobile(){
  if (!mobileNav) return;
  mobileNav.style.display = "none";
  burger?.setAttribute("aria-expanded", "false");
}
function toggleMobile(){
  if (!mobileNav) return;
  const open = mobileNav.style.display === "block";
  mobileNav.style.display = open ? "none" : "block";
  burger?.setAttribute("aria-expanded", String(!open));
}
burger?.addEventListener("click", toggleMobile);
mobileNav?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMobile));

// -------------------------------
// Smooth scroll "cinéma"
// -------------------------------
function easeInOutCubic(t){
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
}
function smoothScrollTo(targetY, duration = 760){
  const startY = window.scrollY;
  const diff = targetY - startY;
  const start = performance.now();

  function step(now){
    const t = Math.min(1, (now - start) / duration);
    const eased = easeInOutCubic(t);
    window.scrollTo(0, startY + diff * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();

    const header = document.querySelector(".header");
    const offset = (header?.offsetHeight || 0) + 16;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;

    smoothScrollTo(y, 780);

    if (mobileNav && mobileNav.style.display === "block") closeMobile();
  });
});

// -------------------------------
// Filtres “pills” (optionnel)
// -------------------------------
const pillsRow = $("pillsRow");
if (pillsRow) {
  const pills = Array.from(pillsRow.querySelectorAll(".pill"));
  const cards = Array.from(document.querySelectorAll(".service-card"));

  function setActive(btn){
    pills.forEach(p => p.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
  }

  function applyFilter(tag){
    cards.forEach(c => {
      const ctag = c.getAttribute("data-tag") || "";
      c.style.display = (tag === "all" || ctag === tag) ? "" : "none";
    });
  }

  pills.forEach(btn => {
    btn.addEventListener("click", () => {
      const tag = btn.getAttribute("data-filter") || "all";
      setActive(btn);
      applyFilter(tag);
    });
  });
}