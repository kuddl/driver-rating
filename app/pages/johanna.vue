<script setup lang="ts">
// Johanna-Startformular (#9): Login einmal pro Gerät, dann Felder mit Platzhaltern.
useHead({ title: 'Fahrt starten' })

const authed = ref<boolean | null>(null)
const password = ref('')
const loginError = ref('')

const nextNumber = ref<number | null>(null)
const active = ref<{ name: string, until: number } | null>(null)
const name = ref('')
const destination = ref('')
const city = ref('')
const comment = ref('')
const date = ref('')
const submitError = ref('')
const success = ref<{ name: string, until: number } | null>(null)
const busy = ref(false)

const fmtTime = (s: number) => new Date(s * 1000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' })

function todayLocal() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

async function loadDefaults() {
  const d = await $fetch<{ nextNumber: number, active: { name: string, until: number } | null }>('/api/johanna/defaults')
  nextNumber.value = d.nextNumber
  active.value = d.active
}

async function checkAuth() {
  const s = await $fetch<{ authenticated: boolean }>('/api/johanna/status')
  authed.value = s.authenticated
  if (authed.value) await loadDefaults()
}

async function login() {
  loginError.value = ''
  try {
    await $fetch('/api/johanna/login', { method: 'POST', body: { password: password.value } })
    password.value = ''
    authed.value = true
    await loadDefaults()
  } catch (e: any) {
    loginError.value = e?.data?.message ?? 'Das passt nicht. Nochmal versuchen.'
  }
}

async function startTrip() {
  submitError.value = ''
  success.value = null
  busy.value = true
  try {
    const r = await $fetch<{ name: string, until: number }>('/api/johanna/trips', {
      method: 'POST',
      body: { name: name.value, destination: destination.value, city: city.value, comment: comment.value, date: date.value },
    })
    success.value = { name: r.name, until: r.until }
    name.value = ''
    destination.value = ''
    city.value = ''
    comment.value = ''
    // Nach dem Start direkt den Mitfahrer-QR-Code zeigen (#12)
    await navigateTo('/mitfahrer')
  } catch (e: any) {
    submitError.value = e?.data?.message ?? 'Hat nicht geklappt. Bitte nochmal tippen.'
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  date.value = todayLocal()
  checkAuth()
})
</script>

<template>
<div class="theme-pop">
  <div class="page">
    <h1>FAHRT STARTEN 🚗</h1>

    <p v-if="authed === null" class="small">Lädt …</p>

    <form v-else-if="!authed" class="card" @submit.prevent="login">
      <div class="field">
        <label for="pw">Passwort</label>
        <input id="pw" v-model="password" type="password" autocomplete="current-password" required>
      </div>
      <p v-if="loginError" class="error">{{ loginError }}</p>
      <button class="btn" type="submit" style="margin-top:14px">ANMELDEN</button>
    </form>

    <template v-else>
      <div v-if="active" class="card" style="font-size:18px">
        Läuft gerade: <strong>{{ active.name }}</strong> bis {{ fmtTime(active.until) }}.
        Eine neue Fahrt beendet sie.
      </div>

      <form class="card" @submit.prevent="startTrip">
        <div class="field">
          <label for="name">Name der Fahrt</label>
          <input id="name" v-model="name" :placeholder="nextNumber ? `Fahrt Nummer ${nextNumber}` : ''">
        </div>
        <div class="field" style="margin-top:12px">
          <label for="dest">Ziel</label>
          <input id="dest" v-model="destination" placeholder="Zu Hause">
        </div>
        <div class="field" style="margin-top:12px">
          <label for="city">Stadt</label>
          <input id="city" v-model="city" placeholder="Zu Hause">
        </div>
        <div class="field" style="margin-top:12px">
          <label for="comment">Kommentar (optional)</label>
          <textarea id="comment" v-model="comment" maxlength="200" placeholder="z. B. Mit Freunden zum Skifahren" />
        </div>
        <input type="hidden" :value="date">

        <p v-if="submitError" class="error" style="margin-top:12px">{{ submitError }}</p>
        <p v-if="success" class="ok" style="margin-top:12px">
          {{ success.name }} läuft bis {{ fmtTime(success.until) }}. Mitfahrer können jetzt bewerten.
        </p>
        <button class="btn" type="submit" :disabled="busy" style="margin-top:16px">FAHRT JETZT STARTEN</button>
      </form>

      <p class="small"><NuxtLink to="/auswertung">Zur Auswertung</NuxtLink></p>
    </template>
  </div>
  </div>
</template>
