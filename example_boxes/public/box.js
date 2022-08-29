class Box {
  constructor(size, x, y) {
    this.size = size
    this.x = x
    this.y = y
    this.color = undefined
  }

  over() {
    return (
      mouseX >= this.x &&
      mouseX < this.x + this.size &&
      mouseY >= this.y &&
      mouseY < this.y + this.size
    )
  }

  run() {
    stroke(5)

    if (this.over()) {
      fill(255)
    } else if (this.color) {
      fill(this.color, 255, 255)
    } else {
      fill(0)
    }

    const x = this.x + random(-jiggle, jiggle)
    const y = this.y + random(-jiggle, jiggle)
    rect(x, y, this.size, this.size)
  }
}
