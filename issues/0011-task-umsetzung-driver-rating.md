---
id: 11
title: Umsetzung Driver-Rating (Schema, Fragenpool, Seiten)
type: ticket
labels: [wayfinder:task]
parent: 1
status: closed
assignee: claude-code
blocked-by: [3, 6, 9, 10]
---

## Question

Die Entscheidungen aus den Tickets #3, #6, #9 und #10 umsetzen:

- D1-Schema mit `drivers`, `trips` (inkl. `city`, `comment`, `date`), `ratings` (inkl. `alias`, `icon`) und `answers`, Migration anlegen und remote anwenden.
- Fragenpool als JSON mit 20 Fragen, pro Bewertung 5 zufällig.
- Startformular für Johanna: Name, Ziel, Stadt (Platzhalter), Kommentar, verstecktes Datum, neue Fahrt beendet die laufende, 15-Minuten-Fenster fest ab Start, Passwort einmal pro Gerät per Cookie (30 Tage), Secret über `wrangler secret put`.
- Mitfahrer-Seite: fester Code, 5 Fragen mit drei Emoji-Stufen, Pseudonym und Icon nach dem Abschicken.
- Auswertungsseite: Dashboard mit Gesamtergebnis, Durchschnitt pro Frage, Top 5 pro Monat, Fahrtenliste, Filter Zeitraum und Fahrt, Detailansicht pro Fahrt, Rangliste der Pseudonyme.
- Den HTML-Prototyp aus `prototype/` als Look übernehmen (Stil in `design/entscheidung.md`).

Die Arbeit kann in mehrere Schritte aufgeteilt werden, wenn das Ticket zu groß wird.

HITL: Die Entscheidungen sind abgestimmt, Rückfragen nur bei offenen Details.

## Resolution

**Stand: umgesetzt und deployt.** Live unter `https://driverrating.familiesailer.com` (Seiten HTTP 200, Fahrt gestartet und mehrfach bewertet).

- **D1-Schema:** `migrations/0001_init.sql` mit `drivers`, `trips`, `ratings`, `answers`. Remote angewendet, Johanna als Fahrerin (ID 1) angelegt.
- **Fragenpool:** `server/data/questions.json` (20 Fragen), Pseudonyme in `server/data/pseudonyms.json`.
- **API:** `/api/rating/*` (Status, 5 Fragen, Absenden), `/api/johanna/*` (Login, Logout, Platzhalter, Fahrt starten), `/api/auswertung/*` (Dashboard, Fahrtdetail). Schreib- und Auswertungs-Routen prüfen das Cookie.
- **Seiten:** `/` (Mitfahrer), `/johanna` (Startformular), `/auswertung` (Dashboard), `/auswertung/fahrt/[id]` (Detail). Look aus dem Prototyp übernommen.
- **Lokal getestet:** Login, Fahrt starten (neue beendet die laufende), Bewertung speichern, Dashboard-Filter, Detail, Fehlerfälle (401, 409, 400). Die Seiten rendern mit HTTP 200. Im Browser nicht geprüft.

**Erledigt:** `AUTH_PASSWORD` als Secret gesetzt, Deploy durchgeführt.

**Entscheidungen, die im Grilling nicht festgelegt waren:**
- Rangliste der Pseudonyme: „Größte Fans“ (höchster Durchschnitt) und „Schärfste Kritiker“ (niedrigster Durchschnitt), ab 2 Bewertungen pro Pseudonym.
- Top 5 / Flop 5: die fünf besten und schlechtesten Fragen des gewählten Zeitraums.
- Kein Mitfahrer-Code (Entscheidung nach Rückfrage): Bewertet werden kann, solange eine Fahrt aktiv ist. Der feste Code aus #3 entfällt.
- Monatsfilter für Bewertungen nutzt UTC, für Fahrten das Fahrtdatum.
- Kein Rate-Limit beim Login (bewusst, unwichtige App).
