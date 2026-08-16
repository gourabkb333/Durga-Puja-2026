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

/* ---------- Music player: two tabs, manually curated tracks ---------- */
let ytPlayer = null;
let currentSection = 'mahalaya';
let currentIndex = 0;

function onYouTubeIframeAPIReady() {
  const firstTrack = getTrack(currentSection, 0);
  ytPlayer = new YT.Player('ytPlayer', {
    height: '3',
    width: '3',
    videoId: firstTrack ? firstTrack.id : undefined,
    playerVars: { autoplay: 0 },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function getTrack(section, index) {
  const list = SITE_CONFIG.songs[section] || [];
  return list[index] || null;
}

function onPlayerReady() {
  setupPlayerControls();
  setupTabs();
  renderTrackList();
  updateNowPlayingLabel();
}

function setupPlayerControls() {
  document.getElementById('prevBtn').addEventListener('click', () => step(-1));
  document.getElementById('nextBtn').addEventListener('click', () => step(1));
  document.getElementById('playBtn').addEventListener('click', () => {
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
    } else {
      const track = getTrack(currentSection, currentIndex);
      if (track && (!ytPlayer.getVideoData().video_id)) {
        ytPlayer.loadVideoById(track.id);
      } else {
        ytPlayer.playVideo();
      }
    }
  });

  const drawer = document.getElementById('trackDrawer');
  const toggle = document.getElementById('drawerToggle');
  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.getElementById('drawerChevron').style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  });
}

function setupTabs() {
  document.getElementById('tabMahalaya').addEventListener('click', () => switchSection('mahalaya'));
  document.getElementById('tabPujorGaan').addEventListener('click', () => switchSection('pujorGaan'));
}

function switchSection(section) {
  if (section === currentSection) return;
  currentSection = section;
  currentIndex = 0;
  document.getElementById('tabMahalaya').classList.toggle('active', section === 'mahalaya');
  document.getElementById('tabPujorGaan').classList.toggle('active', section === 'pujorGaan');
  document.getElementById('tabMahalaya').setAttribute('aria-selected', String(section === 'mahalaya'));
  document.getElementById('tabPujorGaan').setAttribute('aria-selected', String(section === 'pujorGaan'));
  renderTrackList();
  updateNowPlayingLabel();
}

function renderTrackList() {
  const listEl = document.getElementById('trackList');
  const tracks = SITE_CONFIG.songs[currentSection] || [];
  listEl.innerHTML = '';

  if (tracks.length === 0 || tracks.every(t => t.id.includes('PASTE_VIDEO_ID'))) {
    const li = document.createElement('li');
    li.className = 'track-empty';
    li.textContent = 'এখনও কোনো গান যোগ করা হয়নি — config.js-এ যোগ করুন';
    listEl.appendChild(li);
    return;
  }

  tracks.forEach((track, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'track-item' + (i === currentIndex ? ' active' : '');
    btn.textContent = track.title;
    btn.addEventListener('click', () => playTrack(currentSection, i));
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

function playTrack(section, index) {
  const track = getTrack(section, index);
  if (!track) return;
  currentSection = section;
  currentIndex = index;
  ytPlayer.loadVideoById(track.id);
  document.getElementById('npTitle').textContent = track.title;
  renderTrackList();
}

function step(direction) {
  const tracks = SITE_CONFIG.songs[currentSection] || [];
  if (tracks.length === 0) return;
  const nextIndex = (currentIndex + direction + tracks.length) % tracks.length;
  playTrack(currentSection, nextIndex);
}

function updateNowPlayingLabel() {
  document.getElementById('npLabel').textContent =
    currentSection === 'mahalaya' ? 'মহালয়া' : 'পূজোর গান';
  const track = getTrack(currentSection, currentIndex);
  document.getElementById('npTitle').textContent = track ? track.title : 'একটি গান বেছে নিন';
}

function onPlayerStateChange(e) {
  const playIcon = document.getElementById('playIcon');
  if (e.data === YT.PlayerState.PLAYING) {
    playIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'; // pause icon
  } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // play icon
    if (e.data === YT.PlayerState.ENDED) step(1);
  }
}

function onPlayerError(e) {
  const messages = {
    2: 'ভুল ভিডিও আইডি — config.js চেক করুন',
    5: 'ভিডিও চালানো যাচ্ছে না',
    100: 'ভিডিওটি খুঁজে পাওয়া যায়নি বা প্রাইভেট',
    101: 'এই ভিডিওতে এমবেডিং বন্ধ আছে — অন্য গান বেছে নিন',
    150: 'এই ভিডিওতে এমবেডিং বন্ধ আছে — অন্য গান বেছে নিন'
  };
  document.getElementById('npTitle').textContent = messages[e.data] || 'গান চালানো যায়নি';
  console.warn('YouTube player error code:', e.data, '— video:', getTrack(currentSection, currentIndex)?.id);
}
