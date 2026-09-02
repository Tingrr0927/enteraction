document.getElementById("year").textContent = new Date().getFullYear();

const navEl = document.querySelector(".nav");

/* Shrink the header (logo + nav padding) once the page scrolls past the top.
   The tab row lives inside this same header and reflows via CSS (flex-wrap)
   as it shrinks, so no separate height bookkeeping is needed.

   Enter/exit use different thresholds (hysteresis) on purpose: the header
   is sticky and still sits in normal flow, so collapsing it shortens the
   whole document by ~35px. Right near the top, that shortening can clamp
   window.scrollY back down past a single shared threshold, which removes
   "scrolled", regrows the header, restores the scroll height, and lets the
   next scroll frame cross the threshold again — an oscillation that reads
   as the tab row jittering. Only exiting at the very top (scrollY <= 0)
   makes that clamp unable to re-trigger the exit condition. */
let navScrollTicking = false;

function updateNavScrolledState() {
  if (!navEl) return;
  const isScrolled = navEl.classList.contains("scrolled");
  if (!isScrolled && window.scrollY > 24) {
    navEl.classList.add("scrolled");
  } else if (isScrolled && window.scrollY <= 0) {
    navEl.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", () => {
  if (navScrollTicking) return;
  navScrollTicking = true;
  requestAnimationFrame(() => {
    updateNavScrolledState();
    navScrollTicking = false;
  });
});

updateNavScrolledState();

/* Scroll-triggered reveal (only for content outside the tab panels, e.g. the CTA section) */
const scrollRevealEls = document.querySelectorAll(".cta .reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  scrollRevealEls.forEach((el) => revealObserver.observe(el));
} else {
  scrollRevealEls.forEach((el) => el.classList.add("is-visible"));
}

/* Mobile menu — the tab row becomes a dropdown toggled by a hamburger button */
const menuToggle = document.querySelector(".menu-toggle");
const mobileTabNav = document.getElementById("tab-nav");

function closeMobileMenu() {
  if (!menuToggle || !mobileTabNav) return;
  menuToggle.classList.remove("open");
  mobileTabNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && mobileTabNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileTabNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!mobileTabNav.classList.contains("open")) return;
    if (mobileTabNav.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMobileMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
}

/* Tabs — panel content fades in each time its tab is activated */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

function activateTab(tabId, { scroll = true } = {}) {
  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tabId));
  tabPanels.forEach((panel) => {
    const isActive = panel.id === tabId;
    panel.classList.toggle("active", isActive);
    if (!isActive) return;

    const reveals = panel.querySelectorAll(".reveal");
    if (prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    reveals.forEach((el) => el.classList.remove("is-visible"));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reveals.forEach((el) => el.classList.add("is-visible"));
      });
    });
  });

  if (scroll) {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activateTab(btn.dataset.tab);
    closeMobileMenu();
  });
});

activateTab("about", { scroll: false });

document.querySelector(".brand").addEventListener("click", (e) => {
  e.preventDefault();
  activateTab("about");
  closeMobileMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

const translations = {
  zh: {
    "page.title": "ENTERACTION — 敢開口,持續開口",
    "page.description": "ENTERACTION 是友善、低壓力的全英文交流空間,幫助你培養英文口說習慣,慢慢建立表達的自信。",
    "nav.discord": "加入 Discord",
    "tabs.about": "關於我們",
    "tabs.activities": "活動內容",
    "tabs.ability": "能力成長",
    "tabs.guidelines": "群組原則",
    "tabs.membership": "加入方式",
    "hero.title": "敢開口,持續開口",
    "hero.sub": "ENTERACTION 是一個友善、低壓力的全英文交流空間,幫助成員培養英文口說習慣,慢慢建立表達的自信。重點不是英文要完美,而是願意嘗試說出來。",
    "hero.cta": "加入 Discord 社群",
    "about.title": "關於 ENTERACTION",
    "about.p1": "這是一個希望讓大家「敢開口、持續開口」的英文交流空間。我們想建立友善、低壓力的全英文對話環境,幫助成員培養英文口說習慣,慢慢建立表達的自信。",
    "about.p2": "交流時以英文為主;如果不知道如何表達,也可以使用 AI 或翻譯工具協助。重點不是英文要完美,而是願意嘗試說出來。",
    "activities.title": "我們會進行的活動",
    "activities.item1.title": "自由聊天與生活分享",
    "activities.item1.desc": "用英文聊生活大小事,輕鬆自在地開口。",
    "activities.item2.title": "每週主題討論",
    "activities.item2.desc": "每週圍繞一個主題交流想法與觀點。",
    "activities.item3.title": "短講或個人故事分享",
    "activities.item3.desc": "練習用英文表達,分享屬於自己的故事。",
    "activities.item4.title": "英語文化交流",
    "activities.item4.desc": "認識不同文化背景,拓展國際視野。",
    "activities.item5.title": "書籍、遊戲主題活動",
    "activities.item5.desc": "透過英文書籍、遊戲等主題,用不同方式練習口說。",
    "activities.note": "每次活動前,我們會提前提供主題與簡單的會前資料,讓大家有時間準備。",
    "ability.title": "ENTERACTION 如何幫助你成長",
    "ability.subtitle": "ENTERACTION 的每一項活動,都建立在以下成長原則之上:",
    "ability.item1.title": "用自己的步調成長",
    "ability.item1.desc": "不需要完美或立刻開口,依照你自在的步調慢慢累積英文口說的自信。",
    "ability.item2.title": "在實作中練習",
    "ability.item2.desc": "透過自由聊天、每週討論、短講與主題活動培養真正的口說能力,而不是死背文法。",
    "ability.item3.title": "一起成長,不被評價",
    "ability.item3.desc": "不論英文程度如何都歡迎加入,我們用耐心互相支持,而不是糾正或批評。",
    "ability.item4.title": "向夥伴學習",
    "ability.item4.desc": "透過與不同背景的成員交流,累積新的表達方式、文化觀點與自信。",
    "guidelines.title": "群組基本原則",
    "guidelines.item1.title": "互相尊重",
    "guidelines.item1.desc": "不批評或嘲笑他人的英文程度。",
    "guidelines.item2.title": "尊重隱私",
    "guidelines.item2.desc": "分享個人經驗時,請注意彼此的隱私。",
    "guidelines.item3.title": "安全又有趣的氛圍",
    "guidelines.item3.desc": "一起維持安全、自在且有趣的交流氣氛。",
    "membership.title": "加入我們的社群",
    "membership.subtitle": "選擇你最習慣的平台。",
    "membership.discord.title": "Discord",
    "membership.discord.desc": "即時聊天、語音交流,大部分每週活動都在這裡進行。",
    "membership.discord.cta": "加入 Discord",
    "membership.line.title": "LINE",
    "membership.line.desc": "習慣用 LINE 聊天嗎?掃描下方 QR Code 加入我們的社群。",
    "cta.title": "準備好開口了嗎?",
    "cta.body": "無論你的英文程度如何,只要想練習口說、認識新朋友,或對英語文化有興趣,都非常歡迎加入!<br>我們目前仍在規劃活動時間、使用平台及未來主題,之後也會邀請大家一起提供想法。<br>期待和大家一起開口說英文,把英文變成生活的一部分。",
    "footer.rights": "版權所有。",
  },
  en: {
    "page.title": "ENTERACTION — Speak Up, Keep Speaking",
    "page.description": "ENTERACTION is a friendly, low-pressure all-English space to help you build a speaking habit and grow your confidence.",
    "nav.discord": "Join Discord",
    "tabs.about": "About",
    "tabs.activities": "Activities",
    "tabs.ability": "Ability",
    "tabs.guidelines": "Guidelines",
    "tabs.membership": "Membership",
    "hero.title": "Speak Up. Keep Speaking.",
    "hero.sub": "ENTERACTION is a friendly, low-pressure all-English space designed to help you build a real speaking habit and grow your confidence, one conversation at a time. It's not about perfect English — it's about being willing to speak.",
    "hero.cta": "Join Our Discord",
    "about.title": "About ENTERACTION",
    "about.p1": "This is an English-speaking community built around one simple idea: dare to speak, and keep speaking. We're creating a friendly, low-pressure all-English environment to help members build a speaking habit and gradually gain confidence in expressing themselves.",
    "about.p2": "Conversations are held mostly in English — if you're not sure how to say something, feel free to use AI or translation tools for help. What matters isn't perfect English, it's being willing to try.",
    "activities.title": "What We Do",
    "activities.item1.title": "Casual Chats & Life Sharing",
    "activities.item1.desc": "Talk about everyday life in English, in a relaxed and easygoing way.",
    "activities.item2.title": "Weekly Themed Discussions",
    "activities.item2.desc": "Share ideas and perspectives around a different topic each week.",
    "activities.item3.title": "Short Talks & Personal Stories",
    "activities.item3.desc": "Practice expressing yourself in English by sharing your own stories.",
    "activities.item4.title": "Cultural Exchange",
    "activities.item4.desc": "Get to know different cultures and broaden your global perspective.",
    "activities.item5.title": "Books & Games Sessions",
    "activities.item5.desc": "Practice speaking through English books, games, and other themed activities.",
    "activities.note": "Before each session, we'll share the topic and some simple prep materials in advance so everyone has time to get ready.",
    "ability.title": "How ENTERACTION Helps You Grow",
    "ability.subtitle": "Every ENTERACTION activity is built on these growth principles:",
    "ability.item1.title": "Learn at Your Own Pace",
    "ability.item1.desc": "There's no pressure to speak perfectly or immediately — grow your English at whatever pace feels comfortable for you.",
    "ability.item2.title": "Practice by Doing",
    "ability.item2.desc": "Build real speaking confidence through free chats, weekly discussions, short talks, and themed activities — not textbook drills.",
    "ability.item3.title": "Grow Together, No Judgment",
    "ability.item3.desc": "Everyone's English level is welcome here. We support each other with patience instead of correction or criticism.",
    "ability.item4.title": "Learn From Fellow Members",
    "ability.item4.desc": "Pick up new expressions, cultural insights, and confidence by learning alongside members from different backgrounds.",
    "guidelines.title": "Community Guidelines",
    "guidelines.item1.title": "Respect Each Other",
    "guidelines.item1.desc": "No criticizing or mocking anyone's English level.",
    "guidelines.item2.title": "Respect Privacy",
    "guidelines.item2.desc": "Be mindful of privacy when sharing personal experiences.",
    "guidelines.item3.title": "Keep It Safe & Fun",
    "guidelines.item3.desc": "Let's keep the space safe, comfortable, and fun together.",
    "membership.title": "Join Our Community",
    "membership.subtitle": "Pick whichever platform you're most comfortable with.",
    "membership.discord.title": "Discord",
    "membership.discord.desc": "Real-time chat, voice hangouts, and where most of our weekly activities happen.",
    "membership.discord.cta": "Join Discord",
    "membership.line.title": "LINE",
    "membership.line.desc": "Prefer LINE for daily chat? Scan the QR code below to join our group.",
    "cta.title": "Ready to Speak Up?",
    "cta.body": "No matter your English level, if you want to practice speaking, meet new people, or explore English-speaking culture, you're very welcome to join!<br>We're still working out the schedule, platform, and future topics — and we'll invite everyone to help shape them.<br>We can't wait to speak English with you and make it a natural part of everyday life.",
    "footer.rights": "All rights reserved.",
  },
};

const langToggle = document.getElementById("lang-toggle");

function applyLanguage(lang) {
  const dict = translations[lang];
  document.documentElement.lang = lang === "en" ? "en" : "zh-Hant";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = dict[el.getAttribute("data-i18n")];
    if (value !== undefined) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const value = dict[el.getAttribute("data-i18n-html")];
    if (value !== undefined) el.innerHTML = value;
  });

  document.title = dict["page.title"];
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", dict["page.description"]);

  langToggle.textContent = lang === "en" ? "中文" : "EN";
  langToggle.setAttribute("aria-label", lang === "en" ? "切換為中文" : "Switch to English");

  try {
    localStorage.setItem("enteraction-lang", lang);
  } catch (e) {
    /* localStorage unavailable, ignore */
  }
}

langToggle.addEventListener("click", () => {
  const current = document.documentElement.lang === "en" ? "en" : "zh";
  applyLanguage(current === "en" ? "zh" : "en");
});

let initialLang = "en";
try {
  initialLang = localStorage.getItem("enteraction-lang") || "en";
} catch (e) {
  /* localStorage unavailable, default to en */
}
applyLanguage(initialLang);
