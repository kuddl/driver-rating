---
id: 16
title: Design-Umsetzung (orange Screens, SVG-Grafiken, neue Antwort-Buttons)
type: ticket
labels: [wayfinder:task]
parent: 1
status: closed
assignee: claude-code
blocked-by: [15]
---

## Question

Umsetzung aus #15:
- Mitfahrer-Screens (Start, Frage, Abschluss), QR-Seite `/mitfahrer` und Startformular `/johanna` mit orangem Vollbild-Hintergrund und Comic-Rahmen. Die Auswertung bleibt unverändert.
- Antwort-Buttons mit Emoji und Text: „Johanna, bitte!“, „Naja..“, „Super!“.
- Eigene SVG-Grafiken: Auto, Johanna-Avatar, acht Pseudonym-Tiere.
- Abschluss mit Sprechblase „Vielen Dank!“ und Pseudonym-Karte mit SVG-Icon.
- Druckansicht des QR-Codes bleibt hell und schlicht.

## Resolution

**Umgesetzt und deployt.**

- **Mitfahrer-Screens** (`app/pages/index.vue`): orangener Vollbild-Hintergrund über die Klasse `theme-pop`, Rahmen im Comic-Stil. Startscreen mit Auto, Fragescreen mit drei Antwort-Buttons „Johanna, bitte!“ / „Naja..“ / „Super!“, Abschluss mit Sprechblase „VIELEN DANK!“ und Pseudonym-Ticket mit Tier-Icon.
- **Startformular** (`/johanna`) und **QR-Seite** (`/mitfahrer`) im selben Look. Die QR-Seite druckt weiterhin hell (`@media print`).
- **Grafiken** in `public/art/`: `car.svg`, `avatar.svg`, `burst.svg`, `animals/` mit acht Tieren. Der Server liefert dafür das Icon-Kennzeichen mit (`icon` in `/api/rating/submit`).
- **Auswertung** unverändert.

**Hinweis:** Die Grafiken sind eine erste Fassung, selbst gezeichnet. Der Avatar ist ein neutraler Kopf mit Sonnenbrille und noch keine Johanna-Figur. Die Seiten habe ich nicht im Browser geprüft, nur per Build und HTTP-Abruf.
