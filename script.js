document.documentElement.classList.add("js");

const tahun = document.getElementById("tahun");
if (tahun) tahun.textContent = new Date().getFullYear();

const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");

function setMenu(open) {
  navbar.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
}

menuBtn.addEventListener("click", () => {
  setMenu(!navbar.classList.contains("open"));
});

document.querySelectorAll("#menu a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
document.addEventListener("click", (e) => {
  if (navbar.classList.contains("open") && !navbar.contains(e.target)) setMenu(false);
});
window.matchMedia("(min-width: 1001px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

const menuLinks = document.querySelectorAll("#menu a");
const sections = document.querySelectorAll("section[id]");

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        menuLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => spy.observe(section));

  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          reveal.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll("section .wrap").forEach((el) => {
    el.classList.add("reveal");
    reveal.observe(el);
  });
}

function updateNavShadow() {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
}
updateNavShadow();
window.addEventListener("scroll", updateNavShadow, { passive: true });

/* ===== Gaya tambahan (disisipkan dari sini supaya cukup mengganti script.js) ===== */
(function () {
  const css = `
.to-top{position:fixed;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9;width:48px;height:48px;display:grid;place-items:center;padding:0;border:0;border-radius:50%;background:var(--yellow);color:var(--onyellow);cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.35);opacity:0;visibility:hidden;transform:translateY(12px)}
.to-top.show{opacity:1;visibility:visible;transform:none}
.to-top:focus-visible{outline-color:#fff}
@media (hover:hover){.to-top:hover{background:#fff}}
@media (prefers-reduced-motion:no-preference){.to-top{transition:opacity .25s ease,transform .25s ease,visibility .25s ease,background-color .25s ease}}

.biz-doc{display:flex;align-items:center;gap:14px;width:100%;max-width:440px;margin:0 0 20px;padding:10px 16px 10px 10px;border:1.5px solid var(--line);border-radius:16px;background:var(--bg);color:inherit;font:inherit;text-align:left;cursor:pointer}
.biz-doc img{flex:0 0 auto;width:52px;height:74px;object-fit:cover;object-position:top;border-radius:8px;border:1px solid var(--line)}
.biz-doc span{display:block;min-width:0;flex:1}
.biz-doc b{display:block;font-size:.98rem;line-height:1.3}
.biz-doc small{display:block;color:var(--muted);font-size:.86rem;line-height:1.4}
.biz-doc i{font-style:normal;font-weight:700;color:var(--ytext)}
.biz-doc:hover{border-color:var(--yellow)}
`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();

/* ===== Tombol panah mengambang untuk kembali ke atas ===== */
(function () {
  const toTop = document.createElement("button");
  toTop.type = "button";
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Kembali ke atas");
  toTop.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(toTop);

  function goTop(e) {
    if (e) e.preventDefault();
    setMenu(false);
    window.scrollTo({ top: 0 });
  }

  function updateToTop() {
    toTop.classList.toggle("show", window.scrollY > 600);
  }

  toTop.addEventListener("click", goTop);
  window.addEventListener("scroll", updateToTop, { passive: true });
  updateToTop();
})();

/* ===== Thumbnail karya: semua mengikuti rasio gambar karya pertama ===== */
const firstThumb = document.querySelector("#karya .work .thumb img");

function syncThumbs() {
  if (!firstThumb || !firstThumb.naturalWidth) return;
  const ratio = firstThumb.naturalWidth + " / " + firstThumb.naturalHeight;
  document.querySelectorAll("#karya .work .thumb").forEach((box) => {
    box.style.aspectRatio = ratio;
  });
}

if (firstThumb) {
  if (firstThumb.complete) syncThumbs();
  else firstThumb.addEventListener("load", syncThumbs);
}

/* ===== Preview gambar: CV dan sertifikat ===== */
const CV_FILE = "CV Fauzan Azmi.jpeg";

const viewer = document.getElementById("viewer");
const vTitle = document.getElementById("viewerTitle");
const vBody = document.getElementById("viewerBody");
const vOpen = document.getElementById("viewerOpen");
const vDl = document.getElementById("viewerDl");
const vDlText = document.getElementById("viewerDlText");

// dlLabel: teks tombol unduh (kosong = sembunyikan). tall: gambar tinggi, bisa digulir
function openViewer(title, src, dlLabel, tall) {
  vTitle.textContent = title;
  vBody.innerHTML = "";
  vBody.classList.toggle("doc", !!dlLabel || !!tall);

  const img = document.createElement("img");
  img.src = src;
  img.alt = title;
  vBody.appendChild(img);

  vOpen.href = src;
  vDl.hidden = !dlLabel;
  if (dlLabel) {
    vDl.href = src;
    vDlText.textContent = dlLabel;
  }

  viewer.showModal();
}

document.querySelectorAll("[data-cv]").forEach((btn) => {
  btn.addEventListener("click", () => openViewer("Curriculum Vitae", CV_FILE, "Unduh CV", false));
});

document.querySelectorAll("[data-cert]").forEach((btn) => {
  btn.addEventListener("click", () =>
    openViewer(btn.dataset.title, btn.dataset.cert, "", btn.hasAttribute("data-tall"))
  );
});

/* ===== Artikel penelitian: PDF dibuka di tab baru (penampil PDF bawaan HP/komputer) ===== */
document.querySelectorAll("[data-pdf]").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.open(btn.dataset.pdf, "_blank", "noopener");
  });
});

viewer.addEventListener("click", (e) => {
  if (e.target === viewer || e.target.closest("[data-close]")) viewer.close();
});

viewer.addEventListener("close", () => {
  vBody.innerHTML = "";
});