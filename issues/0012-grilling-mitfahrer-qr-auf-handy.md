---
id: 12
title: Mitfahrer-QR-Code auf Johannas Handy
type: ticket
labels: [wayfinder:grilling]
parent: 1
status: closed
assignee:
blocked-by: [11]
---

## Question

Idee aus der Umsetzung: Nach dem Start einer Fahrt zeigt das Startformular (`/johanna`) auf Johannas Handy den QR-Code zur Mitfahrer-Seite, mit der Überschrift „Mitfahrer-QR-Code“. Johanna kann das Handy nach hinten geben, und die Mitfahrer scannen den Code direkt vom Handy. Das ersetzt den Zettel im Auto, falls er fehlt.

Offene Punkte für das Gespräch:
- **Anzeige:** Wo genau erscheint der QR-Code nach dem Start? Direkt im Ergebnis-Hinweis oder als eigener Bildschirm?
- **Zeitraum:** Nur während die Fahrt läuft (15 Minuten, #9), oder solange die Fahrt in der Liste steht?
- **Inhalt:** Die Adresse `https://driverrating.familiesailer.com/` ohne weitere Parameter, da der Mitfahrer-Code entfällt (#3)?
- **Erzeugung:** Der QR-Code wird im Browser erzeugt (Bibliothek), damit kein externer Dienst nötig ist. Oder eine fertige Grafik vom Server?
- **Größe und Stil:** Große Darstellung für das Scannen, im Look „Road-Trip Comic“ (Rahmen, Schatten, Titel „Mitfahrer-QR-Code“).
- **Ausdruck:** Soll der Code auch druckbar sein, falls der Zettel doch noch gebraucht wird?

## Resolution

**Route `/mitfahrer`:** Eigene Seite, die immer den QR-Code zeigt. Der Code hängt nicht an einer laufenden Fahrt, weil sich die Adresse nie ändert. Sie öffnet sich nach dem Start einer Fahrt auf Johannas Handy.

**Inhalt:** Die Adresse der Bewertungsseite `https://driverrating.familiesailer.com/` ohne Parameter. Der Mitfahrer-Code entfällt (#3, Entscheidung in #11).

**Anmeldung:** Keine. Auf der Seite steht nichts Sensibles.

**Erzeugung:** Im Browser per JavaScript-Bibliothek, kein externer Dienst, keine Grafik vom Server.

**Anzeige:** Vollbild-Ansicht nur mit Überschrift „Mitfahrer-QR-Code“, großem Code und dem Button „Zurück“.

**Zurück-Button:** Führt auf `/`, die Bewertungsseite. Johanna gelangt von dort nicht direkt zum Startformular und muss `/johanna` selbst aufrufen.

**Druck:** Druckknopf auf der Seite, die Druckansicht zeigt nur den QR-Code. Die schönen Karten mit Design gestaltet Johanna selbst. Die Vorlage aus `design/` (Gemini) ist dafür der Ausgangspunkt.
