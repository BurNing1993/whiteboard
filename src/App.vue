<template>
  <div class="h-screen w-full overflow-hidden select-none relative">
    <canvas ref="canvasEl" style="cursor: crosshair"></canvas>
    <Tools :canvas="canvas!" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import Canvas from './utils/Canvas'
import Tools from './components/Tools.vue'

const canvasEl = useTemplateRef<HTMLCanvasElement>('canvasEl')
const canvas = ref<Canvas>()

onMounted(() => {
  canvas.value = new Canvas(canvasEl.value!)
})
</script>
