/* ============================================================
   VittaUnic — Odontologia Avançada
   Scripts da landing page
   ============================================================ */

/* ------------------------------------------------------------
   1) CONFIGURAÇÃO CENTRAL — edite aqui os dados de contato
   ------------------------------------------------------------ */
const VITTAUNIC = {
  // WhatsApp em formato internacional, somente números: 55 (Brasil) + DDD + número.
  // Obs.: o "0" de prefixo de operadora não entra em links wa.me (formato E.164).
  // Original informado: wa.me/55048999321847  →  aqui sem o 0: 55 48 99932-1847
  whatsapp: "5548999321847",
  // Mensagem pré-preenchida ao abrir o WhatsApp
  whatsappMsg: "Olá! Gostaria de agendar uma avaliação na VittaUnic com o Dr. Fernando Gonçalves.",
  // Usuário do Instagram (sem o @) — perfil oficial do Dr. Fernando / VittaUnic
  instagram: "drfernando.vittaunic",
  // Endereço exibido no rodapé
  endereco: "Empresarial Vittá — R. Caetano Lummertz, 115, Sala 1102 — Centro, Araranguá/SC, 88900-045",
};

/* ------------------------------------------------------------
   2) Monta os links de redes sociais nos elementos [data-link]
   ------------------------------------------------------------ */
(function buildSocialLinks() {
  const waBase =
    "https://wa.me/" +
    VITTAUNIC.whatsapp +
    "?text=" +
    encodeURIComponent(VITTAUNIC.whatsappMsg);
  const igBase = "https://instagram.com/" + VITTAUNIC.instagram;
  const mapsBase =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(VITTAUNIC.endereco);

  const map = {
    whatsapp: waBase,
    "whatsapp-text": waBase,
    instagram: igBase,
    maps: mapsBase,
    "maps-text": mapsBase,
  };

  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.getAttribute("data-link");
    const href = map[key];
    if (!href) return;
    el.setAttribute("href", href);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // Endereço no rodapé — vira link para o Google Maps
  const addr = document.getElementById("footerAddress");
  if (addr) {
    const a = document.createElement("a");
    a.href = mapsBase;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = VITTAUNIC.endereco;
    addr.textContent = "";
    addr.appendChild(a);
  }
})();

/* ------------------------------------------------------------
   3) Header (sombra) + barra de progresso de scroll
   ------------------------------------------------------------ */
const header = document.getElementById("header");
const progress = document.getElementById("scrollProgress");

const onScroll = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);

  if (progress) {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    progress.style.width = (scrolled * 100).toFixed(2) + "%";
  }
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ------------------------------------------------------------
   4) Menu mobile
   ------------------------------------------------------------ */
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

const closeMenu = () => {
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
};

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

// Fecha o menu ao clicar em um link
nav.querySelectorAll(".nav__link").forEach((link) =>
  link.addEventListener("click", closeMenu)
);

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
  if (
    nav.classList.contains("is-open") &&
    !nav.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ------------------------------------------------------------
   5) Reveal on scroll (IntersectionObserver)
   ------------------------------------------------------------ */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ------------------------------------------------------------
   6) Nav ativa conforme a seção visível
   ------------------------------------------------------------ */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((l) =>
            l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
          );
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ------------------------------------------------------------
   7) Contador animado das estatísticas
   ------------------------------------------------------------ */
const counters = document.querySelectorAll(".stat__num[data-count]");

const formatNumber = (n) => n.toLocaleString("pt-BR");

const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10) || 0;
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatNumber(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && counters.length) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => countObserver.observe(el));
} else {
  counters.forEach((el) => {
    el.textContent = formatNumber(parseInt(el.dataset.count, 10) || 0) + (el.dataset.suffix || "");
  });
}

/* ------------------------------------------------------------
   8) FAQ — accordion acessível
   ------------------------------------------------------------ */
const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
  const btn = item.querySelector(".faq__q");
  const answer = item.querySelector(".faq__a");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    // Fecha todos (modo accordion)
    faqItems.forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      other.querySelector(".faq__a").style.maxHeight = null;
    });

    // Abre o clicado, se estava fechado
    if (!isOpen) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

/* ------------------------------------------------------------
   9) Ano automático no rodapé
   ------------------------------------------------------------ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
