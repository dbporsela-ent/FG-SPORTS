/* =========================================================================
   PORSELA LEGOK ENTERTAINMENT — SCRIPT.JS
   Vanilla JS, tanpa dependency berat. Semua data (slide & koleksi foto)
   ada di bagian paling atas file ini — edit di situ saja untuk mengganti
   konten, tidak perlu menyentuh HTML.
   ========================================================================= */

/* ---------------------------------------------------------------------
   1. DATA — ganti path gambar & teks di sini
   --------------------------------------------------------------------- */

// Ganti file .svg placeholder ini dengan foto asli (jpg/png) kapan saja.
// Cukup ubah path-nya, urutan array = urutan slide.
const slides = [
  { image: "images/DSC_0030.JPG", eyebrow: "PORSELA CUP 2026", title: "Event Photography" },
  { image: "images/DSC01.JPG", eyebrow: "MATCH DAY", title: "Sport & Action" },
  { image: "images/DSC_0019.JPG", eyebrow: "AFTER HOURS", title: "Moments" },
];

// Tambah / hapus objek di sini untuk mengubah koleksi Link Photography.
const photoCollections = [
  { image: "images/DSC_0082.JPG", name: "PORSELA CUP", meta: "Photography Collection", href: "link-photography.html" },
  { image: "images/image40.jpg", name: "LATIHAN", meta: "Photography Collection", href: "link-photography.html" },
  { image: "images/DSC_0015.JPG", name: "TROPEO 29 AGS", meta: "Photography Collection", href: "link-photography.html" },
];

/* ---------------------------------------------------------------------
   2. MOBILE HAMBURGER MENU
   --------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  function closeMenu() {
    btn.classList.remove("is-open");
    menu.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    btn.classList.toggle("is-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

/* ---------------------------------------------------------------------
   3. HERO SLIDER — build markup, autoplay, arrows, dots, swipe
   --------------------------------------------------------------------- */
function initSlider() {
  const track = document.getElementById("sliderTrack");
  const dotsWrap = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const slider = document.getElementById("slider");
  if (!track || !slides.length) return;

  let current = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 4500;

  // Build slides
  track.innerHTML = slides
    .map(
      (s, i) => `
      <div class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${slides.length}">
        <img src="${s.image}" alt="${s.title}" loading="${i === 0 ? "eager" : "lazy"}" ${i === 0 ? "" : 'decoding="async"'}>
        <div class="slide-overlay"></div>
        <div class="slide-caption">
          <span class="slide-eyebrow">${s.eyebrow}</span>
          <h2 class="slide-title">${s.title}</h2>
        </div>
      </div>`
    )
    .join("");

  // Build dots
  dotsWrap.innerHTML = slides
    .map(
      (_, i) =>
        `<button class="slider-dot${i === 0 ? " is-active" : ""}" role="tab" aria-label="Ke slide ${i + 1}" aria-selected="${i === 0}"></button>`
    )
    .join("");
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === current);
      d.setAttribute("aria-selected", String(i === current));
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  prevBtn.addEventListener("click", () => { prev(); startAutoplay(); });
  nextBtn.addEventListener("click", () => { next(); startAutoplay(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { goTo(i); startAutoplay(); }));

  // Pause on hover (desktop)
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  // Swipe support (mobile)
  let touchStartX = 0;
  let touchDeltaX = 0;
  const SWIPE_THRESHOLD = 40;

  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      stopAutoplay();
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchmove",
    (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  slider.addEventListener("touchend", () => {
    if (touchDeltaX > SWIPE_THRESHOLD) prev();
    else if (touchDeltaX < -SWIPE_THRESHOLD) next();
    startAutoplay();
  });

  goTo(0);
  startAutoplay();
}

/* ---------------------------------------------------------------------
   4. LINK PHOTOGRAPHY GRID — build cards from data
   --------------------------------------------------------------------- */
function initPhotoGrid() {
  const grid = document.getElementById("photoGrid");
  if (!grid || !photoCollections.length) return;

  grid.innerHTML = photoCollections
    .map(
      (item) => `
      <a class="photo-card" href="${item.href}">
        <div class="photo-card-media">
          <span class="photo-card-tag">PROJECT</span>
          <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" width="900" height="700">
        </div>
        <div class="photo-card-body">
          <span>
            <span class="photo-card-name">${item.name}</span>
            <span class="photo-card-meta">${item.meta}</span>
          </span>
          <span class="photo-card-cta" aria-hidden="true">&#8594;</span>
        </div>
      </a>`
    )
    .join("");
}

/* ---------------------------------------------------------------------
   5. INIT
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSlider();
  initPhotoGrid();
});
