var express = require('express')
var app = express()

app.use(express.json())

const MongoClient = require('mongodb').MongoClient

let db 
MongoClient.connect('mongodb+srv://admltf:Gunners23!@cluster0.ppm3u.mongodb.net/WEBAPP', 
(err, client) => {
    db = client.db('WEBAPP')
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

app.listen(3000, function() {
    console.log("Listening on 3000")
})




