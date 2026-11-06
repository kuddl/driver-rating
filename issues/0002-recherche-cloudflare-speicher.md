---
id: 2
title: Recherche Cloudflare-Speicher für Nuxt
type: ticket
labels: [wayfinder:research]
parent: 1
status: closed
assignee:
blocked-by: []
---

## Question

Welche Speicheroptionen gibt es bei Cloudflare für eine Nuxt-Anwendung (Pages mit Functions oder Workers), die wenige Bewertungen pro Tag speichert? Vergleich von KV, D1 und ggf. anderen Optionen: Free-Tier-Limits, Schreibverhalten, Konsistenz, Nuxt-Preset, Datenmodell-Eignung (Fahrerin, Zeitstempel, Antworten pro Frage).

Kontext: `README.md` und `0001-karte-driver-rating.md` in diesem Ordner.

## Resolution

Empfehlung: **D1** als Speicher, Nuxt auf **Workers** mit Nitro-Preset `cloudflare_module`. Details und Quellen: [research/cloudflare-speicher.md](../research/cloudflare-speicher.md).

- D1 passt zum Datenmodell (Fahrerin, Bewertung, Antworten pro Frage). Die Auswertung ist eine `GROUP BY`-Abfrage.
- KV scheidet aus: Auswertung müsste alle Einträge lesen, und Konsistenz ist nur eventuell.
- Durable Objects sind überdimensioniert.

Offen: Die Doku widerspricht sich beim Free-Speicher für Durable Objects (5 GB oder 1 GB), für dieses Projekt unerheblich. Das D1-Binding im Workers-Format ist noch nicht gegen die Workers-Doku belegt.
