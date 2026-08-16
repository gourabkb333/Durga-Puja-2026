// ============================================================
//  EDIT THIS FILE WITH YOUR OWN DETAILS. Nothing else needs
//  to change. Save, commit, push — your live site updates.
// ============================================================

const SITE_CONFIG = {

  // --- Admin card (shown when the admin icon is clicked) ---
  admin: {
    name: "Gourab Burman",
    photo: "assets/admin-photo.jpeg", // put your photo in /assets and rename it, or change this path
    linkedin: "https://www.linkedin.com/in/gourab-kumar-burman-473b7a139?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
  },

  // --- Countdown target: Maha Shashthi / Puja start date ---
  // Format: YYYY-MM-DD. Update the year each time you redeploy for a new year.
  countdownTargetDate: "2026-10-16",

  // --- YouTube ---
  youtube: {
    // Your playlist link, e.g. https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    // Paste the FULL id after "list=" below (playlist IDs are usually 34 characters, starting with PL).
    playlistId: "PLdv3eXxiZj-c&si=wCv6NnNaPPyvIT5J",
    playlistUrl: "https://youtube.com/playlist?list=PLdv3eXxiZj-c&si=wCv6NnNaPPyvIT5J",
    // Link shown for "manage this playlist" inside the admin card
    studioManageUrl: "https://studio.youtube.com/playlists"
  },

  // --- Visitor counter (free, no signup — powered by CountAPI) ---
  counter: {
    namespace: "maa-asche-by-Gourab", // change to something unique to you, e.g. your name + year
    key: "visits"
  },

  // --- Dhak sound ---
  // Add your own dhak/dhaak beat audio file at assets/dhak.mp3
  // (Claude cannot supply copyrighted or licensed audio for you — you'll need to
  // source a royalty-free dhak sample, e.g. from Pixabay Audio or Freesound, and
  // drop the mp3 in the assets folder with this exact filename.)
  dhakAudioSrc: "assets/dhak.mp3"
};
