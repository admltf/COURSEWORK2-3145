const express = require('express')
const http = require('http')
const path = require("path")

const app = express()

app.use(function (req, res) {
    console.log("In comes: " + req.url)
    res.end("Adam")
})

http.createServer(app).listen(3000)




