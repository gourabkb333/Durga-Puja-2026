# assets

This folder holds static assets for the Durga Puja 2026 project.

- Put images (PNG, JPG, SVG) inside `assets/images/`.
- Put audio/music files (MP3, WAV) inside `assets/music/`.

I added a `.gitkeep` so the `assets/` directory exists in the repository. Create the subfolders and upload files in one of these ways:

1. On GitHub website: Go to the repository -> Add file -> Upload files. You can drag-and-drop files; include `assets/images/` or `assets/music/` in the target path.
2. Locally: git clone the repo, create the directories, add files, commit and push:

   ```bash
   git clone https://github.com/gourabkb333/Durga-Puja-2026.git
   cd Durga-Puja-2026
   mkdir -p assets/images assets/music
   cp /path/to/your/image.png assets/images/
   cp /path/to/your/song.mp3 assets/music/
   git add assets/
   git commit -m "Add images and music to assets"
   git push
   ```

Notes:
- If your audio/image files are large, consider using Git LFS: https://git-lfs.github.com/
- If you prefer, I can also create the `assets/images/` and `assets/music/` subfolders and add README placeholders. Let me know if you want that.
