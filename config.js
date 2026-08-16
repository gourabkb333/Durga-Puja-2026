// ============================================================
//  EDIT THIS FILE WITH YOUR OWN DETAILS. Nothing else needs
//  to change. Save, commit, push — your live site updates.
// ============================================================

const SITE_CONFIG = {

  // --- Admin card (shown when the admin icon is clicked) ---
  admin: {
    name: "Gourab Burman",
    photo: "assets/admin-photo.jpg", // put your photo in /assets and rename it, or change this path
    linkedin: "https://www.linkedin.com/in/gourab-kumar-burman-473b7a139?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
  },

  // --- Countdown target: Maha Shashthi / Puja start date ---
  // Format: YYYY-MM-DD. Update the year each time you redeploy for a new year.
  countdownTargetDate: "2026-10-16",

  // --- YouTube ---
  youtube: {
    // Shown when the YouTube icon (top right) is tapped, and inside the admin card.
    // Point this at your channel or any playlist you want people to browse further.
    playlistUrl: "https://youtube.com/playlist?list=PLdv3eXxiZj-c&si=3IkbUBYQoRsyZ2E6"
  },

  // --- Songs (manually curated — no live YouTube playlist sync) ---
  // For each song, you need the YouTube VIDEO id (not the playlist id).
  // Get it from the video's URL: youtube.com/watch?v=VIDEOID  ← copy just this part.
  // Note: if a video's uploader has disabled embedding, it still won't play here —
  // that's a restriction YouTube enforces per-video and can't be worked around.
  // Pick videos you've confirmed play fine when embedded elsewhere.
  songs: {
    mahalaya: [
      { id: "A-nMCu2y_PM&list=RDA-nMCu2y_PM&start_radio=1&pp=ygUIbW9oYWxheWGgBwE%3D", title: "মহিষাসুরমর্দিনী — বীরেন্দ্রকৃষ্ণ ভদ্র" }
      // Add more like this:
      // { id: "ANOTHER_VIDEO_ID", title: "Song title" },
    ],
    pujorGaan: [
      { id: "6LuRHIXNF_A&list=RD6LuRHIXNF_A&start_radio=1", title: "শুভ শুভ" }
      
      // { id: "ANOTHER_VIDEO_ID", title: "Song title" },
    ]
  },

  // --- Visitor counter (free, no signup — powered by CountAPI) ---
  counter: {
    namespace: "maa-aschhe-site-by-Gourab", // change to something unique to you, e.g. your name + year
    key: "visits"
  },

  // --- Dhak sound ---
  // Add your own dhak/dhaak beat audio file at assets/dhak.mp3
  // (Claude cannot supply copyrighted or licensed audio for you — you'll need to
  // source a royalty-free dhak sample, e.g. from Pixabay Audio or Freesound, and
  // drop the mp3 in the assets folder with this exact filename.)
  dhakAudioSrc: "assets/dhak.mp3"
};
