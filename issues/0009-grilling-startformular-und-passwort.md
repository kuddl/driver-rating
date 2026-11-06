---
id: 9
title: Johanna-Startformular und Passwortschutz
type: ticket
labels: [wayfinder:grilling]
parent: 1
status: closed
assignee:
blocked-by: [7]
---

## Question

Ablauf des Johanna-Startformulars: Felder (Name der Fahrt, Ziel), Dauer des Zeitfensters (60 Minuten), Verhalten bei laufender Fahrt (neue Fahrt überschreibt oder wird abgelehnt?), Passwort-Eingabe (Sitzung oder bei jedem Start), Fehlermeldungen. Dazu: Wie wird das Passwort gespeichert (Umgebungsvariable als Secret)?

## Resolution

**Startformular (Johanna):**
- **Name der Fahrt:** Platzhalter „Fahrt Nummer N“, N = bisherige Fahrten von Johanna + 1. Überschreibbar.
- **Ziel:** Platzhalter „Zu Hause“, Pflicht. Überschreibbar.
- **Stadt:** Platzhalter „Zu Hause“, Pflicht. Überschreibbar.
- **Kommentar:** Optionales Textfeld, Beispiele wie „Mit Freunden zum Skifahren“.
- **Datum:** Verstecktes Feld, wird immer mitgeführt.
- Platzhalter sind keine Werte: Das Feld ist leer, beim Tippen verschwindet der Text. Bleibt ein Feld beim Absenden leer, wird der Platzhalter gespeichert.

**Laufende Fahrt:** Eine neue Fahrt beendet die laufende sofort und startet direkt. Kein Warten.

**Zeitfenster:** 15 Minuten fest ab Start. Keine Verlängerung durch Bewertungen. Ist mehr Zeit nötig, startet Johanna eine neue Fahrt.

**Passwort:** Eingabe einmal pro Gerät. Anmeldung per Cookie für 30 Tage, nur auf Johannas Gerät. Das Cookie enthält einen vom Server ausgestellten Token, nicht das Passwort.

**Speicherung:** Umgebungsvariable als Secret (`wrangler secret put`), nicht im Repo.

**Fehlermeldungen:**
- Falsches Passwort: „Das passt nicht. Nochmal versuchen.“ Ohne Hinweis auf Teiltreffer.
- Fehler beim Speichern: „Hat nicht geklappt. Bitte nochmal tippen.“ Eingaben bleiben erhalten.

**Folgen für das Datenmodell (#3):** `trips` bekommt `city`, `comment`, `date`. `destination` heißt jetzt „Ziel“. Zeitfenster 15 Minuten statt 60.
