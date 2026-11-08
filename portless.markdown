# Portless im lokalen Netzwerk

Einmalig installieren: `npm install -g portless`.
Andere Nuxt-Dev-Server vorher mit `Ctrl+C` beenden.

## HTTPS

Proxy starten (gegebenenfalls nach `portless proxy stop`):

```bash
portless proxy start --lan --https --port 443
```

In einem zweiten Terminal im Projektordner starten:

```bash
portless driver-rating npm run dev
```

Auf Mac und Handy im selben WLAN: **https://driver-rating.local**.
Das Projekt-Terminal offen lassen. Nicht `dev:lan` verwenden: Portless weist
Nuxt einen freien internen Port zu.

Die Portless-CA muss vertraut sein: auf dem Mac mit `portless trust`, auf dem
Handy dieselbe CA installieren und als vertrauenswuerdig aktivieren.
Das gilt auch fuer die sichere HMR-WebSocket-Verbindung.

## HTTP ohne Zertifikate

Projekt mit `Ctrl+C` beenden, Proxy umstellen und Projekt erneut starten:

```bash
portless proxy stop
portless proxy start --lan --no-tls --port 80
portless driver-rating npm run dev
```

Adresse: **http://driver-rating.local**. Bei Problemen: `portless doctor`.

Nur in vertrauenswuerdigen Netzwerken nutzen: Der Nuxt-Entwicklungsserver
gibt Quellcode und Fehler preis; lokal sind Login und Fahrt-Pruefung vereinfacht.