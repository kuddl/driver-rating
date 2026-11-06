---
id: 7
title: Nuxt-Projekt aufsetzen (Workers, Nitro cloudflare_module)
type: ticket
labels: [wayfinder:task]
parent: 1
status: closed
assignee:
blocked-by: []
---

## Question

Nuxt-Projekt im Repo anlegen (Nuxt-Version festlegen), Nitro-Preset `cloudflare_module` setzen, lokal lauffähig machen (`wrangler dev`). Den HTML-Prototyp in `prototype/index.html` als Startpunkt übernehmen. Ergebnis: Projekt baut und zeigt die Startseite.

AFK, sofern Node und npm verfügbar sind.

## Resolution

Nuxt-Projekt im Repo angelegt: **Nuxt 4.6.4** (neueste Version laut npm), Vorlage `minimal`, Nitro-Preset `cloudflare_module` in `nuxt.config.ts`. `npm install` und `npm run build` laufen durch. Der Prototyp liegt noch unverändert in `prototype/` und wird später als Seite übernommen.

Nuxt-MCP-Server verbunden (`pi mcp add nuxt --url https://nuxt.com/mcp`, 12 Werkzeuge, u. a. Dokumentation und Deploy-Anleitungen).
