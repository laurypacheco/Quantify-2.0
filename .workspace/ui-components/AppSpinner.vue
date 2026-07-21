<template>
  <div
    class="q-spinner"
    :class="`q-spinner--${size}`"
    role="status"
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- Track: anillo de fondo (azul muy claro) -->
      <circle
        cx="50" cy="50" r="40"
        stroke="#D6E4F7"
        stroke-width="9"
      />

      <!-- Arco giratorio (azul Quantify — 270° del anillo) -->
      <!--
        Circunferencia = 2π × 40 ≈ 251.3
        Arco 270° = 251.3 × 0.75 ≈ 188.5  →  dashoffset = 251.3 − 188.5 ≈ 62.8
      -->
      <circle
        class="q-arc"
        cx="50" cy="50" r="40"
        stroke="#1B6CB2"
        stroke-width="9"
        stroke-linecap="round"
        stroke-dasharray="251.3"
        stroke-dashoffset="62.8"
      />

      <!-- Cuadrados naranja — motivo del logo (estáticos, pulso suave) -->
      <rect class="q-sq-a" x="55" y="55" width="14" height="14" rx="2.5" fill="#F5A520" />
      <rect class="q-sq-b" x="70" y="70" width="10" height="10" rx="2.5" fill="#F5A520" />
    </svg>

    <span class="q-sr-only">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /**
   * Tamaño del spinner.
   * sm = 24px · md = 40px · lg = 64px · xl = 96px
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Texto accesible leído por lectores de pantalla */
  label?: string
}>(), {
  size: 'md',
  label: 'Cargando...',
})
</script>

<style scoped>
/* ── Contenedor ─────────────────────────────────── */
.q-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.q-spinner svg {
  display: block;
  overflow: visible;
}

/* ── Tamaños ────────────────────────────────────── */
.q-spinner--sm  svg { width: 24px;  height: 24px;  }
.q-spinner--md  svg { width: 40px;  height: 40px;  }
.q-spinner--lg  svg { width: 64px;  height: 64px;  }
.q-spinner--xl  svg { width: 96px;  height: 96px;  }

/* ── Animación del arco ─────────────────────────── */
.q-arc {
  transform-origin: 50px 50px; /* centro del viewBox 0 0 100 100 */
  animation: q-spin 1.1s linear infinite;
}

@keyframes q-spin {
  to { transform: rotate(360deg); }
}

/* ── Pulso de los cuadrados ─────────────────────── */
.q-sq-a {
  animation: q-pulse 1.5s ease-in-out infinite;
}

.q-sq-b {
  animation: q-pulse 1.5s ease-in-out infinite 0.45s;
}

@keyframes q-pulse {
  0%, 100% { opacity: 1;    }
  50%       { opacity: 0.3; }
}

/* ── Accesibilidad ──────────────────────────────── */
.q-sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
