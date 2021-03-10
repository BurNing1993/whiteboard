import { onBeforeUnmount, onMounted, reactive, toRefs } from 'vue'
import { debounce } from 'lodash-es'

interface Size {
  width: number;
  height: number;
}

export default function useSize(element: HTMLElement) {
  const size = reactive<Size>({
    width: 0,
    height: 0,
  })

  const handler = () => {
    size.width = element.getBoundingClientRect().width
    size.height = element.getBoundingClientRect().height
  }

  onMounted(() => {
    handler()
    window.onresize = debounce(handler, 500)
  })

  onBeforeUnmount(() => {
    window.onresize = null
  })

  return {
    ...toRefs(size)
  }
}
