interface Point {
  x: number;
  y: number;
}

// 绘图类型 笔画|移除
export type PaintType = 'paint' | 'remove'

interface Options {
  background?: string
  width?: number
  height?: number
}

export default class Canvas {
  color: string = 'black'; // 笔颜色
  width: number = 20;// 笔宽度
  removeWidth: number = 20;// 橡皮宽度
  background: string = 'white'; // 编辑
  ctx: CanvasRenderingContext2D; // ctx
  canvasElement: HTMLCanvasElement; // el
  history: ImageData[] = []; //历史
  step: number = -10; //步骤 
  paintType: PaintType = 'paint'; // 绘图类型 笔画|移除
  canvasWidth = 0
  canvasHeight = 0
  constructor(canvasElement: HTMLCanvasElement, options: Options = {}) {
    canvasElement.width = options.width || document.body.offsetWidth
    canvasElement.height = options.height || document.body.offsetHeight
    this.canvasElement = canvasElement;
    this.canvasWidth = canvasElement.width;
    this.canvasHeight = canvasElement.height;
    this.ctx = canvasElement.getContext('2d')!;
    if (options.background) {
      this.background = options.background
    }
    this.ctx.fillStyle = this.background
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.ctx.fillStyle = this.color
    this.ctx.lineCap = "round"
    this.ctx.lineJoin = "round"
    this.ctx.lineWidth = this.width
    this.init() // 默认画笔
    this.saveHistory()
  }
  private init() {
    // Mobile
    if (document.body.ontouchstart !== undefined) {
      this.canvasElement.ontouchstart = (e: TouchEvent) => {
        console.log(e);
        let start: Point = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        this.drawCircle(start.x, start.y, 0)
        this.canvasElement.ontouchmove = (e: TouchEvent) => {
          const current: Point = { x: e.touches[0].clientX, y: e.touches[0].clientY }
          this.drawLine(start.x, start.y, current.x, current.y)
          start = current
        }
      }
      this.canvasElement.ontouchend = () => {
        this.canvasElement.ontouchmove = null
        this.saveHistory()
      }
      // PC
    } else {
      this.canvasElement.onmousedown = (e: MouseEvent) => {
        let start: Point = { x: e.clientX, y: e.clientY }
        this.drawCircle(start.x, start.y, 0)
        this.canvasElement.onmousemove = (e: MouseEvent) => {
          const current: Point = { x: e.clientX, y: e.clientY }
          this.drawLine(start.x, start.y, current.x, current.y)
          start = current
        }
      }
      this.canvasElement.onmouseup = () => {
        this.canvasElement.onmousemove = null
        this.saveHistory()
      }
    }
  }

  //paint
  paint() {
    this.paintType = 'paint'
    this.ctx.lineWidth = this.width
  }
  // 清空画布
  clear() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.history = []
    this.saveHistory()
  }

  // 橡皮
  remove() {
    this.paintType = 'remove'
    this.ctx.lineWidth = this.removeWidth
  }

  private drawCircle(x: number, y: number, radius: number) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    if (this.paintType === 'remove') {
      this.ctx.clip();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.restore();
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    if (this.paintType === 'remove') {
      this.ctx.save();
      this.ctx.globalCompositeOperation = "destination-out";
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.clip();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.restore();
    } else {
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }

  // 历史
  private saveHistory() {
    const current = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
    // 最多存20步
    if (this.history.length > 20) {
      this.history.shift()
      if (this.step !== -10) {
        this.step += 1
        if (this.step > this.history.length - 1) {
          this.step = this.history.length - 1
        }
      }
    }
    this.history.push(current)
    this.ctx.save()
  }

  // 撤回
  undo() {
    if (this.history.length > 0) {
      if (this.step === -10) {
        this.step = this.history.length - 1
      }
      if (this.step <= -1) {
        return
      }
      this.step--
      const data = this.history[this.step]
      if (data) {
        this.ctx.putImageData(data, 0, 0)
      }
    }
  }
  // 恢复
  redo() {
    if (this.history.length > 0) {
      if (this.step === -10) {
        this.step = this.history.length - 1
      }
      if (this.step >= this.history.length - 1) {
        return
      }
      this.step++
      const data = this.history[this.step]
      console.log(data);
      if (data) {
        this.ctx.putImageData(data, 0, 0)
      }
    }
  }
  //  保存图片
  save() {
    const imgUrl = this.canvasElement.toDataURL("image/png");
    let saveA = document.createElement("a");
    document.body.appendChild(saveA);
    saveA.href = imgUrl;
    saveA.download = "wb" + Date.now();
    saveA.target = "_blank";
    saveA.click();
  }

  setWidth(width: number) {
    this.width = width
    this.ctx.lineWidth = width
  }
  setRemoveWidth(removeWidth: number) {
    this.removeWidth = removeWidth
    // this.ctx.lineWidth = width
  }
  setColor(color: string) {
    console.log(color);
    this.color = color
    this.ctx.fillStyle = color
    this.ctx.strokeStyle = color
  }
  setBackground(background: string) {
    this.background = background
  }
}
