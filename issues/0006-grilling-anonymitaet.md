---
id: 6
title: Anonymität der Bewertungen
type: ticket
labels: [wayfinder:grilling]
parent: 1
status: closed
assignee:
blocked-by: [3]
---

## Question

Sollen Mitfahrer mit Namen oder anonym bewerten? Wie viel Information wird pro Bewertung gespeichert (nur Antwort, Zeitstempel, Name)? Diese Entscheidung beeinflusst den Datenschutz und das Datenmodell.

## Resolution

**Anonym mit Pseudonym und Icon.** Jede Bewertung bekommt zufällig ein Pseudonym aus einem Namensgenerator (z. B. „Schwarzer Kater“, „Roter Auerhahn“) und ein passendes Icon. Die Mitfahrer sehen ihr Pseudonym nach dem Abschicken („Du bist Mitfahrer Schwarzer Kater“).

- Kein Cookie, kein Login, kein Speicher im Browser.
- Ein Pseudonym gilt nur für eine Bewertung. Es wird nicht über mehrere Bewertungen wiedererkannt.
- Die Auswertung kann trotzdem Pseudonyme zählen („Schwarzer Kater hat am meisten geblinkt“). Dafür reicht ein Pseudonym pro Bewertung.

**Datenmodell-Auswirkung:** Tabelle `ratings` bekommt zwei Spalten: `alias` (Text) und `icon` (Schlüssel für das Icon). Keine personenbezogenen Daten.
