README — Firebase Hosting (DE)

Kurz: Dieses Repo ist vorbereitet für Firebase Hosting. Es deployt die statischen Dateien aus dem Repo‑Root ("public": ".").

Schnelle Befehle (PowerShell):

# In Projektverzeichnis wechseln
Set-Location -LiteralPath 'D:\Harun\Desktop\vcan2.0\VCan\web\webseite'

# firebase-tools installieren (falls nötig)
npm install -g firebase-tools

# interaktives Login
firebase login

# einmaliges Init (nur falls noch nicht initialisiert):
firebase init hosting
# Projekt: vcan-c74cc (auswählen), public: . , Single Page App: Nein (falls Multi‑Page)

# Deployment (prod)
firebase deploy --only hosting

# Preview Channel (staging, 7 Tage)
firebase hosting:channel:deploy staging --expires 7d

CI / GitHub Actions:
- Workflow ist bereits vorhanden: .github/workflows/firebase-hosting.yml
- Erzeuge mit `firebase login:ci` einen Token und füge ihn als GitHub Secret `FIREBASE_TOKEN` hinzu.

Service Worker / Cache:
- Bump `CACHE_NAME` in `sw.js` oder passe Cache‑Header in `firebase.json`, damit Clients neue Versionen schneller sehen.

