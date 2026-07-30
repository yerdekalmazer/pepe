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

// Toplam mum sayısı
// Sunucu ya da veritabanı yok; sayı ücretsiz bir sayaç servisinde (Abacus) tutuluyor.
// Servise ulaşılamazsa satır hiç görünmez, mum yine normal çalışır.
const COUNTER_BASE = "https://abacus.jasoncameron.dev";
const COUNTER_PATH = "pepe-tahayerdekalmazer-com/anit-mum";
const countLine = document.getElementById("candleCount");
const countNum = countLine.querySelector("b");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const today = () => new Date().toISOString().slice(0, 10);
const formatCount = (n) => n.toLocaleString("tr-TR");

let total = null;

async function counterCall(action) {
  const res = await fetch(`${COUNTER_BASE}/${action}/${COUNTER_PATH}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`sayaç ${res.status}`);
  const data = await res.json();
  if (typeof data.value !== "number") throw new Error("beklenmeyen yanıt");
  return data.value;
}

function showTotal(value, { countUp = false } = {}) {
  if (typeof value !== "number" || value < 0) return;
  const from = countUp && !reducedMotion ? 0 : value;
  total = value;

  if (value === 0) return; // henüz kimse yakmadıysa satır durmasın
  countLine.hidden = false;
  requestAnimationFrame(() => countLine.classList.add("is-visible"));

  if (from === value) {
    countNum.textContent = formatCount(value);
    return;
  }
  // Kısa sayma animasyonu
  const started = performance.now();
  const tick = (now) => {
    const p = Math.min((now - started) / 900, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    countNum.textContent = formatCount(Math.round(from + (value - from) * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function popPlusOne() {
  if (reducedMotion) return;
  const pop = document.createElement("span");
  pop.className = "candle-pop";
  pop.textContent = "+1";
  pop.setAttribute("aria-hidden", "true");
  candle.appendChild(pop);
  pop.addEventListener("animationend", () => pop.remove());
}

// Sayfa açılırken güncel toplamı oku
counterCall("get").then((v) => showTotal(v, { countUp: true })).catch(() => {});

candle.addEventListener("click", () => {
  const lit = !candle.classList.contains("lit");
  setCandle(lit);
  try {
    localStorage.setItem("pepe-candle", lit ? new Date().toISOString() : "");
  } catch (_) {}

  if (!lit) return; // söndürmek toplamı azaltmaz, yanan mum yanmıştır

  // Aynı ziyaretçi günde bir kez sayılır
  let counted = null;
  try {
    counted = localStorage.getItem("pepe-candle-counted");
  } catch (_) {}
  if (counted === today()) return;
  try {
    localStorage.setItem("pepe-candle-counted", today());
  } catch (_) {}

  popPlusOne();
  if (total !== null) showTotal(total + 1); // beklemeden göster
  counterCall("hit").then((v) => showTotal(v)).catch(() => {});
});

try {
  const last = localStorage.getItem("pepe-candle");
  if (last) {
    // Aynı gün içinde yakılmışsa yanık kalsın
    const sameDay = new Date(last).toDateString() === new Date().toDateString();
    if (sameDay) setCandle(true);
  }
} catch (_) {}
