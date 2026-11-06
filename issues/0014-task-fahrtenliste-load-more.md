---
id: 14
title: Load-more für die Fahrtenliste im Dashboard
type: ticket
labels: [wayfinder:task]
parent: 1
status: closed
assignee:
blocked-by: []
---

## Question

Auf der Auswertung (`/auswertung`) werden alle Fahrten untereinander angezeigt. Ab etwa 10 Fahrten wird die Seite zu lang. Gewünscht: Die Liste zeigt zunächst 10 Fahrten, darunter ein Button „Mehr Fahrten laden“, der jeweils weitere 10 nachlädt. Der Rest der Auswertung bleibt unverändert.

## Resolution

Umgesetzt in `app/pages/auswertung/index.vue`: Die Fahrtenliste zeigt 10 Fahrten, der Button „Mehr Fahrten laden (N weitere)“ ergänzt jeweils 10. Die Daten kommen schon vollständig vom Dashboard, daher ist kein API-Eingriff nötig. Deployt.
