---
id: 3
title: Datenmodell und Speicherwahl
type: ticket
labels: [wayfinder:grilling]
parent: 1
status: closed
assignee:
blocked-by: [2]
---

## Question

Welcher Cloudflare-Speicher wird genutzt, und wie sieht das Datenmodell aus? Mindestfelder: Fahrerin, Fahrt, Zeitstempel, Antwort pro gezogener Frage.

## Resolution

**Speicher:** D1 (Cloudflare, Free-Tarif), siehe [Recherche](0002-recherche-cloudflare-speicher.md). Kosten bleiben im Free-Tarif, solange die Nutzung im Rahmen bleibt. Die Auswertung ist eine einfache `GROUP BY`-Abfrage.

**Fahrten:** Es gibt eine Tabelle `trips`. Johanna startet eine Fahrt über einen eigenen Code, gibt Name und Ziel an, und die Mitfahrer-Bewertung ist danach eine Stunde lang über den festen Mitfahrer-Code aktiv. Ein Code pro Fahrt ist nicht nötig. Startformular und Auswertung sind mit demselben kleinen Passwort geschützt.

**Schema (Vorschlag):**

```
drivers   (id, name)                                   -- zunächst: Johanna
trips     (id, driver_id -> drivers, name, destination, started_at, active_until)
ratings   (id, trip_id -> trips, created_at)           -- eine Zeile pro Mitfahrer-Bewertung
answers   (id, rating_id -> ratings, question_id, score) -- score: 1 = 😬, 2 = 😐, 3 = 😎
```

- `question_id` verweist auf die ID im JSON-Fragenpool. Der Pool liegt nicht in der Datenbank, damit er einfach erweiterbar bleibt.
- Die Fahrerin einer Bewertung ergibt sich über die Fahrt. Dadurch funktionieren spätere Auswertungen pro Fahrerin direkt.
- Länge der Fahrt wird nicht gespeichert, bis es dafür einen Bedarf gibt. Sie kann später als Spalte in `trips` ergänzt werden.

**Ergänzt durch [Anonymität der Bewertungen](0006-grilling-anonymitaet.md):** `ratings` bekommt die Spalten `alias` und `icon`.

**Änderungen durch [Startformular und Passwort](0009-grilling-startformular-und-passwort.md):** Zeitfenster 15 Minuten statt 60. `trips` bekommt `city`, `comment` und `date`. Eine neue Fahrt beendet die laufende. Die Nummer der Fahrt ist bisherige Fahrten + 1.

**Nachtrag zur Umsetzung (#11):** Der feste Mitfahrer-Code entfällt. Bewertet wird über die aktive Fahrt.
