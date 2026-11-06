<script setup lang="ts">
// Mitfahrer-QR-Code (#12/#13): zeigt immer den Code zur Bewertungsseite, ohne Anmeldung.
import QRCode from 'qrcode'

useHead({ title: 'Mitfahrer-QR-Code' })

const MITFAHRER_URL = 'https://driverrating.familiesailer.com/'
const canvas = ref<HTMLCanvasElement | null>(null)
const error = ref('')

function printPage() {
  window.print()
}

onMounted(async () => {
  if (!canvas.value) return
  try {
    await QRCode.toCanvas(canvas.value, MITFAHRER_URL, { width: 320, margin: 2, errorCorrectionLevel: 'M' })
  } catch {
    error.value = 'QR-Code konnte nicht erzeugt werden.'
  }
})
</script>

<template>
<div class="theme-pop">
  <div class="stage">
    <div class="no-print">
      <NuxtLink to="/" class="btn btn-small">← Zurück</NuxtLink>
    </div>

    <div class="print-area">
      <h1>MITFAHRER-QR-CODE</h1>
      <div class="card qr-card">
        <canvas ref="canvas" />
        <p v-if="error" class="error">{{ error }}</p>
      </div>
      <p class="qr-caption">SCAN MICH & BEWERTE JOHANNA</p>
    </div>

    <button class="btn no-print" @click="printPage">DRUCKEN</button>
  </div>
  </div>
</template>

<style scoped>
.print-area {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.qr-card {
  display: flex;
  justify-content: center;
  padding: 16px;
}
.qr-card canvas {
  width: 100%;
  max-width: 320px;
  height: auto;
}
.qr-caption {
  font-family: "Bangers", cursive;
  font-size: 28px;
  letter-spacing: 1px;
  text-align: center;
  margin: 0;
}

@media print {
  .no-print { display: none !important; }
  body { background: #fff; }
  .stage { min-height: auto; padding: 0; max-width: none; }
  .print-area { gap: 24px; }
  .qr-card { box-shadow: none; }
}
@media print {
  .theme-pop { background: #fff; min-height: auto; }
}
</style>
