# মা আসছে — Durga Puja Countdown Site

A festive one-page site: live visitor counter, YouTube playlist link,
admin card (photo/name/LinkedIn), "মা আসছে" hero, countdown to Puja,
a dhak button, and a music player synced to your **real** YouTube
playlist.

## 1. Fill in your details

Open **`config.js`** and edit:

- `admin.name`, `admin.photo`, `admin.linkedin`
- `countdownTargetDate` — update the year each season
- `youtube.playlistId` / `playlistUrl` — copy the full ID after `list=`
  in your playlist URL (it's usually ~34 characters, starting `PL`).
  The one you sent me looked cut off — double check it in your browser
  address bar.
- `counter.namespace` — change to something unique to you (e.g.
  `maa-aschhe-yourname`) so your counter doesn't share numbers with
  anyone else using the same default value.

## 2. Add your photo and the dhak sound

- Put your photo at `assets/admin-photo.jpg` (or update the path in
  `config.js`).
- Put a dhak/dhaak beat mp3 at `assets/dhak.mp3`. I couldn't include
  one myself — copyrighted or unclear-license audio can't be bundled
  for you. Good royalty-free sources: **Pixabay Audio** or
  **Freesound.org** (search "dhak" or "dhol"), both free for this use.

## 3. Host it for free — GitHub Pages (recommended)

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
| Visitor counter | Free CountAPI service — increments on every page load, shared across all visitors, no signup |
| YouTube icon | Opens your playlist URL from `config.js` |
| Admin icon | Opens a card with your photo/name/LinkedIn from `config.js` — also links to YouTube Studio so you can add/remove/reorder videos on your real playlist |
| Music player | Embeds your live playlist via YouTube's official player — always reflects whatever you've done on YouTube itself, no separate syncing needed |
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
