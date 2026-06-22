/*
 * PERSONNALISE TA PAGE ICI
 * Remplace les textes et les liens ci-dessous.
 * Pour ta photo, ajoute "photo.jpg" dans ce dossier puis utilise :
 * avatar: "./photo.jpg"
 * Pour la vidéo de fond, ajoute "background.mp4" puis utilise :
 * backgroundVideo: "./background.mp4"
 */
const profile = {
  name: "Manon",
  title: "Manon 💕",
  bio: "Découvre mes contenus les plus exclusifs.",
  avatar: "./assets/profile-manon.jpg",
  backgroundVideo: "./assets/background-manon.mp4",
  mymUrl: "https://mym.fans/Lajoliemanon",
  fanvueUrl: "https://www.fanvue.com/lajoliemanon",
  telegramUrl: "https://t.me/+jiagVV79mi4xMDI0",
  socials: [
    {
      name: "Instagram",
      icon: "instagram",
      url: "https://www.instagram.com/lajoliemanonfr_",
    },
  ],
};

const icons = {
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.7" r=".8" fill="currentColor" stroke="none"/></svg>',
};

const $ = (selector) => document.querySelector(selector);
const reduceMotion = false;

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "#";
  } catch {
    return "#";
  }
}

function addCampaignParameters(value) {
  const cleanUrl = safeUrl(value);
  if (cleanUrl === "#") return cleanUrl;

  const url = new URL(cleanUrl);
  const currentParameters = new URLSearchParams(window.location.search);

  for (const [key, parameterValue] of currentParameters) {
    if (key.startsWith("utm_") && !url.searchParams.has(key)) {
      url.searchParams.set(key, parameterValue);
    }
  }

  return url.toString();
}

function renderProfile() {
  const displayName = profile.name.trim() || "Mon univers";
  const firstCharacter = Array.from(displayName)[0]?.toUpperCase() || "♡";

  document.title = `${profile.title || displayName} — Liens officiels`;
  $("#profile-name").textContent = displayName;
  $("#bio").textContent = profile.bio;
  $("#mym-link").href = addCampaignParameters(profile.mymUrl);
  $("#fanvue-link").href = addCampaignParameters(profile.fanvueUrl);
  $("#telegram-link").href = addCampaignParameters(profile.telegramUrl);
  $("#copyright").textContent = `© ${new Date().getFullYear()} ${displayName}`;

  const avatar = $("#avatar");
  const avatarFallback = $("#avatar-fallback");
  avatarFallback.textContent = firstCharacter;

  if (profile.avatar) {
    avatar.src = profile.avatar;
    avatar.alt = `Photo de ${displayName}`;
    avatar.hidden = false;
    avatarFallback.hidden = true;

    avatar.addEventListener(
      "error",
      () => {
        avatar.hidden = true;
        avatarFallback.hidden = false;
      },
      { once: true },
    );
  } else {
    avatar.hidden = true;
    avatarFallback.hidden = false;
  }

  const socialLinks = profile.socials.map((social, index) => {
    const link = document.createElement("a");
    link.className = "social-link";
    link.href = safeUrl(social.url);
    link.target = "_blank";
    link.rel = "me nofollow noreferrer";
    link.title = social.name;
    link.setAttribute("aria-label", social.name);
    link.style.setProperty("--social-index", index);
    link.innerHTML = `${icons[social.icon] || ""}<span>${social.name}</span>`;
    return link;
  });

  $("#socials").replaceChildren(...socialLinks);
}

function setupBackgroundVideo() {
  if (!profile.backgroundVideo) return;

  const video = $("#background-video");
  video.src = profile.backgroundVideo;
  video.defaultMuted = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.controls = false;
  video.poster = "./assets/cover-manon.jpg";
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const markReady = () => {
    document.body.classList.add("video-ready");
    document.body.classList.remove("video-paused");
  };

  const tryPlay = async () => {
    try {
      await video.play();
      markReady();
    } catch {
      document.body.classList.add("video-paused");
    }
  };

  video.addEventListener("loadeddata", markReady, { once: true });
  video.addEventListener("canplay", tryPlay, { once: true });
  video.addEventListener("playing", markReady);
  video.addEventListener("ended", tryPlay);

  video.addEventListener(
    "error",
    () => {
      document.body.classList.remove("video-ready");
    },
    { once: true },
  );

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && video.paused) tryPlay();
  });

  window.addEventListener("pointerdown", tryPlay, { once: true, passive: true });
  video.load();
  tryPlay();
}

function setupPointerEffects() {
  if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const glow = $("#cursor-light");
  const profileCard = $("#profile-card");
  const premiumLinks = document.querySelectorAll(".premium-link");
  let pointerFrame;
  let latestPointer;

  document.addEventListener("pointermove", (event) => {
    latestPointer = event;
    if (pointerFrame) return;

    pointerFrame = window.requestAnimationFrame(() => {
      const pointer = latestPointer;
      const bounds = profileCard.getBoundingClientRect();
      const x = Math.min(Math.max(pointer.clientX - bounds.left, 0), bounds.width);
      const y = Math.min(Math.max(pointer.clientY - bounds.top, 0), bounds.height);
      const rotateY = ((x / bounds.width) - 0.5) * 2.4;
      const rotateX = (0.5 - (y / bounds.height)) * 1.8;

      glow.style.opacity = "1";
      glow.style.left = `${pointer.clientX}px`;
      glow.style.top = `${pointer.clientY}px`;
      profileCard.style.setProperty("--mx", `${x}px`);
      profileCard.style.setProperty("--my", `${y}px`);
      profileCard.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
      profileCard.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
      pointerFrame = null;
    });
  });

  premiumLinks.forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      const bounds = link.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      link.style.setProperty("--lx", `${x}px`);
      link.style.setProperty("--ly", `${y}px`);
    });
  });

  document.addEventListener("pointerleave", () => {
    glow.style.opacity = "0";
    profileCard.style.setProperty("--rx", "0deg");
    profileCard.style.setProperty("--ry", "0deg");
  });
}

function setupConversionMotion() {
  const mymLink = $("#mym-link");
  const platformLinks = document.querySelectorAll(".premium-link");

  if (!mymLink || !mymLink.animate) return;

  platformLinks.forEach((link, index) => {
    link.animate(
      [
        { opacity: 0, transform: "translateY(24px) scale(0.965)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 720,
        delay: 560 + index * 130,
        easing: "cubic-bezier(.16,.84,.22,1)",
        fill: "backwards",
      },
    );
  });

  const attentionPulse = () => {
    mymLink.animate(
      [
        { transform: "translateY(0) scale(1)" },
        { transform: "translateY(-5px) scale(1.022)", offset: 0.38 },
        { transform: "translateY(1px) scale(0.995)", offset: 0.68 },
        { transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 780,
        easing: "cubic-bezier(.2,.8,.2,1)",
      },
    );
    mymLink.classList.remove("attention-hit");
    void mymLink.offsetWidth;
    mymLink.classList.add("attention-hit");
  };

  window.setTimeout(attentionPulse, 1500);
  window.setInterval(attentionPulse, 6800);
}

let toastTimer;

function showToast(message) {
  $("#toast-text").textContent = message;
  $("#toast").classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    $("#toast").classList.remove("is-visible");
  }, 2400);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";
  document.body.append(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();

  if (!copied) {
    throw new Error("La copie automatique n’est pas disponible.");
  }
}

function getShareUrl() {
  return window.location.href;
}

function confirmShareAction(message) {
  const shareButton = $("#share-button");
  showToast(message);
  shareButton.classList.remove("is-success");
  void shareButton.offsetWidth;
  shareButton.classList.add("is-success");
  window.setTimeout(() => shareButton.classList.remove("is-success"), 1400);
}

async function copyPageLink() {
  try {
    await copyToClipboard(getShareUrl());
    confirmShareAction("Lien copié — prêt à être partagé");
    return true;
  } catch {
    showToast("Copie l’adresse de la page pour la partager");
    return false;
  }
}

async function sharePage() {
  const shareData = {
    title: `${profile.title || profile.name} — Liens officiels`,
    text: `Retrouve tous les liens officiels de ${profile.name}.`,
    url: getShareUrl(),
  };
  const preferNativeShare =
    navigator.share &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768);

  if (preferNativeShare) {
    try {
      await navigator.share(shareData);
      confirmShareAction("Page partagée avec succès");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  await copyPageLink();
}

renderProfile();
setupBackgroundVideo();
setupPointerEffects();
setupConversionMotion();
$("#share-button").addEventListener("click", sharePage);
$("#footer-share").addEventListener("click", copyPageLink);

window.requestAnimationFrame(() => {
  document.body.classList.add("is-ready");
});
