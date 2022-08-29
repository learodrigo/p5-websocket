class Flock {
  constructor() {
    this.boids = []
  }
  run() {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].run(this.boids)
    }
  }
  addBoid(b) {
    this.boids.push(b)
  }
}
