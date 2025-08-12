# VCan Website

Startseite & Grundgerüst der VCan Web-Präsenz.

## Struktur

```
webseite/
  index.html          # Landing Page (Hero, Werte, Features, CTA, Footer)
  styles.css          # Design-System & Layout
  app.js              # Navigation Toggle & kleine UX-Hilfen
  manifest.json       # PWA Basis (Name, Farben, Icons Placeholder)
  (assets/)           # Geplante Bilder & Icons
```

## Lokaler Start

PowerShell (Windows):

```powershell
cd VCan/web/webseite
python -m http.server 5500  # oder
# npx serve -p 5500
```
Danach Browser: http://localhost:5500/

## Geplante Nächste Schritte
- Inhalte für vision.html, kontakt.html, impressum.html
- Richtige Bilder & Icons in assets/
- Lighthouse / Performance Feinschliff
- Optional: Service Worker (Offline / Add To Home Screen)

## Deployment (GitHub Pages)
1. Repository erstellen (z.B. vcan-website)
2. Dateien pushen (main Branch)
3. Settings -> Pages -> Branch: main (root) -> Save
4. Warten bis Pages URL aktiv (https://DEINNAME.github.io/vcan-website/)

## Lizenz
Noch nicht festgelegt.
