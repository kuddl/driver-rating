# Issue-Tracker: lokales Markdown

Standard-Tracker für dieses Repo (kein anderer angegeben).

## Konventionen

- Jedes Issue ist eine Datei `NNNN-kurzer-titel.md` in diesem Ordner.
- Frontmatter-Felder:
  - `id`: fortlaufende Nummer
  - `title`: Name des Issues (im Gespräch immer den Namen verwenden)
  - `type`: `map` oder `ticket`
  - `labels`: z. B. `wayfinder:map`, `wayfinder:research`, `wayfinder:grilling`, `wayfinder:prototype`, `wayfinder:task`
  - `status`: `open` oder `closed`
  - `assignee`: leer = nicht beansprucht
  - `parent`: id der Karte (nur bei Tickets)
  - `blocked-by`: Liste von ids, die vorher geschlossen sein müssen
- Die Antwort steht unter `## Resolution` im Ticket (zusätzlich ein Eintrag in `Decisions so far` der Karte).
- Eine Ticket-Datei ist "frontier", wenn sie offen, unbeansprucht und alle `blocked-by` geschlossen sind.

## Wayfinding-Operationen

- **Karte anlegen:** Datei mit `type: map`, Label `wayfinder:map`.
- **Ticket als Kind anlegen:** Datei mit `parent: <map-id>`.
- **Blockieren:** Ids in `blocked-by` eintragen (zweiter Durchgang nach dem Anlegen).
- **Frontier abfragen:** `grep -L "status: closed" *.md` und Prüfung der `blocked-by`-Liste.
- **Beanspruchen:** `assignee:` setzen, bevor gearbeitet wird.
- **Schließen:** `status: closed` setzen und Resolution ergänzen.
