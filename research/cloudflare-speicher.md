# Recherche: Cloudflare-Speicher für die Driver-Rating-Seite

- Ticket: `issues/0002-recherche-cloudflare-speicher.md` (Karte: `issues/0001-karte-driver-rating.md`)
- Stand der Quellen: Abruf am 2026-11-05. Die Cloudflare-Seiten zeigen "Last updated" Daten von Sep. bis Nov. 2026.
- Alle Aussagen stammen aus den verlinkten Primärquellen (offizielle Cloudflare-Docs, Nitro- und Nuxt-Docs). Abschnitt "Eigene Annahmen" ist ausdrücklich als solche markiert.

## Antwort auf die Ticket-Frage

**Empfehlung: D1 (SQLite) als Speicher, Nuxt auf Cloudflare Workers mit Nitro-Preset `cloudflare_module`.**

- D1 bildet Fahrerinnen, Bewertungen und Antworten pro Frage als relationale Tabellen ab. Die Auswertung (Durchschnitt pro Frage, Gesamtergebnis) ist eine SQL-Abfrage mit `GROUP BY`.
- Alle Free-Tier-Limits liegen bei dem erwarteten Volumen (wenige Bewertungen pro Tag) weit unter den Grenzen.
- KV ist als Speicher für Bewertungen schlechter geeignet, weil die Auswertung alle Einträge lesen muss und KV nur eventuell konsistent ist.
- Durable Objects sind für dieses Projekt überdimensioniert. D1 läuft intern selbst auf Durable Objects.
- Preset: Nitro empfiehlt Workers (`cloudflare_module`) als neues Standard-Preset und Pages nur, wenn Pages-spezifische Funktionen gebraucht werden. Die Nuxt-Seite zu Cloudflare beschreibt noch Pages mit `cloudflare_pages`. Ich folge hier der Nitro-Doku, weil sie die aktuellere Empfehlung ist.

## 1. Free-Tier-Limits im Vergleich

| Thema | Workers KV | D1 | Durable Objects (SQLite) |
|---|---|---|---|
| Lesen | 100.000 Keys/Tag | 5 Mio. Rows gelesen/Tag | 5 Mio. Rows gelesen/Tag (SQL), 100.000 Requests/Tag, 13.000 GB-s/Tag Dauer |
| Schreiben | 1.000 Keys/Tag | 100.000 Rows geschrieben/Tag | 100.000 Rows geschrieben/Tag (SQL) |
| Speicher | 1 GB | 5 GB gesamt, DB max. 500 MB | 5 GB gesamt (siehe Widerspruch unten) |
| Eigene Limits | 1.000 Listen/Tag | 50 Queries pro Worker-Aufruf | 1.000 Requests/s pro Objekt (soft) |

Quellen:
- KV Free: 100.000 Reads/Tag, 1.000 Writes/Tag, 1.000 Deletes/Tag, 1.000 Listen/Tag, 1 GB Speicher. [KV Pricing](https://developers.cloudflare.com/kv/platform/pricing/)
- KV Limits: Free: 1.000 Writes/Tag zu verschiedenen Keys, 1 Write/s pro gleichem Key, 1 GB Speicher, Value max. 25 MiB, 1.000 Operationen pro Worker-Aufruf. [KV Limits](https://developers.cloudflare.com/kv/platform/limits/)
- D1 Free: 5 Mio. Rows gelesen/Tag, 100.000 Rows geschrieben/Tag, 5 GB gesamt, 10 Datenbanken, max. 500 MB pro DB. [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- D1 Queries pro Worker-Aufruf: 50 (Free) bzw. 1.000 (Paid). Ein `db.batch()` zählt als eine Query. [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- DO Free: nur SQLite-Backend, 100.000 Requests/Tag, 13.000 GB-s Dauer/Tag, Reads/Writes wie bei D1 (5 Mio./100.000 pro Tag). [DO Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- DO Limits: Free max. 100 DO-Klassen, Speicher 5 GB gesamt, max. 10 GB pro Objekt (Paid). [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)
- Workers Free: 100.000 Requests/Tag, 10 ms CPU-Zeit pro Aufruf. [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)

**Widerspruch in der DO-Doku:** Die Limits-Tabelle nennt für Free 5 GB Speicher pro Account. Die FAQ auf derselben Seite nennt für Free 1 GB bei SQLite-DOs (`SQLITE_FULL`-Fall). Für die Planung nehme ich den kleineren Wert (1 GB) an. Für dieses Projekt ist der Unterschied unerheblich. [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)

## 2. Schreibverhalten und Konsistenz

**Workers KV**
- KV ist ein global verteilter, eventuell konsistenter Key-Value-Store. Schreibvorgänge landen in zentralen Datenspeichern. Änderungen sind am Ort des Schreibens meist sofort sichtbar, andere Standorte brauchen bis zu 60 s oder mehr. Auch "Key existiert nicht" wird gecacht. [KV How it works](https://developers.cloudflare.com/kv/concepts/how-kv-works/)
- KV ist "nicht ideal" für atomare Operationen oder Transaktionen. Dafür empfiehlt Cloudflare Durable Objects. [KV How it works](https://developers.cloudflare.com/kv/concepts/how-kv-works/)
- Cloudflare empfiehlt KV für Lese-lastige Daten wie Konfiguration. Für Schreibe-lastige Muster auf einzelnen Keys (Zähler) ist KV nicht geeignet. [Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)
- Jeder Fetch auf einen nicht existierenden Key zählt als Operation. [KV Pricing](https://developers.cloudflare.com/kv/platform/pricing/)

**D1**
- Jede D1-Datenbank ist von genau einem Durable Object getragen. Abfragen laufen einzeln und seriell. Bei vielen parallelen Anfragen gibt es eine Warteschlange, bei voller Warteschlange den Fehler "overloaded". [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- Schreibvorgänge werden über mehrere Standorte dauerhaft gespeichert. Ein `INSERT` dauert laut Cloudflare einige Millisekunden. [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- Für Mehrfachschreiben empfiehlt Cloudflare `batch()`, damit der Overhead pro Request nur einmal anfällt. [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)

**Durable Objects**
- Ein DO ist einzeln, single-threaded und hat strikt serialisierte Speicherzugriffe. [Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)
- Ein DO kann bis zu 1.000 Requests/s verarbeiten (soft limit). [DO Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)

## 3. Eignung für das Datenmodell

Anforderungen aus der Karte: Fahrerin zuordnen, Zeitstempel, Antworten pro Frage (5 Fragen je Bewertung, drei Stufen), mehrere Fahrerinnen möglich, Auswertung pro Frage.

**D1 (empfohlen)**
- Relational: Tabellen `drivers`, `ratings`, `answers`. Die Auswertung ist eine einfache `GROUP BY`-Abfrage.
- Ein Rating schreibt 1 + 5 = 6 Rows. Mit `batch()` ist das ein Aufruf.
- Die Free-Limits sind bei wenigen Bewertungen am Tag nicht erreichbar. Beispielrechnung unten.
- D1 empfiehlt Cloudflare für "leichtgewichtige, lese-lastige Apps", was hier zutrifft. [Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)

Vorschlag für das Schema (eigene Ableitung, nicht aus einer Quelle):

```sql
CREATE TABLE drivers (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE           -- Johanna, Alexandra, Tobias ...
);
CREATE TABLE ratings (
  id          INTEGER PRIMARY KEY,
  driver_id   INTEGER NOT NULL REFERENCES drivers(id),
  created_at  INTEGER NOT NULL          -- Unix-Millisekunden
);
CREATE INDEX idx_ratings_driver_created ON ratings(driver_id, created_at);
CREATE TABLE answers (
  rating_id    INTEGER NOT NULL REFERENCES ratings(id),
  question_id  TEXT    NOT NULL,        -- ID aus dem JSON-Fragenpool
  level        INTEGER NOT NULL CHECK (level IN (1,2,3)),  -- 😬=1, 😐=2, 😎=3
  PRIMARY KEY (rating_id, question_id)
);
```

Der Index auf `ratings` ist laut D1-Doku sinnvoll, weil er die gelesenen Rows reduziert. Ein Index erzeugt beim Schreiben eine zusätzliche Row. [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)

**Workers KV**
- Ein Key pro Bewertung mit JSON-Wert ist möglich (Wert max. 25 MiB, also unkritisch). [KV Limits](https://developers.cloudflare.com/kv/platform/limits/)
- Auswertung erfordert `list()` plus einen `get()` je Bewertung. Listen sind im Free-Tier auf 1.000/Tag begrenzt. Jede Auswertungsseite liest also alle Bewertungen. [KV Pricing](https://developers.cloudflare.com/kv/platform/pricing/)
- Ein Zähler pro Fahrerin (Read-Modify-Write) wäre nicht atomar. Gleichzeitige Bewertungen können sich überschreiben. Der Ausweg wäre ein DO, dann lohnt sich aber D1 gleich.
- Schreibt man den Zähler auf einen gemeinsamen Key, ist das Limit von 1 Write/s pro Key zu beachten. [KV Limits](https://developers.cloudflare.com/kv/platform/limits/)

**Durable Objects**
- Sinnvoll für Echtzeit oder strikte Serialisierung pro Fahrerin. Für "wenige Bewertungen pro Tag" ist das überdimensioniert.
- Zusatzaufwand: Front-Worker plus DO-Klasse. [Storage options](https://developers.cloudflare.com/workers/platform/storage-options/)
- Nitro unterstützt DO-Klassen im `cloudflare_module`-Preset. [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare)

## 4. Eigene Annahmen und Rechnung

Annahme: höchstens 50 Bewertungen pro Tag (Ticket sagt nur "wenige").

- D1: 50 Ratings × 6 Rows = 300 Rows geschrieben/Tag. Limit Free: 100.000/Tag. Auslastung unter 1 %.
- D1 Speicher: grob 100 Byte pro Rating und 50 Byte pro Antwort, also rund 1 MB/Jahr. Limit Free: 5 GB. Quelle für Speicherbeispiel fehlt, ist eine Schätzung.
- KV: 50 Writes/Tag (ein Key pro Rating). Limit Free: 1.000/Tag. Auslastung 5 %.
- Auswertung KV: bei 18.250 Bewertungen pro Jahr wären das je Seitenaufruf 18.250 Reads. Das Free-Limit (100.000/Tag) wird damit nach wenigen Aufrufen pro Tag erreicht, sobald das Jahr voll ist.

## 5. Nuxt-Deployment und Preset

- Nitro-Preset für Workers: `cloudflare_module`. Ohne Konfiguration beim Bauen; lokale Vorschau über `wrangler dev`, Deployment über `wrangler deploy`. [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare)
- Nitro-Preset für Pages: `cloudflare_pages`, wird als "nicht mehr empfohlen, außer man braucht Pages-spezifische Funktionen" markiert. [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare)
- Die Nuxt-Seite zu Cloudflare beschreibt Pages mit Zero-Config und `npx nuxi build --preset=cloudflare_pages`. [Nuxt Cloudflare](https://nuxt.com/deploy/cloudflare)
- Nuxt verweist für alle Presets auf die Nitro-Doku. [Nuxt Deployment](https://nuxt.com/docs/getting-started/deployment)
- Bindings (D1, KV, DO) werden in der Wrangler-Konfiguration (`wrangler.json`) deklariert. Die Pages-Doku zeigt das Format für `d1_databases` und `kv_namespaces`. Das Nitro-Beispiel zeigt die DO-Deklaration im Worker-Format. [Pages Wrangler-Config](https://developers.cloudflare.com/pages/functions/wrangler-configuration/), [Pages Bindings](https://developers.cloudflare.com/pages/functions/bindings/), [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare)
- Env-Variablen (Secrets wie Passwort für die Auswertung): nur im Request-Lebenszyklus lesbar, nicht im globalen Scope. Lokal über `.dev.vars`, produktiv über `wrangler secret`. [Nitro Cloudflare](https://nitro.build/deploy/providers/cloudflare)
- Pages-Funktionen: Requests zählen auf das Workers-Kontingent, statische Assets sind frei. [Pages Pricing](https://developers.cloudflare.com/pages/functions/pricing/)

## 6. Offene Punkte

- D1 `d1_databases`-Binding im Workers-Format (`wrangler.json`) ist hier nicht aus der Workers-Doku belegt. Der Beispielblock stammt aus der Pages-Doku. Vor der Umsetzung gegen die Workers-Doku prüfen.
- Die Frage, ob die Auswertungsseite serverseitig (Passwort, Nitro-Route) oder clientseitig abgerufen wird, ist Teil der Karte und nicht dieses Tickets.

## Quellen

- KV Limits: https://developers.cloudflare.com/kv/platform/limits/
- KV Pricing: https://developers.cloudflare.com/kv/platform/pricing/
- KV How it works: https://developers.cloudflare.com/kv/concepts/how-kv-works/
- D1 Limits: https://developers.cloudflare.com/d1/platform/limits/
- D1 Pricing: https://developers.cloudflare.com/d1/platform/pricing/
- Durable Objects Limits: https://developers.cloudflare.com/durable-objects/platform/limits/
- Durable Objects Pricing: https://developers.cloudflare.com/durable-objects/platform/pricing/
- Durable Objects Data location: https://developers.cloudflare.com/durable-objects/reference/data-location/
- Workers Pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Storage options (Choose a data or storage product): https://developers.cloudflare.com/workers/platform/storage-options/
- Pages Functions Bindings: https://developers.cloudflare.com/pages/functions/bindings/
- Pages Wrangler-Config: https://developers.cloudflare.com/pages/functions/wrangler-configuration/
- Pages Functions Pricing: https://developers.cloudflare.com/pages/functions/pricing/
- Nitro Cloudflare-Preset: https://nitro.build/deploy/providers/cloudflare
- Nuxt Cloudflare-Deployment: https://nuxt.com/deploy/cloudflare
- Nuxt Deployment (Presets): https://nuxt.com/docs/getting-started/deployment
