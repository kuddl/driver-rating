<script setup lang="ts">
// Auswertung (#10): Dashboard über alle Fahrten, Filter Zeitraum und Fahrt.
interface Dash {
  totals: { ratings: number, trips: number, avg: number | null }
  perQuestion: { id: number, text: string, avg: number, n: number }[]
  top: { id: number, text: string, avg: number, n: number }[]
  flop: { id: number, text: string, avg: number, n: number }[]
  fans: { alias: string, icon: string, avg: number, n: number }[]
  critics: { alias: string, icon: string, avg: number, n: number }[]
  trips: { id: number, name: string, destination: string, city: string, date: string, started_at: number, ratings: number }[]
  filters: { months: string[], trips: { id: number, name: string }[] }
}

useHead({ title: 'Auswertung' })

const authed = ref<boolean | null>(null)
const password = ref('')
const loginError = ref('')
const month = ref('')
const trip = ref('')
const dash = ref<Dash | null>(null)
const loadError = ref('')
const TRIPS_PAGE = 10
const tripLimit = ref(TRIPS_PAGE)

const fmtAvg = (v: number | null | undefined) => v == null ? '–' : v.toFixed(2).replace('.', ',')
const pct = (avg: number) => Math.round((avg / 3) * 100)
const monthLabel = (m: string) => {
  const [y, mo] = m.split('-')
  return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
}

async function load() {
  loadError.value = ''
  try {
    const q = new URLSearchParams()
    if (month.value) q.set('month', month.value)
    if (trip.value) q.set('trip', trip.value)
    dash.value = await $fetch<Dash>(`/api/auswertung/dashboard?${q}`)
  } catch (e: any) {
    if (e?.statusCode === 401) authed.value = false
    else loadError.value = 'Konnte die Auswertung nicht laden.'
  }
}

async function checkAuth() {
  const s = await $fetch<{ authenticated: boolean }>('/api/johanna/status')
  authed.value = s.authenticated
  if (authed.value) await load()
}

async function login() {
  loginError.value = ''
  try {
    await $fetch('/api/johanna/login', { method: 'POST', body: { password: password.value } })
    password.value = ''
    authed.value = true
    await load()
  } catch (e: any) {
    loginError.value = e?.data?.message ?? 'Das passt nicht. Nochmal versuchen.'
  }
}

onMounted(checkAuth)
</script>

<template>
  <div class="page">
    <h1>AUSWERTUNG 📊</h1>

    <p v-if="authed === null" class="small">Lädt …</p>

    <form v-else-if="!authed" class="card" @submit.prevent="login">
      <div class="field">
        <label for="pw">Passwort</label>
        <input id="pw" v-model="password" type="password" autocomplete="current-password" required>
      </div>
      <p v-if="loginError" class="error">{{ loginError }}</p>
      <button class="btn" type="submit" style="margin-top:14px">ANMELDEN</button>
    </form>

    <template v-else-if="dash">
      <div class="card row" style="font-size:18px">
        <div class="field" style="flex:1 1 160px">
          <label for="month">Zeitraum</label>
          <select id="month" v-model="month" @change="load">
            <option value="">Alles</option>
            <option v-for="m in dash.filters.months" :key="m" :value="m">{{ monthLabel(m) }}</option>
          </select>
        </div>
        <div class="field" style="flex:1 1 160px">
          <label for="trip">Fahrt</label>
          <select id="trip" v-model="trip" @change="load">
            <option value="">Alle Fahrten</option>
            <option v-for="t in dash.filters.trips" :key="t.id" :value="String(t.id)">{{ t.name }}</option>
          </select>
        </div>
      </div>

      <p v-if="loadError" class="error">{{ loadError }}</p>

      <div class="row" style="gap:12px; align-items:stretch">
        <div class="card" style="flex:1 1 140px; text-align:center">
          <div class="muted">Gesamt Ø</div>
          <h2>{{ fmtAvg(dash.totals.avg) }} <span class="muted">/ 3</span></h2>
        </div>
        <div class="card" style="flex:1 1 140px; text-align:center">
          <div class="muted">Bewertungen</div>
          <h2>{{ dash.totals.ratings }}</h2>
        </div>
        <div class="card" style="flex:1 1 140px; text-align:center">
          <div class="muted">Fahrten</div>
          <h2>{{ dash.totals.trips }}</h2>
        </div>
      </div>

      <section class="card">
        <h3>Durchschnitt pro Frage</h3>
        <p v-if="!dash.perQuestion.length" class="muted">Noch keine Bewertungen.</p>
        <table v-else class="stats" style="margin-top:8px">
          <tbody>
            <tr v-for="q in dash.perQuestion" :key="q.id">
              <td>{{ q.text }}</td>
              <td style="width:110px"><div class="bar"><span :style="{ width: pct(q.avg) + '%' }" /></div></td>
              <td class="num">{{ fmtAvg(q.avg) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h3>Top 5</h3>
        <ol v-if="dash.top.length" style="margin:8px 0 0; padding-left:24px; font-size:18px">
          <li v-for="q in dash.top" :key="q.id">{{ q.text }} <span class="pill">{{ fmtAvg(q.avg) }}</span></li>
        </ol>
        <p v-else class="muted">Noch keine Daten.</p>
        <h3 style="margin-top:16px">Flop 5</h3>
        <ol v-if="dash.flop.length" style="margin:8px 0 0; padding-left:24px; font-size:18px">
          <li v-for="q in dash.flop" :key="q.id">{{ q.text }} <span class="pill">{{ fmtAvg(q.avg) }}</span></li>
        </ol>
      </section>

      <section class="card">
        <h3>Größte Fans 😎</h3>
        <ul v-if="dash.fans.length" class="list" style="margin-top:8px">
          <li v-for="p in dash.fans" :key="p.alias" class="row">
            <span>{{ p.alias }}</span><span class="pill">Ø {{ fmtAvg(p.avg) }} · {{ p.n }}×</span>
          </li>
        </ul>
        <p v-else class="muted">Mindestens 2 Bewertungen pro Pseudonym nötig.</p>
        <h3 style="margin-top:16px">Schärfste Kritiker 😬</h3>
        <ul v-if="dash.critics.length" class="list" style="margin-top:8px">
          <li v-for="p in dash.critics" :key="p.alias" class="row">
            <span>{{ p.alias }}</span><span class="pill">Ø {{ fmtAvg(p.avg) }} · {{ p.n }}×</span>
          </li>
        </ul>
      </section>

      <section class="card">
        <h3>Fahrten</h3>
        <p v-if="!dash.trips.length" class="muted" style="margin-top:8px">Keine Fahrten für diesen Filter.</p>
        <ul v-else class="list" style="margin-top:8px">
          <li v-for="t in dash.trips.slice(0, tripLimit)" :key="t.id">
            <NuxtLink :to="`/auswertung/fahrt/${t.id}`">
              <strong>{{ t.name }}</strong><br>
              <span class="muted" style="font-size:16px">{{ t.date }} · {{ t.destination }}, {{ t.city }} · {{ t.ratings }} Bewertungen</span>
            </NuxtLink>
          </li>
        </ul>
        <button v-if="dash.trips.length > tripLimit" class="btn btn-small" style="margin-top:12px" @click="tripLimit += TRIPS_PAGE">
          Mehr Fahrten laden ({{ dash.trips.length - tripLimit }} weitere)
        </button>
      </section>
    </template>
  </div>
</template>
