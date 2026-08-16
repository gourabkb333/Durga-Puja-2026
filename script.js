// ============================================================
//  মা আসছে — site behavior
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  setupTopLinks();
  setupVisitorCounter();
  setupCountdown();
  setupDhak();
  setupAdminModal();
});

/* ---------- Top links ---------- */
function setupTopLinks() {
  const ytBtn = document.getElementById('youtubeBtn');
  if (ytBtn) ytBtn.href = SITE_CONFIG.youtube.playlistUrl;
}

/* ---------- Visitor counter (CountAPI — free, no signup) ---------- */
async function setupVisitorCounter() {
  const el = document.getElementById('visitorCount');
  const { namespace, key } = SITE_CONFIG.counter;
  try {
    const res = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
    const data = await res.json();
    el.textContent = data.value.toLocaleString('bn-IN');
  } catch (err) {
    el.textContent = '—';
    console.warn('Visitor counter unavailable:', err);
  }
}

/* ---------- Countdown to Puja ---------- */
function setupCountdown() {
  const el = document.getElementById('daysLeft');
  const target = new Date(SITE_CONFIG.countdownTargetDate + 'T00:00:00');

  function render() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = target - startOfToday;
    const days = Math.ceil(diffMs / 86400000);
    const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    const toBn = n => String(n).split('').map(d => bnDigits[+d] ?? d).join('');

    if (days > 0) {
      el.textContent = toBn(days);
    } else if (days === 0) {
      el.textContent = '🎉';
      document.querySelector('.countdown-label').textContent = 'মা এসে গেছেন!';
    } else {
      el.textContent = toBn(0);
      document.querySelector('.countdown-label').textContent = 'শুভ বিজয়া';
    }
  }
  render();
  // refresh once after midnight rollover checks (cheap, once a minute is plenty)
  setInterval(render, 60000);
}

/* ---------- Dhak button ---------- */
function setupDhak() {
  const btn = document.getElementById('dhakBtn');
  const audio = document.getElementById('dhakAudio');
  const caption = document.getElementById('dhakCaption');
  audio.src = SITE_CONFIG.dhakAudioSrc;

  btn.addEventListener('click', () => {
    const isPlaying = btn.classList.contains('playing');
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      btn.classList.remove('playing');
      btn.setAttribute('aria-pressed', 'false');
      caption.textContent = 'ঢাক বাজাতে ট্যাপ করুন';
    } else {
      audio.currentTime = 0;
      audio.play().catch(() => {
        caption.textContent = 'ঢাকের শব্দ পাওয়া যায়নি — assets/dhak.mp3 যোগ করুন';
      });
      btn.classList.add('playing');
      btn.setAttribute('aria-pressed', 'true');
      caption.textContent = 'ঢাক বাজছে…';
    }
  });

  audio.addEventListener('ended', () => {
    btn.classList.remove('playing');
    btn.setAttribute('aria-pressed', 'false');
    caption.textContent = 'ঢাক বাজাতে ট্যাপ করুন';
  });
}

/* ---------- Admin modal ---------- */
function setupAdminModal() {
  const modal = document.getElementById('adminModal');
  const openBtn = document.getElementById('adminBtn');
  const closeBtn = document.getElementById('adminClose');

  document.getElementById('adminPhoto').src = SITE_CONFIG.admin.photo;
  document.getElementById('adminPhoto').alt = SITE_CONFIG.admin.name;
  document.getElementById('adminName').textContent = SITE_CONFIG.admin.name;
  document.getElementById('adminLinkedin').href = SITE_CONFIG.admin.linkedin;
  document.getElementById('adminManagePlaylist').href = SITE_CONFIG.youtube.studioManageUrl;

  function open() { modal.hidden = false; closeBtn.focus(); }
  function close() { modal.hidden = true; openBtn.focus(); }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
}

/* ---------- YouTube playlist player ---------- */
// Called automatically by the YouTube IFrame API script once it loads.
let ytPlayer = null;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('ytPlayer', {
    height: '0',
    width: '0',
    playerVars: {
      listType: 'playlist',
      list: SITE_CONFIG.youtube.playlistId,
      autoplay: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playBtn = document.getElementById('playBtn');

  prevBtn.addEventListener('click', () => ytPlayer.previousVideo());
  nextBtn.addEventListener('click', () => ytPlayer.nextVideo());
  playBtn.addEventListener('click', () => {
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  });

  updateNowPlaying();
}

function onPlayerStateChange(e) {
  const playIcon = document.getElementById('playIcon');
  if (e.data === YT.PlayerState.PLAYING) {
    playIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'; // pause icon
    updateNowPlaying();
  } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // play icon
  } else if (e.data === YT.PlayerState.CUED) {
    updateNowPlaying();
  }
}

function updateNowPlaying() {
  try {
    const data = ytPlayer.getVideoData();
    document.getElementById('npTitle').textContent = data && data.title ? data.title : 'গান বাজছে';
  } catch (err) {
    // player not fully ready yet
  }
}
