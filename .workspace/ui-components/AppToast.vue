<template>
  <Teleport to="body">
    <div class="q-toast-stack">
      <TransitionGroup name="q-toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="q-toast"
          :class="`q-toast--${toast.type}`"
          role="alert"
          aria-live="polite"
        >
          <!-- Left accent bar -->
          <div class="q-toast__bar" />

          <!-- Icon -->
          <div class="q-toast__icon">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Q arc (brand circle) -->
              <circle cx="10" cy="10" r="8.5"
                :stroke="iconColor(toast.type)"
                stroke-width="1.6"
                stroke-dasharray="38"
                stroke-dashoffset="10"
                stroke-linecap="round"
              />
              <!-- Checkmark -->
              <path v-if="toast.type === 'success'"
                d="M6.5 10.5 L9 13 L13.5 8"
                :stroke="iconColor(toast.type)"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <!-- Warning exclamation -->
              <path v-else-if="toast.type === 'warning'"
                d="M10 6.5 V10.5 M10 13 V13.5"
                :stroke="iconColor(toast.type)"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <!-- Error X -->
              <path v-else-if="toast.type === 'error'"
                d="M7 7 L13 13 M13 7 L7 13"
                :stroke="iconColor(toast.type)"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <!-- Orange squares (Quantify logo motif) -->
              <rect x="11.5" y="11.5" width="3.5" height="3.5" rx="0.6" :fill="iconColor(toast.type)" opacity="0.35"/>
            </svg>
          </div>

          <!-- Text -->
          <div class="q-toast__body">
            <span class="q-toast__title">{{ toast.title }}</span>
            <span v-if="toast.message" class="q-toast__message">{{ toast.message }}</span>
          </div>

          <!-- Close -->
          <button class="q-toast__close" @click="dismiss(toast.id)" aria-label="Cerrar">
            <svg viewBox="0 0 12 12" fill="none">
              <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Progress bar -->
          <div class="q-toast__progress">
            <div
              class="q-toast__progress-fill"
              :style="{ animationDuration: toast.duration + 'ms' }"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface ToastOptions {
  title: string
  message?: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

interface Toast extends Required<ToastOptions> {
  id: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

function iconColor(type: Toast['type']) {
  const map = {
    success: '#1B6CB2',
    warning: '#F5A520',
    error:   '#EF4444',
    info:    '#1B6CB2',
  }
  return map[type]
}

function show(options: ToastOptions) {
  const id = ++nextId
  const toast: Toast = {
    id,
    title:    options.title,
    message:  options.message ?? '',
    type:     options.type ?? 'success',
    duration: options.duration ?? 3500,
  }
  toasts.value.push(toast)
  setTimeout(() => dismiss(id), toast.duration)
  return id
}

function dismiss(id: number) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

// Expose the show method so parent can call it
defineExpose({ show, dismiss })
</script>

<style scoped>
/* ── Stack position ─────────────────────────────── */
.q-toast-stack {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

/* ── Toast card ─────────────────────────────────── */
.q-toast {
  pointer-events: all;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 320px;
  padding: 14px 14px 18px 0;
  background: #ffffff;
  border-radius: 10px;
  box-shadow:
    0 4px 20px rgba(27, 108, 178, 0.14),
    0 1px 4px  rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* ── Left accent bar ────────────────────────────── */
.q-toast__bar {
  width: 4px;
  align-self: stretch;
  flex-shrink: 0;
  border-radius: 4px 0 0 4px;
}
.q-toast--success .q-toast__bar { background: #1B6CB2; }
.q-toast--info    .q-toast__bar { background: #1B6CB2; }
.q-toast--warning .q-toast__bar { background: #F5A520; }
.q-toast--error   .q-toast__bar { background: #EF4444; }

/* ── Icon ───────────────────────────────────────── */
.q-toast__icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
}
.q-toast__icon svg { width: 100%; height: 100%; }

/* ── Body ───────────────────────────────────────── */
.q-toast__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.q-toast__title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: .875rem;
  font-weight: 600;
  color: #1A2B3C;
  line-height: 1.3;
}
.q-toast__message {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: .78rem;
  color: #6B7C93;
  line-height: 1.4;
}

/* ── Close button ───────────────────────────────── */
.q-toast__close {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: none;
  background: none;
  cursor: pointer;
  color: #A0B0C0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0;
  margin-right: 6px;
  transition: color .15s, background .15s;
}
.q-toast__close:hover {
  color: #1A2B3C;
  background: #F0F5FA;
}
.q-toast__close svg { width: 10px; height: 10px; }

/* ── Progress bar ───────────────────────────────── */
.q-toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #EAF0FA;
}
.q-toast__progress-fill {
  height: 100%;
  width: 100%;
  border-radius: 0 2px 2px 0;
  animation: q-toast-progress linear forwards;
}
.q-toast--success .q-toast__progress-fill,
.q-toast--info    .q-toast__progress-fill {
  background: linear-gradient(90deg, #1B6CB2, #F5A520);
}
.q-toast--warning .q-toast__progress-fill { background: #F5A520; }
.q-toast--error   .q-toast__progress-fill { background: #EF4444; }

@keyframes q-toast-progress {
  from { width: 100%; }
  to   { width: 0%; }
}

/* ── Enter / Leave transitions ──────────────────── */
.q-toast-enter-active { animation: q-toast-in  .3s cubic-bezier(.34,1.56,.64,1); }
.q-toast-leave-active { animation: q-toast-out .25s ease-in forwards; }

@keyframes q-toast-in {
  from { transform: translateX(calc(100% + 28px)); opacity: 0; }
  to   { transform: translateX(0);                 opacity: 1; }
}
@keyframes q-toast-out {
  from { transform: translateX(0);                 opacity: 1; max-height: 80px; }
  to   { transform: translateX(calc(100% + 28px)); opacity: 0; max-height: 0;   }
}
</style>
