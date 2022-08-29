class Boid {
  constructor(x, y, color) {
    this.acceleration = createVector(0, 0)
    this.velocity = createVector(random(-1, 1), random(-1, 1))
    this.position = createVector(x, y)
    this.r = 3.0
    this.maxspeed = 3
    this.maxforce = 0.05
    this.color = color
  }

  run(boids) {
    this.flock(boids)
    this.update()
    this.borders()
    this.render()
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  flock(boids) {
    const sep = this.separate(boids)
    const ali = this.align(boids)
    const coh = this.cohesion(boids)

    sep.mult(1.5)
    ali.mult(1.0)
    coh.mult(1.0)

    this.applyForce(sep)
    this.applyForce(ali)
    this.applyForce(coh)
  }

  update() {
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.position)
    desired.normalize()
    desired.mult(this.maxspeed)

    const steer = p5.Vector.sub(desired, this.velocity)
    steer.limit(this.maxforce)

    return steer
  }

  render() {
    const theta = this.velocity.heading() + radians(90)
    fill(this.color, 255, 255)
    noStroke()
    push()
    translate(this.position.x, this.position.y)
    rotate(theta)
    beginShape()
    vertex(0, -this.r * 2)
    vertex(-this.r, this.r * 2)
    vertex(this.r, this.r * 2)
    endShape(CLOSE)
    pop()
  }

  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r
    if (this.position.y < -this.r) this.position.y = height + this.r
    if (this.position.x > width + this.r) this.position.x = -this.r
    if (this.position.y > height + this.r) this.position.y = -this.r
  }

  separate(boids) {
    const desiredseparation = 25.0
    const steer = createVector(0, 0)
    let count = 0

    for (let i = 0; i < boids.length; i++) {
      const d = p5.Vector.dist(this.position, boids[i].position)

      if (d > 0 && d < desiredseparation) {
        const diff = p5.Vector.sub(this.position, boids[i].position)
        diff.normalize()
        diff.div(d)
        steer.add(diff)
        count++
      }
    }

    if (count > 0) {
      steer.div(count)
    }

    if (steer.mag() > 0) {
      steer.normalize()
      steer.mult(this.maxspeed)
      steer.sub(this.velocity)
      steer.limit(this.maxforce)
    }

    return steer
  }

  align(boids) {
    const neighbordist = 50
    const sum = createVector(0, 0)
    let count = 0

    for (let i = 0; i < boids.length; i++) {
      const d = p5.Vector.dist(this.position, boids[i].position)

      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].velocity)
        count++
      }
    }

    if (count > 0) {
      sum.div(count)
      sum.normalize()
      sum.mult(this.maxspeed)

      const steer = p5.Vector.sub(sum, this.velocity)
      steer.limit(this.maxforce)

      return steer
    }

    return createVector(0, 0)
  }

  cohesion(boids) {
    const neighbordist = 50
    const sum = createVector(0, 0)
    let count = 0

    for (let i = 0; i < boids.length; i++) {
      const d = p5.Vector.dist(this.position, boids[i].position)

      if (d > 0 && d < neighbordist) {
        sum.add(boids[i].position)
        count++
      }
    }

    if (count > 0) {
      sum.div(count)
      return this.seek(sum)
    }

    return createVector(0, 0)
  }
}
