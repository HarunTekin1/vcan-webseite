# Scripts

## Verfügbare Scripts

### Video-Generierung

Generiert ein Werbevideo für VCan mit Text-Overlays und Branding.

**Verwendung:**
```bash
npm run generate:video
```

**Was macht das Script:**
- Erstellt einen Gradient-Hintergrund in VCan-Farben (#26c6da bis #0097a7)
- Fügt Text-Overlays mit den Haupt-Botschaften hinzu
- Integriert das Hero-Bild als Picture-in-Picture
- Generiert sowohl MP4 als auch WebM Versionen für maximale Browser-Kompatibilität
- Ausgabe: `assets/videos/vcan-promo.mp4` und `vcan-promo.webm`

**Voraussetzungen:**
- Node.js
- ffmpeg (installiert via `sudo apt-get install ffmpeg`)

**Anpassungen:**
Die Text-Overlays, Timings und Farben können in `scripts/generate-video.js` angepasst werden.

### Bild-Optimierung

Optimiert Bilder für das Web mit mehreren Größen und Formaten.

**Verwendung:**
```bash
npm run optimize:images
```

**Was macht das Script:**
- Generiert responsive Bildgrößen (240px, 420px, 720px)
- Erstellt WebP und AVIF Versionen für bessere Performance
- Erzeugt Platzhalter-Thumbnails für progressives Laden
- Ausgabe: `assets/optimized/`

**Voraussetzungen:**
- Node.js
- sharp (via `npm install`)
