let flock
let text
let myColor

const socket = io.connect("https://ruddy-lead-andesaurus.glitch.me/", {
  extraHeaders: {
    UserAgent: "Mozilla",
  },
})

socket.on("new-boid", (data) => {
  const b = new Boid(data.x, data.y, data.color)
  b.velocity.x = data.vel.x
  b.velocity.y = data.vel.y
  flock.addBoid(b)
})

socket.on("all-boids", (allboids) => {
  for (const boid of allboids) {
    const b = new Boid(boid.x, boid.y, boid.color)

    b.velocity.x = boid.vel.x
    b.velocity.y = boid.vel.y

    flock.addBoid(b)
  }
})

function setup() {
  myColor = random(255)
  colorMode(HSB)

  createCanvas(500, 500)
  flock = new Flock()
}

function draw() {
  background(0)
  flock.run()
}

function mouseClicked() {
  const b = new Boid(mouseX, mouseY, myColor)

  flock.addBoid(b)

  socket.emit("new-boid", {
    x: mouseX,
    y: mouseY,
    color: myColor,
    vel: { x: b.velocity.x, y: b.velocity.y },
  })
}
