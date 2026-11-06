---
id: 8
title: Cloudflare einrichten (D1, Workers, Subdomain)
type: ticket
labels: [wayfinder:task]
parent: 1
status: closed
assignee:
blocked-by: []
---

## Question

Manuelle Vorarbeit im Cloudflare-Dashboard: D1-Datenbank anlegen, Worker oder Projekt für Nuxt vorbereiten und die Subdomain `driverrating.familiesailer.com` auf den Worker zeigen lassen. Ergebnis: Name der D1-Datenbank, Subdomain bestätigt, Zugriff per `wrangler` möglich.

HITL: Du machst die Schritte im Dashboard, ich liefere eine Checkliste.

## Resolution

- **D1-Datenbank:** `driver-rating-db` (ID `6b11692e-156d-4ece-9eff-7ef730db0dfe`, Region EEUR), Binding `driver_rating_db` in `wrangler.jsonc`.
- **Worker:** `driver-rating` mit Custom Domain `driverrating.familiesailer.com` (`routes` mit `custom_domain: true`), deployt als Version `204a0fce-796f-4dda-b221-48dbed4942d8`. Die Zone `familiesailer.com` liegt im Account, Cloudflare hat DNS und Zertifikat automatisch angelegt.
- **Subdomain bestätigt:** Öffentliche Resolver (1.1.1.1, 8.8.8.8) liefern Cloudflare-IPs, `https://driverrating.familiesailer.com/` antwortet mit HTTP 200 und der Nuxt-Seite.
- **Zugriff per wrangler:** `wrangler d1 execute driver-rating-db --remote` funktioniert.

Hinweise:
- Der lokale DNS-Resolver (192.168.178.83) liefert für die Subdomain noch eine alte Adresse. Auf dem Mac ist sie dann nicht erreichbar, bis der Cache dort abläuft oder der Resolver aktualisiert wird.
- Beim Deploy meldete wrangler, dass `workers_dev` nicht in `wrangler.jsonc` steht und daher für diesen Deploy deaktiviert ist. Falls die `*.workers.dev`-URL weiter gebraucht wird, `"workers_dev": true` ergänzen.
- Schema und Migrationen für D1 sind noch nicht angelegt (eigenes Ticket).
