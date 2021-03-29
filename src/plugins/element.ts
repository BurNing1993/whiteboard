import { App } from 'vue'
import { ElPopover, ElSlider, ElColorPicker ,ElIcon} from 'element-plus'

const components = [
  ElPopover, ElSlider, ElColorPicker,ElIcon
]


// const plugins = []

export default (app: App) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
  // plugins.forEach(plugin => {
  //   app.use(plugin)
  // })
}
