// ==UserScript==
// @name         Bilibili 增强进度条
// @name:zh-CN   Bilibili 增强进度条
// @name:en      Bilibili 增强进度条
// @namespace    https://github.com/codertesla/bilibili-enhanced-progress-bar
// @version      0.2.7
// @description  B 站视频暂停时显示进度条，可选永久显示；默认渲染官方蓝自绘进度条，支持缓冲进度、全屏和网页全屏。
// @description:zh-CN B 站视频暂停时显示进度条，可选永久显示；默认渲染官方蓝自绘进度条，支持缓冲进度、全屏和网页全屏。
// @description:en Show a subtle Bilibili-style progress bar when paused, with optional always-on display, buffered progress, fullscreen support.
// @author       codertesla
// @icon         https://static.hdslb.com/images/favicon.ico
// @homepageURL  https://github.com/codertesla/bilibili-enhanced-progress-bar
// @supportURL   https://github.com/codertesla/bilibili-enhanced-progress-bar/issues
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/cheese/play/*
// @match        https://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/blackboard/*
// @match        https://www.bilibili.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    alwaysShowKey: "biliBarAlwaysShow",
    refreshMs: 1000,
  };

  const SELECTORS = {
    video: [
      ".bpx-player-video-wrap video",
      ".bilibili-player-video video",
      "#bilibili-player video",
      "video",
    ].join(","),
    player: [
      ".bpx-player-container",
      ".bilibili-player",
      "#bilibili-player",
      ".bpx-player-primary-area",
      ".player-wrap",
    ].join(","),
  };

  const state = {
    alwaysShow: Boolean(GM_getValue(CONFIG.alwaysShowKey, false)),
    video: null,
    player: null,
    customBar: null,
    customHost: null,
    raf: 0,
    menuCmdId: null,
  };

  const style = document.createElement("style");
  style.textContent = `
    .bbp-custom-host {
      position: relative !important;
    }

    .bbp-custom-bar {
      --bbp-height: 2px;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2147483647;
      height: var(--bbp-height);
      opacity: 0;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.15);
      transition: opacity 150ms ease;
    }

    .bbp-custom-bar.is-visible {
      opacity: 0.88;
    }

    .bbp-custom-buffered,
    .bbp-custom-played {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 0%;
      transform-origin: left center;
    }

    .bbp-custom-buffered {
      background: rgba(255, 255, 255, 0.24);
    }

    .bbp-custom-played {
      background: #37a6cf;
      box-shadow: 0 0 5px rgba(55, 166, 207, 0.24);
    }

    .bbp-custom-bar::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      height: 1px;
      background: rgba(0, 0, 0, 0.18);
    }

    .bbp-custom-bar.is-fullscreen {
      position: fixed;
      bottom: env(safe-area-inset-bottom, 0);
    }
  `;
  document.documentElement.appendChild(style);

  registerMenus();
  observePage();
  bindCurrentVideo();

  function registerMenus() {
    if (state.menuCmdId) GM_unregisterMenuCommand(state.menuCmdId);
    const label = state.alwaysShow ? "✓ 永久显示进度条" : "○ 仅暂停时显示进度条";
    state.menuCmdId = GM_registerMenuCommand(label, () => {
      state.alwaysShow = !state.alwaysShow;
      GM_setValue(CONFIG.alwaysShowKey, state.alwaysShow);
      updateVisibility();
      registerMenus();
    });
  }

  function observePage() {
    const observer = new MutationObserver(() => bindCurrentVideo());
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("fullscreenchange", () => {
      moveCustomBarToBestHost();
      updateVisibility();
      updateProgress();
    }, true);

    document.addEventListener("webkitfullscreenchange", () => {
      moveCustomBarToBestHost();
      updateVisibility();
      updateProgress();
    }, true);
  }

  function bindCurrentVideo() {
    const video = document.querySelector(SELECTORS.video);
    if (!video || video === state.video) return;

    cleanupCurrentVideo();
    state.video = video;
    state.player = findPlayer(video);

    video.addEventListener("play", updateVisibility, true);
    video.addEventListener("pause", updateVisibility, true);
    video.addEventListener("loadedmetadata", updateProgress, true);
    video.addEventListener("progress", updateProgress, true);
    video.addEventListener("timeupdate", scheduleProgress, true);
    video.addEventListener("durationchange", updateProgress, true);

    ensureCustomBar();

    updateVisibility();
    updateProgress();
  }

  function cleanupCurrentVideo() {
    if (!state.video) return;

    state.video.removeEventListener("play", updateVisibility, true);
    state.video.removeEventListener("pause", updateVisibility, true);
    state.video.removeEventListener("loadedmetadata", updateProgress, true);
    state.video.removeEventListener("progress", updateProgress, true);
    state.video.removeEventListener("timeupdate", scheduleProgress, true);
    state.video.removeEventListener("durationchange", updateProgress, true);

    if (state.customBar) {
      state.customBar.remove();
      state.customBar = null;
    }
    if (state.customHost) {
      state.customHost.classList.remove("bbp-custom-host");
      state.customHost = null;
    }

    cancelAnimationFrame(state.raf);
  }

  function findPlayer(video) {
    return video.closest(SELECTORS.player) || video.parentElement || document.body;
  }

  function shouldShow() {
    if (!state.video) return false;
    return state.alwaysShow || state.video.paused || state.video.ended;
  }

  function updateVisibility() {
    const visible = shouldShow();

    ensureCustomBar();
    if (state.customBar) {
      state.customBar.classList.toggle("is-visible", visible);
      state.customBar.classList.toggle("is-fullscreen", isFullscreenLike());
    }

    scheduleProgress();
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function isFullscreenLike() {
    if (fullscreenElement()) return true;
    if (!state.player) return false;

    const rect = state.player.getBoundingClientRect();
    return rect.width >= window.innerWidth * 0.94 && rect.height >= window.innerHeight * 0.82;
  }

  function currentCustomHost() {
    const full = fullscreenElement();
    if (full && full.contains(state.video)) return full;
    if (full) return full;
    return state.player || state.video.parentElement || document.body;
  }

  function moveCustomBarToBestHost() {
    const host = currentCustomHost();
    if (!host || !state.customBar) return;

    if (state.customHost && state.customHost !== host) {
      state.customHost.classList.remove("bbp-custom-host");
    }

    if (state.customBar.parentElement !== host) {
      host.appendChild(state.customBar);
    }

    host.classList.add("bbp-custom-host");
    state.customHost = host;
  }

  function ensureCustomBar() {
    if (!state.player && !state.video) return;

    if (!state.customBar || !state.customBar.isConnected) {
      const bar = document.createElement("div");
      bar.className = "bbp-custom-bar";
      bar.setAttribute("aria-hidden", "true");
      bar.innerHTML = `
        <div class="bbp-custom-buffered"></div>
        <div class="bbp-custom-played"></div>
      `;
      state.customBar = bar;
    }

    moveCustomBarToBestHost();
  }

  function scheduleProgress() {
    if (state.raf) return;
    state.raf = requestAnimationFrame(() => {
      state.raf = 0;
      updateProgress();
    });
  }

  function updateProgress() {
    if (!state.video) return;
    ensureCustomBar();
    if (!state.customBar) return;

    const duration = Number.isFinite(state.video.duration) ? state.video.duration : 0;
    const played = duration > 0 ? clamp((state.video.currentTime / duration) * 100, 0, 100) : 0;
    const buffered = duration > 0 ? bufferedPercent(state.video, duration) : 0;

    const playedEl = state.customBar.querySelector(".bbp-custom-played");
    const bufferedEl = state.customBar.querySelector(".bbp-custom-buffered");
    if (playedEl) playedEl.style.width = `${played}%`;
    if (bufferedEl) bufferedEl.style.width = `${Math.max(buffered, played)}%`;
  }

  function bufferedPercent(video, duration) {
    if (!video.buffered || video.buffered.length === 0) return 0;

    let end = 0;
    for (let i = 0; i < video.buffered.length; i += 1) {
      const start = video.buffered.start(i);
      const rangeEnd = video.buffered.end(i);
      if (video.currentTime >= start && video.currentTime <= rangeEnd) {
        return clamp((rangeEnd / duration) * 100, 0, 100);
      }
      end = Math.max(end, rangeEnd);
    }

    return clamp((end / duration) * 100, 0, 100);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  window.setInterval(() => {
    bindCurrentVideo();
    moveCustomBarToBestHost();
    updateVisibility();
    updateProgress();
  }, CONFIG.refreshMs);
})();
