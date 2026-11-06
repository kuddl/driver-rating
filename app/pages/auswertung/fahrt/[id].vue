<script setup lang="ts">
// Detailansicht einer Fahrt (#10): Kopf, Bewertungen mit Pseudonym und Antworten.
interface Detail {
  trip: { id: number, name: string, destination: string, city: string, comment: string | null, date: string, started_at: number }
  avg: number | null
  ratings: { id: number, createdAt: number, alias: string, emoji: string, answers: { questionId: number, text: string, score: number }[] }[]
}

const route = useRoute()
const data = ref<Detail | null>(null)
useHead({ title: computed(() => data.value ? `Auswertung · ${data.value.trip.name}` : 'Auswertung') })
const error = ref('')
const emojiOf = (s: number) => ['', '😬', '😐', '😎'][s] ?? '–'
const fmtTime = (s: number) => new Date(s * 1000).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Berlin' })

onMounted(async () => {
  try {
    data.value = await $fetch<Detail>(`/api/auswertung/trips/${route.params.id}`)
  } catch (e: any) {
    error.value = e?.statusCode === 401
      ? 'Bitte zuerst in der Auswertung anmelden.'
      : 'Fahrt nicht gefunden.'
  }
})
</script>

<template>
  <div class="page">
    <NuxtLink to="/auswertung" class="small">← Zur Auswertung</NuxtLink>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="!data" class="small">Lädt …</p>
    <template v-else>
      <h1>{{ data.trip.name }}</h1>
      <div class="card" style="font-size:18px">
        <div><strong>Ziel:</strong> {{ data.trip.destination }}</div>
        <div><strong>Stadt:</strong> {{ data.trip.city }}</div>
        <div><strong>Datum:</strong> {{ data.trip.date }}</div>
        <div v-if="data.trip.comment" style="margin-top:6px"><em>„{{ data.trip.comment }}“</em></div>
        <div style="margin-top:10px"><span class="pill">Ø {{ data.avg == null ? '–' : data.avg.toFixed(2).replace('.', ',') }} / 3</span>
          <span class="pill">{{ data.ratings.length }} Bewertungen</span></div>
      </div>

      <p v-if="!data.ratings.length" class="muted">Noch keine Bewertungen für diese Fahrt.</p>
      <section v-for="r in data.ratings" :key="r.id" class="card">
        <div class="row">
          <h3>{{ r.emoji }} {{ r.alias }}</h3>
          <span class="muted" style="font-size:16px">{{ fmtTime(r.createdAt) }}</span>
        </div>
        <ul class="list" style="margin-top:10px">
          <li v-for="a in r.answers" :key="a.questionId" style="font-size:18px">
            {{ a.text }} <strong>{{ emojiOf(a.score) }}</strong>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
