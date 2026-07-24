// Pepe · 2017–2025

// Kaydırma ile beliren bölümler
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Yıl dönümü satırı — her 26 Temmuz'da görünür
(() => {
  const now = new Date();
  const isAnniversary = now.getDate() === 26 && now.getMonth() === 6;
  if (!isAnniversary) return;
  const years = now.getFullYear() - 2025;
  if (years < 1) return;
  const el = document.getElementById("anniversary");
  el.textContent = `Bugün tam ${years} yıl oldu. Seni unutmadık, unutmayacağız.`;
  el.hidden = false;
})();

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");

function openLightbox(src, caption, alt) {
  lbImg.src = src;
  lbImg.alt = alt || "";
  lbCap.textContent = caption || "";
  lb.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lb.hidden = true;
  lbImg.src = "";
  document.body.style.overflow = "";
}

document.querySelectorAll("img[data-full]").forEach((img) => {
  img.addEventListener("click", () => {
    const cap = img.closest("figure")?.querySelector("figcaption")?.textContent;
    openLightbox(img.dataset.full, cap, img.alt);
  });
});
lb.addEventListener("click", (e) => {
  if (e.target === lb || e.target === lbImg) closeLightbox();
});
document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lb.hidden) closeLightbox();
});

// Mum
const candle = document.getElementById("candle");
const hint = document.getElementById("candleHint");

function setCandle(lit) {
  candle.classList.toggle("lit", lit);
  candle.setAttribute("aria-pressed", String(lit));
  hint.textContent = lit ? "Mumun yanıyor. İyi ki geldin." : "Pepe için bir mum yak.";
}

candle.addEventListener("click", () => {
  const lit = !candle.classList.contains("lit");
  setCandle(lit);
  try {
    localStorage.setItem("pepe-candle", lit ? new Date().toISOString() : "");
  } catch (_) {}
});

try {
  const last = localStorage.getItem("pepe-candle");
  if (last) {
    // Aynı gün içinde yakılmışsa yanık kalsın
    const sameDay = new Date(last).toDateString() === new Date().toDateString();
    if (sameDay) setCandle(true);
  }
} catch (_) {}
