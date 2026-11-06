---
id: 1
title: Karte Driver-Rating
type: map
labels: [wayfinder:map]
status: closed
assignee:
---

## Destination

Eine live gehostete Ein-Screen-Webseite unter `driverrating.familiesailer.com` (Cloudflare, Nuxt). Mitfahrer bewerten die Fahrt per Handy über einen QR-Code: fünf zufällige Fragen aus einem JSON-Pool, Antwort in drei Emoji-Stufen (😬 😐 😎). Die Bewertungen werden gespeichert und einer Fahrerin zugeordnet. Eine passwortgeschützte Auswertungsseite zeigt sie an.

## Notes

- Domain: `familiesailer.com`, Subdomain `driverrating.familiesailer.com`.
- Sprache der Oberfläche und der Gespräche: Deutsch.
- Ton: witzig, minimalistisch, mobil-first, ein Screen.
- Fragenpool: JSON-Datei, zunächst 20 Fragen, pro Bewertung 5 zufällig.
- Mehrere Fahrerinnen sind später denkbar (Johanna, Alexandra, Tobias). Das Datenmodell muss das bereits abbilden.
- Die Regel "ein Ticket pro Sitzung" ist für diesen Effort bewusst gelockert, weil der Kontext klein ist. Sie bleibt als Richtwert, wenn der Kontext wächst.
- Skills für Sitzungen: `/grilling`, `/domain-modeling`, `/prototype`, `/research`.

## Decisions so far

<!-- one line per closed ticket -->

- [Nuxt-Projekt aufsetzen](0007-task-nuxt-projekt-aufsetzen.md) — Nuxt 4.6.4 mit Nitro `cloudflare_module`, Build läuft; Nuxt-MCP-Server verbunden
- [Prototyp Screens und Stil](0005-prototyp-screens-und-stil.md) — HTML-Prototyp in `prototype/index.html`: Mitfahrer-Flow bestätigt, Look verfeinerbar
- [Design-Vorschläge einholen](0004-task-design-vorschlaege.md) — Stil „Road-Trip Comic“ in Orange gewählt; Details in `design/entscheidung.md`
- [Recherche Cloudflare-Speicher für Nuxt](0002-recherche-cloudflare-speicher.md) — D1 als Speicher, Nuxt auf Workers (Nitro `cloudflare_module`)
- [Anonymität der Bewertungen](0006-grilling-anonymitaet.md) — anonym mit zufälligem Pseudonym und Icon, ohne Cookie; `ratings` bekommt `alias` und `icon`
- [Cloudflare einrichten](0008-task-cloudflare-einrichten.md) — D1 `driver-rating-db` angelegt und an `wrangler.jsonc` gebunden; Worker `driver-rating` läuft auf `driverrating.familiesailer.com` (HTTP 200)
- [Startformular und Passwort](0009-grilling-startformular-und-passwort.md) — drei Felder (Name, Ziel, Stadt) mit Platzhaltern, optionaler Kommentar, verstecktes Datum; 15-Minuten-Fenster fest ab Start; Passwort einmal pro Gerät per Cookie; Secret über wrangler
- [Auswertungsseite](0010-grilling-auswertung.md) — Dashboard über alle Fahrten: Gesamtergebnis, Durchschnitt pro Frage, Top 5 pro Monat, Fahrtenliste mit Detailansicht; Filter Zeitraum (Monat/Alles) und Fahrt; Pseudonyme nur in Detail und Rangliste
- [Datenmodell und Speicherwahl](0003-datenmodell-und-speicherwahl.md) — D1 mit `drivers`, `trips`, `ratings`, `answers`; Johanna startet die Fahrt per eigenem Code, der Mitfahrer-Code ist fest und eine Stunde aktiv
- [Umsetzung Driver-Rating](0011-task-umsetzung-driver-rating.md) — umgesetzt und live unter driverrating.familiesailer.com (Schema, Fragenpool, API, vier Seiten, Passwort-Secret)

## Not yet specified

<!-- in Tickets überführt: Nuxt-Projekt (0007), Cloudflare (0008), Startformular und Passwort (0009), Auswertung (0010) -->

- Mitfahrer-QR-Code auf Johannas Handy nach dem Start: [Ticket #12](0012-grilling-mitfahrer-qr-auf-handy.md), Umsetzung in [#13](0013-task-mitfahrer-qr-seite.md), live unter `/mitfahrer`.
- Design-Überarbeitung nach Gemini-Screens: [Ticket #15](0015-grilling-design-gemini.md) besprochen, Umsetzung in [#16](0016-task-design-umsetzung-gemini.md), live.
- Load-more für die Fahrtenliste: [Ticket #14](0014-task-fahrtenliste-load-more.md), live.
- Urlaubsmodus: Bewertungen während langer Urlaubsfahrten (Ausbau, kein Teil dieses Efforts, bis er konkret wird).
- Startscreen mit Fahrerinnen-Auswahl (sobald mehrere Fahrerinnen gewünscht sind).

## Out of scope

- Öffentliche Auswertung für alle Mitfahrer (Ausbau "A"). Späterer, eigener Effort, falls gewünscht.
