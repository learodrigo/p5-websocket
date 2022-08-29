const socket = io.connect("http://localhost:5050/")

socket.on("color-box", (data) => {
  boxes[data.index].color = data.color
})

socket.on("all-boxes", (allboxes) => {
  for (const box of allboxes) {
    boxes[box.index].color = box.color
  }
})

socket.on("jiggle", (data) => {
  jiggleTarget = +data.jiggle
})

const boxes = []
let myColor
let jiggle = (jiggleTarget = 0)

function setup() {
  colorMode(HSB)
  createCanvas(500, 500)

  myColor = random(255)

  const gridsize = width / 50

  for (let x = 0; x < width; x += gridsize) {
    for (let y = 0; y < height; y += gridsize) {
      const box = new Box(gridsize, x, y)
      boxes.push(box)
    }
  }
}

function draw() {
  background(0)
  jiggle = lerp(jiggle, jiggleTarget, 0.1)

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].run()
  }
}

function colorBox() {
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].over()) {
      boxes[i].color = myColor
      socket.emit("color-box", { color: myColor, index: i })
    }
  }
}

function mousePressed() {
  colorBox()
}

function mouseDragged() {
  colorBox()
}
