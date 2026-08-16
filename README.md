# মা আসছে — Durga Puja Countdown Site

A festive one-page site: live visitor counter, YouTube playlist link,
admin card (photo/name/LinkedIn), "মা আসছে" hero, countdown to Puja,
a dhak button, and a music player synced to your **real** YouTube
playlist.

## 1. Fill in your details

Open **`config.js`** and edit:

- `admin.name`, `admin.photo`, `admin.linkedin`
- `countdownTargetDate` — update the year each season
- `youtube.playlistId` — the ID after `list=` in your playlist URL
  (e.g. `youtube.com/playlist?list=`**`PLdv3eXxiZj-c`**). The player
  loads and plays directly from this playlist.
- `counter.namespace` — change to something unique to you (e.g.
  `maa-aschhe-yourname`) so your counter doesn't share numbers with
  anyone else using the same default value.

## 2. Manage your songs

You no longer edit song titles/IDs in `config.js` — the player pulls its
track list **live from your YouTube playlist** every time the page loads.
To add, remove, or reorder songs, just edit the playlist itself on
YouTube (via YouTube Studio or the playlist page) — the site picks up
the change automatically on next visit.

**Important:** some videos have embedding disabled by their uploader.
YouTube doesn't allow any website to override that. If a track in your
playlist is embed-restricted, the site detects this automatically and
shows a "YouTube-এ শুনুন ↗" link for that one track instead — tapping it
opens the video on YouTube directly, and the player auto-advances to
the next song. To fix it permanently, either swap in a different
upload of the same track, or if it's your own upload, enable "Allow
embedding" for it in YouTube Studio.

## 3. Add your photo, dhak sound, and Durga face image

- Put your photo at `assets/admin-photo.jpg` (or update the path in
  `config.js`).
- Put a small Durga face/idol image at `assets/durga-face.png` — it
  displays just above the "শারদীয়া দুর্গোৎসব" text. Keep it small
  (a transparent-background PNG works best) since it's shown at a
  fixed 64×64px on the page regardless of the original file size.
- Put a dhak/dhaak beat mp3 at `assets/dhak.mp3`. I couldn't include
  one myself — copyrighted or unclear-license audio can't be bundled
  for you. Good royalty-free sources: **Pixabay Audio** or
  **Freesound.org** (search "dhak" or "dhol"), both free for this use.

## 4. Host it for free — GitHub Pages (recommended)

1. Create a free GitHub account if you don't have one.
2. Create a new repository, e.g. `maa-aschhe`.
3. Upload all files in this folder (`index.html`, `style.css`,
   `script.js`, `config.js`, `assets/`) to that repository.
4. Go to the repo's **Settings → Pages**.
5. Under "Build and deployment", set Source to **Deploy from a
   branch**, branch `main`, folder `/ (root)`. Save.
6. After a minute, your site is live at:
   `https://<your-username>.github.io/maa-aschhe/`

Netlify or Vercel free tiers work the same way if you'd rather drag
and drop the folder — both have a free static-hosting option with no
credit card required.

## How each feature works

| Feature | How |
|---|---|
| Visitor counter | Free `Abacus` counter service (widely used, powers view counters on many GitHub READMEs) — increments on every page load, shared across all visitors, no signup. Falls back automatically to a second free service if Abacus is briefly unavailable. |
| YouTube icon | Opens your playlist URL from `config.js` |
| Admin icon | Opens a card with your photo/name/LinkedIn from `config.js` — also links to YouTube Studio so you can add/remove/reorder videos on your real playlist |
| Music player | Loads and plays your real YouTube playlist directly. Track titles are fetched live via YouTube's public oEmbed endpoint (no API key needed). Tap a song to play it; prev/next moves through the playlist. Embed-restricted tracks show a "listen on YouTube" link instead and are auto-skipped. |
| Countdown | Calculated client-side against `countdownTargetDate` |
| Dhak button | Plays `assets/dhak.mp3` on tap |

## Note on the admin panel

Because this is a free static site (no server/database), there's no
login-protected backend for editing content live from a phone. All
"admin" editing happens by changing `config.js` and re-uploading —
that's what keeps hosting free. If later on you want true in-browser
editing (say, from your phone without touching GitHub), that needs a
small free backend (e.g. Firebase's free tier) — happy to build that
next if you want it.
