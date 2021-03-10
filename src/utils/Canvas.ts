interface Point {
  x: number;
  y: number;
}

// 绘图类型 笔画|移除
export type PaintType = 'paint' | 'remove'

export default class Canvas {
  color: string = 'black'; // 笔颜色
  width: number = 10;// 笔宽度
  background: string = 'white'; // 编辑
  ctx: CanvasRenderingContext2D; // ctx
  canvasElement: HTMLCanvasElement; // el
  history: ImageData[] = []; //历史
  historyData: ImageData | undefined; //历史数据
  paintType: PaintType = 'paint'; // 绘图类型 笔画|移除
  canvasWidth = 0
  canvasHeight = 0
  constructor(canvasElement: HTMLCanvasElement, background?: string) {
    this.canvasElement = canvasElement;
    setTimeout(()=>{
      this.canvasWidth = canvasElement.width;
      this.canvasHeight = canvasElement.height;
    })
    this.ctx = canvasElement.getContext('2d')!;
    if (background) {
      this.background = background
      this.ctx.fillStyle = this.background
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
    }
    // this.ctx.fillStyle = this.color
    this.ctx.fillStyle = 'orange'
    this.ctx.lineCap = "round"
    this.ctx.lineJoin = "round"
    this.paint() // 默认画笔
  }
  // 画笔
  private paint() {
    this.canvasElement.onmousedown = (e: MouseEvent) => {
      try {
        // TODO
        const current = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight)
        console.log(current);
        this.saveHistory(current)
      } catch (error) {
        console.error(error);
      }
      let start: Point = { x: e.clientX, y: e.clientY }
      this.ctx.save()
      this.drawCircle(start.x, start.y, 0)
      this.canvasElement.onmousemove = (e: MouseEvent) => {
        const current: Point = { x: e.clientX, y: e.clientY }
        this.drawLine(start.x, start.y, current.x, current.y)
        start = current
      }
    }
    this.canvasElement.onmouseup = () => {
      this.canvasElement.onmousemove = null
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
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
  private saveHistory(data: ImageData) {
    if (this.history.length > 10) {
      this.history.shift()
    }
    this.history.push(data)
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
    console.log(width);

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
