const express = require("express")
const app = express()
const server = require("http").Server(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

server.listen(process.env.PORT || 5050)
app.use(express.static("public"))

const boxes = []

app.get("/jiggle/:amount", (req, res) => {
  const amount = req.params.amount

  io.sockets.emit("jiggle", { jiggle: amount })
  res.send("new jiggle amount: " + amount)
})

io.on("connection", (socket) => {
  socket.emit("all-boxes", boxes)

  socket.on("color-box", (data) => {
    boxes.push(data)
    socket.broadcast.emit("color-box", data)
  })
})
