
export default class XVolbar {

    constructor(overlay, ctx, data, barData) {
        this.ctx = ctx
        this.$p = overlay.$props
        this.self = overlay
        this.style = data.raw[6] || this.self
        this._draw(data, barData)
    }

    _draw(data, barData) {
        const bar_color = data.green ? this.style.upVolBarColor : this.style.downVolBarColor
        const line_width = this.style.volBarWidth
        const line_width_half = line_width / 2

        let y0 = this.$p.layout.height
        let w = data.x2 - data.x1
        let h = Math.floor(data.h)

        this.ctx.strokeStyle = bar_color
        this.ctx.lineWidth = line_width

        this.ctx.beginPath()

        // Draw high to low
        this.ctx.moveTo(Math.floor(barData.x - line_width_half), Math.floor(y0 - h - 0.5))
        this.ctx.lineTo(Math.floor(barData.x - line_width_half), Math.floor(y0 + 0.5))

        this.ctx.stroke()

    }
}
