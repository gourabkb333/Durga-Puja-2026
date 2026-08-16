// ============================================================
//  EDIT THIS FILE WITH YOUR OWN DETAILS. Nothing else needs
//  to change. Save, commit, push — your live site updates.
// ============================================================

const SITE_CONFIG = {

  // --- Admin card (shown when the admin icon is clicked) ---
  admin: {
    name: "Gourab Burman",
    photo: "assets/admin-photo.jpeg", // put your photo in /assets and rename it, or change this path
    linkedin: "https://www.linkedin.com/in/gourab-kumar-burman-473b7a139/"
  },

  // --- Countdown target: Maha Shashthi / Puja start date ---
  // Format: YYYY-MM-DD. Update the year each time you redeploy for a new year.
  countdownTargetDate: "2026-10-16",

  // --- YouTube ---
  youtube: {
    // The player loads THIS playlist directly and plays songs from it —
    // no need to list individual songs by hand anymore.
    // Get the ID from your playlist URL: youtube.com/playlist?list=PLAYLIST_ID
    playlistId: "PLdv3eXxiZj-c",

    // Shown when the YouTube icon (top right) is tapped, and inside the admin card.
    playlistUrl: "https://www.youtube.com/playlist?list=PLdv3eXxiZj-c"
  },

  // NOTE: songs are no longer listed here — the player pulls the live track
  // list straight from youtube.playlistId above. Add/remove/reorder songs by
  // editing the playlist itself on YouTube; the site will reflect it on next load.
  // If a track has embedding disabled by its uploader, the player will show a
  // "watch on YouTube" link for that track instead of playing it inline —
  // that restriction is set per-video on YouTube's side and can't be bypassed.

  // --- Visitor counter (free, no signup — powered by CountAPI) ---
  counter: {
    namespace: "maa-aschhe-site", // change to something unique to you, e.g. your name + year
    key: "visits"
  },

  // --- Dhak sound ---
  // Add your own dhak/dhaak beat audio file at assets/dhak.mp3
  // (Claude cannot supply copyrighted or licensed audio for you — you'll need to
  // source a royalty-free dhak sample, e.g. from Pixabay Audio or Freesound, and
  // drop the mp3 in the assets folder with this exact filename.)
  dhakAudioSrc: "assets/dhak.mp3"
};
