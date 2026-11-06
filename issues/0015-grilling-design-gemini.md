---
id: 15
title: Design-Überarbeitung nach Gemini-Screens
type: ticket
labels: [wayfinder:grilling]
parent: 1
status: closed
assignee:
blocked-by: []
---

## Question

Die Screens der Mitfahrer- und Johanna-Seiten sollen poppiger werden, nach den Gemini-Entwürfen im Ordner `design/`: orangener Vollbild-Hintergrund, Comic-Grafiken (Auto, Pseudonym-Karte mit Icon, Sprechblase „Vielen Dank!“), Fortschrittspunkte mit Johanna-Avatar, Antwort-Buttons mit Text. Die Auswertung bleibt unverändert.

Vorlagen im Ordner `design/`:
- `Code_Generated_Image.jpeg`: Startscreen „Fahrt jetzt bewerten!“ mit Auto und Johanna-Avatar
- `Code_Generated_Image (1).jpeg`: Abschluss „Vielen Dank!“ mit Pseudonym-Karte und Katze
- `Code_Generated_Image (4).jpeg`: Fragescreen mit Buttons „Hilfe! / Naja.. / Super!“ und Emojis

Offene Punkte für das Gespräch:
- Antwort-Buttons: nur Emoji oder Emoji plus Text?
- Grafiken: eigene Illustrationen, Platzhalter oder Emojis?
- Pseudonym-Icons: Katze und weitere Tiere als Illustrationen?
- Johanna-Avatar: Foto, Illustration oder weglassen?
- Mitfahrer-QR-Seite (`/mitfahrer`) und Johanna-Formular: gleicher Look wie die Mitfahrer-Screens?

## Resolution

**Entscheidungen:**
1. **Antwort-Buttons:** Emoji mit Text. 😬 „Johanna, bitte!“, 😐 „Naja..“, 😎 „Super!“.
2. **Grafiken:** Eigene Grafiken als SVG im Comic-Stil, keine Gemini-Bilder. Die Vorlagen sind nur Referenz.
3. **Johanna-Avatar:** Illustration im Comic-Stil unten rechts neben den Fortschrittspunkten. Kein Foto.
4. **Geltungsbereich:** Alle Seiten im neuen Look: Mitfahrer (Start, Frage, Abschluss), QR-Seite `/mitfahrer`, Startformular `/johanna`. Die Auswertung bleibt unverändert.
5. **Pseudonym-Icons:** Alle acht als SVG im selben Stil: Schwarzer Kater, Rosa Einhorn, Lustiges Eichhörnchen, Roter Auerhahn, Müder Dachs, Stolzer Biber, Tanzende Eule, Sportlicher Frosch.
6. **Hintergrund:** Vollbild orange (`#F39C12`), Karten und Buttons mit Comic-Rahmen und Offset-Schatten. Der helle Hintergrund (`#FAF5EF`) bleibt auf der Auswertung und beim QR-Druck.

**Hinweis:** Im Ordner `design/` liegen nur noch drei der Gemini-Bilder. Die anderen zwei (2 und 3) sind nicht mehr da.
