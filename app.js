/* ─────────────────────────────────────────────
   NARRATIVE — Interview Media Site
   Vanilla JS (no frameworks)
   ───────────────────────────────────────────── */

// ── Interview Data (loaded from JSON) ──
let INTERVIEWS = [];

// ── Reference Data ──
const REFERENCES = [
  {
    id: "R-001",
    title: "タイトル（仮）",
    source: "著者 / メディア名",
    excerpt: "このリファレンスがプロジェクトに与えた影響についての短いメモ。",
    url: "https://example.com"
  },
  {
    id: "R-002",
    title: "タイトル（仮）",
    source: "著者 / メディア名",
    excerpt: "このリファレンスがプロジェクトに与えた影響についての短いメモ。",
    url: "https://example.com"
  },
  {
    id: "R-003",
    title: "タイトル（仮）",
    source: "著者 / メディア名",
    excerpt: "このリファレンスがプロジェクトに与えた影響についての短いメモ。",
    url: "https://example.com"
  },
  {
    id: "R-004",
    title: "タイトル（仮）",
    source: "著者 / メディア名",
    excerpt: "このリファレンスがプロジェクトに与えた影響についての短いメモ。",
    url: "https://example.com"
  },
  {
    id: "R-005",
    title: "タイトル（仮）",
    source: "著者 / メディア名",
    excerpt: "このリファレンスがプロジェクトに与えた影響についての短いメモ。",
    url: "https://example.com"
  },
  {
    id: "R-006",
    title: "タイトル（仮）",
    source: "著者 / メディア名",
    excerpt: "このリファレンスがプロジェクトに与えた影響についての短いメモ。",
    url: "https://example.com"
  },
];

// ── Utility: Generate gradient background for placeholder thumbnails ──
function generateGradient(index) {
  const hues = [
    [195, 210], [200, 220], [190, 215], [205, 225], [198, 212],
    [192, 218], [202, 208], [196, 222], [188, 214], [204, 216],
  ];
  const [h1, h2] = hues[index % hues.length];
  return `linear-gradient(180deg, hsl(${h1}, 85%, 60%) 0%, hsl(${h2}, 90%, 55%) 100%)`;
}

// ── Simple Hash Router ──
function navigate(path) {
  window.location.hash = path;
}

function getRoute() {
  return window.location.hash || "#/";
}

// ── SVG Icons ──
const ICONS = {
  chevronLeft: '<svg width="9" height="16" viewBox="0 0 9 16" fill="none"><path d="M8 1L1.5 8L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowUp: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M8 3L3 8M8 3L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external: '<svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M4.5 2H2.5C2.22386 2 2 2.22386 2 2.5V9.5C2 9.77614 2.22386 10 2.5 10H9.5C9.77614 10 10 9.77614 10 9.5V7.5M7 2H10V5M10 2L5.5 6.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  book: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 2.5C1.5 2.5 3 1.5 5 1.5C7 1.5 7 2.5 7 2.5V12C7 12 6.5 11.5 5 11.5C3.5 11.5 1.5 12 1.5 12V2.5Z" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 2.5C12.5 2.5 11 1.5 9 1.5C7 1.5 7 2.5 7 2.5V12C7 12 7.5 11.5 9 11.5C10.5 11.5 12.5 12 12.5 12V2.5Z" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

// ── Emoji Cursor ──
function initEmojiCursor() {
  const W = 48, H = 48;
  const cx = 24, cy = 30;
  const fontSize = 40;
  const angle = -22 * Math.PI / 180;

  const tipDist = fontSize * 0.47;
  const hotX = Math.round(cx - Math.sin(-angle) * tipDist);
  const hotY = Math.round(cy - Math.cos(-angle) * tipDist);

  function drawEmoji(scale) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\u{1F446}", 0, 0);
    ctx.restore();
    return canvas.toDataURL("image/png");
  }

  const url1x = drawEmoji(1);
  const url2x = drawEmoji(2);

  const style = document.createElement("style");
  style.id = "emoji-cursor-style";
  style.textContent = `
    *, *::before, *::after {
      cursor: image-set(url("${url1x}") 1x, url("${url2x}") 2x) ${hotX} ${hotY}, auto !important;
    }
  `;
  document.head.appendChild(style);
}

// ── Live Timestamp Footer ──
function formatTimestamp() {
  const now = new Date();
  const offsetMin = -now.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const absMin = Math.abs(offsetMin);
  const offsetH = Math.floor(absMin / 60);
  const offsetM = absMin % 60;
  const tzLabel = offsetM === 0
    ? `UTC${sign}${offsetH}`
    : `UTC${sign}${offsetH}:${String(offsetM).padStart(2, "0")}`;

  const Y  = now.getFullYear();
  const Mo = String(now.getMonth() + 1).padStart(2, "0");
  const D  = String(now.getDate()).padStart(2, "0");
  const h  = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const s  = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${Y}${Mo}${D}_${h}${mi}${s}.${ms}_${tzLabel}`;
}

function initLiveFooter() {
  const el = document.getElementById("footer-timestamp");
  if (!el) return;
  const tick = () => {
    el.textContent = `\u00A9 ${formatTimestamp()}  NARRATIVE.JP`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── FLIP Sort Animation ──
function sortWithFLIP(newSort) {
  const grid = document.querySelector(".card-grid");
  if (!grid) {
    currentSort = newSort;
    renderHomePage();
    return;
  }

  // Step 1: First — 現在の全カード位置を記録
  const cards = [...grid.querySelectorAll(".card[data-id]")];
  const firstRects = new Map();
  cards.forEach(card => {
    firstRects.set(card.dataset.id, card.getBoundingClientRect());
  });

  // Step 2: Last — 新しいソート順にDOMを並び替え
  currentSort = newSort;
  const sorted = getSortedInterviews();
  sorted.forEach(interview => {
    const card = grid.querySelector(`.card[data-id="${interview.id}"]`);
    if (card) {
      // animate-in を外してアニメーション干渉を防ぐ
      card.classList.remove("animate-in");
      card.style.animationDelay = "";
      grid.appendChild(card);
    }
  });

  // Step 3: Invert — 各カードに「元位置へ戻す」逆transform を瞬時適用
  cards.forEach(card => {
    const first = firstRects.get(card.dataset.id);
    if (!first) return;
    const last = card.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    card.style.transition = "none";
    card.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  // Step 4: Play — 全カード同時に新位置へスライド
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cards.forEach(card => {
        card.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.transform = "";
        card.addEventListener("transitionend", () => {
          card.style.transition = "";
          card.style.transform = "";
        }, { once: true });
      });
    });
  });
}

// ── Sort Button (floating) ──
// #sort-float は styled <select>。タップで直接ネイティブピッカーが開く。
function initScrollToTop() {
  const picker = document.getElementById("sort-float");
  if (!picker) return;

  picker.addEventListener("change", (e) => {
    const newSort = e.target.value;
    const route = getRoute();
    if (!route.startsWith("#/interview/") && route !== "#/about" && route !== "#/contact") {
      sortWithFLIP(newSort);
    } else {
      currentSort = newSort;
    }
  });
}

// ── 統合スクロール方向ハンドラ
// scroll-top ボタンと view-switcher を同じ挙動で制御する
function initScrollBehavior() {
  const switcher = document.getElementById("view-switcher");

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const scrollingDown  = currentScrollY > lastScrollY;
      const nearTop        = currentScrollY < 60;
      const nearBottom     = currentScrollY + window.innerHeight >= document.documentElement.scrollHeight - 80;

      // ── View Switcher（ホームページ表示中のみ）──
      if (switcher && switcher.classList.contains("visible")) {
        if (nearTop) {
          switcher.classList.remove("hidden");
        } else {
          switcher.classList.toggle("hidden", scrollingDown || nearBottom);
        }
      }

      // ── Sort Float（view-switcher と全く同じ挙動）──
      const sortFloat = document.getElementById("sort-float");
      if (sortFloat && sortFloat.classList.contains("visible")) {
        if (nearTop) {
          sortFloat.classList.remove("hidden");
        } else {
          sortFloat.classList.toggle("hidden", scrollingDown || nearBottom);
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });
  }, { passive: true });
}

// ── Magnetic Hover Effect ──
// カーソルが近づくとアイコンが少しカーソルに吸い寄せられるエフェクト
function initMagneticHover(el, { radius = 140, strength = 0.35 } = {}) {
  if (!el) return;

  // 現在値と目標値（遅延補間でふわっと動かす）
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;
  let animating = false;

  const animate = () => {
    // Lerp（線形補間）で滑らかに追従
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;

    el.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;

    // 目標値にほぼ到達したら停止
    if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
      currentX = targetX;
      currentY = targetY;
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
      animating = false;
      return;
    }
    rafId = requestAnimationFrame(animate);
  };

  const startAnim = () => {
    if (!animating) {
      animating = true;
      rafId = requestAnimationFrame(animate);
    }
  };

  const onMouseMove = (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < radius) {
      // 近いほど強く引き寄せる（距離0→最大、radius→0）
      const falloff = 1 - dist / radius;
      targetX = dx * strength * falloff;
      targetY = dy * strength * falloff;
      startAnim();
    } else if (targetX !== 0 || targetY !== 0) {
      targetX = 0;
      targetY = 0;
      startAnim();
    }
  };

  const onMouseLeave = () => {
    targetX = 0;
    targetY = 0;
    startAnim();
  };

  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("mouseleave", onMouseLeave);
}

// ── Render: Interview Card ──
// ── View State (Portrait / Pickup) ──
let currentView = "portrait"; // "portrait" | "pickup"

/**
 * 各インタビューのサムネイル画像パスを返す。
 * 画像は images/{id}-portrait.jpg, images/{id}-pickup.jpg の命名規則（どちらも縦型3/4）。
 * 画像が存在しない場合は renderCard 側で onerror フォールバック。
 */
function getThumbSrc(interview, view) {
  // データ側で明示指定されていればそれを優先
  if (view === "pickup" && interview.pickup) return interview.pickup;
  if (view === "portrait" && interview.portrait) return interview.portrait;
  // デフォルト: 命名規則ベース
  return `images/${interview.id}-${view}.jpg`;
}

function renderCard(interview, index) {
  const card = document.createElement("div");
  card.className = "card animate-in";
  card.style.animationDelay = `${Math.min(index * 30, 300)}ms`;
  card.dataset.id = interview.id;
  card.setAttribute("role", "article");
  card.addEventListener("click", () => navigate(`/interview/${interview.id}`));

  const thumbSrc = getThumbSrc(interview, currentView);
  const gradient = generateGradient(index);

  card.innerHTML = `
    <div class="card-thumb-wrapper">
      <div class="card-thumb" style="background: ${gradient}">
        <img
          class="card-thumb-img"
          src="${thumbSrc}"
          alt="${interview.alias}"
          loading="lazy"
          onerror="this.style.display='none'"
        />
      </div>
      <span class="card-id">${interview.id}</span>
      <span class="card-external">${ICONS.external}</span>
    </div>
    <div class="card-body">
      <p class="card-excerpt">${interview.excerpt}</p>
      <div class="card-meta">
        <span class="card-meta-item">${interview.alias}</span>
        <span class="card-meta-item">${interview.age}歳</span>
        <span class="card-meta-item">${interview.occupation}</span>
      </div>
    </div>
    <div class="card-action">
      <button class="card-action-btn">
        ${ICONS.book}
        Read Interview
      </button>
    </div>
  `;

  const actionBtn = card.querySelector(".card-action-btn");
  actionBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(`/interview/${interview.id}`);
  });

  return card;
}

// ── Reference Card ──
function renderReferenceCard(ref, index) {
  const card = document.createElement("div");
  card.className = "card animate-in";
  card.style.animationDelay = `${Math.min(index * 30, 300)}ms`;
  card.setAttribute("role", "article");
  card.style.cursor = "pointer";
  card.addEventListener("click", () => window.open(ref.url, "_blank", "noopener"));

  const gradient = generateGradient(index);

  card.innerHTML = `
    <div class="card-thumb-wrapper">
      <div class="card-thumb" style="background: ${gradient}"></div>
      <span class="card-id">${ref.id}</span>
      <span class="card-external">${ICONS.external}</span>
    </div>
    <div class="card-body">
      <p class="card-excerpt">${ref.title}</p>
      <div class="card-meta">
        <span class="card-meta-item">${ref.source}</span>
      </div>
    </div>
    <div class="card-action">
      <button class="card-action-btn">
        ${ICONS.external}
        Open Link
      </button>
    </div>
  `;

  const actionBtn = card.querySelector(".card-action-btn");
  actionBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.open(ref.url, "_blank", "noopener");
  });

  return card;
}

// ── Page: Home ──
// ── Sort State ──
let currentSort = ""; // デフォルト：並び替えなし（元の掲載順）

function getSortedInterviews() {
  const list = [...INTERVIEWS];
  if (currentSort === "newest") {
    // ID降順（N-025 → N-001）
    list.sort((a, b) => b.id.localeCompare(a.id));
  } else if (currentSort === "oldest") {
    // ID昇順（N-001 → N-025）
    list.sort((a, b) => a.id.localeCompare(b.id));
  } else if (currentSort === "name") {
    list.sort((a, b) => a.alias.localeCompare(b.alias, "ja"));
  }
  return list;
}

// ── Hero: 都市名をタイムゾーンから取得 ──
function getCityFromTimezone() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Asia/Tokyo"
  const city = tz.split("/").pop().replace(/_/g, " ");
  return city.toUpperCase();
}

// ── Hero: 日付フォーマット "TUESDAY, APRIL 14" ──
function formatHeroDate(now) {
  const day  = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const month = now.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const date  = now.getDate();
  return `${day}, ${month} ${date}`;
}

// ── Hero: 時刻フォーマット "23:13:04" ──
function formatHeroTime(now) {
  const h  = String(now.getHours()).padStart(2, "0");
  const m  = String(now.getMinutes()).padStart(2, "0");
  const s  = String(now.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

let heroTimerID = null;

function renderHomePage() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  if (heroTimerID) { clearInterval(heroTimerID); heroTimerID = null; }

  const sorted = getSortedInterviews();
  const city = getCityFromTimezone();

  // ── Hero Section ──
  const hero = document.createElement("div");
  hero.className = "hero";
  const isDark = document.documentElement.classList.contains("dark");
  hero.innerHTML = `
    <p class="hero-title">NARRATIVE</p>
    <p class="hero-date" id="hero-date"></p>
    <p class="hero-time" id="hero-time"></p>
    <div class="theme-toggle-wrap">
      <button
        class="theme-toggle ${isDark ? "is-on" : ""}"
        id="theme-toggle"
        role="switch"
        aria-checked="${isDark}"
        aria-label="ダークモード切替"
      ><span class="theme-toggle-thumb"></span></button>
    </div>
  `;
  app.appendChild(hero);

  // 毎秒更新
  const updateHero = () => {
    const now = new Date();
    const dateEl = document.getElementById("hero-date");
    const timeEl = document.getElementById("hero-time");
    if (dateEl) dateEl.textContent = formatHeroDate(now);
    if (timeEl) timeEl.textContent = `${city}, ${formatHeroTime(now)}`;
  };
  updateHero();
  heroTimerID = setInterval(updateHero, 1000);

  // Count badge
  const grid = document.createElement("div");
  grid.className = "card-grid";
  sorted.forEach((interview, idx) => {
    grid.appendChild(renderCard(interview, idx));
  });
  app.appendChild(grid);
}

// ── Page: Detail ──
function renderDetailPage(id) {
  const interview = INTERVIEWS.find(i => i.id === id);
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (!interview) {
    app.innerHTML = `
      <div class="detail-container">
        <button class="detail-back" id="detail-back-btn">${ICONS.chevronLeft} Back</button>
        <p>Interview not found.</p>
      </div>
    `;
    document.getElementById("detail-back-btn").addEventListener("click", () => navigate("/"));
    return;
  }

  const index = INTERVIEWS.indexOf(interview);

  const container = document.createElement("div");
  container.className = "detail-container animate-in";

  const contentHtml = interview.content.map(block => {
    if (block.type === "image") {
      const caption = block.caption ? `<figcaption class="detail-content-caption">${block.caption}</figcaption>` : "";
      return `<figure class="detail-content-figure"><img class="detail-content-img" src="${block.src}" alt="${block.caption || ""}" loading="lazy" />${caption}</figure>`;
    }
    if (block.type === "question") {
      return `<p class="question">── ${block.text}</p>`;
    }
    const text = block.text ?? block;
    return `<p class="${String(text).startsWith("──") ? "question" : ""}">${text}</p>`;
  }).join("");

  const tagsHtml = interview.tags.map(tag =>
    `<span class="detail-tag">${tag}</span>`
  ).join("");

  container.innerHTML = `
    <button class="detail-back" id="detail-back-btn">${ICONS.chevronLeft} NARRATIVE</button>

    <div class="detail-hero">
      <div class="detail-hero-inner" style="background: ${generateGradient(index)}">
        <img
          class="detail-hero-img"
          src="${getThumbSrc(interview, 'portrait')}"
          alt="${interview.alias}"
          onerror="this.style.display='none'"
        />
      </div>
    </div>

    <div class="detail-id">${interview.id}</div>
    <h1 class="detail-headline">${interview.excerpt}</h1>

    <div class="detail-profile">
      <div class="detail-profile-avatar" style="background: ${generateGradient(index)}">
        ${interview.alias.charAt(0)}
      </div>
      <div class="detail-profile-info">
        <span class="detail-profile-name">${interview.alias}</span>
        <span class="detail-profile-meta">${interview.age}歳 / ${interview.occupation}</span>
      </div>
    </div>

    <div class="detail-tags">${tagsHtml}</div>

    <div class="detail-content">${contentHtml}</div>
    ${interview.credit ? `<p class="detail-credit">${interview.credit}</p>` : ""}
  `;

  app.appendChild(container);

  document.getElementById("detail-back-btn").addEventListener("click", () => navigate("/"));
  window.scrollTo(0, 0);
}

// ── Page: Shop ──
function renderShopPage() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.classList.add("shop-page");

  const container = document.createElement("div");
  container.className = "shop-soon animate-in";
  container.innerHTML = `<span>Soon🏗️</span>`;
  app.appendChild(container);


}

// ── Page: About ──
function renderAboutPage() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const occupationCount = new Set(INTERVIEWS.map(i => i.occupation)).size;
  const minAge = Math.min(...INTERVIEWS.map(i => i.age));
  const maxAge = Math.max(...INTERVIEWS.map(i => i.age));

  const container = document.createElement("div");
  container.className = "about-container animate-in";

  container.innerHTML = `
    <div class="about-body">
      <h2 class="about-section-title">WHAT IS NARRATIVE?</h2>
      <p>
        電車で隣に座っている人も、<br class="br-sp"/>いつも行くコンビニの店員も、<br class="br-pc"/><br class="br-sp"/>運転席で黙っているタクシー運転手も。
      </p>
      <p>
      　私たちにはそれぞれの生い立ちがあり、<br class="br-sp"/>今日を生きています。
      </p>
      <p>
        子どもの頃になにを見て、昨日なにを考えて、<br class="br-pc"/><br class="br-sp"/>明日なにをしようとしているのか。<br class="br-pc"/><br class="br-sp"/>インタビューを通して「誰か」である誰かの<br class="br-sp"/>人生を記録するメディアです。
      </p>

      <div class="about-section-divider">📮</div>
      <h2 class="about-section-title">CONTACT</h2>
      <p>
        NARRATIVEではインタビューを<br class="br-pc"/><br class="br-sp"/>受けて下さる方を募集しています。<br class="br-sp"/>自薦・他薦は問いません。<br class="br-pc"/><br class="br-sp"/>こちらまでお問い合わせください。
      </p>
      <a href="mailto:hello@narrative.jp" style="color: var(--color-accent); text-decoration: underline; font-size: 18px;">
        hello@narrative.jp
      </a>

      <div class="about-section-divider">🤹‍♂️</div>
      <h2 class="about-section-title">INSPO</h2>
      <p>
        本プロジェクトを始めるきっかけになった<br class="br-pc"/><br class="br-sp"/>作品・メディア・書籍・授業などです。<br class="br-pc"/><br class="br-sp"/>これらは語ることの意味、<br class="br-sp"/>記録することの価値、編集することの楽しさを<br class="br-pc"/><br class="br-sp"/>教えてくれたものたちです。
      </p>
    </div>
  `;

  container.style.paddingBottom = "0";
  app.appendChild(container);

  // Reference card-grid — about-container の外に置いてホームと同じスタイルを保持
  const refGrid = document.createElement("div");
  refGrid.className = "card-grid";
  refGrid.style.paddingTop = "var(--spacing-md)";
  REFERENCES.forEach((ref, idx) => {
    refGrid.appendChild(renderReferenceCard(ref, idx));
  });
  app.appendChild(refGrid);
  window.scrollTo(0, 0);
}

// ── Router ──
// ── ページ遷移: blur + fade ──
function transitionPage(renderFn) {
  const app = document.getElementById("app");

  // 初回レンダリング（コンテンツなし）はそのまま描画
  if (!app.children.length) {
    renderFn();
    return;
  }

  // 退場: blur + fade out
  app.classList.add("page-exit");

  setTimeout(() => {
    app.classList.remove("page-exit");
    // 入場開始状態: blur をセット
    app.style.filter = "blur(10px)";
    // 新しいコンテンツを描画
    renderFn();
    // 2フレーム後に transition を有効化して blur を解除
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        app.classList.add("page-entering");
        app.style.filter = "";
        app.addEventListener("transitionend", () => {
          app.classList.remove("page-entering");
        }, { once: true });
      });
    });
  }, 230);
}

function handleRoute() {
  if (heroTimerID) { clearInterval(heroTimerID); heroTimerID = null; }

  // フッターをデフォルトで表示に戻す
  const footer = document.querySelector(".footer");
  if (footer) footer.style.display = "";

  // shop-page クラスをリセット
  document.getElementById("app").classList.remove("shop-page");

  const route = getRoute();
  const isHome = !route.startsWith("#/interview/") && route !== "#/about" && route !== "#/contact" && route !== "#/shop";

  transitionPage(() => {
    if (route.startsWith("#/interview/")) {
      const id = route.replace("#/interview/", "");
      renderDetailPage(id);
    } else if (route === "#/about") {
      renderAboutPage();
    } else if (route === "#/shop") {
      renderShopPage();
    } else {
      renderHomePage();
    }
  });

  // View Switcher の表示制御（ホームのみ表示）
  const viewSwitcher = document.getElementById("view-switcher");
  if (viewSwitcher) {
    viewSwitcher.classList.toggle("visible", isHome);
  }

  // Sort Float の表示制御（view-switcher と同じ: ホームのみ表示）
  const sortFloat = document.getElementById("sort-float");
  if (sortFloat) {
    sortFloat.classList.toggle("visible", isHome);
    if (!isHome) sortFloat.classList.remove("hidden");
  }

  // Navbar メニューのステータス表示
  const navbarMenu = document.getElementById("navbar-menu");
  if (navbarMenu) {
    if (route === "#/about") {
      navbarMenu.value = "about";
    } else if (route === "#/shop") {
      navbarMenu.value = "shop";
    } else {
      navbarMenu.selectedIndex = 0; // "NARRATIVE"
    }
  }
}

// ── Init ──
document.addEventListener("DOMContentLoaded", async () => {
  // ── インタビューデータをJSONから読み込む ──
  try {
    const res = await fetch("data/interviews.json");
    const data = await res.json();
    INTERVIEWS = data.items.filter(item => item.published !== false);
  } catch (e) {
    console.error("インタビューデータの読み込みに失敗しました:", e);
  }

  const navbarMenu = document.getElementById("navbar-menu");
  if (navbarMenu) {
    navbarMenu.addEventListener("change", (e) => {
      const value = e.target.value;
      if (value === "home") {
        navigate("/");
        window.scrollTo(0, 0);
      } else if (value === "about") {
        navigate("/about");
      } else if (value === "contact") {
        window.location.href = "mailto:hello@narrative.jp";
      } else if (value === "shop") {
        navigate("/shop");
      }
    });
  }

  // Navbar count label
  const navbarCountLabel = document.getElementById("navbar-count-label");
  if (navbarCountLabel) {
    navbarCountLabel.textContent = `${INTERVIEWS.length} Interviews`;
  }

  // 中央アイコン：ダークモード/ライトモード切り替え
  // navbar-icon: ダークモード機能を解除（トップページへ戻す）
  document.getElementById("navbar-icon").addEventListener("click", () => {
    navigate("/");
    window.scrollTo(0, 0);
  });

  // Theme Toggle（ヒーロー内トグル）- delegateでDOMが入れ替わっても動作
  document.getElementById("app").addEventListener("click", (e) => {
    const btn = e.target.closest("#theme-toggle");
    if (!btn) return;
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    btn.classList.toggle("is-on", isDark);
    btn.setAttribute("aria-checked", isDark);
    try { localStorage.setItem("theme", isDark ? "dark" : "light"); } catch (_) {}
  });

  // View Switcher (Portrait / Pickup)
  const viewSwitcher = document.getElementById("view-switcher");
  if (viewSwitcher) {
    viewSwitcher.querySelectorAll(".view-switcher-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        if (view === currentView) return;
        currentView = view;

        // ボタンのアクティブ状態更新
        viewSwitcher.querySelectorAll(".view-switcher-btn").forEach((b) => {
          const active = b.dataset.view === view;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        // インジケーター位置をdata属性で制御
        viewSwitcher.dataset.view = view;

        // ホーム画面表示中なら画像srcだけ差し替え（再描画なし）
        const route = getRoute();
        if (!route.startsWith("#/interview/") && route !== "#/about" && route !== "#/contact") {
          document.querySelectorAll(".card[data-id]").forEach(card => {
            const interview = INTERVIEWS.find(i => i.id === card.dataset.id);
            if (!interview) return;
            const img = card.querySelector(".card-thumb-img");
            if (!img) return;
            // クロスフェード: 新画像を上に重ねてフェードイン → 完了後に差し替え
            const newSrc = getThumbSrc(interview, view);
            const thumbDiv = card.querySelector(".card-thumb");
            if (!thumbDiv) return;
            const overlay = document.createElement("img");
            overlay.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;opacity:0;animation:none;transition:opacity 0.35s ease;";
            thumbDiv.appendChild(overlay);
            overlay.onload = () => {
              overlay.style.opacity = "1";
              setTimeout(() => {
                img.src = newSrc;
                overlay.remove();
              }, 370);
            };
            overlay.onerror = () => overlay.remove();
            overlay.src = newSrc;
          });
        }
      });
    });
  }

  // Init features
  initEmojiCursor();
  initLiveFooter();
  initScrollToTop();
  initScrollBehavior();
  // マウスポインターを持つデバイス（非タッチ）のみ magnetic hover を有効化
  if (window.matchMedia("(pointer: fine)").matches) {
    initMagneticHover(document.getElementById("navbar-icon"), { radius: 140, strength: 0.35 });
  }

  // 画像保存抑止
  document.addEventListener("contextmenu", e => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });
  document.addEventListener("dragstart", e => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  // Route
  handleRoute();
  window.addEventListener("hashchange", handleRoute);
});
