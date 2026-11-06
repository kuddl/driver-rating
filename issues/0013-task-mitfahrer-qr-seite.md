---
id: 13
title: Mitfahrer-QR-Seite (/mitfahrer mit Druckknopf)
type: ticket
labels: [wayfinder:task]
parent: 1
status: closed
assignee: claude-code
blocked-by: [12]
---

## Question

Umsetzung aus #12: Route `/mitfahrer` zeigt immer den QR-Code der Bewertungsseite `https://driverrating.familiesailer.com/`, ohne Anmeldung. Der QR-Code wird im Browser erzeugt (Bibliothek `qrcode`). Button „Zurück“ führt auf `/`. Druckknopf gibt nur den QR-Code aus. Die gestalteten Karten macht Johanna selbst.

## Resolution

**Umgesetzt und deployt** (`https://driverrating.familiesailer.com/mitfahrer`, HTTP 200).

- `app/pages/mitfahrer.vue`: QR-Code per `qrcode` (Canvas, im Browser), Überschrift „MITFAHRER-QR-CODE“, Text „SCAN MICH & BEWERTE JOHANNA“, Button „Zurück“ auf `/`, Button „DRUCKEN“.
- Druckansicht: Nur der Bereich mit Überschrift, Code und Text wird gedruckt. Buttons sind ausgeblendet.
- Keine Anmeldung nötig.
- Abhängigkeit: `qrcode` in `package.json`.

**Nachbesserung:** Nach dem Start einer Fahrt leitet `/johanna` jetzt auf `/mitfahrer` weiter. Vorher fehlte die Weiterleitung, die Fahrt wurde angelegt, aber der Code erschien nicht.

**Nachbesserung 2:** Der Drucken-Button rief `window.print()` direkt im Template auf, dort ist `window` nicht verfügbar. Die Funktion steht jetzt im Script (`printPage`).

Nicht im Browser geprüft, nur per HTTP-Abruf und Build. Die Bibliothek erzeugt im Node-Test einen gültigen Code.
