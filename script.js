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

/* ---------- Visitor counter (Abacus, with automatic fallback) ---------- */
async function setupVisitorCounter() {
  const el = document.getElementById('visitorCount');
  const { namespace, key } = SITE_CONFIG.counter;

  // Primary: Abacus — free, no signup, widely used and reliable
  try {
    const res = await fetch(`https://abacus.jasoncameron.dev/hit/${namespace}/${key}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    el.textContent = Number(data.value).toLocaleString('bn-IN');
    return;
  } catch (err) {
    console.warn('Primary visitor counter (Abacus) failed, trying fallback:', err);
  }

  // Fallback: countapi.mileshilliard.com
  try {
    const combinedKey = `${namespace}_${key}`;
    const res = await fetch(`https://countapi.mileshilliard.com/api/v1/hit/${combinedKey}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    el.textContent = Number(data.value).toLocaleString('bn-IN');
    return;
  } catch (err) {
    el.textContent = '—';
    console.warn('Fallback visitor counter also failed:', err,
      '— if this persists, a browser ad-blocker or privacy extension may be blocking counter/tracking-style domains. Try disabling it for this site, or open DevTools → Network tab to see the exact request that failed.');
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

  function open() { modal.hidden = false; closeBtn.focus(); }
  function close() { modal.hidden = true; openBtn.focus(); }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
}

/* ---------- Music player: live playback from your YouTube playlist ---------- */
let ytPlayer = null;
let playlistVideoIds = [];       // video IDs in playlist order, once loaded
let titleCache = {};             // videoId -> title (fetched via oEmbed, no API key needed)
let blockedVideoIds = new Set(); // videoIds that failed with an embedding-disabled error

function onYouTubeIframeAPIReady() {
  const playlistId = SITE_CONFIG.youtube.playlistId;
  ytPlayer = new YT.Player('ytPlayer', {
    height: '0',
    width: '0',
    playerVars: {
      listType: 'playlist',
      list: playlistId,
      autoplay: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function onPlayerReady() {
  setupPlayerControls();
  loadPlaylistTrackList();
}

function setupPlayerControls() {
  document.getElementById('prevBtn').addEventListener('click', () => ytPlayer.previousVideo());
  document.getElementById('nextBtn').addEventListener('click', () => ytPlayer.nextVideo());
  document.getElementById('playBtn').addEventListener('click', () => {
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  });

  const drawer = document.getElementById('trackDrawer');
  const toggle = document.getElementById('drawerToggle');
  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.getElementById('drawerChevron').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  });

  setupSeekBar();
}

/* ---------- Seek bar ---------- */
let isSeeking = false;
let seekPollInterval = null;

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function setupSeekBar() {
  const seekBar = document.getElementById('seekBar');
  const currentEl = document.getElementById('seekCurrent');
  const durationEl = document.getElementById('seekDuration');

  // While dragging: just update the displayed time, don't seek yet
  // (seeking on every 'input' event would spam the player with requests).
  seekBar.addEventListener('input', () => {
    isSeeking = true;
    currentEl.textContent = formatTime(Number(seekBar.value));
    applySeekBarFill(seekBar);
  });

  // On release: actually jump to that point in the track.
  const commitSeek = () => {
    if (!ytPlayer || typeof ytPlayer.seekTo !== 'function') return;
    ytPlayer.seekTo(Number(seekBar.value), true);
    isSeeking = false;
  };
  seekBar.addEventListener('change', commitSeek);
  seekBar.addEventListener('mouseup', commitSeek);
  seekBar.addEventListener('touchend', commitSeek);

  seekPollInterval = setInterval(() => {
    if (!ytPlayer || isSeeking) return;
    if (typeof ytPlayer.getDuration !== 'function') return;
    const duration = ytPlayer.getDuration();
    const current = ytPlayer.getCurrentTime();
    if (!duration) return;

    seekBar.max = duration;
    seekBar.value = current;
    applySeekBarFill(seekBar);
    currentEl.textContent = formatTime(current);
    durationEl.textContent = formatTime(duration);
  }, 250);
}

function applySeekBarFill(seekBar) {
  const pct = seekBar.max > 0 ? (seekBar.value / seekBar.max) * 100 : 0;
  seekBar.style.setProperty('--seek-pct', pct + '%');
}

// Playlists load asynchronously inside the IFrame player — poll briefly until
// getPlaylist() returns the video IDs, then fetch each title via YouTube's
// public oEmbed endpoint (no API key required, works for any embeddable video).
function loadPlaylistTrackList(attempt) {
  attempt = attempt || 0;
  const ids = ytPlayer.getPlaylist();
  if ((!ids || ids.length === 0) && attempt < 10) {
    setTimeout(() => loadPlaylistTrackList(attempt + 1), 400);
    return;
  }
  playlistVideoIds = ids || [];
  if (playlistVideoIds.length === 0) {
    document.getElementById('trackList').innerHTML =
      '<li class="track-empty">প্লেলিস্ট খুঁজে পাওয়া যায়নি — config.js-এ playlistId চেক করুন</li>';
    return;
  }
  renderTrackList();
  fetchTitlesThenRerender();
  updateNowPlayingLabel();
}

async function fetchTitlesThenRerender() {
  await Promise.all(playlistVideoIds.map(async (id) => {
    if (titleCache[id]) return;
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      titleCache[id] = data.title;
    } catch (err) {
      titleCache[id] = null; // fall back to a generic label for this track
      console.warn('Could not fetch title for video', id, err);
    }
  }));
  renderTrackList();
  updateNowPlayingLabel();
}

function renderTrackList() {
  const listEl = document.getElementById('trackList');
  const currentIndex = ytPlayer.getPlaylistIndex ? ytPlayer.getPlaylistIndex() : -1;
  listEl.innerHTML = '';

  playlistVideoIds.forEach((id, i) => {
    const li = document.createElement('li');
    const isBlocked = blockedVideoIds.has(id);

    if (isBlocked) {
      const link = document.createElement('a');
      link.className = 'track-item track-item--blocked';
      link.href = `https://www.youtube.com/watch?v=${id}`;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = (titleCache[id] || `গান ${i + 1}`) + ' — YouTube-এ শুনুন ↗';
      li.appendChild(link);
    } else {
      const btn = document.createElement('button');
      btn.className = 'track-item' + (i === currentIndex ? ' active' : '');
      btn.textContent = titleCache[id] || `গান ${i + 1}`;
      btn.addEventListener('click', () => ytPlayer.playVideoAt(i));
      li.appendChild(btn);
    }
    listEl.appendChild(li);
  });
}

function updateNowPlayingLabel() {
  document.getElementById('npLabel').textContent = 'প্লে লিস্ট';
  const currentIndex = ytPlayer.getPlaylistIndex ? ytPlayer.getPlaylistIndex() : -1;
  const currentId = playlistVideoIds[currentIndex];
  const title = currentId ? titleCache[currentId] : null;
  document.getElementById('npTitle').textContent = title || 'একটি গান বেছে নিন';
}

function onPlayerStateChange(e) {
  const playIcon = document.getElementById('playIcon');
  if (e.data === YT.PlayerState.PLAYING) {
    playIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'; // pause icon
    renderTrackList();
    updateNowPlayingLabel();
  } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // play icon
  }
}

function onPlayerError(e) {
  const messages = {
    2: 'ভুল ভিডিও আইডি',
    5: 'ভিডিও চালানো যাচ্ছে না',
    100: 'ভিডিওটি খুঁজে পাওয়া যায়নি বা প্রাইভেট',
    101: 'এই গানে এমবেডিং বন্ধ আছে — পরের গান বাজছে',
    150: 'এই গানে এমবেডিং বন্ধ আছে — পরের গান বাজছে'
  };
  const currentIndex = ytPlayer.getPlaylistIndex ? ytPlayer.getPlaylistIndex() : -1;
  const currentId = playlistVideoIds[currentIndex];

  if ((e.data === 101 || e.data === 150) && currentId) {
    blockedVideoIds.add(currentId);
    renderTrackList();
  }

  document.getElementById('npTitle').textContent = messages[e.data] || 'গান চালানো যায়নি';
  console.warn('YouTube player error code:', e.data, '— video:', currentId);

  // Auto-skip to the next track so one blocked song doesn't stall the player.
  if (e.data === 101 || e.data === 150 || e.data === 100) {
    setTimeout(() => ytPlayer.nextVideo(), 1200);
  }
}
