<template>
  <div
    class="q-sk"
    :class="[`q-sk--r-${rounded}`, block && 'q-sk--block']"
    :style="{
      width:  width  ?? undefined,
      height: height ?? undefined,
      borderRadius: rounded === 'full' ? '9999px' : rounded === 'md' ? '8px' : rounded === 'sm' ? '4px' : undefined,
    }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** Ancho fijo, ej. "120px" o "60%" */
  width?: string
  /** Alto fijo, ej. "16px" */
  height?: string
  /** Border-radius: sm=4px · md=8px · full=círculo */
  rounded?: 'sm' | 'md' | 'full'
  /** Si true, ocupa el 100% del ancho del contenedor */
  block?: boolean
}>(), {
  rounded: 'sm',
  block: false,
})
</script>

<style scoped>
.q-sk {
  display: inline-block;
  min-width: 24px;
  min-height: 14px;
  background: linear-gradient(
    90deg,
    #E4EEF8 25%,
    #F2F7FD 50%,
    #E4EEF8 75%
  );
  background-size: 200% 100%;
  animation: q-shimmer 1.6s ease-in-out infinite;
}

.q-sk--block {
  display: block;
  width: 100%;
}

@keyframes q-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
</style>
