const express = require("express")

const app = express()
const server = require("http").Server(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

const boids = []

server.listen(process.env.PORT || 5050)

app.use(express.static("public"))

io.on("connection", (socket) => {
  socket.emit("all-boids", boids)

  socket.on("new-boid", (data) => {
    boids.push(data)
    socket.broadcast.emit("new-boid", data)
  })
})
