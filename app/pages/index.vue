<script setup lang="ts">
// Mitfahrer-Seite (#9/#6): Garage oder Start, 5 Fragen mit drei Emoji-Stufen, Abschluss mit Pseudonym.
interface Q {
  id: number;
  text: string;
}
interface Character {
  alias: string;
  icon: string;
  emoji: string;
}
type Phase = "loading" | "garage" | "start" | "question" | "done";

useHead({ title: "Mitfahrer" });

const phase = ref<Phase>("loading");
const questions = ref<Q[]>([]);
const index = ref(0);
const answers = ref<{ questionId: number; score: number }[]>([]);
const character = ref<Character | null>(null);
const result = ref<Character | null>(null);
const busy = ref(false);
const error = ref("");
const current = computed(() => questions.value[index.value]);

async function loadStatus() {
  error.value = "";
  try {
    const s = await $fetch<{ active: boolean }>("/api/rating/status");
    phase.value = s.active ? "start" : "garage";
  } catch {
    phase.value = "start";
    error.value = "Verbindung klappt gerade nicht. Bitte nochmal laden.";
  }
}

async function startRating() {
  error.value = "";
  try {
    const r = await $fetch<{ questions: Q[]; character: Character }>("/api/rating/questions");
    questions.value = r.questions;
    character.value = r.character;
    result.value = null;
    index.value = 0;
    answers.value = [];
    phase.value = "question";
  } catch (e: any) {
    if (e?.statusCode === 409) phase.value = "garage";
    else error.value = "Hat nicht geklappt. Bitte nochmal tippen.";
  }
}

async function answer(score: number) {
  if (busy.value || !current.value) return;
  busy.value = true;
  answers.value.push({ questionId: current.value.id, score });
  await new Promise((r) => setTimeout(r, 350));
  busy.value = false;
  if (index.value + 1 < questions.value.length) {
    index.value++;
    return;
  }
  await submit();
}

async function submit() {
  busy.value = true;
  try {
    result.value = await $fetch("/api/rating/submit", {
      method: "POST",
      body: { answers: answers.value, characterIcon: character.value?.icon },
    });
    phase.value = "done";
  } catch (e: any) {
    if (e?.statusCode === 409) {
      phase.value = "garage";
    } else {
      // Antworten bleiben erhalten, ein Tipp auf den letzten Button sendet erneut
      index.value = questions.value.length - 1;
      answers.value.pop();
      error.value = "Hat nicht geklappt. Bitte nochmal tippen.";
    }
  } finally {
    busy.value = false;
  }
}

onMounted(loadStatus);
</script>

<template>
  <div class="theme-pop">
    <div class="stage">
      <template v-if="phase === 'loading'">
        <p class="small">Lädt …</p>
      </template>

      <template v-else-if="phase === 'garage'">
        <div class="frame">
          <h1>JOHANNAS FAHRT-CHECK 🚗</h1>
          <div class="card garage">
            🏠🔒
            <p>Johanna fährt gerade nicht Auto, hat keine Fahrt.</p>
          </div>
          <button class="btn" disabled>FAHRT JETZT BEWERTEN!</button>
          <button class="btn btn-small" style="align-self: center" @click="loadStatus">Nochmal prüfen</button>
        </div>
      </template>

      <template v-else-if="phase === 'start'">
        <div class="frame">
          <h1>JOHANNAS FAHRT-CHECK</h1>
          <img class="art art-car" src="/art/car.svg" alt="Auto" />
          <div class="sign">Schnall dich an! Wie schlägt sich Johanna heute hinterm Lenkrad?</div>
          <p class="small">5 kurze Fragen · Dauer: 30 Sek.</p>
          <p v-if="error" class="error">{{ error }}</p>
          <button class="btn ticket" @click="startRating">FAHRT JETZT BEWERTEN!</button>
          <!-- <div class="footer-row">
            <span class="small">Fortschritt</span>
            <img class="art-avatar" src="/art/avatar.webp" alt="Johanna" />
          </div> -->
        </div>
      </template>

      <template v-else-if="phase === 'question' && current">
        <div class="frame">
         
          <div v-if="character" class="ticket">
            <img class="art-animal" :src="`/art/animals/${character.icon}.webp`" :alt="character.alias" />
            <div>
              <div class="label">Du bist Mitfahrer</div>
              <div class="name ">{{ character.alias.toUpperCase() }}</div>
            </div>
          </div>
          <div :key="index" class="card slide-in ticket">
            Frage {{ index + 1 }} von {{ questions.length }}: {{ current.text }}
          </div>
          <div class="answers-col">
            <button class="answer" :disabled="busy" @click="answer(1)">
              <span class="face">😬</span>Johanna, bitte!
            </button>
            <button class="answer" :disabled="busy" @click="answer(2)"><span class="face">😐</span>Naja..</button>
            <button class="answer" :disabled="busy" @click="answer(3)"><span class="face">😎</span>Super!</button>
          </div>
          <p v-if="error" class="error">{{ error }}</p>
           <div class="footer-row">
            <div class="dots">
              <span v-for="(q, i) in questions" :key="q.id" class="dot" :class="{ done: i < index }" />
            </div>
            <img class="art-avatar" src="/art/avatar.webp" alt="Johanna" />
          </div>
        </div>
      </template>

      <template v-else-if="phase === 'done' && result">
        <div class="frame">
          <img class="art burst-img" src="/art/burst.webp" alt="Vielen Dank!" />
          <p class="ticket" style="font-size: 20px; margin: 0; text-align: center">Beehre uns bald wieder im Auto!</p>
          <div class="ticket">
            <img class="art-animal" :src="`/art/animals/${result.icon}.webp`" :alt="result.alias" />
            <div>
              <div class="name ">{{ result.alias.toUpperCase() }}</div>
            </div>
          </div>
          <button class="btn answer "  @click="startRating">NOCHMAL BEWERTEN!</button>
        </div> 
      </template>
    </div>
  </div>
</template>
