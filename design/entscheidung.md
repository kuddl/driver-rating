# Design-Entscheidung: Road-Trip Comic

Quelle: `design/Stil-Richtungen für Mitfahrer-Bewertungs-App - Google Gemini.pdf` (Gemini-Chat, Richtung 1).

## Look

- Hintergrund: `#FAF5EF`
- Akzent (Sticker-Orange): `#F39C12`
- Text und Konturen: `#1A1A1A`, Text auf Orange immer schwarz
- Kontrast: `#F1C40F` (Verkehrsgelb)
- Fehler: `#C0392B`
- Schatten: schwarzer Offset-Schatten bei Karten und Buttons
- Schrift: Bangers (Überschriften), Comic Neue (Fließtext)

## Screens

1. **Start:** Schild-Titel, Sprechblase („Schnall dich an! Wie schlägt sich Johanna heute hinterm Lenkrad?“), Info „5 kurze Fragen“, großer Button „FAHRT JETZT BEWERTEN“. Zusätzlich Zustand „Gerade keine Fahrt aktiv“.
2. **Frage:** Fragekarte, drei Emoji-Buttons 😬 😐 😎, Fortschritt.
3. **Abschluss:** Dank-Satz, Pseudonym mit Icon („Du bist Mitfahrer Schwarzer Kater“). Kein Hinweis auf Benachrichtigung.
4. **Johanna-Startformular:** Name und Ziel der Fahrt, geschützt mit dem kleinen Passwort.
5. **Auswertung:** eigener Bereich, geschützt mit dem kleinen Passwort.

## QR-Codes

- **Mitfahrer-Code** (Handschuhfach, Kopfstütze): Schild in Orange, Sprechblase „HILFE! Wie fährt sie?“, Text „SCAN MICH & BEWERTE JOHANNA“.
- **Johanna-Code** (Sonnenblende oder Mittelkonsole): gelbes Badge mit roter Leiste, führt zum Startformular, nicht zur Auswertung.

## Offen

- Icons für die Pseudonyme: Die Katze ist nur ein Platzhalter.
- Titel „JOHANNAS …“ ist fest. Bei mehreren Fahrerinnen wird er später dynamisch.

## Ablauf (Screen-Entscheidungen)

**Mitfahrer-Flow** (Prototyp, Stufe 1):

1. **Start:** Ist eine Fahrt aktiv, steht der Button „FAHRT JETZT BEWERTEN“ bereit. Ist keine Fahrt aktiv, ist der Button ausgegraut, darüber eine geschlossene Garage mit parkendem Auto und der Text „Johanna fährt gerade nicht Auto, hat keine Fahrt“.
2. **Fragen:** Eine Frage pro Bildschirm, Fortschrittsanzeige. Eine Antwort per Tipp auf 😬 😐 😎, danach blättert die Karte automatisch weiter. Kein Zurück. Animation: Die Karte schiebt nach links raus, die nächste kommt von rechts.
3. **Abschluss:** Dank-Satz, Pseudonym mit großem Emoji (z. B. 🐈‍⬛ Schwarzer Kater), Button „NOCHMAL BEWERTEN“. Jeder Durchlauf bekommt ein neues Pseudonym. Das Handy darf weitergegeben werden.

**Icons:** Für den Prototyp große Emojis. Später ersetzen durch kompakte Comic-Illustrationen.

**Offen:** Schutz vor Mehrfach-Bewertungen durch dieselbe Person (zunächst bewusst ohne).
