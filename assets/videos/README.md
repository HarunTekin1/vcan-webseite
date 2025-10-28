# VCan Videos

Dieser Ordner enthält generierte Promo-Videos für die VCan-Website.

## Videos generieren

Die Videos werden nicht im Git-Repository gespeichert, da sie groß sind und automatisch generiert werden können.

Um die Videos zu generieren, führe aus:

```bash
npm run generate:video
```

## Voraussetzungen

- Node.js
- ffmpeg (installieren mit: `sudo apt-get install ffmpeg`)

## Generierte Dateien

- `vcan-promo.mp4` - H.264 Version (ca. 200 KB, 15 Sekunden)
- `vcan-promo.webm` - VP9 Version (ca. 500 KB, 15 Sekunden)

## Verwendung

Die Videos können in HTML mit dem `<video>`-Tag verwendet werden:

```html
<video controls poster="assets/hero-image.jpg">
  <source src="assets/videos/vcan-promo.webm" type="video/webm">
  <source src="assets/videos/vcan-promo.mp4" type="video/mp4">
  Ihr Browser unterstützt das Video-Tag nicht.
</video>
```

## Anpassungen

Um die Texte, Timings oder Farben im Video anzupassen, bearbeite die Datei:
`scripts/generate-video.js`
