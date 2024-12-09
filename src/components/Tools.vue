<template>
  <section class="absolute bottom-2 left-1/2 transform -translate-x-1/2">
    <div class="flex flex-wrap">
      <el-popover placement="top" width="400" trigger="click">
        <template #reference>
          <div
            class="rounded-full cursor-pointer border border-gray-200 p-2 mx-1"
            :class="{ active: active === 'paint' }"
            @click="onPaint"
            title="画笔"
          >
            <PencilLine :fill="color" />
          </div>
        </template>
        <div class="pt-4 w-80 px-2">
          <div class="flex justify-between items-center h-16">
            <el-slider
              class="w-48"
              v-model="width"
              :max="30"
              :min="10"
              @change="onWidthChange"
            ></el-slider>
            <div class="w-8 ml-10 flex justify-center items-center">
              <div class="rounded-full border border-gray-300" :style="style"></div>
            </div>
          </div>
          <div class="flex justify-around items-center">
            <div
              v-for="color in colors"
              :key="color"
              :style="{ backgroundColor: color }"
              class="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
              @click="selectColor(color)"
            ></div>
            <el-color-picker v-model="color"></el-color-picker>
          </div>
        </div>
      </el-popover>

      <div
        class="rounded-full cursor-pointer border border-gray-200 p-2 mx-1"
        :class="{ active: active === 'remove' }"
        @click="onRemove"
        title="擦除"
      >
        <Eraser />
      </div>
      <div
        class="rounded-full cursor-pointer border border-gray-200 p-2 mx-1"
        @click="onSave"
        title="保存"
      >
        <Save />
      </div>
      <div
        class="rounded-full cursor-pointer border border-gray-200 p-2 mx-1 history"
        @click="onUndo"
        title="撤回"
      >
        <Undo />
      </div>
      <div
        class="rounded-full cursor-pointer border border-gray-200 p-2 mx-1 history"
        @click="onRedo"
        title="恢复"
      >
        <Redo />
      </div>
      <div
        class="rounded-full cursor-pointer border border-gray-200 p-2 mx-1"
        @click="onClear"
        title="清空画布"
      >
        <CircleX />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Canvas from '../utils/Canvas'
import { ElMessageBox } from 'element-plus'
import { CircleX, Redo, Save, Undo, PencilLine, Eraser } from 'lucide-vue-next'

type Active = 'paint' | 'remove'

const props = defineProps({
  canvas: { type: Canvas, required: true },
})

const active = ref<Active>('paint')
const width = ref(20)
const color = ref('#000000')
const selectColor = (c: string) => {
  color.value = c
  props.canvas.setColor(c)
}
const onWidthChange = (v: number) => {
  props.canvas.setWidth(v)
}
// 画笔
const onPaint = () => {
  props.canvas.paint()
  active.value = 'paint'
}
// 清空
const onClear = async () => {
  ElMessageBox.confirm('确认清空画板?', '清空', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      props.canvas.clear()
    })
    .catch(() => {})
}
// 橡皮
const onRemove = () => {
  props.canvas.remove()
  active.value = 'remove'
}
// 保存
const onSave = () => {
  props.canvas.save()
}
// onUndo
const onUndo = () => {
  props.canvas.undo()
}
// onUndo
const onRedo = () => {
  props.canvas.redo()
}

const style = computed(() => ({
  width: width.value + 'px',
  height: width.value + 'px',
  backgroundColor: color.value,
}))

const colors = ['#ffffff', '#000000', '#FF3333', '#0066FF', '#FFFF33', '#33CC66', '#808080']
</script>

<style scoped>
.active,
.history:active {
  box-shadow: 0 0 15px #00ccff;
}
</style>
