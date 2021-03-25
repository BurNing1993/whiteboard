<template>
  <div class="h-screen w-full overflow-hidden select-none relative">
    <canvas ref="canvasEl" style="cursor: crosshair"></canvas>
    <Tools :canvas="canvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, h, nextTick, onMounted, ref, warn, watch } from "vue";
import useSize from "./hooks/useSize";
import Canvas from "./utils/Canvas";
import Tools from "./components/Tools.vue";

export default defineComponent({
  name: "App",
  components: {
    Tools,
  },
  setup() {
    const canvasEl = ref<HTMLCanvasElement | null>(null);
    const canvas = ref<Canvas | null>(null);
    const { width, height } = useSize(document.body);
    onMounted(() => {
      canvas.value = new Canvas(canvasEl.value!, {
        width: width.value,
        height: height.value,
      });
    });
    return {
      canvasEl,
      width,
      height,
      canvas,
    };
  },
});
</script>
