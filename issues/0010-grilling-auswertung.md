---
id: 10
title: Auswertungsseite
type: ticket
labels: [wayfinder:grilling]
parent: 1
status: closed
assignee:
blocked-by: [3, 9]
---

## Question

Aufbau der passwortgeschützten Auswertung für Johanna: Welche Kennzahlen (Durchschnitt pro Frage, Gesamtergebnis, Top 5 pro Monat, Durchschnitt der letzten 3 Wochen, Liste der Fahrten), welche Filter (Zeitraum, Fahrt), und wie werden Pseudonyme und Icons angezeigt?

## Resolution

Gemeint ist das **Dashboard** über alle Fahrten. Die Ansicht einer einzelnen Fahrt gehört dazu: Ein Klick auf eine Fahrt in der Liste öffnet ihre Detailansicht.

**Kennzahlen (Dashboard):**
- Gesamtergebnis oben: Durchschnitt über alle Antworten, plus Anzahl der Bewertungen und Fahrten.
- Durchschnitt pro Frage.
- Top 5 pro Monat: Fragen mit bestem und schlechtestem Durchschnitt im gewählten Monat.
- Liste der Fahrten: Nummer, Name, Ziel, Stadt, Datum, Anzahl der Bewertungen. Klick öffnet die Detailansicht.
- Kein separater Durchschnitt für die letzten 3 Wochen, dafür gibt es den Zeitraum-Filter.

**Filter:**
- Zeitraum: „Alles“ (Standard) oder ein einzelner Monat. Der Monatsfilter steuert auch die Top 5. Kein freier Datumsbereich.
- Fahrt: Dropdown mit „Alle Fahrten“ (Standard).
- Filter wirken zusammen und gelten für alle Kennzahlen außer der Fahrtenliste.

**Pseudonyme und Icons:**
- Fahrtdetail: Jede Bewertung als Zeile mit Icon, Pseudonym, Uhrzeit und Antworten.
- Dashboard: Rangliste „Wer hat am meisten geblinkt“ mit Pseudonym und Anzahl.
- Gesamtkennzahlen und Durchschnitte: ohne Pseudonyme.
